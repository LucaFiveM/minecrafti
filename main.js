/* ===================== SUPABASE (checklist persistence) ===================== */
import { GEM, ENCHANTS, CAT_LABEL, POOL_SIZE, maxLevelPercent, iconImg, mcIcon, iconUrl, blockUrl, portraitUrl, handleIconError, patchDataIcons } from './app.js';
import { PROFESSIONS, DE, deName, LVL_NAMES } from './professions.js';
import { mountExtras, applyHash, PRESETS } from './features.js';

const SUPA_URL = 'https://bdeizijhvgkycaizaddx.supabase.co';
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkZWl6aWpodmdreWNhaXphZGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1Njg1NzcsImV4cCI6MjEwMDE0NDU3N30.mHvo72We4NPesdCJgTtnRHi4ltm3VTsq57empTU6Cx0';
let supa = null;
try { supa = window.supabase.createClient(SUPA_URL, SUPA_ANON); } catch(e){ supa = null; }
const checklistState = {};   // item_key -> {checked, note}
let checklistReady = false;

async function loadChecklist(){
  if(!supa) { checklistReady = true; renderEnchIfOpen(); return; }
  try {
    const { data, error } = await supa.from('villager_checklist').select('item_key,checked,note');
    if(!error && data){ data.forEach(r=>{ checklistState[r.item_key] = {checked:!!r.checked, note:r.note||''}; }); }
  } catch(e){}
  checklistReady = true;
  renderEnchIfOpen();
}
async function toggleChecklist(key, label, checked){
  checklistState[key] = { checked, note: (checklistState[key] && checklistState[key].note) || '' };
  if(!supa) return;
  try {
    const existing = await supa.from('villager_checklist').select('id').eq('item_key', key).maybeSingle();
    if(existing.data){
      await supa.from('villager_checklist').update({checked, updated_at:new Date().toISOString()}).eq('item_key', key);
    } else {
      await supa.from('villager_checklist').insert({item_key:key, label, checked});
    }
  } catch(e){}
}
async function saveChecklistNote(key, label, note){
  if(!checklistState[key]) checklistState[key] = {checked:false, note:''};
  checklistState[key].note = note;
  if(!supa) return;
  try {
    const existing = await supa.from('villager_checklist').select('id').eq('item_key', key).maybeSingle();
    if(existing.data){
      await supa.from('villager_checklist').update({note, updated_at:new Date().toISOString()}).eq('item_key', key);
    } else {
      await supa.from('villager_checklist').insert({item_key:key, label, note});
    }
  } catch(e){}
}

/* ===================== BUILD FILTER TABS ===================== */
const tabsEl = document.getElementById('tabs');
let activeProf = 'all';
function buildTabs(){
  let html = `<span class="tab active" data-id="all">Alle</span>`;
  PROFESSIONS.forEach(p=>{
    html += `<span class="tab${p.hasEnchants?' enchant-tab':''}" data-id="${p.id}"><img src="${portraitUrl(p.en.replace(/ /g,'_'))}" onerror="this.style.display='none'">${p.de}</span>`;
  });
  tabsEl.innerHTML = html;
}
buildTabs();
tabsEl.addEventListener('click', e=>{
  const t = e.target.closest('.tab'); if(!t) return;
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  t.classList.add('active'); activeProf = t.dataset.id; render();
});

/* ===================== RENDER PROFESSIONS ===================== */
const container = document.getElementById('professions');
const countEl = document.getElementById('count');
const searchEl = document.getElementById('search');

