

export enum BuildingStatus {
  OWNED = 'OWNED',
  RENTED = 'RENTED'
}

export type Language = 'TR' | 'EN';

export type Season = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';
export type Planet = 'EARTH' | 'MARS' | 'VENUS' | 'JUPITER' | 'SATURN' | 'URANUS' | 'NEPTUNE' | 'MERCURY';

export interface Translation {
  title: string;
  status: string;
  market: string;
  bulldoze: string;
  done: string;
  reset: string;
  floors: string;
  estPop: string;
  perfect: string;
  gameOver: string;
  finalHeight: string;
  newPop: string;
  whatToDo: string;
  rentBtn: string;
  rentDesc: string;
  sellBtn: string;
  sellDesc: string;
  cancelBtn: string;
  marketTitle: string;
  availableFunds: string;
  tabCrane: string;
  tabStyles: string;
  maxLevel: string;
  upgrade: string;
  equip: string;
  equipped: string;
  unlock: string;
  active: string;
  occupiedMsg: string;
  demolishMsg: string;
  resetMsg: string;
  season: string;
  spring: string;
  summer: string;
  autumn: string;
  winter: string;
  build: string;
  tabRocket: string;
  rocketArea: string;
  rocketBody: string;
  rocketModule: string;
  rocketShuttleBody: string;
  rocketShuttleEngine: string;
  rocketShuttleComp: string;
  rocketComplete: string;
  rocketLocked: string;
  rocketSiloMsg: string;
  demolishAction: string;
  marsTitle: string;
  venusTitle: string;
  jupiterTitle: string;
  saturnTitle: string;
  uranusTitle: string;
  neptuneTitle: string;
  mercuryTitle: string;
  travelToMars: string;
  returnToEarth: string;
  journeyToMars: string;
  journeyToVenus: string;
  journeyToJupiter: string;
  journeyToSaturn: string;
  journeyToUranus: string;
  journeyToNeptune: string;
  journeyToMercury: string;
  arrivalTime: string;
  landingAvailable: string;
  landOnMars: string;
  landOnVenus: string;
  landOnJupiter: string;
  landOnSaturn: string;
  landOnUranus: string;
  landOnNeptune: string;
  landOnMercury: string;
  popReqMars: string;
  popReqVenus: string;
  popReqJupiter: string;
  popReqSaturn: string;
  popReqUranus: string;
  popReqNeptune: string;
  popReqMercury: string;
  menuPlay: string;
  menuSave: string;
  menuAbout: string;
  menuReset: string;
  aboutText: string;
  gameSaved: string;
  settings: string;
  musicVol: string;
  sfxVol: string;
  help: string;
  helpTitle: string;
  helpText: string;
  adminMode: string;
  adminActive: string;
  autoPilot: string;
  rocketHp: string;
  launchFailed: string;
  stallWarning: string;
  puzzleTitle: string;
  puzzleTime: string;
  puzzleSolved: string;
  puzzleFailed: string;
  penaltyMsg: string;
  puzzleInstructions: string;
}

