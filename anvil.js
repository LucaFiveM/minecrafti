/* ===================== AMBOSS-PLANER ===================== */
import { GIF_ICONS, iconUrl, iconImg, mcIcon, handleIconError } from './app.js';
GIF_ICONS.add("Enchanted Book");
const ROMAN = ['','I','II','III','IV','V','VI','VII','VIII','IX','X'];
const bookIcon = () => `<img src="${iconUrl('Enchanted Book')}" data-name="${encodeURIComponent('Enchanted Book')}" alt="Buch" loading="lazy" onerror="handleIconError(this)">`;

const ITEMS = [
  {k:'helmet', en:'Helmet', de:'Helm', icon:'Diamond Helmet', tags:['helmet','armorhead','armor','durable','wearable']},
  {k:'chestplate', en:'Chestplate', de:'Brustplatte', icon:'Diamond Chestplate', tags:['chestplate','armor','durable','wearable']},
  {k:'leggings', en:'Leggings', de:'Hose', icon:'Diamond Leggings', tags:['leggings','armor','durable','wearable']},
  {k:'boots', en:'Boots', de:'Stiefel', icon:'Diamond Boots', tags:['boots','armor','durable','wearable']},
  {k:'turtle', en:'Turtle Shell', de:'Schildkrötenpanzer', icon:'Turtle Shell', tags:['helmet','armorhead','armor','durable','wearable','turtle']},
  {k:'elytra', en:'Elytra', de:'Elytren', icon:'Elytra', tags:['elytra','durable','wearable']},
  {k:'sword', en:'Sword', de:'Schwert', icon:'Diamond Sword', tags:['sword','melee','durable']},
  {k:'axe', en:'Axe', de:'Axt', icon:'Diamond Axe', tags:['axe','tool','melee','durable']},
  {k:'mace', en:'Mace', de:'Streitkolben', icon:'Mace', tags:['mace','durable']},
  {k:'trident', en:'Trident', de:'Dreizack', icon:'Trident', tags:['trident','durable']},
  {k:'bow', en:'Bow', de:'Bogen', icon:'Bow', tags:['bow','durable']},
  {k:'crossbow', en:'Crossbow', de:'Armbrust', icon:'Crossbow', tags:['crossbow','durable']},
  {k:'pickaxe', en:'Pickaxe', de:'Spitzhacke', icon:'Diamond Pickaxe', tags:['pickaxe','tool','durable']},
  {k:'shovel', en:'Shovel', de:'Schaufel', icon:'Diamond Shovel', tags:['shovel','tool','durable']},
  {k:'hoe', en:'Hoe', de:'Hacke', icon:'Diamond Hoe', tags:['hoe','tool','durable']},
  {k:'shield', en:'Shield', de:'Schild', icon:'Shield', tags:['shield','durable']},
  {k:'fishing', en:'Fishing Rod', de:'Angel', icon:'Fishing Rod', tags:['fishing','durable']},
  {k:'shears', en:'Shears', de:'Schere', icon:'Shears', tags:['shears','tool','durable']},
  {k:'flint', en:'Flint and Steel', de:'Feuerzeug', icon:'Flint and Steel', tags:['flint','durable']},
  {k:'brush', en:'Brush', de:'Pinsel', icon:'Brush', tags:['brush','durable']},
  {k:'cos', en:'Carrot on a Stick', de:'Karottenrute', icon:'Carrot on a Stick', tags:['cos','durable']},
  {k:'wfos', en:'Warped Fungus on a Stick', de:'Wirrpilzrute', icon:'Warped Fungus on a Stick', tags:['cos','durable']},
  {k:'pumpkin', en:'Carved Pumpkin', de:'Geschnitzter Kürbis', icon:'Carved Pumpkin', tags:['pumpkin','wearable']},
  {k:'book', en:'Book', de:'Buch (Verzaubertes Buch bauen)', icon:'Book', tags:['*']},
];
const E = [
  {k:'unbreaking', en:'Unbreaking', de:'Haltbarkeit', max:3, bm:1, on:['durable']},
  {k:'mending', en:'Mending', de:'Reparatur', max:1, bm:2, on:['durable'], tr:true},
  {k:'vanishing', en:'Curse of Vanishing', de:'Fluch des Verschwindens', max:1, bm:4, on:['durable','wearable'], tr:true},
  {k:'binding', en:'Curse of Binding', de:'Fluch der Bindung', max:1, bm:4, on:['wearable'], tr:true},
  {k:'protection', en:'Protection', de:'Schutz', max:4, bm:1, on:['armor']},
  {k:'fire_protection', en:'Fire Protection', de:'Feuerschutz', max:4, bm:1, on:['armor']},
  {k:'blast_protection', en:'Blast Protection', de:'Explosionsschutz', max:4, bm:2, on:['armor']},
  {k:'projectile_protection', en:'Projectile Protection', de:'Geschossschutz', max:4, bm:1, on:['armor']},
  {k:'thorns', en:'Thorns', de:'Dornen', max:3, bm:4, on:['armor']},
  {k:'respiration', en:'Respiration', de:'Atmung', max:3, bm:2, on:['armorhead']},
  {k:'aqua_affinity', en:'Aqua Affinity', de:'Wassergängigkeit', max:1, bm:2, on:['armorhead']},
  {k:'feather_falling', en:'Feather Falling', de:'Federfall', max:4, bm:1, on:['boots']},
  {k:'depth_strider', en:'Depth Strider', de:'Tiefenläufer', max:3, bm:2, on:['boots']},
  {k:'frost_walker', en:'Frost Walker', de:'Frostläufer', max:2, bm:2, on:['boots'], tr:true},
  {k:'soul_speed', en:'Soul Speed', de:'Seelentempo', max:3, bm:4, on:['boots'], tr:true},
  {k:'swift_sneak', en:'Swift Sneak', de:'Sanfter Schleicher', max:3, bm:4, on:['leggings'], tr:true},
  {k:'sharpness', en:'Sharpness', de:'Schärfe', max:5, bm:1, on:['sword','axe']},
  {k:'smite', en:'Smite', de:'Bann', max:5, bm:1, on:['sword','axe']},
  {k:'bane', en:'Bane of Arthropods', de:'Nemesis d. Gliederfüßer', max:5, bm:1, on:['sword','axe']},
  {k:'knockback', en:'Knockback', de:'Rückstoß', max:2, bm:1, on:['sword']},
  {k:'fire_aspect', en:'Fire Aspect', de:'Verbrennung', max:2, bm:2, on:['sword']},
  {k:'looting', en:'Looting', de:'Plünderung', max:3, bm:2, on:['sword']},
  {k:'sweeping', en:'Sweeping Edge', de:'Schwungkraft', max:3, bm:2, on:['sword']},
  {k:'efficiency', en:'Efficiency', de:'Effizienz', max:5, bm:1, on:['pickaxe','shovel','axe','hoe','shears']},
  {k:'silk_touch', en:'Silk Touch', de:'Behutsamkeit', max:1, bm:4, on:['pickaxe','shovel','axe','hoe']},
  {k:'fortune', en:'Fortune', de:'Glück', max:3, bm:2, on:['pickaxe','shovel','axe','hoe']},
  {k:'power', en:'Power', de:'Stärke', max:5, bm:1, on:['bow']},
  {k:'punch', en:'Punch', de:'Schlag', max:2, bm:2, on:['bow']},
  {k:'flame', en:'Flame', de:'Flamme', max:1, bm:2, on:['bow']},
  {k:'infinity', en:'Infinity', de:'Unendlichkeit', max:1, bm:4, on:['bow']},
  {k:'piercing', en:'Piercing', de:'Durchschlag', max:4, bm:1, on:['crossbow']},
  {k:'quick_charge', en:'Quick Charge', de:'Schnellladen', max:3, bm:1, on:['crossbow']},
  {k:'multishot', en:'Multishot', de:'Mehrfachschuss', max:1, bm:2, on:['crossbow']},
  {k:'impaling', en:'Impaling', de:'Harpune', max:5, bm:2, on:['trident']},
  {k:'loyalty', en:'Loyalty', de:'Treue', max:3, bm:1, on:['trident']},
  {k:'riptide', en:'Riptide', de:'Sog', max:3, bm:2, on:['trident']},
  {k:'channeling', en:'Channeling', de:'Entladung', max:1, bm:4, on:['trident']},
  {k:'luck', en:'Luck of the Sea', de:'Glück des Meeres', max:3, bm:2, on:['fishing']},
  {k:'lure', en:'Lure', de:'Köder', max:3, bm:2, on:['fishing']},
  {k:'density', en:'Density', de:'Dichte', max:5, bm:1, on:['mace']},
  {k:'breach', en:'Breach', de:'Bruch', max:4, bm:2, on:['mace']},
  {k:'wind_burst', en:'Wind Burst', de:'Windstoß', max:3, bm:2, on:['mace'], tr:true},
];
const EMAP = Object.fromEntries(E.map(e=>[e.k,e]));
const INCOMPAT_GROUPS = [
  ['protection','fire_protection','blast_protection','projectile_protection'],
  ['sharpness','smite','bane'],
  ['silk_touch','fortune'],
  ['infinity','mending'],
  ['depth_strider','frost_walker'],
  ['multishot','piercing'],
  ['riptide','loyalty'],
  ['riptide','channeling'],
];
function conflicts(a, b){ return INCOMPAT_GROUPS.some(g=>g.includes(a)&&g.includes(b)); }
function itemAccepts(item, e){
  if(item.tags.includes('*')) return true;
  return e.on.some(t=>item.tags.includes(t));
}

