/* Banc d'essai du décor : charge le vrai code de nocturne.html + sprites.js
   dans un bac à sable Node (DOM factice) et vérifie que le décor généré
   est identique d'un tirage à l'autre — c'est ce qui permet la synchro réseau.
   Usage : node test_decor.js [--rapport] */
const fs=require('fs'), vm=require('vm'), path=require('path');
const dir=__dirname;
const html=fs.readFileSync(path.join(dir,'nocturne.html'),'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const sprites=fs.readFileSync(path.join(dir,'sprites.js'),'utf8');

/* un objet qui accepte tout : appels, propriétés, constructeurs */
function fantome(){
  const f=function(){};
  return new Proxy(f,{
    get:(t,k)=> k===Symbol.toPrimitive? ()=>0 : k==='length'? 0 : k==='then'? undefined : fantome(),
    set:()=>true, apply:()=>fantome(), construct:()=>fantome(),
  });
}
const sandbox={ console, Math, JSON, Map, Set, Promise, Array, Object, Number, String, Date,
  Float32Array, Uint8Array, Uint8ClampedArray, Int32Array, Uint32Array, ArrayBuffer,
  setTimeout:()=>0, setInterval:()=>0, clearTimeout(){}, requestAnimationFrame:()=>0,
  performance:{now:()=>0}, localStorage:fantome(), navigator:{getGamepads:()=>[]},
  innerWidth:1280, innerHeight:720, devicePixelRatio:1,
  document:fantome(), Image:function(){ return fantome(); }, Audio:function(){ return fantome(); },
  addEventListener(){}, matchMedia:()=>({matches:false,addEventListener(){}}), AudioContext:function(){ return fantome(); },
  WebSocket:function(){ return fantome(); }, location:{search:'',host:'',protocol:'http:'},
};
sandbox.window=sandbox; sandbox.self=sandbox; sandbox.globalThis=sandbox;
const ctx=vm.createContext(sandbox);
// le script principal tourne jusqu'au bout ; on ne garde que ce qui sert aux tests
const principal=scripts[scripts.length-1].replace(/\n\s*(boucle|requestAnimationFrame)\([^)]*\);?\s*$/m,'');
try{
  vm.runInContext(sprites+'\n;globalThis.__SPR=SPRITES;',ctx,{filename:'sprites.js'});
  vm.runInContext(principal+'\n;globalThis.__T={CFG,G,genererDecor,grainNiveau,SPR,distChemin,LUMIERES:typeof LUMIERES!=="undefined"?LUMIERES:null};',ctx,{filename:'nocturne.html'});
}catch(e){ console.error('chargement impossible :',e.message); process.exit(2); }
const T=sandbox.__T;
/* SPR n'est pas compilé dans le bac à sable (images factices) : on déclare
   seulement les tailles que le générateur lit. */
for(const k in sandbox.__SPR){ const s=sandbox.__SPR[k]; if(s.img64) T.SPR[k]={w:s.img64.w,h:s.img64.h,taille:s.img64.taille}; }
module.exports=T;

const ROUTE_MIN=88+40, BORD=460;
const empreinte=(d,G)=>JSON.stringify(d.map(o=>[o.id,o.nom,Math.round(o.x*10),Math.round(o.y*10),Math.round(o.h*10),o.flip?1:0,Math.round(o.ph*1000),o.mur?1:0]))+JSON.stringify([G.murs,G.salles,G.seuils,G.trace]);