export const TRANSLATIONS: Record<Language, Translation> = {
  TR: {
    title: "Build your tower universe",
    status: "Statü",
    market: "Market",
    bulldoze: "Yıkım Modu",
    done: "Bitti",
    reset: "Şehri Sıfırla",
    floors: "Kat",
    estPop: "Tahmini Nüfus",
    perfect: "MÜKEMMEL!",
    gameOver: "İnşaat Tamamlandı",
    finalHeight: "Final Yüksekliği",
    newPop: "Yeni Nüfus",
    whatToDo: "Bu bina ile ne yapmak istersin?",
    rentBtn: "KİRAYA VER",
    rentDesc: "Zamanla pasif gelir sağlar",
    sellBtn: "HEMEN SAT",
    sellDesc: "Anında nakit para",
    cancelBtn: "Projeyi İptal Et",
    marketTitle: "İnşaat Pazarı",
    availableFunds: "Kasa:",
    tabCrane: "Vinç Geliştirmeleri",
    tabStyles: "Mimari Projeler",
    maxLevel: "MAKS SEVİYE",
    upgrade: "Geliştir",
    equip: "Kullan",
    equipped: "Kullanımda",
    unlock: "Kilidi Aç",
    active: "AKTİF",
    occupiedMsg: "Bu alan dolu. Yıkım modunu kullanarak temizleyebilirsin.",
    demolishMsg: "Bu binayı yıkmak istiyor musun? Para iadesi yapılmaz.",
    resetMsg: "Tüm ilerlemen silinecek. Emin misin?",
    season: "Mevsim",
    spring: "İlkbahar",
    summer: "Yaz",
    autumn: "Sonbahar",
    winter: "Kış",
    build: "İnşa Et",
    tabRocket: "Uzay Programı",
    rocketArea: "Roket İnşa Alanı",
    rocketBody: "Roket Gövdesi",
    rocketModule: "Komuta Modülü",
    rocketShuttleBody: "Mekik Gövdesi",
    rocketShuttleEngine: "Mekik Motorları",
    rocketShuttleComp: "Navigasyon Sistemi",
    rocketComplete: "FIRLATMAYA HAZIR",
    rocketLocked: "KİLİTLİ",
    rocketSiloMsg: "Roket fırlatma rampası üzerinde inşaat yapılamaz.",
    demolishAction: "YIK!",
    marsTitle: "Mars Kolonisi",
    venusTitle: "Venüs Üssü",
    jupiterTitle: "Jüpiter İstasyonu",
    saturnTitle: "Satürn Halkaları",
    uranusTitle: "Uranüs Buzulu",
    neptuneTitle: "Neptün Okyanusu",
    mercuryTitle: "Merkür Krateri",
    travelToMars: "Mars'a Git",
    returnToEarth: "Dünya'ya Dön",
    journeyToMars: "MARS YOLCULUĞU",
    journeyToVenus: "VENÜS YOLCULUĞU",
    journeyToJupiter: "JÜPİTER YOLCULUĞU",
    journeyToSaturn: "SATÜRN YOLCULUĞU",
    journeyToUranus: "URANÜS YOLCULUĞU",
    journeyToNeptune: "NEPTÜN YOLCULUĞU",
    journeyToMercury: "MERKÜR YOLCULUĞU",
    arrivalTime: "Tahmini Varış:",
    landingAvailable: "Yörüngeye Girildi",
    landOnMars: "Mars'a İniş Yap",
    landOnVenus: "Venüs'e İniş Yap",
    landOnJupiter: "Jüpiter'e İniş Yap",
    landOnSaturn: "Satürn'e İniş Yap",
    landOnUranus: "Uranüs'e İniş Yap",
    landOnNeptune: "Neptün'e İniş Yap",
    landOnMercury: "Merkür'e İniş Yap",
    popReqMars: "Roket fırlatmak için 500 Nüfus gerekli!",
    popReqVenus: "Venüs yolculuğu için 2000 Nüfus gerekli!",
    popReqMercury: "Merkür yolculuğu için 3500 Nüfus gerekli!",
    popReqJupiter: "Jüpiter Mekiği için 5000 Nüfus gerekli!",
    popReqSaturn: "Satürn Halkaları için 10.000 Nüfus gerekli!",
    popReqUranus: "Uranüs için 25.000 Nüfus gerekli!",
    popReqNeptune: "Neptün Sınırı için 50.000 Nüfus gerekli!",
    menuPlay: "OYNA",
    menuSave: "OYUNU KAYDET",
    menuAbout: "HAKKIMIZDA",
    menuReset: "ŞEHRİ SIFIRLA",
    aboutText: "Vinç yardımı ile kuleler dikip gökyüzüne ulaşmaya ne dersin! Biraz para kazanıp şehrin nüfusunu artırabilirsen uzay programını başlatıp yeni gezegenlerde inşaa sistemine devam edebilirsin. Unutma 500 nufusla başlayıp, 2000 nüfus, 5000 nüfusa kadar ilerleyince venüs hatta jüpiter bile ayaklarında olacak. Pardon göklerde :d\n\nOyun Şirketi: firecouldnight\nGeliştiren: İbrahim Çıvgın",
    gameSaved: "Oyun Başarıyla Kaydedildi!",
    settings: "Ayarlar",
    musicVol: "Müzik Sesi",
    sfxVol: "Oyun Sesi",
    help: "Yardım",
    helpTitle: "Evrensel İnşaat Rehberi",
    helpText: "Hoş geldin Mimar! Amacın göklere uzanan kuleler inşa etmek ve insanlığı güneş sistemine yaymak. İşte rehberin:\n\n🏗️ 1. İNŞAAT VE EKONOMİ\n• Temeller: Vinç ile blokları üst üste diz. Ne kadar hizalı koyarsan o kadar çok nüfus ve 'Kombo' bonusu kazanırsın.\n• Gelir Modeli: Binayı bitirince 'Kiraya Ver' dersen her 10 dakikada bir pasif gelir elde edersin. 'Sat' dersen anında nakit para alırsın.\n• Gelişim: Marketten vinç hızını ve blok hassasiyetini artır. Yeni bina stilleri satın alarak gelirini ve nüfus kapasiteni katla.\n\n🚀 2. UZAY PROGRAMI\n• Roket İnşası: Market > Uzay Programı sekmesinden 6 parça roket malzemesi satın al.\n• Montaj: Şehrin sağ altındaki (16. Slot) roket rampasında parçalar otomatik birleşir.\n• Aşama 3 (Temel Roket): Mars, Venüs ve Merkür'e ulaşım sağlar.\n• Aşama 6 (Uzay Mekiği): Jüpiter, Satürn ve ötesine ulaşım sağlar.\n\n🪐 3. GEZEGENLER VE ŞARTLAR\nNüfusun arttıkça yeni rotalar açılır:\n🔴 Mars: 500 Nüfus (Temel Roket)\n🟡 Venüs: 2.000 Nüfus (Temel Roket)\n🟤 Merkür: 3.500 Nüfus (Temel Roket)\n🟠 Jüpiter: 5.000 Nüfus (Mekik Şart!)\n🪐 Satürn: 10.000 Nüfus (Mekik Şart!)\n🔵 Uranüs: 25.000 Nüfus (Mekik Şart!)\n🌊 Neptün: 50.000 Nüfus (Mekik Şart!)\n\nHer gezegende sıfırdan bir koloni kurar, oranın ekonomisini yönetir ve bir sonraki durağa hazırlanırsın. İyi şanslar!",
    adminMode: "Yönetici Modu",
    adminActive: "AKTİF - Anında Uçuş",
    autoPilot: "Oto-Pilot Modülü",
    rocketHp: "Roket Sağlığı",
    launchFailed: "FIRLATMA BAŞARISIZ!",
    stallWarning: "MOTOR DURDU! İRTİFA KAYBEDİLİYOR!",
    puzzleTitle: "ÖZEL BLOK YERLEŞİMİ",
    puzzleTime: "Kalan Süre",
    puzzleSolved: "BAŞARILI!",
    puzzleFailed: "BAŞARISIZ!",
    penaltyMsg: "Para Cezası: -200$ ve Blok Kaybedildi!",
    puzzleInstructions: "Parçaları doğru sıraya koymak için tıkla ve yer değiştir."
  },
  EN: {
    title: "Build your tower universe",
    status: "Status",
    market: "Market",
    bulldoze: "Bulldoze",
    done: "Done",
    reset: "Reset City",
    floors: "Floors",
    estPop: "Est. Pop",
    perfect: "PERFECT!",
    gameOver: "Construction Finished",
    finalHeight: "Final Height",
    newPop: "New Population",
    whatToDo: "What would you like to do?",
    rentBtn: "RENT IT OUT",
    rentDesc: "Earn passive income over time",
    sellBtn: "SELL IMMEDIATELY",
    sellDesc: "Instant cash injection",
    cancelBtn: "Scrap Project",
    marketTitle: "Construction Market",
    availableFunds: "Funds:",
    tabCrane: "Crane Upgrades",
    tabStyles: "Blueprints",
    maxLevel: "MAX LEVEL",
    upgrade: "Upgrade",
    equip: "Upgrade",
    equipped: "Equipped",
    unlock: "Unlock",
    active: "ACTIVE",
    occupiedMsg: "This plot is occupied. Enable Bulldoze mode to clear it.",
    demolishMsg: "Demolish this building? You won't get a refund.",
    resetMsg: "Hard Reset: Wipe all progress?",
    season: "Season",
    spring: "Spring",
    summer: "Summer",
    autumn: "Autumn",
    winter: "Winter",
    build: "Build",
    tabRocket: "Space Program",
    rocketArea: "Rocket Assembly Area",
    rocketBody: "Rocket Fuselage",
    rocketModule: "Command Module",
    rocketShuttleBody: "Shuttle Hull",
    rocketShuttleEngine: "Shuttle Engines",
    rocketShuttleComp: "Nav Systems",
    rocketComplete: "READY FOR LAUNCH",
    rocketLocked: "LOCKED",
    rocketSiloMsg: "Cannot build on the launch pad.",
    demolishAction: "DEMOLISH!",
    marsTitle: "Mars Colony",
    venusTitle: "Venus Base",
    jupiterTitle: "Jupiter Station",
    saturnTitle: "Saturn Rings",
    uranusTitle: "Uranus Outpost",
    neptuneTitle: "Neptune Deep",
    mercuryTitle: "Mercury Crater",
    travelToMars: "Go to Mars",
    returnToEarth: "Return to Earth",
    journeyToMars: "JOURNEY TO MARS",
    journeyToVenus: "JOURNEY TO VENUS",
    journeyToJupiter: "JOURNEY TO JUPITER",
    journeyToSaturn: "JOURNEY TO SATURN",
    journeyToUranus: "JOURNEY TO URANUS",
    journeyToNeptune: "JOURNEY TO NEPTUNE",
    journeyToMercury: "JOURNEY TO MERCURY",
    arrivalTime: "Est. Arrival:",
    landingAvailable: "Orbit Achieved",
    landOnMars: "Land on Mars",
    landOnVenus: "Land on Venus",
    landOnJupiter: "Land on Jupiter",
    landOnSaturn: "Land on Saturn",
    landOnUranus: "Land on Uranus",
    landOnNeptune: "Land on Neptune",
    landOnMercury: "Land on Mercury",
    popReqMars: "Need 500 Population to launch rocket!",
    popReqVenus: "Need 2000 Population for Venus journey!",
    popReqMercury: "Need 3500 Population for Mercury journey!",
    popReqJupiter: "Need 5000 Population for Jupiter Shuttle!",
    popReqSaturn: "Need 10,000 Population for Saturn!",
    popReqUranus: "Need 25,000 Population for Uranus!",
    popReqNeptune: "Need 50,000 Population for Neptune!",
    menuPlay: "PLAY",
    menuSave: "SAVE GAME",
    menuAbout: "ABOUT",
    menuReset: "RESET CITY",
    aboutText: "How about building towers with a crane and reaching for the sky! If you can earn some money and increase the city's population, you can start the space program and continue the construction system on new planets. Remember, starting with 500 population, as you progress to 2000, 5000 population, Venus and even Jupiter will be at your feet. Sorry, in the skies :d\n\nGame Company: firecouldnight\nDeveloper: İbrahim Çıvgın",
    gameSaved: "Game Saved Successfully!",
    settings: "Settings",
    musicVol: "Music Volume",
    sfxVol: "SFX Volume",
    help: "Help",
    helpTitle: "Space Travel Guide",
    helpText: "Follow these steps to reach new planets:\n\n1. 🏙️ Grow Population: Reach 500 for Mars, 2000 for Venus, 5000 for Jupiter.\n2. 🛒 Buy Parts: Purchase rocket parts from Market > Space Program tab.\n3. 🚀 Complete Rocket: Finish construction at the launch pad (16th slot).\n4. 🌌 Launch: Click the ready rocket to blast off!",
    adminMode: "Admin Mode",
    adminActive: "ACTIVE - Instant Flight",
    autoPilot: "Auto-Pilot Module",
    rocketHp: "Rocket Integrity",
    launchFailed: "LAUNCH FAILED!",
    stallWarning: "ENGINE STALL! DROPPING ALTITUDE!",
    puzzleTitle: "SPECIAL BLOCK ASSEMBLY",
    puzzleTime: "Time Remaining",
    puzzleSolved: "SUCCESS!",
    puzzleFailed: "FAILED!",
    penaltyMsg: "Penalty: -$200 and Block Lost!",
    puzzleInstructions: "Click pieces to swap and reassemble the block."
  }
};