const panel   = document.getElementById('anvilPanel');
const toggle  = document.getElementById('anvilToggleBtn');
const itemSel = document.getElementById('anvilItemSelect');
const itemIcon= document.getElementById('anvilItemIcon');
const listEl  = document.getElementById('anvilEnchList');
const searchE = document.getElementById('anvilEnchSearch');
const resultEl= document.getElementById('anvilResult');
const calcBtn = document.getElementById('anvilCalcBtn');
const clearBtn= document.getElementById('anvilClearBtn');
const optXp   = document.getElementById('optXp');
const optPwp  = document.getElementById('optPwp');
const optInc  = document.getElementById('optIncompat');

let curItem = ITEMS[0];
let picked  = new Map();
let objective = 'xp';
let allowIncompat = false;

ITEMS.forEach(it=>{
  const o=document.createElement('option'); o.value=it.k; o.textContent=`${it.de}  ·  ${it.en}`; itemSel.appendChild(o);
});
function setItemIcon(){
  itemIcon.src = iconUrl(curItem.icon);
  itemIcon.dataset.name = encodeURIComponent(curItem.icon);
  itemIcon.dataset.step = '0';
  itemIcon.style.display = '';
  itemIcon.onerror = ()=>handleIconError(itemIcon);
}
function renderList(){
  const q = searchE.value.trim().toLowerCase();
  const applicable = E.filter(e=>itemAccepts(curItem,e));
  const rows = applicable.filter(e=>!q || (e.en+' '+e.de).toLowerCase().includes(q));
  if(!rows.length){ listEl.innerHTML = `<div class="ench-pick-empty">Keine passenden Verzauberungen.</div>`; return; }
  listEl.innerHTML = rows.map(e=>{
    const isPicked = picked.has(e.k);
    let blocked=false, blocker=null;
    if(!allowIncompat && !isPicked){
      for(const k of picked.keys()){ if(conflicts(e.k,k)){ blocked=true; blocker=EMAP[k]; break; } }
    }
    const lvlOpts = Array.from({length:e.max},(_,i)=>i+1)
      .map(l=>`<option value="${l}" ${isPicked&&picked.get(e.k)===l?'selected':''}>${ROMAN[l]}</option>`).join('');
    return `<div class="ench-pick ${isPicked?'picked':''} ${blocked?'incompat':''}" data-k="${e.k}" ${blocked?'data-blocked="1"':''}>
      <span class="ench-check">${isPicked?'V':''}</span>
      <span class="ench-pick-name">
        <span class="en">${e.en}${e.tr?'<span class="tag">TREASURE</span>':''}</span>
        <span class="de">${e.de}${blocked?`<span class="incompat-note">unverträglich mit ${blocker.de}</span>`:''}</span>
      </span>
      <select class="ench-lvl-select" data-lvlfor="${e.k}" ${e.max===1?'disabled':''} ${!isPicked?'disabled':''}>${lvlOpts}</select>
    </div>`;
  }).join('');
}
listEl.addEventListener('click', ev=>{
  const row = ev.target.closest('.ench-pick');
  if(!row || ev.target.closest('.ench-lvl-select')) return;
  const k = row.dataset.k;
  if(picked.has(k)){ picked.delete(k); }
  else { if(row.dataset.blocked) return; picked.set(k, EMAP[k].max); }
  renderList();
});
listEl.addEventListener('change', ev=>{
  const sel = ev.target.closest('.ench-lvl-select'); if(!sel) return;
  const k = sel.dataset.lvlfor;
  if(picked.has(k)) picked.set(k, parseInt(sel.value,10));
});
searchE.addEventListener('input', renderList);
itemSel.addEventListener('change', ()=>{
  curItem = ITEMS.find(i=>i.k===itemSel.value) || ITEMS[0];
  picked.clear(); setItemIcon(); renderList();
  resultEl.innerHTML = placeholderHtml();
});
function setObjective(o){ objective=o; optXp.classList.toggle('active',o==='xp'); optPwp.classList.toggle('active',o==='pwp'); }
optXp.addEventListener('click', ()=>setObjective('xp'));
optPwp.addEventListener('click', ()=>setObjective('pwp'));
optInc.addEventListener('click', ()=>{ allowIncompat=!allowIncompat; optInc.classList.toggle('active',allowIncompat); renderList(); });
clearBtn.addEventListener('click', ()=>{ picked.clear(); renderList(); resultEl.innerHTML=placeholderHtml(); });
function placeholderHtml(){ return `<div class="anvil-placeholder">Wähl links ein Item und ein paar Verzauberungen,<br>dann auf <b>„Reihenfolge berechnen"</b> tippen.</div>`; }

