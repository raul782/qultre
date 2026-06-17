import React, { Suspense, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import InteractiveGlobe from './InteractiveGlobe';
import FloatingCard from './FloatingCard';

// Dynamic import helpers to avoid SSR execution
let Canvas: any = null;
let Stars: any = null;
let OrbitControls: any = null;

export default function HeroScene() {
  const { t, i18n } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [threeLoaded, setThreeLoaded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    Promise.all([
      import('@react-three/fiber'),
      import('@react-three/drei')
    ]).then(([r3f, drei]) => {
      Canvas = r3f.Canvas;
      Stars = drei.Stars;
      OrbitControls = drei.OrbitControls;
      setThreeLoaded(true);
    }).catch(err => {
      console.error("Failed to load React Three Fiber packages", err);
    });
  }, []);

  const cardData = [
    { position: [-3.3, 1.2, 0.5], color: '#f59e0b', label: i18n.language === 'es' ? 'Madrid' : 'Madrid', id: 'madrid' },
    { position: [3.3, 0.4, -0.6], color: '#06b6d4', label: i18n.language === 'es' ? 'Tokio' : 'Tokyo', id: 'tokyo' },
    { position: [-1.0, -2.3, 1.6], color: '#a855f7', label: i18n.language === 'es' ? 'Roma' : 'Rome', id: 'rome' },
  ];

  if (!isMounted || !threeLoaded) {
    // Elegant background loading skeleton while libraries fetch
    return (
      <div className="fixed inset-0 w-screen h-screen z-0 bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="relative flex flex-col items-center gap-3">
          <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-primary-500 rounded-full animate-spin"></div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">
            Loading Spatial Environment...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen z-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 6.2], fov: 60 }}>
        {/* Soft atmospheric ambient light */}
        <ambientLight intensity={0.25} />
        
        {/* Directional focus highlighting */}
        <pointLight position={[10, 10, 10]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[-8, 8, -5]} intensity={0.6} color="#4f46e5" />
        <directionalLight position={[8, -8, 5]} intensity={0.4} color="#06b6d4" />
        
        <Suspense fallback={null}>
          {/* Wireframe relational Globe */}
          <InteractiveGlobe />
          
          {/* Orbiting / drifting custom cards */}
          {cardData.map((card) => (
            <FloatingCard 
              key={card.id}
              initialPosition={card.position}
              accentColor={card.color}
              cityName={card.label}
              cityId={card.id}
            />
          ))}

          {/* Deep space stars context */}
          <Stars radius={100} depth={50} count={2500} factor={4} saturation={0.5} fade speed={1.5} />
        </Suspense>

        {/* Orbit restrictions to prevent disorientating average users */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 1.7} 
          minPolarAngle={Math.PI / 2.3} 
          autoRotate 
          autoRotateSpeed={0.15} 
        />
      </Canvas>
    </div>
  );
}
