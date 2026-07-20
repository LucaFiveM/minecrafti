/* ===================== ICON HELPERS ===================== */
export const GEM = `<svg class="gem" viewBox="0 0 16 16"><polygon points="8,1 15,6 8,15 1,6" fill="#17c34e" stroke="#0e7a30" stroke-width="1"/><polygon points="8,1 15,6 8,7" fill="#3ee06f"/><polygon points="1,6 8,7 8,15" fill="#0e9c3d"/></svg>`;

export const ICON_OVERRIDE = {
  "Log":"Oak Log","Wood Planks":"Oak Planks","Wood Slab":"Oak Slab","Boat":"Oak Boat",
  "Banner":"White Banner","Colored Wool":"White Wool","Colored Carpet":"White Carpet",
  "Glazed Terracotta":"White Glazed Terracotta","Stained Terracotta":"White Terracotta",
  "Dye":"White Dye","Explorer Map":"Woodland Explorer Map"
};
export const GIF_ICONS = new Set(["Compass","Clock","Bottle o' Enchanting","Recovery Compass","Enchanted Book"]);
export function iconBase(name){ return ICON_OVERRIDE[name] || name; }
export function iconUrl(name, ext){
  ext = ext || (GIF_ICONS.has(name) ? "gif" : "png");
  return "https://minecraft.wiki/images/Invicon_" + encodeURIComponent(iconBase(name).replace(/ /g,"_")) + "." + ext;
}
export function blockUrl(slug){ return "https://minecraft.wiki/images/BlockSprite_" + slug + ".png"; }
export function portraitUrl(prof){ return "https://minecraft.wiki/images/Plains_" + prof + ".png"; }
export function handleIconError(img){
  const step = img.dataset.step || "0";
  const name = decodeURIComponent(img.dataset.name || "");
  if(step === "0"){
    const triedExt = GIF_ICONS.has(name) ? "gif" : "png";
    const altExt = triedExt === "png" ? "gif" : "png";
    img.dataset.step = "1";
    img.src = iconUrl(name, altExt);
  } else { img.style.display = 'none'; }
}
export function iconImg(name){
  return `<img src="${iconUrl(name)}" data-name="${encodeURIComponent(name)}" alt="${name}" loading="lazy" onerror="handleIconError(this)">`;
}
export function mcIcon(name, size){
  size = size || 16;
  return `<img src="${iconUrl(name)}" data-name="${encodeURIComponent(name)}" alt="${name}" loading="lazy" style="width:${size}px;height:${size}px;image-rendering:pixelated;vertical-align:middle;display:inline-block" onerror="handleIconError(this)">`;
}
export function patchDataIcons(root){
  (root||document).querySelectorAll('img[data-icon]').forEach(img=>{
    const name = img.dataset.icon;
    img.src = iconUrl(name);
    img.dataset.name = encodeURIComponent(name);
    img.dataset.step = '0';
    img.onerror = ()=>handleIconError(img);
  });
}

/* ===================== ENCHANTMENT DATA ===================== */
/* Pool size for librarian enchanted-book trade (without Villager Trade Rebalance):
   all enchanting-table enchantments including treasure ones, EXCEPT Soul Speed,
   Swift Sneak and Wind Burst (never sold). 39 entries total. */
