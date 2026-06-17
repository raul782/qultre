import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useWaitlistStore } from '@store/useWaitlistStore';
import * as THREE from 'three';

export default function InteractiveGlobe() {
  const globeRef = useRef<THREE.Mesh>(null);
  const selectedCity = useWaitlistStore((state) => state.selectedCity);
  const targetRotationY = useRef(0);

  useEffect(() => {
    switch (selectedCity) {
      case 'madrid':
        targetRotationY.current = 0;
        break;
      case 'tokyo':
        targetRotationY.current = Math.PI * 0.7;
        break;
      case 'rome':
        targetRotationY.current = -Math.PI * 0.35;
        break;
      default:
        targetRotationY.current = 0;
    }
  }, [selectedCity]);

  useFrame((state, delta) => {
    if (globeRef.current) {
      // Smoothly lerp Y-rotation to center the country in space plus auto-spin offset
      globeRef.current.rotation.y = THREE.MathUtils.lerp(
        globeRef.current.rotation.y,
        targetRotationY.current + state.clock.getElapsedTime() * 0.05,
        delta * 3.0
      );
      // Subtle float pitch
      globeRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.05;
    }
  });

  return (
    <mesh ref={globeRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2.5, 40, 40]} />
      <meshStandardMaterial 
        color="#4f46e5" 
        wireframe 
        transparent 
        opacity={0.22} 
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