if(require.main===module){
  const {CFG,G,genererDecor,distChemin}=T;
  const REG=CFG.decors.regles, A=CFG.regles.arene, S4=(A/4200)**2/4;
  const rapport=process.argv.includes('--rapport');
  let ok=true;
  const verdict=(bon,msg)=>{ if(!bon){ ok=false; console.log('  ÉCHEC '+msg); } };
  /* --- les blocs préfabriqués : chacun doit être sain avant d'être assemblé --- */
  const niveauxOK=new Set(CFG.niveaux.map(l=>l.id)), noms=new Set();
  for(const pf of (CFG.decors.prefabs||[])){
    const pb=[];
    if(noms.has(pf.nom)) pb.push('nom en double'); noms.add(pf.nom);
    if(pf.niveaux && !pf.niveaux.every(n=>niveauxOK.has(n))) pb.push('niveau inconnu');
    if(!(pf.nb>=1) || !(pf.loin>=300)) pb.push('nb/loin invalides');
    const R=Math.max(...pf.items.map(i=>Math.hypot(i[1],i[2])));
    if(R>480) pb.push('rayon '+Math.round(R)+' px : trop grand');
    const pieds=[];
    for(const [n,x,y,e] of pf.items){
      const s=T.SPR[n];
      if(!s){ pb.push('sprite inconnu '+n); continue; }
      if(n==='d_mur'||n==='d_murbrise') continue;
      const h=(s.taille||s.h)*e, w=h*s.w/s.h;
      pieds.push({n,x1:x-w*0.4,x2:x+w*0.4,y1:n==='d_mare'?y-h*0.7:y-h*0.25,y2:y});
    }
    let chev=0;
    for(let i=0;i<pieds.length;i++) for(let j=i+1;j<pieds.length;j++){
      const a=pieds[i], b=pieds[j];
      const ox=Math.min(a.x2,b.x2)-Math.max(a.x1,b.x1), oy=Math.min(a.y2,b.y2)-Math.max(a.y1,b.y1);
      if(ox>0 && oy>0){
        const part=ox*oy/Math.min((a.x2-a.x1)*(a.y2-a.y1),(b.x2-b.x1)*(b.y2-b.y1));
        if(part>0.3){ chev++; if(chev<=3) pb.push('chevauchement '+a.n.slice(2)+'/'+b.n.slice(2)); }
      }
    }
    const murs=pf.items.filter(i=>i[0]==='d_mur'||i[0]==='d_murbrise');
    const doubles=new Set(); for(const m of murs){ const k=m[1]+','+m[2]; if(doubles.has(k)) pb.push('mur en double '+k); doubles.add(k); }
    verdict(pb.length===0,'bloc '+pf.nom+' : '+pb.join(', '));
    if(rapport) console.log('       bloc '+pf.nom.padEnd(24)+String(pf.items.length).padStart(3)+' objets, rayon '+Math.round(R)+' px, '+(pf.niveaux?pf.niveaux.join('/'):'partout'));
  }
  for(const L of CFG.niveaux){
    const d=genererDecor(L), empA=empreinte(d,G);
    const bon=empA===empreinte(genererDecor(L),G);
    verdict(bon,'déterminisme '+L.id+' : deux tirages différents');
    const libres=d.filter(o=>!o.mur);
    const par={}; for(const o of libres) (par[o.nom]=par[o.nom]||[]).push(o);
    let nEsp=0, nIso=0, nMax=0, nRoute=0, nBord=0, nSalle=0;
    for(const nom in par){
      const a=par[nom].filter(o=>!o.dansSalle && !o.bloc), rg=REG[nom]||{};
      if(rg.max!=null && a.length>Math.ceil(rg.max*S4)) nMax++;
      const esp=rg.esp!=null?rg.esp:1.2;
      for(let i=0;i<a.length;i++) for(let j=i+1;j<a.length;j++){
        const dd=Math.hypot(a[i].x-a[j].x,a[i].y-a[j].y);
        if(rg.iso && dd<rg.iso) nIso++;
        if(dd<esp*(a[i].h+a[j].h)/2-1e-6) nEsp++;
      }
    }
    for(const o of d){                          // un mur plein hors du labyrinthe ne barre pas le trajet
      const C=A/2, dansLaby=Math.abs(o.x-C)<1150 && Math.abs(o.y-C)<1150;
      if(o.nom==='d_mur' && !dansLaby && distChemin(o.x,o.y)<ROUTE_MIN-30) nRoute++;
    }
    for(const o of libres){
      if(o.x<BORD||o.y<BORD||o.x>A-BORD||o.y>A-BORD) nBord++;
    }
    /* les pieds pleins : rien sur le départ ni sur un Seuil, et chaque Seuil reste atteignable
       à pied (balayage d'une grille de 24 px, la carte entière, un joueur de 18 px de rayon) */
    const C=A/2, CEL=24, N=Math.ceil(A/CEL), bloque=new Uint8Array(N*N), R=18, BJ=330;
    const rect=(x1,y1,x2,y2)=>{ for(let j=Math.max(0,Math.floor(y1/CEL));j<=Math.min(N-1,Math.floor(y2/CEL));j++)
      for(let i=Math.max(0,Math.floor(x1/CEL));i<=Math.min(N-1,Math.floor(x2/CEL));i++) bloque[j*N+i]=1; };
    for(const m of G.murs) rect(m.x-R,m.y-R,m.x+m.w+R,m.y+m.h+R);
    rect(0,0,BJ,A); rect(A-BJ,0,A,A); rect(0,0,A,BJ); rect(0,A-BJ,A,A);
    const vu=new Uint8Array(N*N), file=[], dep=G.depart, i0=Math.floor(dep.x/CEL)+Math.floor(dep.y/CEL)*N;
    verdict(!bloque[i0], L.id+' : le départ est muré');
    vu[i0]=1; file.push(i0);
    for(let q=0;q<file.length;q++){ const c=file[q], ci=c%N, cj=(c-ci)/N;
      for(const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1]]){ const ni=ci+di, nj=cj+dj; if(ni<0||nj<0||ni>=N||nj>=N) continue;
        const k=nj*N+ni; if(!vu[k]&&!bloque[k]){ vu[k]=1; file.push(k); } } }
    const atteint=(p)=>vu[Math.floor(p.x/CEL)+Math.floor(p.y/CEL)*N]===1;
    const cibles=G.seuils.slice(0,-1).map((p,i)=>['Seuil '+(i+1),p]);
    const dehors=G.trace.filter(p=>Math.abs(p.x-C)>1100||Math.abs(p.y-C)>1100).pop();
    cibles.push(['porte du labyrinthe',dehors]);
    for(const [nomC,p] of cibles) verdict(atteint(p), L.id+' : '+nomC+' inatteignable à pied');
    const nSolides=d.filter(o=>o.solides).length;
    const libresN=bloque.reduce((a,b)=>a+(b?0:1),0);
    if(rapport) console.log('       carte accessible depuis le départ : '+Math.round(100*file.length/libresN)+' % des cases libres');
    verdict(nMax===0,L.id+' : '+nMax+' plafond(s) dépassé(s)');
    verdict(nRoute===0,L.id+' : '+nRoute+' mur(s) plein(s) sur le trajet des Seuils');
    verdict(nBord===0,L.id+' : '+nBord+' décor(s) dans la brume des confins');
    const blocs=d.filter(o=>o.bloc), nbPf=(CFG.decors.prefabs||[]).filter(p=>!p.niveaux||p.niveaux.includes(L.id)).length;
    verdict(nbPf===0 || blocs.length>0, L.id+' : aucun bloc préfabriqué posé');
    console.log((bon?'OK    ':'ÉCHEC ')+L.id.padEnd(8)+' '+String(d.length).padStart(4)+' décors  identiques trop proches: '+nEsp+'  monuments non isolés: '+nIso+'  objets de blocs: '+blocs.length+'  pleins: '+nSolides+' ('+G.murs.length+' pieds)');
    if(rapport) console.log('       '+Object.entries(par).map(([n,a])=>n.slice(2)+':'+a.length).join(' '));
  }
  process.exit(ok?0:1);
}
