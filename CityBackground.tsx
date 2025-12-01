
import React, { useRef, useEffect } from 'react';
import { Season } from './types';

interface CityBackgroundProps {
    season: Season;
}

const CityBackground: React.FC<CityBackgroundProps> = ({ season }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    let leaves: any[] = [];
    let clouds: any[] = [];
    let birds: any[] = [];
    let cars: any[] = [];
    let passengers: any[] = [];
    let backgroundBuildings: any[] = [];
    
    let width = 0;
    let height = 0;
    let frame = 0;

    const generateBuildings = () => {
        backgroundBuildings = [];
        let x = 0;
        while (x < width) {
            const bWidth = 40 + (x % 70);
            const bHeight = 100 + (x % 150);
            backgroundBuildings.push({ x, y: height - bHeight, w: bWidth, h: bHeight });
            x += bWidth;
        }
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      generateBuildings();
    };
    
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 12; i++) {
        particles.push({
            x: Math.random() * width, y: Math.random() * height,
            speed: (Math.random() - 0.5) * 2, size: Math.random() * 3,
            color: Math.random() > 0.5 ? '#fbbf24' : '#f87171', type: 'light'
        });
    }

    for (let i = 0; i < 3; i++) {
        clouds.push({
            x: Math.random() * width, y: Math.random() * (height * 0.4),
            speed: 0.2 + Math.random() * 0.3, size: 30 + Math.random() * 20
        });
    }

    for (let i = 0; i < 2; i++) {
        birds.push({
            x: Math.random() * width, y: Math.random() * (height * 0.5),
            speed: 1 + Math.random() * 1.5, size: 2 + Math.random() * 2,
            offset: Math.random() * 100
        });
    }
    
    const spawnCar = () => {
        if (backgroundBuildings.length === 0 || cars.length > 6) return; // Increased max cars
        const targetBuilding = backgroundBuildings[Math.floor(Math.random() * backgroundBuildings.length)];
        const startLeft = Math.random() > 0.5;
        cars.push({
            x: startLeft ? -60 : width + 60,
            y: height - 25,
            speed: startLeft ? (1.5 + Math.random()) : -(1.5 + Math.random()),
            color: ['#ef4444', '#3b82f6', '#eab308', '#ffffff'][Math.floor(Math.random() * 4)],
            state: 'DRIVING_IN',
            targetX: targetBuilding.x + targetBuilding.w / 2,
            parkTimer: 180 // 3 seconds at 60fps
        });
    };

    // Spawn one car immediately
    spawnCar();

    const drawTree = (x: number, y: number, scale: number) => {
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(x - 3 * scale, y - 20 * scale, 6 * scale, 20 * scale);
        if (season === 'SPRING') {
            ctx.fillStyle = '#4ade80';
            ctx.beginPath(); ctx.arc(x, y - 25 * scale, 15 * scale, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#f472b6';
            if (Math.floor(frame / 20) % 2 === 0) {
                ctx.beginPath(); ctx.arc(x - 5*scale, y - 30*scale, 2*scale, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(x + 8*scale, y - 25*scale, 2*scale, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(x + 2*scale, y - 18*scale, 2*scale, 0, Math.PI*2); ctx.fill();
            }
        } else if (season === 'SUMMER') {
            ctx.fillStyle = '#15803d';
            ctx.beginPath(); ctx.arc(x, y - 25 * scale, 18 * scale, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(x - 8*scale, y - 28*scale, 3*scale, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(x + 5*scale, y - 32*scale, 3*scale, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(x + 6*scale, y - 18*scale, 3*scale, 0, Math.PI*2); ctx.fill();
        } else if (season === 'AUTUMN') {
            ctx.fillStyle = '#d97706';
            ctx.beginPath(); ctx.arc(x, y - 25 * scale, 15 * scale, 0, Math.PI*2); ctx.fill();
            if (Math.random() < 0.02) {
                leaves.push({
                    x: x + (Math.random()-0.5)*20*scale, y: y - 25*scale,
                    vx: (Math.random()-0.5)*1, vy: 0.5 + Math.random(),
                    color: Math.random() > 0.5 ? '#d97706' : '#b45309', life: 100
                });
            }
        } else if (season === 'WINTER') {
            ctx.fillStyle = '#cbd5e1';
            ctx.beginPath(); ctx.moveTo(x, y-40*scale); ctx.lineTo(x-15*scale, y-10*scale); ctx.lineTo(x+15*scale, y-10*scale); ctx.fill();
            ctx.fillStyle = '#94a3b8';
            ctx.beginPath(); ctx.moveTo(x, y-30*scale); ctx.lineTo(x-10*scale, y-10*scale); ctx.lineTo(x+10*scale, y-10*scale); ctx.fill();
        }
    };

    const loop = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);
      
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      if (season === 'WINTER') {
          gradient.addColorStop(0, '#1e293b'); gradient.addColorStop(1, '#cbd5e1');
      } else if (season === 'AUTUMN') {
          gradient.addColorStop(0, '#451a03'); gradient.addColorStop(1, '#fbbf24');
      } else {
          gradient.addColorStop(0, '#020617'); gradient.addColorStop(1, '#1e293b');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = season === 'WINTER' ? 'rgba(200, 200, 200, 0.2)' : 'rgba(255, 255, 255, 0.15)';
      clouds.forEach(cloud => {
          cloud.x += cloud.speed;
          if (cloud.x > width + 100) cloud.x = -100;
          ctx.beginPath();
          ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
          ctx.arc(cloud.x + cloud.size * 0.6, cloud.y - cloud.size * 0.2, cloud.size * 0.8, 0, Math.PI * 2);
          ctx.arc(cloud.x - cloud.size * 0.6, cloud.y - cloud.size * 0.2, cloud.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
      });

      ctx.strokeStyle = season === 'WINTER' ? '#334155' : '#0f172a';
      ctx.lineWidth = 2;
      birds.forEach(bird => {
          bird.x += bird.speed;
          bird.y += Math.sin(frame * 0.02 + bird.offset) * 0.5;
          if (bird.x > width + 20) { bird.x = -20; bird.y = Math.random() * (height * 0.5); }
          const flap = Math.sin(frame * 0.2 + bird.offset) * 5;
          ctx.beginPath(); ctx.moveTo(bird.x, bird.y); ctx.lineTo(bird.x - 5, bird.y - 3 + flap);
          ctx.moveTo(bird.x, bird.y); ctx.lineTo(bird.x + 5, bird.y - 3 + flap); ctx.stroke();
      });

      backgroundBuildings.forEach(b => {
          ctx.fillStyle = season === 'WINTER' ? '#1e293b' : '#0f172a';
          ctx.fillRect(b.x, height - b.h, b.w, b.h);
          if (season === 'WINTER') {
              ctx.fillStyle = '#fff'; ctx.fillRect(b.x, height - b.h, b.w, 4);
          }
      });

      ctx.fillStyle = season === 'WINTER' ? '#e2e8f0' : '#111827';
      ctx.fillRect(0, height - 50, width, 50);

      // FIX: Draw trees BEFORE cars and passengers to fix layering
      const treePositions = [0.1, 0.3, 0.5, 0.7, 0.9];
      treePositions.forEach(p => {
          drawTree(width * p, height - 40, 1.5);
      });

      if (cars.length < 6 && Math.random() < 0.03) { spawnCar(); } // Increased spawn rate
      
      for (let i = passengers.length - 1; i >= 0; i--) {
        const p = passengers[i];
        if (p.state === 'WALKING') {
            p.y -= p.speed;
            if (p.y <= p.targetY) {
                p.y = p.targetY; p.state = 'ENTERING'; p.alpha = 1.0;
            }
        } else if (p.state === 'ENTERING') {
            p.alpha -= 0.05;
            if (p.alpha <= 0) { passengers.splice(i, 1); continue; }
        }
        ctx.globalAlpha = p.alpha || 1;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y - 5, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(p.x - 1.5, p.y - 2, 3, 6);
        ctx.globalAlpha = 1;
      }

      for (let i = cars.length - 1; i >= 0; i--) {
          const car = cars[i];
          switch (car.state) {
              case 'DRIVING_IN':
                  car.x += car.speed;
                  if ((car.speed > 0 && car.x >= car.targetX) || (car.speed < 0 && car.x <= car.targetX)) {
                      car.x = car.targetX; car.state = 'PARKED';
                  }
                  break;
              case 'PARKED':
                  car.parkTimer--;
                  if (car.parkTimer === 170) {
                      passengers.push({
                          x: car.x + 20, y: car.y - 5,
                          targetY: height - 50, speed: 0.5,
                          color: `hsl(${Math.random() * 360}, 60%, 70%)`, state: 'WALKING'
                      });
                  }
                  if (car.parkTimer <= 0) { car.state = 'DRIVING_OUT'; }
                  break;
              case 'DRIVING_OUT':
                  car.x += car.speed;
                  if (car.x < -100 || car.x > width + 100) { cars.splice(i, 1); continue; }
                  break;
          }

          const carWidth = 40, carHeight = 14;
          ctx.fillStyle = car.color;
          ctx.fillRect(car.x, car.y - carHeight, carWidth, carHeight);
          ctx.fillStyle = '#1f2937'; 
          ctx.fillRect(car.x + 5, car.y - carHeight - 6, carWidth - 10, 6);
          ctx.fillStyle = '#000';
          ctx.beginPath(); ctx.arc(car.x + 8, car.y, 5, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(car.x + carWidth - 8, car.y, 5, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = 'rgba(255, 255, 100, 0.5)';
          ctx.beginPath();
          if (car.speed > 0) {
              ctx.moveTo(car.x + carWidth, car.y - 8); ctx.lineTo(car.x + carWidth + 30, car.y - 2); ctx.lineTo(car.x + carWidth + 30, car.y + 5);
          } else {
              ctx.moveTo(car.x, car.y - 8); ctx.lineTo(car.x - 30, car.y - 2); ctx.lineTo(car.x - 30, car.y + 5);
          }
          ctx.fill();
      }

      if (season === 'WINTER') {
           if (Math.random() < 0.2) {
               particles.push({
                   x: Math.random() * width, y: -10, speed: 0, vx: (Math.random()-0.5),
                   vy: 1 + Math.random(), size: 2, color: '#fff', type: 'snow', life: 500
               });
           }
      } else {
          particles.forEach(p => {
              if (p.type === 'light') {
                p.x += p.speed;
                if (p.x > width) p.x = 0; if (p.x < 0) p.x = width;
                ctx.fillStyle = p.color; ctx.globalAlpha = 0.6;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
                ctx.globalAlpha = 1;
              }
          });
      }
      
      for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          if (p.type === 'snow') {
              p.x += p.vx; p.y += p.vy;
              ctx.fillStyle = p.color;
              ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
              if (p.y > height) particles.splice(i, 1);
          }
      }

      for (let i = leaves.length - 1; i >= 0; i--) {
          const l = leaves[i];
          l.x += l.vx + Math.sin(frame * 0.1); l.y += l.vy;
          ctx.fillStyle = l.color; ctx.fillRect(l.x, l.y, 4, 4);
          if (l.y > height - 50) leaves.splice(i, 1);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [season]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10 pointer-events-none" />;
};

export default CityBackground;