export interface BuildingStyle {
  id: string;
  name: string;
  cost: number;
  rentMultiplier: number;
  sellMultiplier: number;
  popMultiplier: number;
  color: string;
  accentColor: string;
}

export interface BuildingSlot {
  id: string;
  floors: number;
  pop: number;
  status: BuildingStatus;
  styleId: string;
  timestamp: number;
}

export interface UpgradeStats {
  speed: number; 
  accuracy: number; 
}

export interface CityMeta {
  cash: number;
  population: number;
  upgrades: UpgradeStats;
  unlockedStyles: string[];
  activeStyleId: string;
  lastIncomeTime: number;
  rentCyclesCount: number; 
  currentSeason: Season;
  history: { day: number; cash: number; pop: number }[];
  rocket: { 
    stage: number; // 0-3 for basic rocket, 4-6 for shuttle
    launched?: boolean;
    launchTime?: number; 
  };
  autoPilotCharges: number; // For rocket minigame
  marsUnlocked: boolean;
  venusUnlocked: boolean;
  jupiterUnlocked: boolean;
  saturnUnlocked: boolean;
  uranusUnlocked: boolean;
  neptuneUnlocked: boolean;
  mercuryUnlocked: boolean;
}

// 10 Minutes per cycle
export const MONTH_DURATION_MS = 600 * 1000; 
// 10 Minutes Journey to Mars/Planets
export const MARS_JOURNEY_DURATION_MS = 10 * 60 * 1000;

