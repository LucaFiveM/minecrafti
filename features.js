/* ===================== FEATURES ===================== */
import { ENCHANTS, CAT_LABEL, mcIcon, iconImg, iconUrl, blockUrl, portraitUrl, handleIconError } from './app.js';
import { PROFESSIONS, deName } from './professions.js';
/* ---------- 1. SMARAGD-FARM-RATGEBER ---------- */
/* Collects all "sell X → get emerald" trades and ranks them by ease.
   ease = how easy the item is to obtain (farmable/cheap items rank high). */
const FARM_EASE = {
  "Stick":5, "Paper":5, "Wheat":5, "Potato":5, "Carrot":5, "Beetroot":4, "Pumpkin":5, "Melon":5,
  "Sugar Cane":5, "Raw Chicken":4, "Raw Porkchop":4, "Raw Beef":4, "Raw Mutton":4, "Raw Cod":5,
  "Raw Salmon":5, "Coal":4, "Iron Ingot":3, "Gold Ingot":2, "Rotten Flesh":3, "String":3,
  "Leather":3, "Flint":4, "Clay Ball":4, "Stone":4, "Granite":3, "Andesite":3, "Diorite":3,
  "Nether Quartz":2, "Dried Kelp Block":4, "Sweet Berries":4, "Glass Pane":3, "Ink Sac":3,
  "Rabbit Hide":2, "Rabbit's Foot":1, "Turtle Scute":1, "Tropical Fish":2, "Pufferfish":2,
  "Tripwire Hook":2, "Feather":3, "Book":3, "Book and Quill":2, "Lava Bucket":3, "Diamond":1,
  "Nether Wart":2, "Glass Bottle":3, "Cobblestone":5, "Gravel":4, "Wood Planks":5, "Log":5,
  "Dye":4, "White Wool":4
};
function buildFarmGuide(){
  const sellTrades = [];
  PROFESSIONS.forEach(p=>{
    p.trades.forEach(t=>{
      const give = t.give;
      if(give.i === "Emerald"){
        t.want.forEach(w=>{
          if(w.i !== "Emerald"){
            const ease = FARM_EASE[w.i] || 2;
            sellTrades.push({
              prof: p.de, profEn: p.en, item: w.i, itemDe: deName(w.i),
              count: w.n, ease, lvl: t.lvl
            });
          }
        });
      }
    });
  });
  sellTrades.sort((a,b)=> b.ease - a.ease || a.count - b.count);

  const panel = document.createElement('div');
  panel.className = 'farm-panel';
  panel.id = 'farmPanel';
  panel.innerHTML = `
    <div class="farm-head">${mcIcon('Emerald',16)} SMARAGD-FARM-RATGEBER <span class="farm-sub">— was verkaufe ich wem für Smaragde?</span></div>
    <div class="farm-intro">Diese Liste zeigt alle <b>„verkaufen für Smaragd"</b>-Handel, sortiert nachdem wie <b>leicht</b> der Stoff zu beschaffen ist. Oben = super einfach farmbar (z.B. Stöcke, Papier, Weizen). Unten = selten/aufwendig.</div>
    <div class="farm-legend">
      <span class="farm-dot e5"></span> super leicht
      <span class="farm-dot e4"></span> leicht
      <span class="farm-dot e3"></span> mittel
      <span class="farm-dot e2"></span> schwer
      <span class="farm-dot e1"></span> sehr selten
    </div>
    <div class="farm-list" id="farmList"></div>
  `;
  const listEl = panel.querySelector('#farmList');
  const top = sellTrades.slice(0, 24);
  listEl.innerHTML = top.map(t=>{
    const easeLabel = ['sehr selten','schwer','mittel','leicht','super leicht'][t.ease-1] || 'mittel';
    return `<div class="farm-row e${t.ease}">
      <div class="farm-ease-dot farm-dot e${t.ease}" data-tip="Schwierigkeit: ${easeLabel}"></div>
      <div class="farm-item">${mcIcon(t.item,24)} <div><span class="farm-itemname">${t.itemDe}</span><span class="farm-prof">bei ${t.prof} (Lvl ${t.lvl})</span></div></div>
      <div class="farm-amount">${t.count}× ${mcIcon(t.item,16)}</div>
      <div class="farm-arrow">→</div>
      <div class="farm-reward">${mcIcon('Emerald',20)} 1</div>
    </div>`;
  }).join('');
  return panel;
}

