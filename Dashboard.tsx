
import React, { useState, useEffect } from 'react';
import { BuildingSlot, CityMeta, STYLES_CONFIG, BuildingStatus, RANKS, MONTH_DURATION_MS, Language, Translation } from './types';
import { audioService } from './audioService';
import { Building2, Users, Coins, TrendingUp, Hammer, Clock, Trash2, Globe, Sun, CloudSnow, CloudRain, Leaf, Rocket, RotateCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  meta: CityMeta;
  cityData: (BuildingSlot | null)[];
  onBuildRequest: (index: number) => void;
  onDemolitionRequest: (index: number) => void;
  onLaunchRocket: () => void;
  onOpenMarket: () => void;
  onReset: () => void;
  lang: Language;
  setLang: (l: Language) => void;
  t: Translation;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
    meta, cityData, onBuildRequest, onDemolitionRequest, onLaunchRocket, 
    onOpenMarket, onReset, lang, setLang, t
}) => {
  
  const [showStats, setShowStats] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const handleSlotClick = (index: number) => {
    if (isLaunching) return;

    const slot = cityData[index];
    const isRocketSlot = (meta.rocket?.stage || 0) > 0 && index === 15;

    if (isDeleteMode) {
      if (slot) {
        onDemolitionRequest(index);
      }
      return;
    }

    if (isRocketSlot) {
      if (meta.rocket.stage === 3 && !meta.rocket.launched) {
        audioService.playLaunchRumble();
        setIsLaunching(true);
        setTimeout(() => {
          onLaunchRocket();
          setIsLaunching(false);
        }, 4000); // Match animation duration
      } else if (!meta.rocket.launched) {
        // Silo is not fully built or already launched
      }
      return;
    }

    if (slot) {
      alert(t.occupiedMsg);
    } else {
      onBuildRequest(index);
    }
  };

  const rank = RANKS.slice().reverse().find(r => meta.population >= r.l) || RANKS[0];

  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
      const timer = setInterval(() => {
          const elapsed = Date.now() - meta.lastIncomeTime;
          const remaining = Math.max(0, MONTH_DURATION_MS - elapsed);
          const m = Math.floor(remaining / 60000);
          const s = Math.floor((remaining % 60000) / 1000);
          setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
      }, 1000);
      return () => clearInterval(timer);
  }, [meta.lastIncomeTime]);

  const getSeasonIcon = () => {
      switch(meta.currentSeason) {
          case 'SPRING': return <CloudRain className="w-4 h-4 text-pink-400" />;
          case 'SUMMER': return <Sun className="w-4 h-4 text-yellow-400" />;
          case 'AUTUMN': return <Leaf className="w-4 h-4 text-orange-400" />;
          case 'WINTER': return <CloudSnow className="w-4 h-4 text-blue-200" />;
          default: return <Sun className="w-4 h-4" />;
      }
  };

  const getSeasonName = () => {
      switch(meta.currentSeason) {
          case 'SPRING': return t.spring;
          case 'SUMMER': return t.summer;
          case 'AUTUMN': return t.autumn;
          case 'WINTER': return t.winter;
          default: return '';
      }
  }

  return (
    <div className="relative z-10 w-full h-full flex flex-col items-center p-4 max-w-2xl mx-auto">
        {/* Header Stats */}
        <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl p-4 mb-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        {meta.population > 5000000 ? 'MEGA ŞEHİR' : t.title}
                    </h1>
                    <div className="text-slate-400 text-xs font-semibold tracking-wide uppercase">{rank.n} {t.status}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="text-3xl font-bold text-green-400 font-mono flex items-center justify-end gap-1">
                        <Coins className="w-6 h-6" />
                        {meta.cash.toLocaleString()}
                    </div>
                    <button 
                        onClick={() => setLang(lang === 'TR' ? 'EN' : 'TR')}
                        className="flex items-center gap-1 text-xs bg-slate-800 px-2 py-1 rounded border border-slate-600 hover:bg-slate-700 text-slate-300"
                    >
                        <Globe className="w-3 h-3" />
                        {lang === 'TR' ? 'Türkçe' : 'English'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-2 flex flex-col items-center justify-center border border-slate-700">
                    <div className="flex items-center gap-1 text-blue-400 mb-1"><Users className="w-4 h-4"/> Nüfus</div>
                    <div className="font-bold">{meta.population.toLocaleString()}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 flex flex-col items-center justify-center border border-slate-700 cursor-pointer hover:bg-slate-800 transition" onClick={() => setShowStats(true)}>
                    <div className="flex items-center gap-1 text-purple-400 mb-1"><TrendingUp className="w-4 h-4"/> Grafik</div>
                    <div className="text-xs text-slate-400">İzle</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 flex flex-col items-center justify-center border border-slate-700 relative overflow-hidden">
                     <div className="flex items-center gap-1 text-orange-400 mb-1"><Clock className="w-4 h-4"/> Gelir</div>
                     <div className="font-mono text-sm">{timeLeft}</div>
                     <div className="absolute bottom-1 right-1 flex items-center gap-1 text-[10px] text-slate-400 bg-slate-900/80 px-1 rounded">
                        {getSeasonIcon()}
                        {getSeasonName()}
                     </div>
                </div>
            </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-4 gap-3 w-full aspect-square mb-6">
            {cityData.map((slot, i) => {
                const isRocketSlot = (meta.rocket?.stage || 0) > 0 && i === 15;

                if (isRocketSlot) {
                    const stage = meta.rocket.stage;
                    const launched = meta.rocket.launched || false;
                    
                    if (launched) {
                         return (
                            <div key={i} className="relative rounded-xl flex flex-col items-center justify-center border-2 bg-slate-900 border-green-500/50 shadow-lg overflow-hidden">
                                <Rocket className="w-8 h-8 text-green-400" />
                                <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-sm p-1 text-center">
                                    <div className="text-[10px] font-bold text-green-400">Görev Başarılı</div>
                                </div>
                            </div>
                         );
                    }

                    return (
                        <div 
                            key={i}
                            onClick={() => handleSlotClick(i)}
                            className={`relative rounded-xl flex items-center justify-center border-2 transition-all duration-300 shadow-lg overflow-hidden bg-slate-900 
                                ${stage === 3 ? 'border-yellow-500/50 cursor-pointer animate-pulse' : 'border-slate-700'}
                            `}
                        >
                            <div className="absolute w-full h-full flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-600"></div>
                            </div>
                            
                            <div className={`absolute w-8 h-[80%] ${isLaunching ? 'rocket-launching' : ''}`}>
                                {stage >= 2 && <div className={`absolute bottom-0 h-[70%] w-full rounded-t-md transition-all ${stage === 2 ? 'bg-slate-500' : 'bg-slate-200'}`}></div>}
                                {stage >= 3 && <div className="absolute top-[15%] h-6 w-full bg-red-500" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>}
                            </div>

                            <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-sm p-1 text-center pointer-events-none">
                                <div className="text-[10px] font-bold text-yellow-400">{stage === 3 ? "FIRLAT" : "Roket Silosu"}</div>
                                <div className="text-[9px] text-slate-300">Aşama {stage}/3</div>
                            </div>
                        </div>
                    );
                }

                const style = slot ? STYLES_CONFIG.find(s => s.id === slot.styleId) : null;
                const isBuildable = !slot && !isDeleteMode;
                
                return (
                    <div 
                        key={i}
                        onClick={() => handleSlotClick(i)}
                        className={`
                            relative rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-300 cursor-pointer shadow-lg overflow-hidden group
                            ${slot 
                                ? 'bg-slate-800 border-slate-600 hover:border-slate-400' 
                                : isDeleteMode 
                                    ? 'bg-slate-800/20 border-slate-800 border-dashed opacity-30 cursor-not-allowed'
                                    : 'bg-slate-800/40 border-dashed border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                            }
                            ${isDeleteMode && slot ? 'ring-2 ring-red-500 border-red-500' : ''}
                        `}
                    >
                        {slot ? (
                            <>
                                <div className="absolute inset-x-4 top-4 bottom-8 rounded-sm opacity-80 shadow-inner" style={{ background: style?.color }}>
                                    <div className="w-full h-full grid grid-cols-2 gap-1 p-1 opacity-50">
                                        {Array.from({length: 4}).map((_, idx) => <div key={idx} className="bg-slate-900/30 rounded-sm"></div>)}
                                    </div>
                                </div>
                                <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-sm p-1 text-center">
                                    <div className="text-[10px] font-bold text-white">{slot.floors} {t.floors}</div>
                                    <div className="text-[9px] text-slate-300">{slot.status === BuildingStatus.RENTED ? 'Kirada' : 'Sahibi'}</div>
                                </div>
                            </>
                        ) : (
                            <div className={`flex flex-col items-center transition-all duration-300 ${isBuildable ? 'text-emerald-500/60 group-hover:text-emerald-400 scale-90 group-hover:scale-100' : 'text-slate-700 opacity-50'}`}>
                                <div className={`p-3 rounded-full transition-colors ${isBuildable ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20 shadow-inner shadow-emerald-500/5' : ''}`}>
                                     <Hammer className="w-6 h-6" />
                                </div>
                                {isBuildable && (
                                    <div className="text-[10px] font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider text-emerald-400">
                                        {t.build}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {isDeleteMode && slot && (
                            <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center backdrop-blur-[1px]">
                                <Trash2 className="w-8 h-8 text-white animate-bounce" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-center w-full">
             <button 
                onClick={onOpenMarket}
                className="flex-1 min-w-[120px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-900/20 transition transform active:scale-95 flex items-center justify-center gap-2"
            >
                <Building2 className="w-5 h-5"/> {t.market}
            </button>
            <button 
                onClick={() => setIsDeleteMode(!isDeleteMode)}
                className={`flex-1 min-w-[120px] font-bold py-3 px-4 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2
                    ${isDeleteMode 
                        ? 'bg-red-600 text-white shadow-red-900/20 animate-pulse' 
                        : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    }`}
            >
                <Trash2 className="w-5 h-5"/> {isDeleteMode ? t.done : t.bulldoze}
            </button>
             <button 
                onClick={onReset}
                className="flex-1 min-w-[120px] bg-red-800 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-900/20 transition transform active:scale-95 flex items-center justify-center gap-2"
            >
                <RotateCcw className="w-5 h-5"/> {t.reset}
            </button>
        </div>

        <div className="mt-4 text-xs text-slate-500">
            <span>v7.3.0</span>
        </div>

        {/* Stats Modal */}
        {showStats && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowStats(false)}>
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Şehir Büyüme Grafiği</h2>
                        <button onClick={() => setShowStats(false)} className="text-slate-400 hover:text-white">✕</button>
                    </div>
                    
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={meta.history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="day" hide />
                                <YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `$${val/1000}k`}/>
                                <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12}/>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Line yAxisId="left" type="monotone" dataKey="cash" stroke="#3b82f6" strokeWidth={2} dot={false} name="Nakit" />
                                <Line yAxisId="right" type="monotone" dataKey="pop" stroke="#10b981" strokeWidth={2} dot={false} name="Nüfus" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
