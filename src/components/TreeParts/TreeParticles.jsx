import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../../store';
import { generateTreePoints, generateNebulaPoints } from '../../utils/geometry';

const PARTICLE_COUNT = 5000;
const dummy = new THREE.Object3D();
const tempVec = new THREE.Vector3();
const mouseVec = new THREE.Vector3();

const TreeParticles = ({ animationState }) => {
  const { phase } = useStore();
  const meshRef = useRef();
  const { mouse, viewport } = useThree();

  // Generate Geometry Data
  const { points: treePositions, particleData: treeParticleData } = useMemo(() => generateTreePoints(PARTICLE_COUNT, 3.5, 8), []);
  const nebulaPositions = useMemo(() => generateNebulaPoints(PARTICLE_COUNT, 8, 2), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const { progress, explosion } = animationState.current;

    // Mouse Interaction
    mouseVec.set(mouse.x * viewport.width / 2, mouse.y * viewport.height / 2, 0);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const treePos = treePositions[i];
        const nebulaPos = nebulaPositions[i];
        const particle = treeParticleData[i];

        if (!treePos || !nebulaPos || !particle) continue;

        // Base Position Interpolation
        tempVec.lerpVectors(treePos, nebulaPos, progress);

        // Explosion Effect
        if (explosion > 0) {
            const dir = tempVec.clone().normalize();
            tempVec.add(dir.multiplyScalar(explosion * 5));
        }

        // Mouse Repulsion (Only in tree phase)
        if (phase === 'tree') {
            const dist = tempVec.distanceTo(mouseVec);
            if (dist < 2.5) {
                const repelDir = tempVec.clone().sub(mouseVec).normalize();
                const force = (2.5 - dist) * 0.8;
                tempVec.add(repelDir.multiplyScalar(force));
            }
        }
        
        // Ambient Motion (Bobbing/Breathing)
        tempVec.y += Math.sin(time * 0.5 + i * 0.1) * 0.05;
        if (phase === 'tree') {
            const breathing = 1 + Math.sin(time * 0.8) * 0.01;
            tempVec.multiplyScalar(breathing);
        }

        dummy.position.copy(tempVec);
        
        // Scale Logic
        let currentScale = particle.scale;
        currentScale *= (Math.sin(time * 2 + i) * 0.2 + 1) * 0.1;
        
        if (progress > 0) {
            currentScale = THREE.MathUtils.lerp(currentScale, 0.05, progress);
        }

        dummy.scale.set(currentScale, currentScale, currentScale);
        dummy.rotation.copy(particle.rotation);
        dummy.rotation.x += time * 0.1;
        dummy.rotation.y += time * 0.1;
        
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        
        // Color Logic (Flashing)
        const isFlashing = Math.sin(time * 5 + i * 10) > 0.95;
        if (isFlashing && phase === 'tree') {
             meshRef.current.setColorAt(i, new THREE.Color('#FFD700'));
        } else {
             meshRef.current.setColorAt(i, particle.color);
        }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, PARTICLE_COUNT]} raycast={() => null}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial 
          vertexColors={false}
          toneMapped={false}
          emissive="#002200"
          emissiveIntensity={2.2}
          roughness={0.1} 
          metalness={0.9} 
          clearcoat={1}
          clearcoatRoughness={0.1}
      />
    </instancedMesh>
  );
};

export default TreeParticles;