function penalty(pw){ return (1<<pw) - 1; }
function paretoPush(list, cand){
  for(const x of list){ if(x.cost<=cand.cost && x.pw<=cand.pw) return; }
  for(let i=list.length-1;i>=0;i--){ if(cand.cost<=list[i].cost && cand.pw<=list[i].pw) list.splice(i,1); }
  list.push(cand);
}
function solve(leaves, hasItem, capOn){
  const N = leaves.length;
  const cost = leaves.map(l => l.level * l.bm);
  const groupCost = mask => { let s=0; for(let i=0;i<N;i++) if(mask&(1<<i)) s+=cost[i]; return s; };
  const bookMemo = new Map();
  function solveBook(mask){
    if(bookMemo.has(mask)) return bookMemo.get(mask);
    let res;
    if((mask & (mask-1))===0){ res=[{cost:0,pw:0,node:{t:'book',bit:Math.log2(mask)}}]; }
    else {
      const front=[];
      for(let a=(mask-1)&mask; a>0; a=(a-1)&mask){
        const b = mask ^ a;
        const tf=solveBook(a), sf=solveBook(b), tc=groupCost(b);
        for(const t of tf) for(const s of sf){
          const step = tc + penalty(t.pw) + penalty(s.pw);
          if(capOn && step>=40) continue;
          paretoPush(front, {cost:t.cost+s.cost+step, pw:Math.max(t.pw,s.pw)+1, node:{t:'m', L:t.node, R:s.node, tc, step, sac:b}});
        }
      }
      res=front;
    }
    bookMemo.set(mask,res); return res;
  }
  if(!hasItem){ const full=(1<<N)-1; return {frontier: solveBook(full), leaves, cost}; }
  const itemMemo=new Map();
  function solveItem(mask){
    if(itemMemo.has(mask)) return itemMemo.get(mask);
    let res;
    if(mask===0){ res=[{cost:0,pw:0,node:{t:'item'}}]; }
    else{
      const front=[];
      for(let b=mask; b>0; b=(b-1)&mask){
        const a=mask^b;
        const tf=solveItem(a), sf=solveBook(b), tc=groupCost(b);
        for(const t of tf) for(const s of sf){
          const step = tc + penalty(t.pw) + penalty(s.pw);
          if(capOn && step>=40) continue;
          paretoPush(front, {cost:t.cost+s.cost+step, pw:Math.max(t.pw,s.pw)+1, node:{t:'m', L:t.node, R:s.node, tc, step, sac:b, item:true}});
        }
      }
      res=front;
    }
    itemMemo.set(mask,res); return res;
  }
  const full=(1<<N)-1;
  return {frontier: solveItem(full), leaves, cost};
}
function pickBest(frontier){
  if(!frontier.length) return null;
  let best=frontier[0];
  for(const f of frontier){
    if(objective==='xp'){ if(f.cost<best.cost || (f.cost===best.cost && f.pw<best.pw)) best=f; }
    else { if(f.pw<best.pw || (f.pw===best.pw && f.cost<best.cost)) best=f; }
  }
  return best;
}
function flatten(node, leaves){
  const steps=[]; let counter=0;
  function contents(n){
    if(n.t==='item') return {isItem:true, bits:[]};
    if(n.t==='book') return {isItem:false, bits:[n.bit]};
    const L=contents(n.L), R=contents(n.R);
    return {isItem:L.isItem||R.isItem, bits:L.bits.concat(R.bits)};
  }
  function tok(n){
    if(n.t==='item') return {kind:'item'};
    if(n.t==='book'){ const e=leaves[n.bit]; return {kind:'book', e}; }
    return {kind:'result', step:n._step};
  }
  function walk(n){
    if(n.t!=='m') return;
    walk(n.L); walk(n.R);
    n._step = ++counter;
    steps.push({n:n._step, left:tok(n.L), right:tok(n.R), tc:n.tc, step:n.step, sac:n.sac, resPw: Math.max(pwOf(n.L), pwOf(n.R))+1, contents: contents(n)});
  }
  function pwOf(n){ if(n.t==='item'||n.t==='book') return 0; return n._pw; }
  function walk2(n){ if(n.t!=='m'){ n._pw=0; return 0;} const l=walk2(n.L), r=walk2(n.R); n._pw=Math.max(l,r)+1; return n._pw; }
  walk2(node); walk(node);
  return steps;
}
function contentsTip(c, leaves){
  const list = c.bits.map(b=>`${leaves[b].de} ${ROMAN[leaves[b].level]}`).join(', ');
  if(c.isItem) return `${curItem.de} mit: ${list || '(noch nichts)'}`;
  return `Verzaubertes Buch mit: ${list}`;
}
const STEP_COLORS = ['#e0b341','#5cc8ff','#8b7cff','#57d982','#ff8f6b','#ff79c6','#4ad0c0','#f4d03f','#b39ddb','#7fd1ae','#ffab73','#9bd0ff'];
function stepColor(n){ return STEP_COLORS[(n-1) % STEP_COLORS.length]; }
function tokenHtml(t, tip){
  if(t.kind==='item'){
    return `<span class="anvil-token"><span class="slot">${iconImg(curItem.icon)}</span><span><span class="tk-name">${curItem.de}</span><small>frisch · Strafe 0</small></span></span>`;
  }
  if(t.kind==='book'){
    return `<span class="anvil-token" style="border-color:#8b7cff"><span class="slot">${bookIcon()}</span><span><span class="tk-name">${t.e.de} ${ROMAN[t.e.level]}</span><small>Buch</small></span></span>`;
  }
  const c = stepColor(t.step);
  const tipAttr = tip ? ` data-tip="${tip.replace(/"/g,'&quot;')}" tabindex="0"` : '';
  return `<span class="anvil-token ref" style="border-color:${c}"${tipAttr}><span class="refnum" style="background:${c}">${t.step}</span><span><span class="tk-name" style="color:${c}">Ergebnis ${t.step}</span><small>aus Schritt ${t.step} ↑ · hover für Inhalt</small></span></span>`;
}
function costClass(c){ return c>=40?'too-exp':(c>=25?'warn':'good'); }
function calculate(){
  const leaves = [...picked.entries()].map(([k,level])=>({k, level, bm:EMAP[k].bm, en:EMAP[k].en, de:EMAP[k].de}));
  const hasItem = curItem.k!=='book';
  if(leaves.length===0){ resultEl.innerHTML = `<div class="anvil-placeholder">Noch keine Verzauberung angehakt. Wähl links mindestens eine aus.</div>`; return; }
  if(!hasItem && leaves.length===1){ resultEl.innerHTML = `<div class="anvil-placeholder">Nur eine Verzauberung fürs Buch — das ist schon ein fertiges Buch, kein Amboss nötig.</div>`; return; }
  if(hasItem && leaves.length===0){ return; }
  if(leaves.length>13){ resultEl.innerHTML = `<div class="anvil-warn-banner"><b>Zu viele Verzauberungen (${leaves.length}).</b> Bitte auf 13 oder weniger reduzieren — mehr passt in Minecraft ohnehin nicht sinnvoll auf ein Item.</div>`; return; }
  let overCap=false;
  let out = solve(leaves, hasItem, true);
  let best = pickBest(out.frontier);
  if(!best){ overCap=true; out = solve(leaves, hasItem, false); best = pickBest(out.frontier); }
  if(!best){ resultEl.innerHTML = `<div class="anvil-warn-banner">Konnte keinen Plan finden.</div>`; return; }
  const steps = flatten(best.node, out.leaves);
  const totalLevels = steps.reduce((a,s)=>a+s.step,0);
  const maxStep = steps.reduce((a,s)=>Math.max(a,s.step),0);
  const finalPw = best.pw;
  let html='';
  if(overCap){
    html += `<div class="anvil-warn-banner"><b>Achtung — in Survival nicht baubar!</b> Mindestens ein Schritt kostet 40 Level oder mehr → der Amboss sagt „Zu teuer!". Das Ganze klappt nur im Kreativmodus. Die roten Schritte zeigen, wo es klemmt.</div>`;
  }
  html += `<div class="anvil-summary">
    <div class="sumbox tip" tabindex="0" data-tip="Alle Level zusammengezählt, die du über sämtliche Amboss-Vorgänge ausgibst."><div class="k">GESAMT-LEVEL <span class="q">?</span></div><div class="v ${overCap?'warn':'good'}">${totalLevels}</div></div>
    <div class="sumbox tip" tabindex="0" data-tip="Der teuerste einzelne Amboss-Vorgang."><div class="k">TEUERSTER SCHRITT <span class="q">?</span></div><div class="v ${costClass(maxStep)}">${maxStep} Lvl</div></div>
    <div class="sumbox tip" tabindex="0" data-tip="So oft musst du den Amboss insgesamt benutzen."><div class="k">SCHRITTE <span class="q">?</span></div><div class="v info">${steps.length}×</div></div>
    <div class="sumbox tip" tabindex="0" data-tip="Reparaturstrafe des FERTIGEN Items."><div class="k">END-STRAFE <span class="q">?</span></div><div class="v info">Stufe ${finalPw}</div></div>
  </div>`;
  html += `<div class="astep-legend"><b style="color:#8b7cff">Lila</b> = Buch &nbsp;·&nbsp; <b>graues Item</b> = dein frisches Teil &nbsp;·&nbsp; <b>farbige Nummer</b> = Zwischen-Ergebnis. Taucht dieselbe Farbe/Nummer später wieder auf, ist es genau <b>dieses</b> Ergebnis — <b>fahr mit der Maus drüber</b>, dann siehst du, was drauf ist.</div>`;
  const stepContents = {};
  steps.forEach(s=>{ stepContents[s.n] = s.contents; });
  const tipFor = tok => (tok.kind==='result' && stepContents[tok.step]) ? contentsTip(stepContents[tok.step], out.leaves) : '';
  html += `<div class="anvil-steps">`;
  steps.forEach(s=>{
    const cc = costClass(s.step);
    const isFinal = s.n === steps.length;
    const col = stepColor(s.n);
    const lp = penalty(pwSide(s.left,steps)), rp = penalty(pwSide(s.right,steps));
    const outTip = contentsTip(s.contents, out.leaves).replace(/"/g,'&quot;');
    const outToken = isFinal
      ? `<span class="anvil-token result-out final-out" data-tip="${outTip}" tabindex="0"><span class="slot" style="background:#173c22;display:flex;align-items:center;justify-content:center">${mcIcon(curItem.icon,20)}</span><span><span class="tk-name" style="color:var(--emerald)">FERTIGES ITEM</span><small>Strafe → Stufe ${s.resPw} · hover für Inhalt</small></span></span>`
      : `<span class="anvil-token result-out" style="border-color:${col}" data-tip="${outTip}" tabindex="0"><span class="outnum" style="background:${col}">${s.n}</span><span><span class="tk-name" style="color:${col}">Ergebnis ${s.n}</span><small>Strafe → Stufe ${s.resPw} · hover für Inhalt</small></span></span>`;
    html += `<div class="astep ${s.step>=40?'too-exp':''}" style="border-left-color:${isFinal?'var(--emerald)':col}">
      <div class="astep-top">
        <span class="step-badge" style="background:${isFinal?'var(--emerald)':col}">Schritt ${s.n}</span>
        <span class="astep-cost ${cc}">${mcIcon('Bottle o\' Enchanting',12)} ${s.step} Level${s.step>=40?' — ZU TEUER':''}</span>
      </div>
      <div class="astep-combo">
        ${tokenHtml(s.left, tipFor(s.left))}<span class="anvil-plus">+</span>${tokenHtml(s.right, tipFor(s.right))}<span class="anvil-eq">=</span>${outToken}
      </div>
      <div class="astep-pw tip" tabindex="0" data-tip="Amboss-Kosten = Verzauber-Transfer + Reparaturstrafe links + Reparaturstrafe rechts. Strafe(Stufe n) = 2^n − 1.">Transfer ${s.tc} + Strafe links ${lp} + Strafe rechts ${rp} = <b>${s.step} Level</b> <span class="q">?</span></div>
    </div>`;
  });
  html += `</div>`;
  html += `<div class="anvil-tip" style="border:none;padding-top:8px;margin-top:8px"><b>Merke:</b> Du brauchst beim teuersten Schritt kurzzeitig <b>${maxStep} Erfahrungslevel</b> auf einmal. Sammle also genug XP, bevor du loslegst.</div>`;
  resultEl.innerHTML = html;
}
function pwSide(tok, steps){
  if(tok.kind==='item'||tok.kind==='book') return 0;
  const s = steps.find(x=>x.n===tok.step);
  return s ? s.resPw : 0;
}
calcBtn.addEventListener('click', calculate);
function openAnvil(prefillKey){
  panel.classList.add('show'); toggle.classList.add('on');
  const cp=document.getElementById('calcPanel'); if(cp){ cp.classList.remove('show'); document.getElementById('calcToggleBtn').classList.remove('on'); }
  if(prefillKey && EMAP[prefillKey]){
    const it = ITEMS.find(i=>i.k!=='book' && itemAccepts(i,EMAP[prefillKey])) || ITEMS[0];
    curItem=it; itemSel.value=it.k; setItemIcon();
    picked.clear(); picked.set(prefillKey, EMAP[prefillKey].max); renderList();
  }
  panel.scrollIntoView({behavior:'smooth', block:'start'});
}
toggle.addEventListener('click', ()=>{
  const show=!panel.classList.contains('show');
  panel.classList.toggle('show',show); toggle.classList.toggle('on',show);
  if(show) panel.scrollIntoView({behavior:'smooth', block:'start'});
});
window.openAnvilPlanner = openAnvil;
window.openAnvilPlannerByEn = function(en){
  const e = E.find(x=>x.en.toLowerCase()===String(en||'').toLowerCase());
  openAnvil(e ? e.k : null);
};
setItemIcon(); renderList();