export const UPGRADES_CONFIG = {
  speed: { name: "Motor Torku", baseCost: 500, effect: 0.005, maxLevel: 5 },
  accuracy: { name: "Lazer Sabitleyici", baseCost: 1000, effect: 5, maxLevel: 3 }
};

export const STYLES_CONFIG: BuildingStyle[] = [
  { id: 'STONE_HOUSE', name: 'Taş Konut', cost: 0, rentMultiplier: 1.0, sellMultiplier: 1.0, popMultiplier: 1.0, color: '#a8a29e', accentColor: '#57534e' },
  { id: 'BRICK_ESTATE', name: 'Tuğla Malikane', cost: 2500, rentMultiplier: 1.3, sellMultiplier: 1.2, popMultiplier: 1.1, color: '#b91c1c', accentColor: '#fca5a5' },
  { id: 'MODERN_APARTMENT', name: 'Modern Daire', cost: 5000, rentMultiplier: 1.5, sellMultiplier: 1.5, popMultiplier: 1.2, color: '#3b82f6', accentColor: '#93c5fd' },
  { id: 'ECO_TOWER', name: 'Eko Kule', cost: 12000, rentMultiplier: 1.8, sellMultiplier: 1.6, popMultiplier: 1.4, color: '#059669', accentColor: '#6ee7b7' },
  { id: 'SKYSCRAPER_GLASS', name: 'Cam Gökdelen', cost: 25000, rentMultiplier: 2.5, sellMultiplier: 2.2, popMultiplier: 1.5, color: '#0ea5e9', accentColor: '#e0f2fe' },
  { id: 'GOLDEN_PLAZA', name: 'Altın Rezidans', cost: 50000, rentMultiplier: 3.2, sellMultiplier: 4.0, popMultiplier: 1.8, color: '#eab308', accentColor: '#fef08a' },
  { id: 'CYBER_CITADEL', name: 'Siber Kale', cost: 100000, rentMultiplier: 4.0, sellMultiplier: 3.0, popMultiplier: 2.0, color: '#7c3aed', accentColor: '#d8b4fe' },
  { id: 'QUANTUM_SPIRE', name: 'Kuantum Kule', cost: 250000, rentMultiplier: 6.0, sellMultiplier: 5.0, popMultiplier: 3.0, color: '#ec4899', accentColor: '#fbcfe8' }
];

