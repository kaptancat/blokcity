
import React, { useRef, useEffect, useState } from 'react';
import { STYLES_CONFIG, UPGRADES_CONFIG, CityMeta, Translation } from './types';
import { audioService } from './audioService';
import { Wind, CloudRain, CloudSnow, Sun, Rocket, Zap, Star, Globe } from 'lucide-react';

interface GameCanvasProps {
  meta: CityMeta;
  onClose: (result?: { floors: number; pop: number; type: 'RENT' | 'SELL' }) => void;
  t: Translation;
}

type Zone = 'GROUND' | 'SKY' | 'HIGH_SKY' | 'STRATOSPHERE' | 'MESOSPHERE' | 'SPACE';
type WeatherType = 'CLEAR' | 'RAIN' | 'SNOW' | 'HAIL';

export const GameCanvas: React.FC<GameCanvasProps> = ({ meta, onClose, t }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const balloonImageRef = useRef<HTMLImageElement | null>(null);
  const [score, setScore] = useState(0);
  const [sessionPop, setSessionPop] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [weather, setWeather] = useState<WeatherType>('CLEAR');

  // Refs for mutable state to avoid closure staleness in loop
  const gameState = useRef({
    width: 0,
    height: 0,
    stack: [] as any[],
    current: null as any,
    cameraY: 0,
    frame: 0,
    bgParticles: [] as any[], 
    weatherParticles: [] as any[], 
    pedestrians: [] as any[],
    active: true,
    zone: 'GROUND' as Zone,
    gravity: 0.8,
    windOffset: 0
  });

  const weatherRef = useRef<WeatherType>('CLEAR');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load Balloon Image
    const img = new Image();
    img.src = "https://ideogram.ai/assets/image/lossless/response/4W6_4tF2T4qC4u5Q5j3XqA";
    balloonImageRef.current = img;

    audioService.init();
    // We call resume in handleInput to comply with browser policies, 
    // but try here just in case user interacted before
    audioService.resume(); 

    // Initial Random Weather (70% Clear, 30% Bad Weather)
    changeWeather(Math.random() > 0.7 ? getRandomBadWeather() : 'CLEAR');

    gameState.current.width = canvas.width = window.innerWidth;
    gameState.current.height = canvas.height = window.innerHeight;

    gameState.current.stack = [{
        x: gameState.current.width / 2 - 30,
        y: gameState.current.height - 50,
        w: 60,
        h: 60,
        color: '#334155',
        accentColor: '#475569',
        styleId: 'BASE'
    }];

    // Initial Pedestrians (Reduced count)
    for(let i=0; i<4; i++) spawnPedestrian();

    spawnBlock();

    let animId: number;
    const loop = () => {
      if (gameState.current.active) {
        updateState();
        updatePhysics();
      }
      draw(ctx);
      animId = requestAnimationFrame(loop);
    };
    loop();

    const handleResize = () => {
        gameState.current.width = canvas.width = window.innerWidth;
        gameState.current.height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      audioService.toggleAmbience('CLEAR'); // Reset audio
    };
  }, []);

  const getRandomBadWeather = (): WeatherType => {
      const r = Math.random();
      if (r < 0.5) return 'RAIN';
      if (r < 0.8) return 'SNOW';
      return 'HAIL';
  };

  const changeWeather = (newWeather: WeatherType) => {
      setWeather(newWeather);
      weatherRef.current = newWeather;
      
      let audioType: 'CLEAR' | 'RAIN' | 'SNOW' = 'CLEAR';
      if (newWeather === 'RAIN' || newWeather === 'HAIL') audioType = 'RAIN';
      if (newWeather === 'SNOW') audioType = 'SNOW';
      
      audioService.toggleAmbience(audioType);
  };

  const getStyle = () => STYLES_CONFIG.find(s => s.id === meta.activeStyleId) || STYLES_CONFIG[0];

  const determineZone = (height: number): Zone => {
      if (height < 10) return 'GROUND';        
      if (height < 20) return 'SKY';           
      if (height < 30) return 'HIGH_SKY';      
      if (height < 40) return 'STRATOSPHERE';  
      if (height < 50) return 'MESOSPHERE';    
      return 'SPACE';                          
  };

  const spawnBlock = () => {
    const gs = gameState.current;
    const style = getStyle();
    const speedBase = 0.03 + (meta.upgrades.speed * UPGRADES_CONFIG.speed.effect);
    const accuracyPenalty = 10 - (meta.upgrades.accuracy * UPGRADES_CONFIG.accuracy.effect);
    
    // Space Gravity (Level 60+ is deep space, low gravity)
    gs.gravity = gs.stack.length >= 50 ? 0.2 : 0.8; 

    // Weather Dynamic Change Logic (Every 15 floors)
    if (gs.stack.length > 0 && gs.stack.length % 15 === 0) {
        if (Math.random() > 0.5) {
             const nextWeather = Math.random() > 0.6 ? getRandomBadWeather() : 'CLEAR';
             changeWeather(nextWeather);
        }
    }

    // FIX: Calculate initial Y based on pivot to prevent block from spawning off-screen (below camera)
    // when stack gets high.
    const topBlock = gs.stack[gs.stack.length - 1];
    const pivotY = topBlock.y - 250;
    const ropeLen = 200;
    const initialY = pivotY + ropeLen; 

    gs.current = {
        x: gs.width / 2,
        y: initialY, // Fixed: Use calculated world Y instead of static screen Y
        w: 60,
        h: 60,
        angle: 0,
        speed: speedBase + (gs.stack.length * 0.001),
        ropeLen: ropeLen,
        drop: false,
        vy: 0,
        maxDiff: Math.max(2, accuracyPenalty),
        color: style.color,
        accentColor: style.accentColor,
        styleId: style.id,
        popMult: style.popMultiplier
    };
  };

  const spawnPedestrian = () => {
    const gs = gameState.current;
    gs.pedestrians.push({
        x: Math.random() * gs.width,
        y: gs.height - 50,
        vx: (Math.random() - 0.5) * 1.5,
        color: `hsl(${Math.random()*360}, 60%, 60%)`,
        size: 4 + Math.random() * 2
    });
  };

  const spawnAmbientParticle = (zone: Zone) => {
      const gs = gameState.current;
      const r = Math.random();
      
      // Camera View Bounds for relative spawning
      const viewTop = -gs.cameraY;
      const viewBottom = -gs.cameraY + gs.height;

      // REDUCED SPAWN RATES (Medium level activity)
      // Zone specific spawning
      if (zone === 'GROUND') {
          if (gs.pedestrians.length < 6 && r < 0.03) spawnPedestrian();
          // Clouds
          if (r < 0.02) gs.bgParticles.push({ type: 'CLOUD', x: -150, y: viewTop + Math.random() * (gs.height * 0.5), vx: 0.2 + Math.random()*0.3, size: 30 + Math.random()*30 });
      }
      else if (zone === 'SKY' || zone === 'HIGH_SKY') {
          // Birds (White)
          if (r < 0.02 && zone === 'SKY') gs.bgParticles.push({ type: 'BIRD', x: -20, y: viewTop + Math.random() * gs.height, vx: 2 + Math.random(), vy: (Math.random()-0.5)*0.5, size: 3 });
          // Clouds
          if (r < 0.02) gs.bgParticles.push({ type: 'CLOUD', x: -150, y: viewTop + Math.random() * gs.height, vx: 0.5 + Math.random()*0.5, size: 40 + Math.random()*40 });
      } 
      
      // BALLOON LOGIC: Starts at floor 10, rises to floor 20, then falls
      if (gs.stack.length >= 10 && gs.stack.length < 50) {
          if (r < 0.005) { // Rare spawn
              gs.bgParticles.push({ 
                  type: 'BALLOON', 
                  x: Math.random() * gs.width, 
                  y: viewBottom + 50, // Start from bottom of screen
                  vx: (Math.random()-0.5) * 0.5, 
                  vy: -1.0 - Math.random(), 
                  size: 20 + Math.random() * 10,
                  state: 'RISING',
                  // Target Y is roughly where Floor 20 is. 
                  // Floor 20 Y = (Height - 50) - (20 * 60)
                  targetY: gs.height - 50 - (20 * 60)
              });
          }
      }

      if (zone === 'STRATOSPHERE') {
          // AIRLINER Logic (Level 30-40)
          if (r < 0.005) {
              gs.bgParticles.push({ 
                  type: 'AIRLINER', 
                  x: gs.width + 150, 
                  y: viewTop + (Math.random() * gs.height * 0.8) + 50, 
                  vx: -2.0, // Faster
                  vy: 0, 
                  size: 1 
              });
          }
      } 
      else if (zone === 'MESOSPHERE') {
          // Meteors
          if (r < 0.02) gs.bgParticles.push({ type: 'METEOR', x: Math.random() * gs.width, y: viewTop - 50, vx: (Math.random()-0.5) * 3, vy: 8 + Math.random()*4, size: 3, life: 60 });
      } 
      else if (zone === 'SPACE') {
          // Stars
          if (r < 0.1) gs.bgParticles.push({ type: 'STAR', x: Math.random() * gs.width, y: viewTop - 10, vx: 0, vy: 0.2, size: Math.random() * 2, alpha: Math.random() });
          // Shooting stars
          if (r < 0.01) gs.bgParticles.push({ type: 'SHOOTING_STAR', x: Math.random() * gs.width, y: viewTop + Math.random() * (gs.height/2), vx: 12 + Math.random() * 5, vy: 3, life: 20 });
          // Satellite
          if (r < 0.005) gs.bgParticles.push({ type: 'SATELLITE', x: -50, y: viewTop + Math.random() * (gs.height/3), vx: 1, vy: 0, size: 1 });
      }
  };

  const spawnWeatherParticles = () => {
      const gs = gameState.current;
      const currW = weatherRef.current;
      if (currW === 'CLEAR') return;

      // Reduced weather intensity for better performance/visibility
      const count = currW === 'HAIL' ? 1 : 4; 
      
      for(let i=0; i<count; i++) {
          const x = Math.random() * gs.width;
          const y = -20;
          
          if (currW === 'RAIN') {
              gs.weatherParticles.push({ x, y, vx: (Math.random()-0.5)*2 + 2, vy: 15 + Math.random()*5, type: 'RAIN', len: 10 + Math.random()*10 });
          } else if (currW === 'SNOW') {
              gs.weatherParticles.push({ x, y, vx: (Math.random()-0.5)*2, vy: 2 + Math.random(), type: 'SNOW', size: 2 + Math.random()*2 });
          } else if (currW === 'HAIL') {
              gs.weatherParticles.push({ x, y, vx: (Math.random()-0.5)*5, vy: 20 + Math.random()*5, type: 'HAIL', size: 3 + Math.random() });
          }
      }
  };

  const updateState = () => {
      const gs = gameState.current;
      gs.zone = determineZone(gs.stack.length);
      spawnAmbientParticle(gs.zone);
      spawnWeatherParticles();
  };

  const updatePhysics = () => {
    const gs = gameState.current;
    if (!gs.current) return;

    gs.frame++;
    gs.cameraY += ((gs.stack.length > 3 ? (gs.stack.length - 3) * 60 : 0) - gs.cameraY) * 0.1;

    if (!gs.current.drop) {
        const pivotX = gs.width / 2;
        const pivotY = gs.stack[gs.stack.length - 1].y - 250;
        
        // Wind Logic
        const isAtmos = gs.stack.length < 50;
        const currW = weatherRef.current;
        
        let windForce = 0;
        if (isAtmos) {
            let amplitude = 20; 
            let speed = 0.02;
            
            if (currW === 'RAIN') { amplitude = 30; speed = 0.03; }
            if (currW === 'SNOW') { amplitude = 25; speed = 0.01; } 
            if (currW === 'HAIL') { amplitude = 45; speed = 0.08; } 
            
            windForce = Math.sin(gs.frame * speed) * amplitude;
            
            if (currW === 'SNOW') windForce += (Math.random() - 0.5) * 5;
            if (currW === 'HAIL') windForce += (Math.random() - 0.5) * 15;
        }

        gs.current.angle += gs.current.speed;
        gs.current.x = pivotX + Math.sin(gs.current.angle) * gs.current.ropeLen - 30 + windForce;
        gs.current.y = pivotY + Math.cos(gs.current.angle) * 20 + gs.current.ropeLen;
    } else {
        gs.current.vy += gs.gravity;
        gs.current.y += gs.current.vy;

        const topBlock = gs.stack[gs.stack.length - 1];
        
        if (gs.current.y + gs.current.h >= topBlock.y) {
            const diff = gs.current.x - topBlock.x;
            
            if (Math.abs(diff) < 60) {
                gs.current.y = topBlock.y - gs.current.h;
                
                const isPerfect = Math.abs(diff) < gs.current.maxDiff;
                
                if (isPerfect) {
                    gs.current.x = topBlock.x; 
                    setCombo(prev => prev + 1);
                    audioService.playSuccess();
                    const bonusPop = Math.floor(2 * gs.current.popMult * (combo + 1));
                    setSessionPop(prev => prev + bonusPop);
                } else {
                    setCombo(0);
                    audioService.playClap();
                    const basePop = Math.floor(1 * gs.current.popMult);
                    setSessionPop(prev => prev + basePop);
                }

                gs.stack.push(gs.current);
                setScore(gs.stack.length - 1);
                spawnBlock();
            } else {
                audioService.playError();
                setGameOver(true);
                gs.active = false; 
            }
        } 
        else if (gs.current.y > gs.height + gs.cameraY + 100) {
             audioService.playError();
             setGameOver(true);
             gs.active = false;
        }
    }

    gs.pedestrians.forEach(p => {
        p.x += p.vx;
        if (p.x > gs.width) p.x = -10;
        if (p.x < -10) p.x = gs.width;
    });

    for (let i = gs.bgParticles.length - 1; i >= 0; i--) {
        const p = gs.bgParticles[i];
        
        // Custom Physics for specific types
        if (p.type === 'BALLOON') {
            if (p.state === 'RISING') {
                p.y += p.vy;
                p.x += p.vx;
                // Check if reached target height (Floor 20)
                if (p.y <= p.targetY) {
                    p.state = 'FALLING';
                    p.vy = 1.0; // Start falling slowly
                }
            } else if (p.state === 'FALLING') {
                p.y += p.vy; // Fall down
                p.x += Math.sin(gs.frame * 0.05) * 1.5; // Swoop/Sway
            }
        } else {
            // Standard physics
            p.x += p.vx;
            p.y += p.vy;
        }
        
        if (p.life) p.life--;
        
        const viewTop = -gs.cameraY - 400;
        const viewBottom = -gs.cameraY + gs.height + 400;

        if (p.x > gs.width + 400 || p.x < -400 || p.y > viewBottom || p.y < viewTop || (p.life !== undefined && p.life <= 0)) {
            gs.bgParticles.splice(i, 1);
        }
    }

    for (let i = gs.weatherParticles.length - 1; i >= 0; i--) {
        const p = gs.weatherParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > gs.height + gs.cameraY) { 
             gs.weatherParticles.splice(i, 1);
        }
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
      const gs = gameState.current;
      const currW = weatherRef.current;
      
      // LEVEL 60+ EARTH VIEW
      if (gs.stack.length >= 60) {
          // Deep Space Black
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, gs.width, gs.height);

          // Render The Earth Horizon at bottom
          ctx.save();
          const earthRadius = gs.width * 1.5;
          const earthCenterX = gs.width / 2;
          // Position horizon based on screen height to create curve
          const earthCenterY = gs.height + earthRadius - (gs.height * 0.35); 

          // 1. Atmosphere Glow (Outer)
          ctx.shadowBlur = 60;
          ctx.shadowColor = '#3b82f6';
          ctx.beginPath();
          ctx.arc(earthCenterX, earthCenterY, earthRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#000'; 
          ctx.fill();
          ctx.shadowBlur = 0;

          // 2. Earth Gradient Surface
          const grad = ctx.createRadialGradient(earthCenterX, earthCenterY, earthRadius * 0.8, earthCenterX, earthCenterY, earthRadius);
          grad.addColorStop(0, '#1e3a8a'); // Deep Ocean
          grad.addColorStop(0.6, '#2563eb'); // Lighter Blue
          grad.addColorStop(0.95, '#60a5fa'); // Atmosphere edge
          grad.addColorStop(1, '#93c5fd'); // White-ish horizon

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(earthCenterX, earthCenterY, earthRadius, 0, Math.PI * 2);
          ctx.fill();

          // 3. Horizon Line Shine
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(earthCenterX, earthCenterY, earthRadius - 2, 0, Math.PI*2);
          ctx.stroke();

          ctx.restore();

          // 4. Procedural Clouds on Earth Surface
          // We draw them clipped or just positioned at bottom
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, gs.height * 0.6, gs.width, gs.height * 0.4);
          ctx.clip();
          for (let i = 0; i < 10; i++) {
              ctx.fillStyle = 'rgba(255,255,255,0.15)';
              const cx = (gs.frame * 0.5 + i * 200) % (gs.width + 400) - 200;
              const cy = gs.height - 50 - Math.sin(i)*100;
              ctx.beginPath();
              ctx.arc(cx, cy, 80 + i*10, 0, Math.PI*2);
              ctx.fill();
          }
          ctx.restore();

      } else {
        // STANDARD SKY GRADIENTS (Levels 0-59)
        const grad = ctx.createLinearGradient(0, 0, 0, gs.height);
        if (currW === 'CLEAR') {
            switch(gs.zone) {
                case 'GROUND': grad.addColorStop(0, '#87CEEB'); grad.addColorStop(1, '#E0F7FA'); break;
                case 'SKY': grad.addColorStop(0, '#60a5fa'); grad.addColorStop(1, '#87CEEB'); break;
                case 'HIGH_SKY': grad.addColorStop(0, '#3b82f6'); grad.addColorStop(1, '#60a5fa'); break;
                case 'STRATOSPHERE': grad.addColorStop(0, '#1e3a8a'); grad.addColorStop(1, '#3b82f6'); break;
                case 'MESOSPHERE': grad.addColorStop(0, '#0f172a'); grad.addColorStop(1, '#1e3a8a'); break;
                case 'SPACE': grad.addColorStop(0, '#000000'); grad.addColorStop(1, '#0f172a'); break;
                default: grad.addColorStop(0, '#87CEEB'); grad.addColorStop(1, '#fff');
            }
        } else {
            grad.addColorStop(0, '#334155'); 
            grad.addColorStop(1, '#64748b');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, gs.width, gs.height);
      }

      ctx.save();
      ctx.translate(0, gs.cameraY);

      // Draw Particles
      gs.bgParticles.forEach(p => {
          if (p.type === 'CLOUD') {
              ctx.fillStyle = currW === 'CLEAR' ? 'rgba(255,255,255,0.6)' : 'rgba(100,116,139, 0.7)';
              ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
              ctx.beginPath(); ctx.arc(p.x+25, p.y+5, p.size*0.9, 0, Math.PI*2); ctx.fill();
              ctx.beginPath(); ctx.arc(p.x-20, p.y+10, p.size*0.7, 0, Math.PI*2); ctx.fill();
          } else if (p.type === 'BIRD') {
              ctx.strokeStyle = '#f1f5f9'; 
              ctx.lineWidth = 2;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - 6, p.y - 4); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + 6, p.y - 4); ctx.stroke();
          } else if (p.type === 'BALLOON') {
              // Draw Image Balloon
              // FIX: Check for naturalWidth to ensure image is not broken
              if (balloonImageRef.current && balloonImageRef.current.complete && balloonImageRef.current.naturalWidth > 0) {
                  // Adjust size proportionally
                  const width = p.size * 2.5;
                  const height = p.size * 3.5;
                  ctx.drawImage(balloonImageRef.current, p.x - width/2, p.y - height/2, width, height);
              } else {
                  // Fallback if image fails
                  ctx.fillStyle = '#ff6b6b';
                  ctx.beginPath(); ctx.ellipse(p.x, p.y, p.size*0.8, p.size, 0, 0, Math.PI*2); ctx.fill();
              }
          } else if (p.type === 'AIRLINER') {
              const scale = 1;
              ctx.fillStyle = '#ffffff';
              ctx.beginPath(); ctx.ellipse(p.x, p.y, 40 * scale, 10 * scale, 0, 0, Math.PI*2); ctx.fill();
              ctx.fillStyle = '#1d4ed8'; 
              ctx.beginPath(); ctx.moveTo(p.x + 20 * scale, p.y - 5 * scale); ctx.lineTo(p.x + 40 * scale, p.y - 25 * scale); ctx.lineTo(p.x + 45 * scale, p.y - 5 * scale); ctx.fill();
              ctx.fillStyle = '#cbd5e1'; 
              ctx.beginPath(); ctx.moveTo(p.x + 5 * scale, p.y - 5 * scale); ctx.lineTo(p.x - 10 * scale, p.y - 20 * scale); ctx.lineTo(p.x - 5 * scale, p.y - 5 * scale); ctx.fill();
              ctx.fillStyle = '#e2e8f0'; 
              ctx.beginPath(); ctx.moveTo(p.x - 5 * scale, p.y + 2 * scale); ctx.lineTo(p.x - 25 * scale, p.y + 20 * scale); ctx.lineTo(p.x + 5 * scale, p.y + 5 * scale); ctx.fill();
              ctx.fillStyle = '#1d4ed8'; 
              ctx.beginPath(); ctx.ellipse(p.x - 10 * scale, p.y + 12 * scale, 6 * scale, 3 * scale, 0.1, 0, Math.PI*2); ctx.fill();
              ctx.fillStyle = '#0f172a';
              ctx.beginPath(); ctx.arc(p.x - 35 * scale, p.y - 2 * scale, 2 * scale, 0, Math.PI*2); ctx.fill();
          } else if (p.type === 'STAR') {
              ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
              ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
          } else if (p.type === 'SHOOTING_STAR') {
              const grad = ctx.createLinearGradient(p.x, p.y, p.x - p.vx*3, p.y - p.vy*3);
              grad.addColorStop(0, 'rgba(255,255,255,1)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
              ctx.strokeStyle = grad; ctx.lineWidth = 2;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx*3, p.y - p.vy*3); ctx.stroke();
          } else if (p.type === 'METEOR') {
              const grad = ctx.createLinearGradient(p.x, p.y, p.x - p.vx*5, p.y - p.vy*5);
              grad.addColorStop(0, '#f97316'); grad.addColorStop(1, 'rgba(255,80,80,0)');
              ctx.strokeStyle = grad; ctx.lineWidth = 4;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx*5, p.y - p.vy*5); ctx.stroke();
          } else if (p.type === 'SATELLITE') {
               ctx.fillStyle = '#94a3b8';
               ctx.fillRect(p.x, p.y, 20, 8);
               ctx.fillStyle = '#3b82f6'; // Solar panels
               ctx.fillRect(p.x - 15, p.y+1, 15, 6);
               ctx.fillRect(p.x + 20, p.y+1, 15, 6);
          }
      });

      gs.stack.forEach((b, i) => {
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.strokeStyle = 'rgba(0,0,0,0.2)';
          ctx.lineWidth = 2;
          ctx.strokeRect(b.x, b.y, b.w, b.h);
          
          if (i > 0 && b.styleId !== 'BASE') { 
            // Use the block's specific accent color for windows, or fallback to yellow
            ctx.fillStyle = (Math.floor(gs.frame / 30) + i) % 2 === 0 ? (b.accentColor || '#fbbf24') : '#475569';
            ctx.fillRect(b.x + 10, b.y + 10, 10, 15); ctx.fillRect(b.x + 40, b.y + 10, 10, 15);
            ctx.fillRect(b.x + 10, b.y + 35, 10, 15); ctx.fillRect(b.x + 40, b.y + 35, 10, 15);
          }
      });
      
      // Draw Start Arrows if only base block exists and nothing is dropping
      if (gs.stack.length === 1 && !gs.current?.drop) {
          const centerX = gs.width / 2;
          // Target Y is top of base block (stack[0])
          const targetY = gs.stack[0].y; 
          const bounce = Math.sin(gs.frame * 0.15) * 8;
          
          ctx.fillStyle = '#fbbf24'; // Warning Yellow
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          
          // Left Arrow (Points Right)
          const lx = centerX - 80 + bounce;
          const ly = targetY;
          ctx.beginPath();
          ctx.moveTo(lx, ly - 15);
          ctx.lineTo(lx + 25, ly);
          ctx.lineTo(lx, ly + 15);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Right Arrow (Points Left)
          const rx = centerX + 80 - bounce;
          const ry = targetY;
          ctx.beginPath();
          ctx.moveTo(rx, ry - 15);
          ctx.lineTo(rx - 25, ry);
          ctx.lineTo(rx, ry + 15);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
      }

      // Ground Pedestrians
      if (gs.zone === 'GROUND') {
          ctx.fillStyle = '#16a34a';
          ctx.fillRect(0, gs.height - 50, gs.width, 50);
          gs.pedestrians.forEach(p => {
              ctx.fillStyle = p.color;
              ctx.beginPath(); ctx.arc(p.x, p.y - 10, p.size, 0, Math.PI*2); ctx.fill(); 
              ctx.fillRect(p.x - p.size/2, p.y - 10, p.size, 15); 
              const walk = Math.sin(gs.frame * 0.5) * 3;
              ctx.beginPath(); ctx.moveTo(p.x, p.y + 5); ctx.lineTo(p.x - walk, p.y + 15); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(p.x, p.y + 5); ctx.lineTo(p.x + walk, p.y + 15); ctx.stroke();
          });
      }

      if (gs.current) {
          if (!gs.current.drop) {
              const pivotX = gs.width / 2;
              const pivotY = gs.stack[gs.stack.length - 1].y - 250;
              ctx.beginPath(); ctx.moveTo(pivotX, pivotY); ctx.lineTo(gs.current.x + 30, gs.current.y);
              ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2; ctx.stroke();
          }
          ctx.fillStyle = gs.current.color;
          ctx.fillRect(gs.current.x, gs.current.y, gs.current.w, gs.current.h);
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(gs.current.x, gs.current.y, gs.current.w, gs.current.h);
          
          // Draw windows on current block too for better preview
          if (gs.current.styleId !== 'BASE') {
             ctx.fillStyle = gs.current.accentColor || '#fbbf24';
             ctx.fillRect(gs.current.x + 10, gs.current.y + 10, 10, 15); ctx.fillRect(gs.current.x + 40, gs.current.y + 10, 10, 15);
             ctx.fillRect(gs.current.x + 10, gs.current.y + 35, 10, 15); ctx.fillRect(gs.current.x + 40, gs.current.y + 35, 10, 15);
          }
      }

      // Weather Overlay
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      gs.weatherParticles.forEach(p => {
          if (p.type === 'RAIN') {
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.vx, p.y + p.len); ctx.stroke();
          } else if (p.type === 'SNOW') {
              ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
          } else if (p.type === 'HAIL') {
              ctx.fillRect(p.x, p.y, p.size, p.size);
          }
      });

      ctx.restore();
  };

  const handleInput = () => {
      audioService.resume(); // Ensure audio context is active on interaction
      if (gameState.current.current && !gameState.current.current.drop && !gameOver) {
          gameState.current.current.drop = true;
      }
  };

  const currentZone = gameState.current.zone;
  const isSpace = score >= 60;

  return (
    <div 
        className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center"
        onMouseDown={handleInput}
        onTouchStart={handleInput}
    >
        <canvas ref={canvasRef} className="absolute inset-0 block" />
        
        {/* Game HUD */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none select-none z-10">
            <div className="bg-black/50 backdrop-blur p-3 rounded-xl text-white border border-white/10">
                <div className="text-sm text-slate-400 uppercase tracking-wider">{t.floors}</div>
                <div className="text-3xl font-bold text-yellow-400">{score}</div>
            </div>
            <div className="bg-black/50 backdrop-blur p-3 rounded-xl text-white border border-white/10">
                <div className="text-sm text-slate-400 uppercase tracking-wider">{t.estPop}</div>
                <div className="text-2xl font-bold text-green-400">+{sessionPop}</div>
            </div>
        </div>

        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur p-2 rounded-full border border-white/10 z-10 flex gap-2">
             {weather === 'CLEAR' && <Sun className="text-yellow-500 w-8 h-8" />}
             {weather === 'RAIN' && <CloudRain className="text-blue-400 w-8 h-8" />}
             {weather === 'SNOW' && <CloudSnow className="text-white w-8 h-8" />}
             {weather === 'HAIL' && <Zap className="text-purple-400 w-8 h-8" />}
             
             <div className="border-l border-white/20 pl-2 ml-2 flex items-center justify-center">
                {isSpace ? <Globe className="text-blue-400 w-8 h-8" /> : (
                    <>
                        {(currentZone === 'STRATOSPHERE' || currentZone === 'HIGH_SKY') && <Wind className="text-blue-300 w-8 h-8" />}
                        {currentZone === 'SPACE' && <Rocket className="text-white w-8 h-8" />}
                        {currentZone === 'MESOSPHERE' && <Star className="text-orange-400 w-8 h-8" />}
                    </>
                )}
             </div>
        </div>

        {combo > 1 && (
            <div className="absolute top-1/4 animate-bounce text-4xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] z-10">
                {combo}x {t.perfect}
            </div>
        )}

        {/* Game Over Modal */}
        {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-600 max-w-md w-full text-center shadow-2xl transform scale-100 transition-all">
                    <h2 className="text-3xl font-bold text-white mb-2">{t.gameOver}</h2>
                    <div className="flex justify-center gap-8 my-6">
                        <div>
                            <div className="text-slate-400 text-sm">{t.finalHeight}</div>
                            <div className="text-3xl font-bold text-white">{score} {t.floors}</div>
                        </div>
                        <div>
                            <div className="text-slate-400 text-sm">{t.newPop}</div>
                            <div className="text-3xl font-bold text-green-400">+{sessionPop}</div>
                        </div>
                    </div>

                    <p className="text-slate-300 mb-6">{t.whatToDo}</p>
                    
                    <div className="grid gap-3">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onClose({ floors: score, pop: sessionPop, type: 'RENT' }); }}
                            className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-white transition flex flex-col items-center shadow-lg shadow-green-900/20"
                        >
                            <span>{t.rentBtn}</span>
                            <span className="text-xs font-normal opacity-80">{t.rentDesc}</span>
                        </button>
                        
                        <button 
                            onClick={(e) => { e.stopPropagation(); onClose({ floors: score, pop: sessionPop, type: 'SELL' }); }}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-white transition flex flex-col items-center shadow-lg shadow-blue-900/20"
                        >
                            <span>{t.sellBtn}</span>
                            <span className="text-xs font-normal opacity-80">{t.sellDesc}</span>
                        </button>

                        <button 
                             onClick={(e) => { e.stopPropagation(); onClose(); }}
                             className="mt-2 text-slate-500 hover:text-slate-300 text-sm"
                        >
                            {t.cancelBtn}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
