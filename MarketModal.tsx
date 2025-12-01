
import React, { useState } from 'react';
import { CityMeta, STYLES_CONFIG, UPGRADES_CONFIG, Translation } from './types';
import { Check, Lock, ShoppingCart, ArrowUpCircle, Rocket } from 'lucide-react';

interface MarketModalProps {
  meta: CityMeta;
  onClose: () => void;
  onBuyUpgrade: (type: 'speed' | 'accuracy', cost: number) => boolean;
  onUnlockStyle: (id: string, cost: number) => boolean;
  onEquipStyle: (id: string) => void;
  onBuyRocketPart: () => boolean;
  t: Translation;
}

export const MarketModal: React.FC<MarketModalProps> = ({ 
    meta, onClose, onBuyUpgrade, onUnlockStyle, onEquipStyle, onBuyRocketPart, t
}) => {
  const [activeTab, setActiveTab] = useState<'CRANE' | 'STYLES' | 'ROCKET'>('CRANE');

  const calculateUpgradeCost = (baseCost: number, level: number) => {
      return Math.floor(baseCost * Math.pow(1.8, level));
  };
  
  const ROCKET_PARTS = [
    { name: t.rocketArea, cost: 5000 },
    { name: t.rocketBody, cost: 7000 },
    { name: t.rocketModule, cost: 10000 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShoppingCart className="text-indigo-400"/> {t.marketTitle}
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-xl">×</button>
            </div>

            {/* Cash Display */}
            <div className="bg-slate-800/50 p-3 text-center border-b border-slate-800">
                <span className="text-slate-400 text-sm">{t.availableFunds} </span>
                <span className="text-green-400 font-mono font-bold text-lg">${meta.cash.toLocaleString()}</span>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800">
                <button 
                    className={`flex-1 py-3 text-sm font-bold transition ${activeTab === 'CRANE' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-slate-800/30' : 'text-slate-500 hover:text-slate-300'}`}
                    onClick={() => setActiveTab('CRANE')}
                >
                    {t.tabCrane}
                </button>
                <button 
                    className={`flex-1 py-3 text-sm font-bold transition ${activeTab === 'STYLES' ? 'text-purple-400 border-b-2 border-purple-400 bg-slate-800/30' : 'text-slate-500 hover:text-slate-300'}`}
                    onClick={() => setActiveTab('STYLES')}
                >
                    {t.tabStyles}
                </button>
                <button 
                    className={`flex-1 py-3 text-sm font-bold transition ${activeTab === 'ROCKET' ? 'text-yellow-400 border-b-2 border-yellow-400 bg-slate-800/30' : 'text-slate-500 hover:text-slate-300'}`}
                    onClick={() => setActiveTab('ROCKET')}
                >
                    {t.tabRocket}
                </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto flex-1">
                {activeTab === 'CRANE' && (
                    <div className="space-y-4">
                        {Object.entries(UPGRADES_CONFIG).map(([key, config]) => {
                            const level = meta.upgrades[key as keyof typeof meta.upgrades];
                            const cost = calculateUpgradeCost(config.baseCost, level);
                            const isMax = level >= config.maxLevel;
                            const canAfford = meta.cash >= cost;

                            return (
                                <div key={key} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                                    <div className="flex justify-between mb-2">
                                        <h3 className="font-bold text-white">{config.name}</h3>
                                        <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Lvl {level}/{config.maxLevel}</span>
                                    </div>
                                    <div className="w-full bg-slate-700 h-2 rounded-full mb-4 overflow-hidden">
                                        <div 
                                            className="bg-indigo-500 h-full transition-all duration-500" 
                                            style={{ width: `${(level / config.maxLevel) * 100}%` }}
                                        ></div>
                                    </div>
                                    <button
                                        disabled={isMax || !canAfford}
                                        onClick={() => onBuyUpgrade(key as 'speed' | 'accuracy', cost)}
                                        className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition
                                            ${isMax 
                                                ? 'bg-slate-700 text-slate-500 cursor-default' 
                                                : canAfford 
                                                    ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20' 
                                                    : 'bg-slate-700 text-slate-400 opacity-50 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        {isMax ? t.maxLevel : (
                                            <>
                                                <ArrowUpCircle className="w-4 h-4"/> {t.upgrade} (${cost.toLocaleString()})
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'STYLES' && (
                    <div className="space-y-4">
                        {STYLES_CONFIG.map(style => {
                            const isOwned = meta.unlockedStyles.includes(style.id);
                            const isActive = meta.activeStyleId === style.id;
                            const canAfford = meta.cash >= style.cost;

                            return (
                                <div key={style.id} className={`relative bg-slate-800 rounded-xl p-4 border ${isActive ? 'border-purple-500 ring-1 ring-purple-500' : 'border-slate-700'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-white flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ background: style.color }}></div>
                                                {style.name}
                                            </h3>
                                            <div className="text-xs text-slate-400 mt-1 space-x-2">
                                                <span className="text-green-400">Kira x{style.rentMultiplier}</span>
                                                <span className="text-blue-400">Nüfus x{style.popMultiplier}</span>
                                            </div>
                                        </div>
                                        {isActive && <span className="text-xs font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded">{t.active}</span>}
                                    </div>

                                    {isOwned ? (
                                        <button
                                            onClick={() => onEquipStyle(style.id)}
                                            disabled={isActive}
                                            className={`w-full py-2 rounded-lg font-bold text-sm mt-2 transition
                                                ${isActive 
                                                    ? 'bg-slate-700 text-slate-500 cursor-default' 
                                                    : 'bg-slate-600 hover:bg-slate-500 text-white'
                                                }
                                            `}
                                        >
                                            {isActive ? t.equipped : t.equip}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onUnlockStyle(style.id, style.cost)}
                                            disabled={!canAfford}
                                            className={`w-full py-2 rounded-lg font-bold text-sm mt-2 flex items-center justify-center gap-2 transition
                                                ${canAfford 
                                                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                                                    : 'bg-slate-700 text-slate-500 opacity-50'
                                                }
                                            `}
                                        >
                                            {canAfford ? <Check className="w-4 h-4"/> : <Lock className="w-4 h-4"/>}
                                            {t.unlock} (${style.cost.toLocaleString()})
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                
                {activeTab === 'ROCKET' && (
                    <div className="space-y-4">
                        {(meta.rocket?.stage || 0) >= 3 ? (
                            <div className="bg-slate-800 rounded-xl p-4 border border-yellow-500 text-center">
                                <h3 className="font-bold text-yellow-400 text-lg flex items-center justify-center gap-2"><Rocket /> {t.rocketComplete}</h3>
                                <p className="text-sm text-slate-400 mt-2">Tüm parçalar monte edildi. Fırlatma rampası aktif!</p>
                            </div>
                        ) : (
                            ROCKET_PARTS.map((part, index) => {
                                const stage = meta.rocket?.stage || 0;
                                const isCompleted = index < stage;
                                const isCurrent = index === stage;
                                const canAfford = meta.cash >= part.cost;

                                return (
                                    <div key={index} className={`bg-slate-800 rounded-xl p-4 border transition-all ${isCurrent ? 'border-yellow-500' : 'border-slate-700'}`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className={`font-bold ${isCurrent ? 'text-white' : 'text-slate-400'}`}>{part.name}</h3>
                                            {isCompleted && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Tamamlandı</span>}
                                        </div>
                                        
                                        {!isCompleted && (
                                            <button
                                                disabled={!isCurrent || !canAfford}
                                                onClick={onBuyRocketPart}
                                                className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition
                                                    ${!isCurrent 
                                                        ? 'bg-slate-700 text-slate-500 cursor-default' 
                                                        : canAfford 
                                                            ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20' 
                                                            : 'bg-slate-700 text-slate-400 opacity-50 cursor-not-allowed'
                                                    }
                                                `}
                                            >
                                                {!isCurrent ? <Lock className="w-4 h-4"/> : <ShoppingCart className="w-4 h-4"/>}
                                                {!isCurrent ? t.rocketLocked : `${t.unlock} ($${part.cost.toLocaleString()})`}
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