export const MARS_STYLES_CONFIG: BuildingStyle[] = [
  { id: 'MARS_POD', name: 'Yaşam Kapsülü', cost: 0, rentMultiplier: 2.0, sellMultiplier: 1.5, popMultiplier: 1.5, color: '#f8fafc', accentColor: '#38bdf8' },
  { id: 'OXYGEN_PLANT', name: 'Oksijen Tesisi', cost: 10000, rentMultiplier: 3.0, sellMultiplier: 2.0, popMultiplier: 1.2, color: '#ecfeff', accentColor: '#f472b6' },
  { id: 'RED_MINE', name: 'Kızıl Maden', cost: 25000, rentMultiplier: 5.0, sellMultiplier: 3.0, popMultiplier: 1.0, color: '#cbd5e1', accentColor: '#f59e0b' },
  { id: 'BIO_DOME', name: 'Biyo Kubbe', cost: 75000, rentMultiplier: 6.0, sellMultiplier: 4.0, popMultiplier: 3.0, color: 'glass', accentColor: '#4ade80' },
  { id: 'FUSION_REACTOR', name: 'Füzyon Reaktörü', cost: 200000, rentMultiplier: 10.0, sellMultiplier: 5.0, popMultiplier: 2.0, color: '#1e293b', accentColor: '#a855f7' }
];

