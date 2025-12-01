
import React, { useRef, useEffect } from 'react';
import { BuildingSlot, STYLES_CONFIG, Translation } from './types';
import { audioService } from './audioService';

interface DemolitionViewProps {
  building: BuildingSlot;
  onComplete: () => void;
  t: Translation;
}

export const DemolitionView: React.FC<DemolitionViewProps> = ({ building, onComplete, t }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const state = useRef({
    width: 0,
    height: 0,
    building: {
      x: 0,
      y: 0,
      w: 200,
      h: 0,
      hits: 3,
      style: STYLES_CONFIG.find(s => s.id === building.styleId) || STYLES_CONFIG[0],
      shake: 0
    },
    bulldozer: {
      x: -150,
      y: 0,
      w: 120,
      h: 80,
      state: 'IDLE' // IDLE, CHARGING, RETURNING
    },
    particles: [] as any[],
    frame: 0,
    state: 'READY' // READY, IMPACT, COLLAPSING, DONE
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    audioService.init();
    audioService.resume();

    const gs = state.current;
    gs.width = canvas.width = window.innerWidth;
    gs.height = canvas.height = window.innerHeight;
    
    gs.building.h = Math.min(gs.height * 0.7, building.floors * 25);
    gs.building.x = gs.width / 2 - gs.building.w / 2;
    gs.building.y = gs.height - 80 - gs.building.h;
    gs.bulldozer.y = gs.height - 95;

    let animId: number;
    const loop = () => {
      update();
      draw(ctx);
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animId);
  }, []);
  
  const createDebris = (count: number) => {
    const gs = state.current;
    for (let i = 0; i < count; i++) {
        gs.particles.push({
            type: 'DEBRIS',
            x: gs.building.x + Math.random() * gs.building.w,
            y: gs.building.y + gs.building.h - 20,
            vx: (Math.random() - 0.5) * 10,
            vy: -Math.random() * 15,
            size: Math.random() * 8 + 4,
            life: 60,
            color: Math.random() > 0.5 ? gs.building.style.color : '#57534e'
        });
    }
  };

  const createDustCloud = () => {
    const gs = state.current;
     for (let i = 0; i < 50; i++) {
        gs.particles.push({
            type: 'DUST',
            x: gs.building.x + gs.building.w / 2,
            y: gs.height - 80,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            size: Math.random() * 30 + 10,
            life: 80,
            alpha: 0.5
        });
    }
  };

  const update = () => {
    const gs = state.current;
    gs.frame++;
    
    if (gs.bulldozer.state === 'CHARGING') {
        gs.bulldozer.x += (gs.building.x - gs.bulldozer.w - gs.bulldozer.x) * 0.2;
        if (gs.bulldozer.x > gs.building.x - gs.bulldozer.w - 5) {
            gs.bulldozer.state = 'RETURNING';
            gs.building.hits--;
            gs.building.shake = 30;
            audioService.playBulldozerImpact();
            createDebris(30);

            if (gs.building.hits <= 0) {
                gs.state = 'COLLAPSING';
                audioService.playBuildingCollapse();
                createDustCloud();
            }
        }
        if (Math.random() < 0.5) {
            gs.particles.push({
                type: 'EXHAUST',
                x: gs.bulldozer.x + gs.bulldozer.w - 15,
                y: gs.bulldozer.y - 15,
                vx: 0.5,
                vy: -Math.random() * 2,
                size: Math.random() * 5 + 3,
                life: 40,
                alpha: 0.4
            });
        }
    } else if (gs.bulldozer.state === 'RETURNING') {
        gs.bulldozer.x += (-150 - gs.bulldozer.x) * 0.1;
        if (gs.bulldozer.x < -145) {
            gs.bulldozer.state = 'IDLE';
        }
    }

    if(gs.building.shake > 0) gs.building.shake--;
    
    if (gs.state === 'COLLAPSING') {
        gs.building.h -= 5;
        gs.building.y += 5;
        if (gs.building.h <= 0) {
            gs.state = 'DONE';
            setTimeout(onComplete, 1000);
        }
    }

    // Particles
    for (let i = gs.particles.length - 1; i >= 0; i--) {
        const p = gs.particles[i];
        p.vy += 0.5; // Gravity
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.type === 'DUST' || p.type === 'EXHAUST') p.alpha -= 0.01;
        if (p.life <= 0 || p.alpha <= 0) gs.particles.splice(i, 1);
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    const gs = state.current;

    // Background
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(0, 0, gs.width, gs.height);
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(0, gs.height - 80, gs.width, 80);

    const shakeX = (Math.random() - 0.5) * gs.building.shake;
    const shakeY = (Math.random() - 0.5) * gs.building.shake;
    ctx.save();
    ctx.translate(shakeX, shakeY);

    // Building
    if (gs.state !== 'DONE') {
        // Main structure
        ctx.fillStyle = gs.building.style.color;
        ctx.fillRect(gs.building.x, gs.building.y, gs.building.w, gs.building.h);

        // Draw floors and windows
        const floorCount = building.floors;
        const floorHeight = gs.building.h / floorCount;
        for (let i = 0; i < floorCount; i++) {
            const floorY = gs.building.y + i * floorHeight;
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 1;
            ctx.strokeRect(gs.building.x, floorY, gs.building.w, floorHeight);
            
            // Windows
            ctx.fillStyle = gs.building.style.accentColor || '#475569';
            ctx.fillRect(gs.building.x + 30, floorY + floorHeight * 0.2, 50, floorHeight * 0.6);
            ctx.fillRect(gs.building.x + gs.building.w - 80, floorY + floorHeight * 0.2, 50, floorHeight * 0.6);
        }

        // Main outline
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(gs.building.x, gs.building.y, gs.building.w, gs.building.h);

        // Cracks
        ctx.strokeStyle = 'rgba(0,0,0,0.6)';
        ctx.lineWidth = 2;
        for(let i = 0; i < (3 - gs.building.hits); i++) {
            ctx.beginPath();
            const crackX = gs.building.x + 20 + i*50;
            const crackY = gs.building.y + gs.building.h;
            ctx.moveTo(crackX, crackY);
            ctx.lineTo(crackX + (Math.random() - 0.5) * 40, crackY - 100);
            ctx.lineTo(crackX + (Math.random() - 0.5) * 60, crackY - 150);
            ctx.stroke();
        }
    }

    ctx.restore();

    // Particles
    gs.particles.forEach(p => {
        if (p.type === 'DEBRIS') {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        } else if (p.type === 'DUST' || p.type === 'EXHAUST') {
            const color = p.type === 'DUST' ? '161, 161, 170' : '80, 80, 80';
            ctx.fillStyle = `rgba(${color}, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // More realistic Bulldozer
    const b = gs.bulldozer;
    // Tracks
    ctx.fillStyle = '#374151'; 
    ctx.fillRect(b.x, b.y + b.h - 15, b.w, 25);
    ctx.fillStyle = '#4b5563'; 
    ctx.beginPath(); ctx.arc(b.x + 10, b.y + b.h, 10, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(b.x + b.w - 10, b.y + b.h, 10, 0, Math.PI*2); ctx.fill();

    // Body
    ctx.fillStyle = '#facc15'; // Yellow
    ctx.fillRect(b.x, b.y, b.w, b.h);
    
    // Blade
    ctx.fillStyle = '#a1a1aa'; 
    ctx.fillRect(b.x + b.w - 5, b.y + b.h/2 - 10, 25, 50);
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(b.x + b.w - 20, b.y + b.h/2, 15, 10);
    
    // Cab
    ctx.fillStyle = '#1f2937'; 
    ctx.fillRect(b.x + 10, b.y - 30, 60, 30);
    ctx.fillStyle = '#60a5fa'; // Window
    ctx.fillRect(b.x + 15, b.y - 25, 40, 20);

    // Exhaust
    ctx.fillStyle = '#4b5563';
    ctx.fillRect(b.x + b.w - 20, b.y - 15, 10, 15);
  };
  
  const handleAction = () => {
    if (state.current.bulldozer.state === 'IDLE' && state.current.state === 'READY') {
      state.current.bulldozer.state = 'CHARGING';
    }
  };

  return (
    <div 
        className="fixed inset-0 z-50 bg-slate-900 cursor-pointer"
        onClick={handleAction}
    >
        <canvas ref={canvasRef} className="absolute inset-0 block" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white bg-black/50 p-4 rounded-xl text-center pointer-events-none">
            <h2 className="text-2xl font-bold">{t.demolishAction}</h2>
            <p className="text-sm opacity-80">Binayı yıkmak için ekrana dokun</p>
        </div>
    </div>
  );
};