/* ---------- 2. QUICK-PRESETS for Anvil Planner ---------- */
/* Optimal enchantment sets per item type — one click fills the planner. */
export const PRESETS = {
  sword: { label:"Bestes Schwert", ench:{ sharpness:5, looting:3, unbreaking:3, sweeping:3, fire_aspect:2 } },
  pickaxe: { label:"Beste Spitzhacke", ench:{ efficiency:5, unbreaking:3, fortune:3 } },
  pickaxe_silk: { label:"Spitzhacke (Behutsamkeit)", ench:{ efficiency:5, unbreaking:3, silk_touch:1 } },
  axe: { label:"Beste Axt", ench:{ sharpness:5, efficiency:5, unbreaking:3, fortune:3 } },
  shovel: { label:"Beste Schaufel", ench:{ efficiency:5, unbreaking:3, fortune:3 } },
  hoe: { label:"Beste Hacke", ench:{ efficiency:5, unbreaking:3, fortune:3 } },
  bow: { label:"Bester Bogen", ench:{ power:5, punch:2, flame:1, infinity:1, unbreaking:3 } },
  crossbow: { label:"Beste Armbrust", ench:{ quick_charge:3, multishot:1, unbreaking:3 } },
  crossbow_pierce: { label:"Armbrust (Durchschlag)", ench:{ piercing:4, quick_charge:3, unbreaking:3 } },
  trident: { label:"Bester Dreizack", ench:{ impaling:5, loyalty:3, unbreaking:3, mending:1 } },
  helmet: { label:"Bester Helm", ench:{ protection:4, respiration:3, aqua_affinity:1, unbreaking:3, mending:1 } },
  chestplate: { label:"Beste Brustplatte", ench:{ protection:4, thorns:3, unbreaking:3, mending:1 } },
  leggings: { label:"Beste Hose", ench:{ protection:4, swift_sneak:3, unbreaking:3, mending:1 } },
  boots: { label:"Beste Stiefel", ench:{ protection:4, feather_falling:4, depth_strider:3, unbreaking:3, mending:1 } },
  boots_frost: { label:"Stiefel (Frostläufer)", ench:{ protection:4, feather_falling:4, frost_walker:2, unbreaking:3, mending:1 } },
  fishing: { label:"Beste Angel", ench:{ luck:3, lure:3, unbreaking:3, mending:1 } },
  mace: { label:"Bester Streitkolben", ench:{ density:5, breach:4, unbreaking:3, mending:1 } },
  shears: { label:"Beste Schere", ench:{ efficiency:5, unbreaking:3, mending:1 } },
  shield: { label:"Bestes Schild", ench:{ unbreaking:3, mending:1 } },
  elytra: { label:"Elytren", ench:{ unbreaking:3, mending:1 } },
};

/* ---------- 4. URL-HASH-NAVIGATION ---------- */
export function applyHash(){
  const hash = location.hash.replace('#','');
  if(!hash) return;
  const tab = document.querySelector(`.tab[data-id="${hash}"]`);
  if(tab){ tab.click(); }
}

/* ---------- 5. VERZAUBERUNGS-EMPFEHLUNGEN ---------- */
/* Shows recommended enchantments for a given item type, inline. */
export const RECOMMENDATIONS = {
  sword: ["sharpness","looting","unbreaking","sweeping","fire_aspect"],
  pickaxe: ["efficiency","unbreaking","fortune"],
  axe: ["sharpness","efficiency","unbreaking","fortune"],
  shovel: ["efficiency","unbreaking","fortune"],
  hoe: ["efficiency","unbreaking","fortune"],
  bow: ["power","unbreaking","punch","flame","infinity"],
  crossbow: ["quick_charge","multishot","unbreaking"],
  trident: ["impaling","loyalty","unbreaking","mending"],
  helmet: ["protection","respiration","aqua_affinity","unbreaking","mending"],
  chestplate: ["protection","thorns","unbreaking","mending"],
  leggings: ["protection","swift_sneak","unbreaking","mending"],
  boots: ["protection","feather_falling","depth_strider","unbreaking","mending"],
  fishing: ["luck","lure","unbreaking","mending"],
  mace: ["density","breach","unbreaking","mending"],
  shield: ["unbreaking","mending"],
  shears: ["efficiency","unbreaking","mending"],
  elytra: ["unbreaking","mending"],
};

/* ---------- Mount farm guide ---------- */
export function mountExtras(){
  const container = document.getElementById('professions');
  const farmGuide = buildFarmGuide();
  container.parentNode.insertBefore(farmGuide, container.nextSibling);
}
