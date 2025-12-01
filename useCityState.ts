import { useState, useEffect, useCallback } from 'react';
import { CityMeta, BuildingSlot, BuildingStatus, STYLES_CONFIG, MARS_STYLES_CONFIG, MONTH_DURATION_MS, Season, Planet } from './types';

const INITIAL_META: CityMeta = {
  cash: 5000,
  population: 15, 
  upgrades: { speed: 0, accuracy: 0 },
  unlockedStyles: ['STONE_HOUSE', 'MARS_POD'],
  activeStyleId: 'STONE_HOUSE',
  lastIncomeTime: Date.now(),
  rentCyclesCount: 0,
  currentSeason: 'SPRING',
  history: [],
  rocket: { stage: 0, launched: false },
  autoPilotCharges: 0,
  marsUnlocked: false,
  venusUnlocked: false,
  jupiterUnlocked: false,
  saturnUnlocked: false,
  uranusUnlocked: false,
  neptuneUnlocked: false,
  mercuryUnlocked: false
};

const SEASONS: Season[] = ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'];

export const useCityState = () => {
  // EARTH DATA
  const [cityData, setCityData] = useState<(BuildingSlot | null)[]>(() => {
    const saved = localStorage.getItem('grandCityDataV7');
    if (saved) return JSON.parse(saved);
    const initialData = Array(16).fill(null);
    initialData[0] = {
      id: 'starter-home',
      floors: 3,
      pop: 15,
      status: BuildingStatus.RENTED,
      styleId: 'STONE_HOUSE',
      timestamp: Date.now()
    };
    return initialData;
  });

  // MARS DATA
  const [marsData, setMarsData] = useState<(BuildingSlot | null)[]>(() => {
    const saved = localStorage.getItem('grandMarsDataV7');
    if (saved) return JSON.parse(saved);
    return Array(16).fill(null); // Empty map for Mars
  });

  const [meta, setMeta] = useState<CityMeta>(() => {
    const saved = localStorage.getItem('grandCityMetaV7');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.rocket) parsed.rocket = { stage: 0, launched: false };
        if (parsed.autoPilotCharges === undefined) parsed.autoPilotCharges = 0;
        if (parsed.marsUnlocked === undefined) parsed.marsUnlocked = false;
        if (parsed.venusUnlocked === undefined) parsed.venusUnlocked = false;
        if (parsed.jupiterUnlocked === undefined) parsed.jupiterUnlocked = false;
        if (parsed.saturnUnlocked === undefined) parsed.saturnUnlocked = false;
        if (parsed.uranusUnlocked === undefined) parsed.uranusUnlocked = false;
        if (parsed.neptuneUnlocked === undefined) parsed.neptuneUnlocked = false;
        if (parsed.mercuryUnlocked === undefined) parsed.mercuryUnlocked = false;
        // Check unlocked styles to include Mars default
        if (!parsed.unlockedStyles.includes('MARS_POD')) parsed.unlockedStyles.push('MARS_POD');
        return parsed;
    }
    return INITIAL_META;
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('grandCityDataV7', JSON.stringify(cityData));
    localStorage.setItem('grandMarsDataV7', JSON.stringify(marsData));
    localStorage.setItem('grandCityMetaV7', JSON.stringify(meta));
  }, [cityData, marsData, meta]);

  // Recalculate population whenever grids change
  useEffect(() => {
    const earthPop = cityData.reduce((acc, slot) => acc + (slot ? slot.pop : 0), 0);