export const VENUS_STYLES_CONFIG: BuildingStyle[] = [
    { id: 'ACID_SHELTER', name: 'Asit Sığınağı', cost: 0, rentMultiplier: 4.0, sellMultiplier: 2.0, popMultiplier: 1.5, color: '#3f3f46', accentColor: '#facc15' }, 
    { id: 'CLOUD_CITY', name: 'Bulut Şehri', cost: 50000, rentMultiplier: 5.0, sellMultiplier: 2.5, popMultiplier: 2.0, color: '#fde047', accentColor: '#a16207' },
    { id: 'THERMAL_PLANT', name: 'Termal Santral', cost: 150000, rentMultiplier: 8.0, sellMultiplier: 4.0, popMultiplier: 1.5, color: '#713f12', accentColor: '#ef4444' },
    { id: 'SKY_HABITAT', name: 'Gök Habitatı', cost: 500000, rentMultiplier: 12.0, sellMultiplier: 6.0, popMultiplier: 4.0, color: '#ecfeff', accentColor: '#06b6d4' }
];

export const JUPITER_STYLES_CONFIG: BuildingStyle[] = [
    { id: 'GAS_PLATFORM', name: 'Gaz Platformu', cost: 0, rentMultiplier: 8.0, sellMultiplier: 3.0, popMultiplier: 2.0, color: '#78350f', accentColor: '#fdba74' },
    { id: 'ORBITAL_STATION', name: 'Yörünge İstasyonu', cost: 250000, rentMultiplier: 10.0, sellMultiplier: 4.0, popMultiplier: 3.0, color: '#e5e5e5', accentColor: '#3b82f6' },
    { id: 'STORM_HARVESTER', name: 'Fırtına Toplayıcı', cost: 1000000, rentMultiplier: 15.0, sellMultiplier: 5.0, popMultiplier: 1.5, color: '#7f1d1d', accentColor: '#ef4444' },
    { id: 'GRAVITY_ANCHOR', name: 'Kütle Çapası', cost: 5000000, rentMultiplier: 25.0, sellMultiplier: 10.0, popMultiplier: 5.0, color: '#171717', accentColor: '#a855f7' }
];

