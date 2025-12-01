

import React, { useState, useEffect } from 'react';
import { useCityState } from './hooks/useCityState';
import { Dashboard } from './components/Dashboard';
import { GameCanvas } from './components/GameCanvas';
import CityBackground from './components/CityBackground';
import MarsBackground from './components/MarsBackground';
import { MarsJourney } from './components/MarsJourney';
import { MarketModal } from './components/MarketModal';
import { DemolitionView } from './components/DemolitionView';
import { MainMenu } from './components/MainMenu';
import { BuildingSlot, BuildingStatus, Language, TRANSLATIONS, Planet, STYLES_CONFIG, MARS_STYLES_CONFIG, VENUS_STYLES_CONFIG, JUPITER_STYLES_CONFIG, SATURN_STYLES_CONFIG, URANUS_STYLES_CONFIG, NEPTUNE_STYLES_CONFIG, MERCURY_STYLES_CONFIG } from './types';
import { audioService } from './services/audioService';

const App: React.FC = () => {
  const { 
    meta, 
    adminMode, setAdminMode,
    cityData, marsData, venusData, jupiterData, saturnData, uranusData, neptuneData, mercuryData,
    addBuilding, removeBuilding, updateCash, buyUpgrade, unlockStyle, setActiveStyle, resetCity,
    buyRocketPart, launchRocket, unlockPlanet
  } = useCityState();

  const [view, setView] = useState<'MENU' | 'DASHBOARD' | 'GAME' | 'DEMOLITION' | 'JOURNEY'>('MENU');
  const [gameMode, setGameMode] = useState<'BUILD' | 'LAUNCH' | 'LANDING'>('BUILD');
  const [currentPlanet, setCurrentPlanet] = useState<Planet>('EARTH');
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(-1);
  const [buildingToDemolish, setBuildingToDemolish] = useState<BuildingSlot | null>(null);
  const [showMarket, setShowMarket] = useState(false);
  const [lang, setLang] = useState<Language>('TR');
  const [isMuted, setIsMuted] = useState(false);
  
  // State to hold the target planet during the landing sequence
  const [landingTarget, setLandingTarget] = useState<Planet>('MARS');

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    audioService.init();
    if (view === 'MENU') {
        audioService.playAmbientMusic('MENU');
    } else {
        audioService.playAmbientMusic(currentPlanet);
    }
  }, [view, currentPlanet]);

  // Helper to force style reset on planet switch
  const handlePlanetSwitch = (p: Planet) => {
      setCurrentPlanet(p);
      
      // Auto-select valid style for new planet
      let defaultStyle = 'STONE_HOUSE';
      if (p === 'MARS') defaultStyle = MARS_STYLES_CONFIG[0].id;
      if (p === 'VENUS') defaultStyle = VENUS_STYLES_CONFIG[0].id;
      if (p === 'JUPITER') defaultStyle = JUPITER_STYLES_CONFIG[0].id;
      if (p === 'SATURN') defaultStyle = SATURN_STYLES_CONFIG[0].id;
      if (p === 'URANUS') defaultStyle = URANUS_STYLES_CONFIG[0].id;
      if (p === 'NEPTUNE') defaultStyle = NEPTUNE_STYLES_CONFIG[0].id;
      if (p === 'MERCURY') defaultStyle = MERCURY_STYLES_CONFIG[0].id;
      
      setActiveStyle(defaultStyle);
  };

  const handleToggleMute = () => {
      const newState = !isMuted;
      setIsMuted(newState);
      audioService.setMute(newState);
  };

  const handleLaunchRocket = () => {
      // Switch to Game View in LAUNCH mode
      setGameMode('LAUNCH');
      setView('GAME');
  };

  const handleOpenJourney = () => {
      setView('JOURNEY');
  };

  const handleStartLanding = () => {
      let target: Planet = 'MARS';
      
      // Logic to determine target based on unlocks (Same logic as Dashboard)
      if (adminMode) {
          // In admin mode, cycle or pick specific? For now, standard logic or direct override
          if (!meta.marsUnlocked) target = 'MARS';
          else if (!meta.venusUnlocked) target = 'VENUS';
          else if (!meta.mercuryUnlocked) target = 'MERCURY';
          else if (!meta.jupiterUnlocked) target = 'JUPITER';
          else if (!meta.saturnUnlocked) target = 'SATURN';
          else if (!meta.uranusUnlocked) target = 'URANUS';
          else if (!meta.neptuneUnlocked) target = 'NEPTUNE';
          else target = 'NEPTUNE'; 
      } else {
          if (meta.rocket.stage >= 6) {
             if (!meta.jupiterUnlocked) target = 'JUPITER';
             else if (!meta.saturnUnlocked) target = 'SATURN';
             else if (!meta.uranusUnlocked) target = 'URANUS';
             else target = 'NEPTUNE';
          } else {
             if (!meta.marsUnlocked) target = 'MARS';
             else if (!meta.venusUnlocked) target = 'VENUS';
             else target = 'MERCURY';
          }
      }

      setLandingTarget(target);
      setGameMode('LANDING');
      setView('GAME');
  };

  const handleBuildRequest = (index: number) => {
    setActiveSlotIndex(index);
    setGameMode('BUILD');
    setView('GAME');
  };
  
  const handleDemolitionRequest = (index: number) => {
    let currentData = cityData;
    if (currentPlanet === 'MARS') currentData = marsData;
    if (currentPlanet === 'VENUS') currentData = venusData;
    if (currentPlanet === 'MERCURY') currentData = mercuryData;
    if (currentPlanet === 'JUPITER') currentData = jupiterData;
    if (currentPlanet === 'SATURN') currentData = saturnData;
    if (currentPlanet === 'URANUS') currentData = uranusData;
    if (currentPlanet === 'NEPTUNE') currentData = neptuneData;

    const slot = currentData[index];
    if (slot) {
      setActiveSlotIndex(index);
      setBuildingToDemolish(slot);
      setView('DEMOLITION');
    }
  };
  
  const handleDemolitionComplete = () => {
    if (activeSlotIndex !== -1) {
      removeBuilding(activeSlotIndex, currentPlanet);
    }
    setView('DASHBOARD');
    setActiveSlotIndex(-1);
    setBuildingToDemolish(null);
  };

  const handleGameClose = (result?: { floors: number; pop: number; type: 'RENT' | 'SELL' } | 'LAUNCH_COMPLETE' | 'LANDING_COMPLETE') => {
    if (result === 'LAUNCH_COMPLETE') {
        launchRocket(); 
        setView('JOURNEY');
        return;
    }

    if (result === 'LANDING_COMPLETE') {
        unlockPlanet(landingTarget);
        handlePlanetSwitch(landingTarget);
        setView('DASHBOARD');
        return;
    }

    if (result && activeSlotIndex !== -1 && typeof result !== 'string') {
      if (result.type === 'SELL') {
        const cashEarned = (result.floors * 150) + (result.pop * 50);
        updateCash(Math.floor(cashEarned));
      } else {
        const newBuilding: BuildingSlot = {
          id: Math.random().toString(36).substr(2, 9),
          floors: result.floors,
          pop: result.pop,
          status: BuildingStatus.RENTED,
          styleId: meta.activeStyleId,
          timestamp: Date.now()
        };
        addBuilding(activeSlotIndex, newBuilding, currentPlanet);
      }
    }
    setView('DASHBOARD');
    setActiveSlotIndex(-1);
  };

  let currentCityData = cityData;
  if (currentPlanet === 'MARS') currentCityData = marsData;
  if (currentPlanet === 'VENUS') currentCityData = venusData;
  if (currentPlanet === 'MERCURY') currentCityData = mercuryData;
  if (currentPlanet === 'JUPITER') currentCityData = jupiterData;
  if (currentPlanet === 'SATURN') currentCityData = saturnData;
  if (currentPlanet === 'URANUS') currentCityData = uranusData;
  if (currentPlanet === 'NEPTUNE') currentCityData = neptuneData;

  // Determine Journey Target for Journey Screen
  let journeyTarget: Planet = 'MARS';
  if (meta.rocket.stage >= 6) {
      if (!meta.jupiterUnlocked) journeyTarget = 'JUPITER';
      else if (!meta.saturnUnlocked) journeyTarget = 'SATURN';
      else if (!meta.uranusUnlocked) journeyTarget = 'URANUS';
      else journeyTarget = 'NEPTUNE';
  } else {
      if (meta.marsUnlocked && !meta.venusUnlocked) journeyTarget = 'VENUS';
      else if (meta.venusUnlocked && !meta.mercuryUnlocked) journeyTarget = 'MERCURY';
      else if (meta.marsUnlocked && meta.venusUnlocked && meta.mercuryUnlocked) journeyTarget = 'JUPITER'; 
  }

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden text-slate-100 select-none font-sans">
      
      {currentPlanet === 'EARTH' ? (
          <CityBackground season={meta.currentSeason || 'SPRING'} />
      ) : (
          <MarsBackground planet={currentPlanet} />
      )}

      {view === 'MENU' && (
          <MainMenu 
            onPlay={() => {
                audioService.init(); 
                audioService.resume();
                setView('DASHBOARD');
            }}
            onReset={() => resetCity()}
            onSave={() => alert(t.gameSaved)}
            t={t}
          />
      )}

      {view === 'DASHBOARD' && (
        <>
          <Dashboard 
            meta={meta}
            cityData={currentCityData}
            currentPlanet={currentPlanet}
            onSwitchPlanet={handlePlanetSwitch}
            onBuildRequest={handleBuildRequest}
            onDemolitionRequest={handleDemolitionRequest}
            onLaunchRocket={handleLaunchRocket}
            onCheckJourney={handleOpenJourney}
            onOpenMarket={() => setShowMarket(true)}
            onReset={() => { if(window.confirm(t.resetMsg)) resetCity(); }}
            lang={lang}
            setLang={setLang}
            t={t}
            isMuted={isMuted}
            toggleMute={handleToggleMute}
            adminMode={adminMode}
            toggleAdmin={() => setAdminMode(!adminMode)}
          />
          
          {showMarket && (
            <MarketModal 
                meta={meta}
                currentPlanet={currentPlanet}
                onClose={() => setShowMarket(false)}
                onBuyUpgrade={buyUpgrade}
                onUnlockStyle={unlockStyle}
                onEquipStyle={setActiveStyle}
                onBuyRocketPart={buyRocketPart}
                t={t}
                adminMode={adminMode}
            />
          )}
        </>
      )}

      {view === 'JOURNEY' && (
          <MarsJourney 
            launchTime={meta.rocket.launchTime || 0} 
            sourcePlanet={currentPlanet} // Pass current planet as source
            targetPlanet={journeyTarget}
            onLand={handleStartLanding}
            t={t}
            isAdmin={adminMode}
          />
      )}

      {view === 'GAME' && (
        <GameCanvas 
            meta={meta}
            // If Landing, use the target planet physics/visuals. If Launching/Building, use current.
            planet={gameMode === 'LANDING' ? landingTarget : currentPlanet}
            mode={gameMode}
            onClose={handleGameClose}
            onPenalty={(amount) => updateCash(-amount)}
            t={t}
        />
      )}
      
      {view === 'DEMOLITION' && buildingToDemolish && (
        <DemolitionView 
            building={buildingToDemolish}
            onComplete={handleDemolitionComplete}
            t={t}
        />
      )}
    </div>
  );
};

export default App;