function escapeRegex(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function highlight(text, q){
  if(!q) return text;
  try { return text.replace(new RegExp('('+escapeRegex(q)+')','ig'), '<mark>$1</mark>'); }
  catch(e){ return text; }
}
function priceMinValue(n){
  if(typeof n === 'number') return n;
  const parts = String(n).split(/[–-]/).map(s=>parseFloat(s.trim())).filter(x=>!isNaN(x));
  return parts.length ? Math.min(...parts) : NaN;
}
function affordBadge(cost, budget){
  if(budget == null || isNaN(budget) || budget <= 0 || isNaN(cost)) return '';
  if(budget >= cost) return `<span class="afford-badge afford-yes">${mcIcon('Emerald',10)}leistbar</span>`;
  return `<span class="afford-badge afford-no">fehlen ${Math.ceil(cost-budget)}</span>`;
}
function priceLabel(n, i, budget){
  if(i !== 'Emerald') return '';
  if(typeof n === 'string'){
    const parts = n.split(/[–-]/).map(s=>s.trim()).filter(Boolean);
    if(parts.length === 2){
      return `<div class="price-tag price-range"><span class="price-min">${GEM}Min ${parts[0]}</span><span class="price-max">${GEM}Max ${parts[1]}</span>${affordBadge(parseFloat(parts[0]), budget)}</div>`;
    }
  }
  return `<div class="price-tag price-fixed">${GEM}Festpreis: ${n} ${affordBadge(parseFloat(n), budget)}</div>`;
}
function moneyCell(n,i,showPrice,budget,q){
  return `<div class="itemcell"><div class="slot">${iconImg(i)}${(typeof n==='number'&&n>1)?`<span class="n">${n}</span>`:''}</div><div class="itemname"><span class="en">${typeof n==='string'?n+' ':''}${highlight(i,q)}</span><span class="de">${highlight(deName(i),q)}</span>${showPrice?priceLabel(n,i,budget):''}</div></div>`;
}
function tradeMatches(p, t, q){
  if(!q) return true;
  const text = (p.en+' '+p.de+' '+t.want.map(w=>w.i+' '+deName(w.i)).join(' ')+' '+t.give.i+' '+deName(t.give.i)).toLowerCase();
  return text.includes(q);
}
function enchantMatches(e, q){
  if(!q) return true;
  return (e.en+' '+e.de).toLowerCase().includes(q);
}
function tradeEmeraldCost(t){
  const w = t.want.find(w=>w.i==='Emerald');
  return w ? priceMinValue(w.n) : Infinity;
}

function buildProfession(p, q){
  let visibleTrades = p.trades.filter(t=>tradeMatches(p,t,q));
  const visibleEnchants = p.hasEnchants ? ENCHANTS.filter(e=>enchantMatches(e,q)) : [];
  if(q && visibleTrades.length===0 && visibleEnchants.length===0) return null;
  if(sortByPrice){ visibleTrades = [...visibleTrades].sort((a,b)=>tradeEmeraldCost(a)-tradeEmeraldCost(b)); }

  const wrap = document.createElement('div');
  wrap.className = 'profession' + (q ? ' open' : '');
  const head = document.createElement('div');
  head.className = 'prof-head';
  head.innerHTML = `
    <div class="prof-portrait"><img src="${portraitUrl(p.en.replace(/ /g,'_'))}" alt="" onerror="this.style.display='none'"></div>
    <div class="prof-titles">
      <div class="en">${highlight(p.en,q)}</div>
      <div class="de">${highlight(p.de,q)} <span class="prof-count">· ${p.trades.length} Angebote${p.hasEnchants?' + '+ENCHANTS.length+' Bücher':''}</span></div>
    </div>
    <div class="station-btn" data-station="${p.id}"><img src="${blockUrl(p.station.slug)}" alt="" onerror="this.style.display='none'">${p.station.de}</div>
    <svg class="chevron" viewBox="0 0 20 20" fill="none"><path d="M5 7l5 5 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`;
  head.addEventListener('click', e=>{
    if(e.target.closest('.station-btn')) return;
    wrap.classList.toggle('open');
  });
  head.querySelector('.station-btn').addEventListener('click', ()=>{ openModal(p); });

  const body = document.createElement('div');
  body.className = 'prof-body';

  if(visibleTrades.length){
    const table = document.createElement('table');
    table.innerHTML = `<thead><tr><th style="width:74px">Level</th><th>Dorfbewohner will</th><th>Du erhältst</th><th class="num">Vorrat</th></tr></thead><tbody></tbody>`;
    const tbody = table.querySelector('tbody');
    visibleTrades.forEach(t=>{
      const tr = document.createElement('tr');
      const wantHtml = t.want.map(w=>moneyCell(w.n,w.i,true,myBudget,q)).join('<span class="plus">+</span>');
      const cost = tradeEmeraldCost(t);
      if(myBudget != null && !isNaN(myBudget) && myBudget>0 && isFinite(cost)){
        totalPriced++;
        if(myBudget >= cost){ tr.classList.add('afford-yes-row'); affordableCount++; }
        else tr.classList.add('afford-no-row');
      }
      tr.innerHTML = `
        <td><span class="lvl lvl-${t.lvl}">${LVL_NAMES[t.lvl]}</span></td>
        <td><div class="want-list">${wantHtml}</div></td>
        <td>${moneyCell(t.give.n, t.give.i, false, null, q)}${t.treasure?'<span class="tag">SCHATZ</span>':''}${t.note?`<div class="note">${t.note}</div>`:''}</td>
        <td class="num stock">${t.stock}×</td>`;
      tbody.appendChild(tr);
    });
    body.appendChild(table);
  }
  if(p.hasEnchants){ body.appendChild(buildEnchantPanel(q)); }
  wrap.appendChild(head); wrap.appendChild(body);
  return wrap;
}

/* ===================== ENCHANT SUB-PANEL ===================== */
let enchantCat = 'all';
let enchantQ = '';
let enchPanelRef = null;
function buildEnchantPanel(searchQ){
  const panel = document.createElement('div');
  panel.className = 'ench-panel';
  panel.innerHTML = `
    <div class="ench-head">${mcIcon('Enchanted Book',16)} VERZAUBERTE BÜCHER — FIXE SMARAGD-PREISLISTE &amp; MAX-LEVEL-CHANCE
      <button type="button" class="anvil-btn" style="font-size:9px;padding:6px 10px;margin-left:auto" onclick="window.openAnvilPlanner&&window.openAnvilPlanner()">${mcIcon('Anvil',14)}Reihenfolge planen</button>
    </div>
    <div class="ench-search">${mcIcon('Book',16)}<input type="text" placeholder="Verzauberung suchen... z.B. Mending, Schärfe" id="enchSearch"></div>
    <div class="ench-filters" id="enchFilters">
      <span class="chip active" data-cat="all">Alle</span>
      <span class="chip" data-cat="Werkzeuge">${mcIcon('Iron Pickaxe',14)}Werkzeuge</span>
      <span class="chip" data-cat="Schwert">${mcIcon('Iron Sword',14)}Schwert</span>
      <span class="chip" data-cat="Rüstung">${mcIcon('Shield',14)}Rüstung</span>
      <span class="chip" data-cat="Fernkampf">${mcIcon('Bow',14)}Bogen &amp; Co.</span>
      <span class="chip" data-cat="Angel">${mcIcon('Fishing Rod',14)}Angel</span>
      <span class="chip" data-cat="Streitkolben">${mcIcon('Mace',14)}Streitkolben</span>
    </div>
    <div class="ench-count" id="enchCount"></div>
    <table>
      <thead><tr><th>Verzauberung</th><th class="num">Level</th><th class="num">Min</th><th class="num">Max</th><th class="num">Max-Lvl Chance</th><th class="num">Haben?</th></tr></thead>
      <tbody id="enchBody"></tbody>
    </table>`;
  const enchSearchEl = panel.querySelector('#enchSearch');
  const enchBody = panel.querySelector('#enchBody');
  const enchCountEl = panel.querySelector('#enchCount');
  enchSearchEl.value = enchantQ;
  enchPanelRef = { renderEnch, enchBody, enchCountEl };

  function renderEnch(){
    const q = enchSearchEl.value.trim().toLowerCase();
    enchantQ = enchSearchEl.value;
    const globalQ = (searchQ||'').toLowerCase();
    const rows = ENCHANTS.filter(e=>{
      const catOk = enchantCat==='all' || e.cat===enchantCat;
      const text = (e.en+' '+e.de).toLowerCase();
      const searchOk = !q || text.includes(q);
      const globalOk = !globalQ || text.includes(globalQ);
      return catOk && searchOk && globalOk;
    });
    enchBody.innerHTML = '';
    if(rows.length===0){
      enchBody.innerHTML = `<tr><td colspan="6" class="empty">Nichts gefunden.</td></tr>`;
      enchCountEl.textContent = '0 BÜCHER';
      return;
    }
    let lastCat = null;
    rows.forEach((d, idx)=>{
      if(d.cat!==lastCat){
        const cr = document.createElement('tr'); cr.className='cat-row';
        cr.innerHTML = `<td colspan="6">${CAT_LABEL[d.cat]}</td>`;
        enchBody.appendChild(cr); lastCat = d.cat;
      }
      const key = d.en.replace(/[^a-zA-Z0-9]/g,'').toLowerCase() + '_' + d.maxLvl;
      const st = checklistState[key] || {checked:false, note:''};
      const tr = document.createElement('tr');
      const rowId = 'einfo_'+d.en.replace(/[^a-zA-Z]/g,'')+'_'+idx;
      const chanceTxt = d.fromLib ? maxLevelPercent(d) : '—';
      tr.innerHTML =
        `<td><div class="ench-name-row"><div class="itemname"><span class="en">${d.en}${d.treasure?'<span class="tag">TREASURE</span>':''}${d.fromLib?'':'<span class="tag" style="background:#5c5c5c;color:#ddd">NICHT VOM LIB</span>'}</span><span class="de">${d.de}</span></div><span class="info-btn" data-target="${rowId}">i</span></div></td>`+
        `<td class="num"><span class="lvl lvl-${['I','II','III','IV','V'].indexOf(d.lvl)+1}">${d.lvl}</span></td>`+
        `<td class="num min"><span class="cost">${GEM}${d.min}</span></td>`+
        `<td class="num max"><span class="cost">${GEM}${d.max}</span></td>`+
        `<td class="num" style="font-family:'Silkscreen',sans-serif;font-size:11px;color:${d.fromLib?'#5cf08a':'var(--ink-dim)'}">${chanceTxt}</td>`+
        `<td class="num"><div class="chk ${st.checked?'on':''}" data-key="${key}" data-label="${d.de} ${d.lvl}"><div class="chk-box"><span class="chk-mark">V</span></div></div></td>`;
      enchBody.appendChild(tr);
      const infoTr = document.createElement('tr');
      infoTr.className = 'info-row'; infoTr.id = rowId;
      infoTr.innerHTML = `<td colspan="6"><b>${d.de}:</b> ${d.desc} <span style="display:inline-block;margin-top:6px"><button type="button" class="anvil-btn" style="font-size:8px;padding:5px 9px" onclick="window.openAnvilPlannerByEn&&window.openAnvilPlannerByEn('${d.en.replace(/'/g,"\\'")}')">${mcIcon('Anvil',14)}im Amboss-Planer öffnen</button></span></td>`;
      enchBody.appendChild(infoTr);
    });
    enchCountEl.textContent = rows.length + (rows.length===1?' BUCH':' BÜCHER');
  }

  enchSearchEl.addEventListener('input', renderEnch);
  panel.querySelector('#enchFilters').addEventListener('click', e=>{
    const chip = e.target.closest('.chip'); if(!chip) return;
    panel.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active'); enchantCat = chip.dataset.cat; renderEnch();
  });
  enchBody.addEventListener('click', e=>{
    const btn = e.target.closest('.info-btn');
    if(btn){ document.getElementById(btn.dataset.target).classList.toggle('show'); return; }
    const chk = e.target.closest('.chk');
    if(chk){
      const key = chk.dataset.key, label = chk.dataset.label;
      const newChecked = !chk.classList.contains('on');
      chk.classList.toggle('on', newChecked);
      toggleChecklist(key, label, newChecked);
    }
  });
  renderEnch();
  return panel;
}
function renderEnchIfOpen(){
  if(enchPanelRef) enchPanelRef.renderEnch();
}

let myBudget = null;
let sortByPrice = false;
let totalPriced = 0;
let affordableCount = 0;

function render(){
  const q = searchEl.value.trim().toLowerCase();
  container.innerHTML = '';
  totalPriced = 0; affordableCount = 0;
  let profs = activeProf==='all' ? PROFESSIONS : PROFESSIONS.filter(p=>p.id===activeProf);
  let shown = 0;
  profs.forEach(p=>{
    const el = buildProfession(p, q);
    if(el){ container.appendChild(el); shown++; }
  });
  if(shown===0){
    container.innerHTML = `<div class="profession"><div class="empty">Nichts gefunden – probier's mal anders.</div></div>`;
    countEl.textContent = '0 TREFFER';
  } else {
    countEl.textContent = shown + (shown===1?' BERUF':' BERUFE') + ' ANGEZEIGT' + (activeProf==='all' && !q ? ' · Tab anklicken für einzelnen Beruf' : '');
  }
  const budgetSummaryEl = document.getElementById('budgetSummary');
  if(myBudget != null && !isNaN(myBudget) && myBudget > 0 && totalPriced > 0){
    budgetSummaryEl.classList.add('show');
    budgetSummaryEl.innerHTML = `${mcIcon('Emerald',14)} Mit ${myBudget} Smaragd${myBudget===1?'':'en'} sind ${affordableCount} von ${totalPriced} angezeigten Angeboten leistbar.`;
  } else { budgetSummaryEl.classList.remove('show'); }
}
searchEl.addEventListener('input', render);
render();

document.getElementById('expandAllBtn').addEventListener('click', ()=>{
  document.querySelectorAll('.profession').forEach(p=>p.classList.add('open'));
});
document.getElementById('collapseAllBtn').addEventListener('click', ()=>{
  document.querySelectorAll('.profession').forEach(p=>p.classList.remove('open'));
});
const sortPriceBtn = document.getElementById('sortPriceBtn');
sortPriceBtn.addEventListener('click', ()=>{
  sortByPrice = !sortByPrice;
  sortPriceBtn.classList.toggle('on', sortByPrice);
  render();
});
document.getElementById('budgetInput').addEventListener('input', e=>{
  const v = parseFloat(e.target.value);
  myBudget = e.target.value === '' ? null : v;
  render();
});
document.addEventListener('keydown', e=>{
  if(e.key === '/' && document.activeElement !== searchEl){ e.preventDefault(); searchEl.focus(); }
  else if(e.key === 'Escape' && document.activeElement === searchEl){ searchEl.value=''; render(); searchEl.blur(); }
});

/* ===================== HOLZ-RECHNER ===================== */
(function(){
  const calcPanel = document.getElementById('calcPanel');
  const calcToggleBtn = document.getElementById('calcToggleBtn');
  calcToggleBtn.addEventListener('click', ()=>{
    calcPanel.classList.toggle('show'); calcToggleBtn.classList.toggle('on');
  });
  const stacksEl = document.getElementById('calcStacks');
  const logsEl = document.getElementById('calcLogs');
  const planksEl = document.getElementById('calcPlanks');
  const sticksEl = document.getElementById('calcSticks');
  const emeraldsEl = document.getElementById('calcEmeralds');
  let updating = false;
  function fromLogsCore(logs, stacks){
    const planks = logs*4, sticks = planks*2, emeralds = sticks/32;
    setAll(stacks, logs, planks, sticks, emeralds);
  }
  function fromStacks(stacks){ stacks=Math.max(0,stacks||0); fromLogsCore(stacks*64, stacks); }
  function fromLogs(logs){ logs=Math.max(0,logs||0); fromLogsCore(logs, logs/64); }
  function fromPlanks(planks){ planks=Math.max(0,planks||0); const logs=planks/4; fromLogsCore(logs, logs/64); }
  function fromSticks(sticks){ sticks=Math.max(0,sticks||0); const logs=(sticks/2)/4; fromLogsCore(logs, logs/64); }
  function fromEmeralds(emeralds){ emeralds=Math.max(0,emeralds||0); const logs=((emeralds*32)/2)/4; fromLogsCore(logs, logs/64); }
  function fmt(n){ if(!isFinite(n)) return ''; const r=Math.round(n*100)/100; return r===0?'':String(r); }
  function setAll(stacks, logs, planks, sticks, emeralds){
    updating=true;
    stacksEl.value=fmt(stacks); logsEl.value=fmt(logs); planksEl.value=fmt(planks);
    sticksEl.value=fmt(sticks); emeraldsEl.value=fmt(emeralds);
    updating=false;
  }
  stacksEl.addEventListener('input', ()=>{ if(!updating) fromStacks(parseFloat(stacksEl.value)); });
  logsEl.addEventListener('input', ()=>{ if(!updating) fromLogs(parseFloat(logsEl.value)); });
  planksEl.addEventListener('input', ()=>{ if(!updating) fromPlanks(parseFloat(planksEl.value)); });
  sticksEl.addEventListener('input', ()=>{ if(!updating) fromSticks(parseFloat(sticksEl.value)); });
  emeraldsEl.addEventListener('input', ()=>{ if(!updating) fromEmeralds(parseFloat(emeraldsEl.value)); });
})();

/* ===================== CRAFTING MODAL ===================== */
const overlay = document.getElementById('modalOverlay');
const craftGrid = document.getElementById('craftGrid');
function openModal(p){
  document.getElementById('modalIcon').src = blockUrl(p.station.slug);
  document.getElementById('modalIcon').onerror = function(){ this.style.display='none'; };
  document.getElementById('modalEn').textContent = p.station.en;
  document.getElementById('modalDe').textContent = p.station.de + ' — Werkstatt für ' + p.de;
  craftGrid.innerHTML = '';
  p.station.grid.forEach(cell=>{
    const slot = document.createElement('div'); slot.className = 'craft-slot';
    if(cell){ slot.innerHTML = `${iconImg(cell.i)}${cell.n && cell.n>1 ? `<span class="n">${cell.n}</span>`:''}`; }
    craftGrid.appendChild(slot);
  });
  document.getElementById('craftNote').innerHTML = `<div class="craft-result">→ <div class="slot">${iconImg(p.station.en)}</div> <b>${p.station.en}</b></div><div style="margin-top:10px">${p.station.note}</div>`;
  overlay.classList.add('show');
}
document.getElementById('modalClose').addEventListener('click', ()=> overlay.classList.remove('show'));
overlay.addEventListener('click', e=>{ if(e.target===overlay) overlay.classList.remove('show'); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') overlay.classList.remove('show'); });

/* Patch data-icon placeholders now, then load checklist. */
patchDataIcons(document);
mountExtras();
loadChecklist();
applyHash();
window.addEventListener('hashchange', applyHash);
