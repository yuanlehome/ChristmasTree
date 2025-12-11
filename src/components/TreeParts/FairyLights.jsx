import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateFairyLights, generateNebulaPoints } from '../../utils/geometry';

const FAIRY_LIGHT_COUNT = 300;
const PARTICLE_COUNT = 5000; // Needed for nebula sync
const dummy = new THREE.Object3D();

const FairyLights = ({ animationState }) => {
  const meshRef = useRef();

  // Generate Geometry Data
  const fairyLightData = useMemo(() => generateFairyLights(FAIRY_LIGHT_COUNT, 3.5, 8), []);
  // We need nebula positions to sync the transition
  const nebulaPositions = useMemo(() => generateNebulaPoints(PARTICLE_COUNT, 8, 2), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const { progress } = animationState.current;

    for(let i=0; i < FAIRY_LIGHT_COUNT; i++) {
        const data = fairyLightData[i];
        let targetPos = data.position.clone();
        
        // Nebula Transition
        if (progress > 0) {
             // Move to nebula ring (reuse nebula points but with offset)
             const nebulaTarget = nebulaPositions[i % PARTICLE_COUNT].clone().multiplyScalar(0.8); 
             targetPos.lerp(nebulaTarget, progress);
        }

        dummy.position.copy(targetPos);
        
        // Twinkle Logic
        const blinkSpeed = 3;
        const blink = Math.sin(time * blinkSpeed + data.phaseOffset);
        const intensity = blink > 0 ? 1 : 0.2; // On or Dim
        
        const scale = progress > 0 ? 0.05 : (intensity * 0.08);
        
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        
        meshRef.current.setColorAt(i, new THREE.Color(data.color));
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, FAIRY_LIGHT_COUNT]} raycast={() => null}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
};

export default FairyLights;