export const MERCURY_STYLES_CONFIG: BuildingStyle[] = [
    { id: 'HEAT_SHIELD', name: 'Isı Kalkanı', cost: 0, rentMultiplier: 6.0, sellMultiplier: 2.5, popMultiplier: 1.5, color: '#57534e', accentColor: '#ef4444' },
    { id: 'SOLAR_ARRAY', name: 'Güneş Paneli', cost: 100000, rentMultiplier: 9.0, sellMultiplier: 3.5, popMultiplier: 2.0, color: '#1c1917', accentColor: '#facc15' },
    { id: 'CRATER_BASE', name: 'Krater Üssü', cost: 300000, rentMultiplier: 12.0, sellMultiplier: 5.0, popMultiplier: 2.5, color: '#78716c', accentColor: '#e7e5e4' }
];

export const SATURN_STYLES_CONFIG: BuildingStyle[] = [
    { id: 'RING_STATION', name: 'Halka İstasyonu', cost: 0, rentMultiplier: 12.0, sellMultiplier: 4.0, popMultiplier: 3.0, color: '#d4d4d8', accentColor: '#facc15' },
    { id: 'HEX_TOWER', name: 'Altıgen Kule', cost: 500000, rentMultiplier: 18.0, sellMultiplier: 6.0, popMultiplier: 4.0, color: '#fef3c7', accentColor: '#b45309' },
    { id: 'TITAN_HABITAT', name: 'Titan Habitatı', cost: 2000000, rentMultiplier: 30.0, sellMultiplier: 10.0, popMultiplier: 5.0, color: '#064e3b', accentColor: '#34d399' }
];

export const URANUS_STYLES_CONFIG: BuildingStyle[] = [
    { id: 'ICE_SPIRE', name: 'Buz Kulesi', cost: 0, rentMultiplier: 20.0, sellMultiplier: 5.0, popMultiplier: 3.5, color: '#cffafe', accentColor: '#22d3ee' },
    { id: 'DIAMOND_MINE', name: 'Elmas Madeni', cost: 1000000, rentMultiplier: 40.0, sellMultiplier: 15.0, popMultiplier: 6.0, color: '#ecfeff', accentColor: '#a5f3fc' }
];

export const NEPTUNE_STYLES_CONFIG: BuildingStyle[] = [
    { id: 'DEEP_RIG', name: 'Derin Sondaj', cost: 0, rentMultiplier: 35.0, sellMultiplier: 8.0, popMultiplier: 4.0, color: '#172554', accentColor: '#3b82f6' },
    { id: 'WIND_TURBINE_N', name: 'Fırtına Türbini', cost: 2500000, rentMultiplier: 60.0, sellMultiplier: 20.0, popMultiplier: 8.0, color: '#1e3a8a', accentColor: '#60a5fa' }
];

export const RANKS = [
    { l: 0, n: "Köy" }, 
    { l: 1000, n: "Kasaba" }, 
    { l: 10000, n: "İlçe" }, 
    { l: 100000, n: "Şehir" }, 
    { l: 750000, n: "Büyükşehir" }, 
    { l: 5000000, n: "Metropol" }
];