export const POOL_SIZE = 39;
export const ENCHANTS = [
  {cat:"Werkzeuge", en:"Unbreaking", de:"Haltbarkeit", lvl:"III", maxLvl:3, min:11, max:45, fromLib:true, desc:"Erhöht die Chance, dass ein Werkzeug, eine Waffe oder Rüstung bei Nutzung nicht abgenutzt wird."},
  {cat:"Werkzeuge", en:"Efficiency", de:"Effizienz", lvl:"V", maxLvl:5, min:17, max:64, fromLib:true, desc:"Erhöht die Abbaugeschwindigkeit von Werkzeugen deutlich."},
  {cat:"Werkzeuge", en:"Fortune", de:"Glück", lvl:"III", maxLvl:3, min:11, max:45, fromLib:true, desc:"Erhöht die Menge mancher Blockdrops, z.B. mehr Diamanten, Kohle oder Beeren."},
  {cat:"Werkzeuge", en:"Silk Touch", de:"Behutsamkeit", lvl:"I", maxLvl:1, min:5, max:19, fromLib:true, desc:"Blöcke droppen sich selbst statt ihrer üblichen Drops (z.B. Erzblock statt Rohstoff)."},
  {cat:"Werkzeuge", en:"Mending", de:"Reparatur", lvl:"I", maxLvl:1, min:10, max:38, treasure:true, fromLib:true, desc:"Nutzt aufgesammelte Erfahrungsorbs, um das Item automatisch zu reparieren, statt XP zu geben."},
  {cat:"Werkzeuge", en:"Curse of Vanishing", de:"Fluch des Verschwindens", lvl:"I", maxLvl:1, min:10, max:38, treasure:true, fromLib:true, desc:"Das Item verschwindet beim Tod statt gedroppt zu werden."},

  {cat:"Schwert", en:"Sharpness", de:"Schärfe", lvl:"V", maxLvl:5, min:17, max:64, fromLib:true, desc:"Erhöht den allgemeinen Nahkampfschaden mit dem Schwert."},
  {cat:"Schwert", en:"Smite", de:"Bann", lvl:"V", maxLvl:5, min:17, max:64, fromLib:true, desc:"Zusätzlicher Schaden gegen Untote wie Zombies, Skelette und den Wither."},
  {cat:"Schwert", en:"Bane of Arthropods", de:"Nemesis der Gliederfüßer", lvl:"V", maxLvl:5, min:17, max:64, fromLib:true, desc:"Zusätzlicher Schaden gegen Spinnen, Höhlenspinnen, Endermilben & Silberfischchen, verlangsamt sie zudem."},
  {cat:"Schwert", en:"Looting", de:"Plünderung", lvl:"III", maxLvl:3, min:11, max:45, fromLib:true, desc:"Erhöht Drop-Menge und Chance auf seltene Mob-Drops."},
  {cat:"Schwert", en:"Sweeping Edge", de:"Schwungkraft", lvl:"III", maxLvl:3, min:11, max:45, fromLib:true, desc:"Erhöht den Schaden des Rundumschlags mit dem Schwert."},
  {cat:"Schwert", en:"Fire Aspect", de:"Verbrennung", lvl:"II", maxLvl:2, min:8, max:32, fromLib:true, desc:"Setzt getroffene Gegner in Brand."},
  {cat:"Schwert", en:"Knockback", de:"Rückstoß", lvl:"II", maxLvl:2, min:8, max:32, fromLib:true, desc:"Stößt getroffene Gegner weiter zurück."},

  {cat:"Rüstung", en:"Protection", de:"Schutz", lvl:"IV", maxLvl:4, min:14, max:58, fromLib:true, desc:"Reduziert die meisten Schadensarten leicht bis stark."},
  {cat:"Rüstung", en:"Projectile Protection", de:"Geschossschutz", lvl:"IV", maxLvl:4, min:14, max:58, fromLib:true, desc:"Reduziert Schaden durch Projektile wie Pfeile oder Feuerbälle."},
  {cat:"Rüstung", en:"Blast Protection", de:"Explosionsschutz", lvl:"IV", maxLvl:4, min:14, max:58, fromLib:true, desc:"Reduziert Explosionsschaden und den dadurch verursachten Rückstoß."},
  {cat:"Rüstung", en:"Fire Protection", de:"Feuerschutz", lvl:"IV", maxLvl:4, min:14, max:58, fromLib:true, desc:"Reduziert Feuer- und Lavaschaden."},
  {cat:"Rüstung", en:"Feather Falling", de:"Federfall", lvl:"IV", maxLvl:4, min:14, max:58, fromLib:true, desc:"Reduziert Fallschaden deutlich."},
  {cat:"Rüstung", en:"Thorns", de:"Dornen", lvl:"III", maxLvl:3, min:11, max:45, fromLib:true, desc:"Reflektiert einen Teil des erlittenen Schadens auf den Angreifer, nutzt die Rüstung dabei schneller ab."},
  {cat:"Rüstung", en:"Respiration", de:"Atmung", lvl:"III", maxLvl:3, min:11, max:45, fromLib:true, desc:"Verlängert den Luftvorrat unter Wasser und verbessert die Sicht."},
  {cat:"Rüstung", en:"Aqua Affinity", de:"Wassergängigkeit", lvl:"I", maxLvl:1, min:5, max:19, fromLib:true, desc:"Normale Abbaugeschwindigkeit auch unter Wasser."},
  {cat:"Rüstung", en:"Depth Strider", de:"Tiefenläufer", lvl:"III", maxLvl:3, min:11, max:45, fromLib:true, desc:"Erhöht die Bewegungsgeschwindigkeit im Wasser."},
  {cat:"Rüstung", en:"Frost Walker", de:"Frostläufer", lvl:"II", maxLvl:2, min:16, max:64, treasure:true, fromLib:true, desc:"Verwandelt Wasser unter den Füßen in begehbares Eis."},
  {cat:"Rüstung", en:"Curse of Binding", de:"Fluch der Bindung", lvl:"I", maxLvl:1, min:10, max:38, treasure:true, fromLib:true, desc:"Verhindert, dass das verfluchte Rüstungsteil abgelegt werden kann."},
  {cat:"Rüstung", en:"Soul Speed", de:"Seelentempo", lvl:"III", maxLvl:3, min:16, max:64, treasure:true, fromLib:false, desc:"Erhöht die Bewegungsgeschwindigkeit auf Seelensand und Seelenerde. Nur über Piglin-Tausch erhältlich — nicht vom Bibliothekar."},
  {cat:"Rüstung", en:"Swift Sneak", de:"Sanfter Schleicher", lvl:"III", maxLvl:3, min:16, max:64, treasure:true, fromLib:false, desc:"Erhöht die Schleichgeschwindigkeit. Nur in antiken Stätten findbar — nicht vom Bibliothekar."},

  {cat:"Fernkampf", en:"Power", de:"Stärke", lvl:"V", maxLvl:5, min:17, max:64, fromLib:true, desc:"Erhöht den Pfeilschaden des Bogens."},
  {cat:"Fernkampf", en:"Punch", de:"Schlag", lvl:"II", maxLvl:2, min:8, max:32, fromLib:true, desc:"Stößt mit Pfeilen getroffene Ziele weiter zurück."},
  {cat:"Fernkampf", en:"Flame", de:"Flamme", lvl:"I", maxLvl:1, min:5, max:19, fromLib:true, desc:"Pfeile setzen getroffene Ziele in Brand."},
  {cat:"Fernkampf", en:"Infinity", de:"Unendlichkeit", lvl:"I", maxLvl:1, min:5, max:19, fromLib:true, desc:"Verbraucht keine Pfeile mehr — ein Pfeil im Inventar reicht."},
  {cat:"Fernkampf", en:"Piercing", de:"Durchschlag", lvl:"IV", maxLvl:4, min:14, max:58, fromLib:true, desc:"Armbrust-Bolzen durchdringen mehrere Ziele hintereinander."},
  {cat:"Fernkampf", en:"Quick Charge", de:"Schnellladen", lvl:"III", maxLvl:3, min:11, max:45, fromLib:true, desc:"Verkürzt die Ladezeit der Armbrust."},
  {cat:"Fernkampf", en:"Multishot", de:"Mehrfachschuss", lvl:"I", maxLvl:1, min:5, max:19, fromLib:true, desc:"Verschießt 3 Pfeile gleichzeitig, verbraucht dabei nur einen."},
  {cat:"Fernkampf", en:"Impaling", de:"Harpune", lvl:"V", maxLvl:5, min:17, max:64, fromLib:true, desc:"Zusätzlicher Schaden gegen Wasserbewohner mit dem Dreizack."},
  {cat:"Fernkampf", en:"Loyalty", de:"Treue", lvl:"III", maxLvl:3, min:11, max:45, fromLib:true, desc:"Der Dreizack fliegt nach dem Werfen zum Spieler zurück."},
  {cat:"Fernkampf", en:"Riptide", de:"Sog", lvl:"III", maxLvl:3, min:11, max:45, fromLib:true, desc:"Schleudert den Spieler beim Werfen im Wasser oder Regen mit fort."},
  {cat:"Fernkampf", en:"Channeling", de:"Entladung", lvl:"I", maxLvl:1, min:5, max:19, fromLib:true, desc:"Ruft bei Gewitter einen Blitzschlag auf das getroffene Ziel."},

  {cat:"Angel", en:"Luck of the Sea", de:"Glück des Meeres", lvl:"III", maxLvl:3, min:11, max:45, fromLib:true, desc:"Erhöht die Chance auf seltene Angelfunde und verringert Müll-Drops."},
  {cat:"Angel", en:"Lure", de:"Köder", lvl:"III", maxLvl:3, min:11, max:45, fromLib:true, desc:"Verkürzt die Wartezeit, bis beim Angeln etwas anbeißt."},

  {cat:"Streitkolben", en:"Density", de:"Dichte", lvl:"V", maxLvl:5, min:17, max:64, fromLib:true, desc:"Erhöht den Schaden des Streitkolbens je Fallhöhe."},
  {cat:"Streitkolben", en:"Breach", de:"Bruch", lvl:"IV", maxLvl:4, min:14, max:58, fromLib:true, desc:"Reduziert die Rüstungswirkung des getroffenen Gegners."},
  {cat:"Streitkolben", en:"Wind Burst", de:"Windstoß", lvl:"III", maxLvl:3, min:16, max:64, treasure:true, fromLib:false, desc:"Schleudert den Spieler nach einem Angriff nach oben. Nur aus Prüfungskammern — nicht vom Bibliothekar."},
];
export const CAT_LABEL = {
  "Werkzeuge": mcIcon("Iron Pickaxe",14)+" Werkzeuge & Allgemein",
  "Schwert": mcIcon("Iron Sword",14)+" Schwert",
  "Rüstung": mcIcon("Shield",14)+" Rüstung",
  "Fernkampf": mcIcon("Bow",14)+" Bogen / Armbrust / Dreizack",
  "Angel": mcIcon("Fishing Rod",14)+" Angel",
  "Streitkolben": mcIcon("Mace",14)+" Streitkolben",
};
/* Chance to get the max level of an enchant from a librarian book trade.
   Each level of a sold enchant is equally likely, so P(max) = 1/maxLvl,
   and the enchant itself is 1/POOL_SIZE of the book pool. */
export function maxLevelChance(e){ return 1 / (POOL_SIZE * e.maxLvl); }
export function maxLevelPercent(e){ return (100/POOL_SIZE/e.maxLvl).toFixed(2).replace('.',',') + "%"; }
