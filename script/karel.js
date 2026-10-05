const $=id=>document.getElementById(id);
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const DIRS=[[0,-1],[1,0],[0,1],[-1,0]],ARROWS='^>v<',DELAYS=[900,450,220,110,50,15];
class Err extends Error{constructor(m,n){super(n?`Ligne ${n} : ${m}`:m)}}

/* ---------- Monde ---------- */
function grid(t){
  let bag=Infinity;const rows=[];
  for(const l0 of t.split('\n')){
    const l=l0.trim();if(!l||l[0]===';')continue;
    const m=l.match(/^sac\s+(\d+)/i);if(m){bag=+m[1];continue}
    rows.push(l.replace(/\s+/g,''));
  }
  if(!rows.length)throw new Err('le monde est vide');
  const w=rows[0].length,g={w,h:rows.length,wall:[],b:[],k:null,bag};
  rows.forEach((r,y)=>{
    if(r.length!==w)throw new Err(`monde : la rangée ${y+1} n'a pas la même largeur que la première`);
    [...r].forEach((c,x)=>{
      const i=y*w+x,d=ARROWS.indexOf(c);
      g.wall[i]=c==='#';g.b[i]=/[1-9]/.test(c)?+c:0;
      if(d>=0)g.k={x,y,d};
      else if(!'.#123456789'.includes(c))throw new Err(`monde : caractère « ${c} » inconnu (rangée ${y+1})`);
    });
  });
  return g;
}
function parseWorld(t){
  const [a,b]=t.replace(/\r\n?/g,'\n').split(/^-{3,}\s*$/m),s=grid(a);
  if(!s.k)throw new Err('monde : Karel est absent (^ > v <)');
  return {start:s,goal:b?grid(b):null};
}
const clone=s=>({...s,b:[...s.b],k:{...s.k}});
const free=(s,x,y)=>x>=0&&y>=0&&x<s.w&&y<s.h&&!s.wall[y*s.w+x];
const look=(s,t)=>{const [dx,dy]=DIRS[(s.k.d+t)%4];return free(s,s.k.x+dx,s.k.y+dy)};
const here=s=>s.k.y*s.w+s.k.x;

