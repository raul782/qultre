import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useWaitlistStore } from '@store/useWaitlistStore';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';
import cardsData from '@data/cards.json';

interface FloatingCardProps {
  initialPosition: number[];
  accentColor: string;
  cityName: string;
  cityId: string;
}

const getCityFlag = (id: string) => {
  switch (id) {
    case 'madrid': return '🇪🇸';
    case 'tokyo': return '🇯🇵';
    case 'rome': return '🇮🇹';
    default: return '';
  }
};

export default function FloatingCard({ initialPosition, accentColor, cityName, cityId }: FloatingCardProps) {
  const { i18n } = useTranslation();
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);
  const selectedCity = useWaitlistStore((state) => state.selectedCity);
  const selectedCategory = useWaitlistStore((state) => state.selectedCategory);
  const setSelectedCity = useWaitlistStore((state) => state.setSelectedCity);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);
  
  const targetPos = new THREE.Vector3(...initialPosition);
  const isSelected = selectedCity === cityId;
  const langKey = i18n.language === 'es' ? 'es' : 'en';

  const cardDetails = cardsData.find(c => c.id === cityId) || cardsData[0];

  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    if (!isSelected) {
      setShowBack(false);
    }
  }, [isSelected]);

  // Rotate 180 degrees (Math.PI) to show back when showBack is true, otherwise show front (0)
  const targetRotationY = showBack ? Math.PI : 0;
  const currentRotationY = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();
    // Drift float baseline
    const floatOffset = Math.sin(t * 1.5 + initialPosition[0]) * 0.12;

    // Smooth lerp rotation Y toward target
    currentRotationY.current = THREE.MathUtils.lerp(currentRotationY.current, targetRotationY, delta * 6);

    if (hovered || isSelected) {
      // Pop card forward closer to camera
      const popDepth = isSelected ? 1.2 : 0.8;
      groupRef.current.position.lerp(new THREE.Vector3(targetPos.x, targetPos.y + floatOffset, targetPos.z + popDepth), delta * 5);
      groupRef.current.scale.lerp(new THREE.Vector3(1.12, 1.12, 1.12), delta * 6);
      
      // Let the card tilt slightly following the pointer coordinates
      groupRef.current.rotation.y = currentRotationY.current + state.pointer.x * 0.3;
      groupRef.current.rotation.x = -state.pointer.y * 0.3;
    } else {
      // Return to resting position
      groupRef.current.position.lerp(new THREE.Vector3(targetPos.x, targetPos.y + floatOffset, targetPos.z), delta * 4);
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 4);
      groupRef.current.rotation.y = currentRotationY.current;
      groupRef.current.rotation.x = 0;
    }
  });

  const handleCardClick = (e: any) => {
    e.stopPropagation();
    if (!isSelected) {
      setSelectedCity(cityId);
      setShowBack(true);
    } else {
      setShowBack(!showBack);
    }
  };

  // Helper to extract category values
  const getCategoryDetails = () => {
    const details = cardDetails[selectedCategory] as any;
    if (selectedCategory === 'finance') {
      return (
        <div className="space-y-2 mt-2 text-white font-medium">
          <div className="flex justify-between border-b border-white/10 pb-1.5">
            <span className="text-[10px] text-white/60">Currency</span>
            <span className="text-xs font-bold text-white">{details.currency}</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-1.5">
            <span className="text-[10px] text-white/60">Coffee</span>
            <span className="text-xs font-semibold text-white">{details.coffeePrice[langKey]}</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-[10px] text-white/60">Meal</span>
            <span className="text-xs font-semibold text-white">{details.mealPrice[langKey]}</span>
          </div>
        </div>
      );
    }
    if (selectedCategory === 'tourism') {
      return (
        <div className="space-y-2 mt-2 text-white font-medium">
          <div>
            <span className="block text-[8px] font-bold uppercase text-white/50">Neighborhood</span>
            <span className="font-semibold text-xs text-white">{details.topDistrict[langKey]}</span>
          </div>
          <div>
            <span className="block text-[8px] font-bold uppercase text-white/50">Must See</span>
            <span className="font-bold text-xs text-white">{details.mainAttraction[langKey]}</span>
          </div>
        </div>
      );
    }
    if (selectedCategory === 'demographics') {
      return (
        <div className="space-y-2 mt-2 text-white font-medium">
          <div className="flex justify-between border-b border-white/10 pb-1.5">
            <span className="text-[10px] text-white/60">Density</span>
            <span className="text-xs font-semibold text-white">{details.populationDensity}</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-[10px] text-white/60">Language</span>
            <span className="text-xs font-semibold text-white">{details.languages[langKey]}</span>
          </div>
        </div>
      );
    }
    if (selectedCategory === 'weather') {
      return (
        <div className="space-y-2 mt-2 text-white font-medium">
          <div className="flex justify-between border-b border-white/10 pb-1.5">
            <span className="text-[10px] text-white/60">Best Visit</span>
            <span className="text-xs font-bold text-white">{details.bestMonth[langKey]}</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-[10px] text-white/60">Avg High</span>
            <span className="text-xs font-semibold text-white">{details.tempHigh.split(' ')[0]}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <group ref={groupRef}>
      {/* Invisible hitbox mesh for 3D raycasting interaction */}
      <mesh 
        onClick={handleCardClick}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[2.0, 3.0, 0.1]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Point Light behind card to project neon color glow onto the globe */}
      <pointLight 
        position={[0, 0, -0.2]} 
        distance={4.5} 
        intensity={hovered || isSelected ? 6.0 : 3.0} 
        color={accentColor} 
      />

      {/* FRONT SIDE HTML INTERACTION LAYER */}
      <Html
        transform
        distanceFactor={1.8}
        position={[0, 0, 0.035]}
        rotation={[0, 0, 0]}
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          pointerEvents: isSelected ? 'none' : 'auto'
        }}
      >
        <div 
          style={{
            borderColor: hovered ? `${accentColor}50` : 'rgba(255, 255, 255, 0.15)',
            boxShadow: hovered 
              ? `0 0 30px ${accentColor}40, inset 0 0 15px ${accentColor}25` 
              : `0 0 15px ${accentColor}15, inset 0 0 8px rgba(255,255,255,0.05)`
          }}
          className="w-[200px] h-[300px] rounded-3xl p-5 border bg-white/10 dark:bg-slate-950/20 backdrop-blur-xl flex flex-col justify-between text-slate-900 dark:text-white select-none transition-all duration-300 active:scale-95"
        >
          {/* Card Header */}
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-300">Culture Deck</span>
            <div 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
            ></div>
          </div>

          {/* Card Center - City Name & Flag (Big and Opaque) */}
          <div className="my-auto space-y-1.5 text-left">
            <h4 className="text-4xl font-black font-display tracking-tighter leading-none uppercase text-slate-900 dark:text-white flex flex-wrap items-center gap-1.5 select-none opacity-100">
              <span className="block">{cityName}</span>
              <span className="text-3xl inline-block drop-shadow-sm">{getCityFlag(cityId)}</span>
            </h4>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-300 tracking-wider block opacity-100 font-sans">
              {cardDetails.country[langKey].toUpperCase()}
            </span>
          </div>

          {/* Card Footer Instruction */}
          <div className="text-[9px] font-bold text-slate-400 dark:text-slate-300 tracking-wider border-t border-slate-200/50 dark:border-slate-800/50 pt-2 flex justify-between items-center">
            <span>CLICK TO DECODE</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 11.518 1.171l-.041.02-.006.003a.75.75 0 01-.518-1.171zm0 0V9m0 2.25h2.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </Html>

      {/* BACK SIDE HTML DATA LAYER */}
      <Html
        transform
        distanceFactor={1.8}
        position={[0, 0, -0.035]}
        rotation={[0, Math.PI, 0]}
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          pointerEvents: isSelected ? 'auto' : 'none'
        }}
      >
        <div 
          style={{
            borderColor: isSelected ? `${accentColor}60` : 'rgba(255, 255, 255, 0.15)',
            boxShadow: isSelected 
              ? `0 0 35px ${accentColor}45, inset 0 0 20px ${accentColor}30` 
              : 'none'
          }}
          className="w-[200px] h-[300px] rounded-3xl p-5 border bg-white/10 dark:bg-slate-950/20 backdrop-blur-xl flex flex-col justify-between text-slate-900 dark:text-white select-none transition-all duration-300"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-primary-500 dark:text-primary-400 font-sans">
              {selectedCategory.toUpperCase()}
            </span>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-300 flex items-center gap-1 font-sans">
              {cityName} {getCityFlag(cityId)}
            </span>
          </div>

          {/* Main metrics display */}
          <div className="my-auto text-left text-xs leading-relaxed space-y-1.5">
            <p className="text-[9px] text-slate-500 dark:text-slate-300 italic mb-2 select-text font-serif leading-snug">
              {cardDetails.tagline[langKey]}
            </p>
            {getCategoryDetails()}
          </div>

          {/* Back Footer */}
          <div className="text-[9px] font-bold text-slate-400 dark:text-slate-300 tracking-wider border-t border-slate-200/50 dark:border-slate-800/50 pt-2 flex justify-between items-center">
            <span>FLIP BACK</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </div>
        </div>
      </Html>
    </group>
  );
}