/* ---------- Langage ---------- */
const ACTIONS={
  avancer(s){if(!look(s,0))throw new Error('Karel ne peut pas avancer : obstacle devant lui');const [dx,dy]=DIRS[s.k.d];s.k.x+=dx;s.k.y+=dy},
  tourner_gauche(s){s.k.d=(s.k.d+3)%4},
  poser_balise(s){if(s.bag<=0)throw new Error('le sac de Karel est vide');s.bag--;s.b[here(s)]++},
  ramasser_balise(s){if(!s.b[here(s)])throw new Error("il n'y a pas de balise ici");s.b[here(s)]--;s.bag++}
};
const CONDS={
  devant_libre:s=>look(s,0),devant_bloque:s=>!look(s,0),
  gauche_libre:s=>look(s,3),droite_libre:s=>look(s,1),
  balise_ici:s=>s.b[here(s)]>0,sac_non_vide:s=>s.bag>0,
  regarde_nord:s=>s.k.d===0,regarde_est:s=>s.k.d===1,regarde_sud:s=>s.k.d===2,regarde_ouest:s=>s.k.d===3
};
function parseProg(src){
  const lines=[];
  src.replace(/\r\n?/g,'\n').split('\n').forEach((raw,i)=>{
    const t=raw.replace(/\t/g,'    ').replace(/#.*$/,'');
    if(t.trim())lines.push({ind:t.match(/^ */)[0].length,txt:norm(t.trim()).replace(/\s+/g,' '),n:i+1});
  });
  let p=0;
  const block=ind=>{
    const out=[];
    while(p<lines.length&&lines[p].ind===ind)out.push(stmt(ind));
    if(p<lines.length&&lines[p].ind>ind)throw new Err("indentation inattendue",lines[p].n);
    return out;
  };
  const body=(ind,l)=>{
    if(p>=lines.length||lines[p].ind<=ind)throw new Err(`il manque des lignes indentées après « ${l.txt} »`,l.n);
    return block(lines[p].ind);
  };
  function stmt(ind){
    const l=lines[p++];let m;
    if(m=l.txt.match(/^definir (\w+) ?:$/))return {t:'def',name:m[1],b:body(ind,l),n:l.n};
    if(m=l.txt.match(/^repeter (\d+) fois ?:$/))return {t:'rep',k:+m[1],b:body(ind,l),n:l.n};
    if(m=l.txt.match(/^(tant que|si) (pas )?(\w+) ?:$/)){
      if(!CONDS[m[3]])throw new Err(`test inconnu « ${m[3]} »`,l.n);
      const s={t:m[1]==='si'?'si':'tq',neg:!!m[2],c:m[3],n:l.n};
      s.b=body(ind,l);
      if(s.t==='si'&&p<lines.length&&lines[p].ind===ind&&/^sinon ?:$/.test(lines[p].txt)){p++;s.e=body(ind,l)}
      return s;
    }
    if(/^sinon/.test(l.txt))throw new Err('« sinon » doit suivre directement un bloc « si »',l.n);
    if(m=l.txt.match(/^(\w+)(\(\))?$/))return {t:'call',name:m[1],n:l.n};
    throw new Err(`instruction non comprise : « ${l.txt} »`,l.n);
  }
  return block(0);
}
function* exec(list,s,env,depth){
  for(const st of list){
    if(st.t==='call'){
      if(st.name==='pause'){yield {pause:st.n};continue}
      if(ACTIONS[st.name]){
        try{ACTIONS[st.name](s)}catch(e){throw new Err(e.message,st.n)}
        yield st.n;
      }else if(env[st.name]){
        if(depth>200)throw new Err('récursion trop profonde',st.n);
        yield* exec(env[st.name],s,env,depth+1);
      }else throw new Err(`commande inconnue « ${st.name} » (faute de frappe ? fonction non définie ?)`,st.n);
    }else if(st.t==='rep'){
      for(let i=0;i<st.k;i++)yield* exec(st.b,s,env,depth);
    }else if(st.t==='si'){
      yield* exec(CONDS[st.c](s)!==st.neg?st.b:(st.e||[]),s,env,depth);
    }else if(st.t==='tq'){
      let g=0;
      while(CONDS[st.c](s)!==st.neg){
        if(++g>10000)throw new Err('boucle infinie ?',st.n);
        yield* exec(st.b,s,env,depth);
      }
    }
  }
}

function reached(g,s){return g?g.b.every((v,i)=>v===s.b[i])&&(!g.k||(g.k.x===s.k.x&&g.k.y===s.k.y&&g.k.d===s.k.d)):null}
function runWorld(prog,env,txt){
  const w=parseWorld(txt),s=clone(w.start);let n=0;
  for(const _ of exec(prog,s,env,0))if(++n>100000)throw new Err('programme trop long');
  return {s,goal:w.goal,n};
}

/* ---------- Markdown (petit sous-ensemble) ---------- */
/* Titres #, paragraphes, listes à puces et numérotées, tableaux, blocs ```,
   et en ligne : **gras** et `code`. Le HTML est toujours échappé. */
const escHtml=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function md(src){
  const inline=s=>{
    const codes=[];
    s=escHtml(s).replace(/`([^`]+)`/g,(_,c)=>{codes.push(c);return '\u0000'+(codes.length-1)+'\u0000'});
    s=s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
    return s.replace(/\u0000(\d+)\u0000/g,(_,i)=>'<code>'+codes[i]+'</code>');
  };
  const cells=r=>r.replace(/^\s*\||\|\s*$/g,'').split('|').map(c=>c.trim());
  const special=/^(#{1,4} |```|\||\d+\. |[-*] )/;
  const lines=src.replace(/\r\n?/g,'\n').split('\n');
  let out='',i=0,m;
  while(i<lines.length){
    const l=lines[i];
    if(/^```/.test(l)){
      const code=[];i++;
      while(i<lines.length&&!/^```/.test(lines[i]))code.push(lines[i++]);
      i++;out+='<pre>'+escHtml(code.join('\n'))+'</pre>';
    }else if(m=l.match(/^(#{1,4}) (.*)/)){
      out+=`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`;i++;
    }else if(/^\|/.test(l)){
      const rows=[];
      while(i<lines.length&&/^\|/.test(lines[i]))rows.push(lines[i++]);
      out+='<table><thead><tr>'+cells(rows[0]).map(c=>`<th>${inline(c)}</th>`).join('')+'</tr></thead><tbody>'
        +rows.slice(2).map(r=>'<tr>'+cells(r).map(c=>`<td>${inline(c)}</td>`).join('')+'</tr>').join('')+'</tbody></table>';
    }else if(/^\d+\. /.test(l)||/^[-*] /.test(l)){
      const ordered=/^\d+\. /.test(l),re=ordered?/^\d+\. /:/^[-*] /,items=[];
      while(i<lines.length&&re.test(lines[i]))items.push(lines[i++].replace(re,''));
      const tag=ordered?'ol':'ul';
      out+=`<${tag}>`+items.map(t=>`<li>${inline(t)}</li>`).join('')+`</${tag}>`;
    }else if(!l.trim()){
      i++;
    }else{
      const p=[];
      while(i<lines.length&&lines[i].trim()&&!special.test(lines[i]))p.push(lines[i++]);
      if(!p.length){p.push(lines[i++])}
      out+='<p>'+inline(p.join(' '))+'</p>';
    }
  }
  return out;
}

/* ---------- Affichage ---------- */
const cv=$('cv');let S0,S,goal,gen=null,timer=0,count=0;
function draw(){
  if(!S)return;
  const cs=Math.max(20,Math.min(56,Math.floor(Math.min(cv.parentElement.clientWidth,640)/S.w))),dpr=devicePixelRatio||1;
  cv.width=S.w*cs*dpr;cv.height=S.h*cs*dpr;cv.style.width=S.w*cs+'px';cv.style.height=S.h*cs+'px';
  const c=cv.getContext('2d'),css=getComputedStyle(document.documentElement),col=n=>css.getPropertyValue(n);
  c.scale(dpr,dpr);c.font=`bold ${cs*.38}px sans-serif`;c.textAlign='center';c.textBaseline='middle';
  const ball=(x,y,n,dash)=>{
    c.beginPath();c.arc((x+.5)*cs,(y+.5)*cs,cs*.28,0,7);
    if(dash){c.setLineDash([4,3]);c.strokeStyle=col('--mut');c.stroke();c.setLineDash([])}
    else{c.fillStyle=col('--bp');c.fill()}
    c.fillStyle=dash?col('--mut'):'#000';c.fillText(n,(x+.5)*cs,(y+.55)*cs);
  };
  for(let y=0;y<S.h;y++)for(let x=0;x<S.w;x++){
    const i=y*S.w+x;
    c.strokeStyle=col('--grid');c.strokeRect(x*cs,y*cs,cs,cs);
    if(S.wall[i]){c.fillStyle=col('--wall');c.fillRect(x*cs+1,y*cs+1,cs-2,cs-2)}
    if(goal&&goal.b[i]&&goal.b[i]!==S.b[i])ball(x,y,goal.b[i],1);
    if(S.b[i])ball(x,y,S.b[i]);
  }
  c.save();c.translate((S.k.x+.5)*cs,(S.k.y+.5)*cs);c.rotate(S.k.d*Math.PI/2);
  c.beginPath();c.moveTo(0,-cs*.36);c.lineTo(cs*.3,cs*.3);c.lineTo(0,cs*.15);c.lineTo(-cs*.3,cs*.3);c.closePath();
  c.fillStyle=col('--acc');c.fill();c.restore();
  $('info').textContent=`Balises dans le sac : ${S.bag===Infinity?'∞':S.bag} — actions effectuées : ${count}`;
}
function msg(t,err){$('msg').textContent=t;$('msg').className=err?'err':''}

/* ---------- Fichiers ---------- */
/* Tout est lu dans le dossier « mondes/ » situé à côté de karel.html :
     mondes/exN/CONSIGNES.md, programme.karel, *.monde (directement ou dans un sous-dossier).
   La page doit être servie par un serveur web (voir README) : un navigateur interdit
   de lire les fichiers du disque depuis une page ouverte en double-clic (file://).
   Les exercices sont découverts grâce à la page d'index du serveur ou, à défaut,
   grâce au fichier mondes/index.json (liste des chemins). */
const ROOT='mondes/',ID={prog:'code',world:'wld'};
let tree=[],exos=[],worlds=[],exo='',chooseId=0;
const cur={prog:null,world:null};   // fichier actuellement associé à chaque zone
const natural=(a,b)=>a.localeCompare(b,undefined,{numeric:true});

async function readText(e){
  const r=await fetch(e.url,{cache:'no-store'});   // no-store : on veut toujours la version du disque
  if(!r.ok)throw new Error(`Lecture de ${e.path} impossible (HTTP ${r.status})`);
  return r.text();
}
async function fresh(k){
  if(!cur[k])return true;
  try{$(ID[k]).value=await readText(cur[k]);$(ID[k]).readOnly=true;return true}
  catch(e){msg(e.message,1);return false}
}
async function resetWorld(){
  stop();gen=null;await fresh('world');
  try{const w=parseWorld($('wld').value);S0=w.start;goal=w.goal;S=clone(S0);count=0;draw();msg('Monde prêt.')}
  catch(e){msg(e.message,1)}
}

/* --- découverte des fichiers --- */
/* Les serveurs présentent leurs dossiers de façons différentes : « ex0/ » (Python), « /mondes/ex0 »
   sans barre finale mais avec la classe « icon-directory » (Live Server). Un nom est donc considéré
   comme un dossier s'il se termine par « / », s'il porte cette classe, ou s'il n'a pas de point. */
async function listDir(dirUrl){   // noms présents dans un dossier, d'après la page d'index du serveur
  const r=await fetch(dirUrl,{cache:'no-store'});
  if(!r.ok)throw new Error('pas de page d\u2019index');
  const base=new URL(dirUrl,location.href),out=[];
  for(const m of (await r.text()).matchAll(/<a\s[^>]*>/g)){
    const h=m[0].match(/href="([^"#?]*)"/);
    if(!h)continue;
    let u;try{u=new URL(h[1],base)}catch(e){continue}
    if(u.origin!==base.origin||!u.pathname.startsWith(base.pathname)||u.pathname===base.pathname)continue;
    const rel=decodeURIComponent(u.pathname.slice(base.pathname.length)),name=rel.replace(/\/$/,'');
    if(!name||name.includes('/')||name[0]==='.')continue;
    out.push({name,dir:rel.endsWith('/')||/icon-directory/.test(m[0])||!name.includes('.')});
  }
  return out;
}
async function scan(prefix,out){
  for(const {name,dir} of await listDir(ROOT+prefix)){
    if(!dir){out.push(prefix+name);continue}
    try{await scan(prefix+name+'/',out)}catch(e){out.push(prefix+name)}   // pas un dossier : c'était un fichier
  }
}
const findExos=paths=>[...new Set(paths.filter(p=>/(^|\/)(programme\.karel|CONSIGNES\.md)$/.test(p)).map(p=>p.split('/').slice(0,-1).join('/')))].sort(natural);
async function loadTree(){
  const diag=[];
  let paths=[];
  try{await scan('',paths);diag.push(`page d\u2019index du serveur : ${paths.length} fichier(s) vu(s)`)}
  catch(e){paths=[];diag.push('page d\u2019index du serveur : indisponible')}
  exos=findExos(paths);
  if(!exos.length){   // repli : liste fournie dans mondes/index.json
    try{
      const r=await fetch(ROOT+'index.json',{cache:'no-store'});
      diag.push(`mondes/index.json : HTTP ${r.status}`);
      if(r.ok){paths=await r.json();exos=findExos(paths)}
    }catch(e){diag.push('mondes/index.json : illisible')}
  }
  tree=[...new Set(paths)].map(p=>({path:p,url:ROOT+p.split('/').map(encodeURIComponent).join('/')}));
  const sel=$('exo');sel.textContent='';
  for(const d of exos){const o=document.createElement('option');o.value=d;o.textContent=d||ROOT;sel.append(o)}
  sel.hidden=exos.length<2;
  if(!exos.length){
    $('consignes').innerHTML=md('# Aucun exercice trouvé\n\nLe dossier `mondes/` est introuvable ou ne contient aucun exercice (un exercice = un dossier avec `CONSIGNES.md` ou `programme.karel`). Vérifiez que `karel.html` est bien à la racine du dépôt, à côté du dossier `mondes/`.\n\nDiagnostic :\n\n'+diag.map(d=>'- '+d).join('\n'));
    return;
  }
  const wanted=decodeURIComponent(location.hash.slice(1));
  return choose(exos.includes(wanted)?wanted:exos[0]);
}

/* --- choix de l'exercice et du monde --- */
async function choose(d,keepWorld){
  const my=++chooseId;   // si un autre choix démarre pendant les lectures, celui-ci est abandonné
  stop();gen=null;exo=d;$('exo').value=d;
  try{history.replaceState(null,'','#'+encodeURIComponent(d))}catch(e){}
  const pre=d?d+'/':'',mine=tree.filter(t=>t.path.startsWith(pre)).map(t=>({...t,rel:t.path.slice(pre.length)}));
  const find=n=>mine.find(t=>t.rel===n);
  const c=find('CONSIGNES.md');
  try{$('consignes').innerHTML=c?md(await readText(c)):'<p>Pas de fichier <code>CONSIGNES.md</code> dans ce dossier.</p>'}
  catch(e){$('consignes').textContent=e.message}
  if(my!==chooseId)return;
  $('consignes').scrollTop=0;
  const p=find('programme.karel');
  cur.prog=p||null;
  if(p){$('nprog').textContent=ROOT+p.path;await fresh('prog');if(my!==chooseId)return}
  else{$('nprog').textContent='aucun programme.karel dans ce dossier';$('code').value='';$('code').readOnly=false}
  worlds=mine.filter(t=>/\.monde$/i.test(t.rel)).sort((a,b)=>natural(a.rel,b.rel));
  const ws=$('wsel');ws.textContent='';
  worlds.forEach((w,i)=>{const o=document.createElement('option');o.value=i;o.textContent=w.rel;ws.append(o)});
  ws.hidden=worlds.length<2;
  return chooseWorld(keepWorld<worlds.length?keepWorld:0);
}
async function chooseWorld(i){
  const w=worlds[i];
  if(!w){cur.world=null;$('nworld').textContent='aucun monde';msg('Aucun fichier .monde dans cet exercice.',1);return}
  cur.world=w;$('nworld').textContent=ROOT+w.path;$('wsel').value=i;
  return resetWorld();
}
/* Rafraîchir : recharge consignes, programme et monde actuels, et remet le monde à zéro */
async function refresh(){
  if(!tree.length)return resetWorld();
  await choose(exo,+$('wsel').value||0);
  if($('msg').className!=='err')msg('Fichiers rechargés.');
}
$('exo').onchange=e=>choose(e.target.value);
$('wsel').onchange=e=>chooseWorld(+e.target.value);

/* ---------- Exécution ---------- */
async function prepare(){
  if(!(await fresh('prog'))||!(await fresh('world')))return false;
  try{
    const w=parseWorld($('wld').value);S0=w.start;goal=w.goal;S=clone(S0);count=0;
    const prog=parseProg($('code').value),env={};
    prog.forEach(s=>{if(s.t==='def')env[s.name]=s.b});
    gen=exec(prog,S,env,0);draw();return true;
  }catch(e){gen=null;draw();msg(e.message,1);return false}
}
function finish(){
  stop();gen=null;let t=`Terminé en ${count} actions.`;
  if(goal){
    const ok=reached(goal,S);
    t+=ok?' Objectif atteint !':" Objectif non atteint (cercles en pointillés : balises attendues).";
  }
  draw();msg(t);
}
function step(){
  try{
    const r=gen.next();
    if(r.done){finish();return false}
    if(typeof r.value==='object'){draw();msg(`Pause à la ligne ${r.value.pause}. Cliquez sur Exécuter pour continuer.`);return false}
    count++;draw();msg(`Ligne ${r.value}`);return true;
  }catch(e){stop();gen=null;draw();msg(e.message,1);return false}
}
function stop(){clearTimeout(timer);timer=0}
function play(){stop();const go=()=>{if(step())timer=setTimeout(go,DELAYS[$('spd').value])};go()}
$('run').onclick=async()=>{stop();if(gen||await prepare())play()};
$('step').onclick=async()=>{stop();if(gen||await prepare())step()};
$('refresh').onclick=refresh;
async function testAll(files){
  if(!(await fresh('prog')))return;
  let prog,env={};
  try{prog=parseProg($('code').value);prog.forEach(s=>{if(s.t==='def')env[s.name]=s.b})}
  catch(e){msg(e.message,1);return}
  const ul=$('res');ul.textContent='';let ok=0;
  files=[...files].sort((a,b)=>natural(a.name,b.name));
  for(const f of files){
    let icon,txt='';
    try{
      const r=runWorld(prog,env,await f.text()),g=reached(r.goal,r.s);
      icon=g===null?'•':g?'✅':'❌';if(g)ok++;if(g===false)txt='objectif non atteint';
    }catch(e){icon='❌';txt=e.message}
    const li=document.createElement('li');li.textContent=`${icon} ${f.name}${txt?' : '+txt:''}`;ul.append(li);
  }
  msg(`${ok} monde(s) réussi(s) sur ${files.length}.`,ok<files.length);
}
$('all').onclick=()=>{
  if(!worlds.length){msg('Aucun monde à tester (la page doit être ouverte avec un serveur web).',1);return}
  testAll(worlds.map(w=>({name:w.rel,text:()=>readText(w)})));
};
addEventListener('resize',draw);

/* ---------- Exemple intégré ---------- */
$('code').value=`# Karel va chercher la balise dans le coin

definir tourner_droite:
    repeter 3 fois:
        tourner_gauche

tant que devant_libre:
    avancer
tourner_droite
tant que devant_libre:
    avancer
ramasser_balise
`;
$('wld').value=`; Karel en haut à gauche, une balise en bas à droite
> . . . . . .
. . . # . . .
. . . # . . .
. . . . . . 1
---
. . . . . . .
. . . # . . .
. . . # . . .
. . . . . . v
`;
resetWorld();

/* ---------- Démarrage ---------- */
if(location.protocol==='file:'){
  $('consignes').innerHTML=md(`# Ouvrez cette page avec Live Server

Un navigateur interdit à une page ouverte par double-clic de lire les fichiers de votre dossier. Dans VS Code :

1. Ouvrez le **dossier** du dépôt (menu Fichier, puis Ouvrir le dossier).
2. Installez l'extension **Live Server** si VS Code vous le propose.
3. Faites un clic droit sur \`karel.html\` dans l'explorateur, puis **Open with Live Server** (ou cliquez sur **Go Live** en bas à droite).

En attendant, un exemple est chargé : cliquez sur **Exécuter**.`);
}else{
  loadTree().catch(e=>msg('Chargement impossible : '+e.message,1));
}
