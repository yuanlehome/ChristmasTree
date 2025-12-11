import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import useStore from '../store';
import TreeParticles from './TreeParts/TreeParticles';
import FairyLights from './TreeParts/FairyLights';
import Ornaments from './TreeParts/Ornaments';
import TopStar from './TreeParts/TopStar';

const ChristmasTree = () => {
  const { phase, setPhase, gesture } = useStore();
  const groupRef = useRef();
  
  // Animation State (Shared across components via ref)
  const animationState = useRef({ progress: 0, explosion: 0 });

  // Handle Phase Transitions
  useEffect(() => {
    if (phase === 'tree' && gesture === 'Open_Palm') {
      setPhase('blooming');
    }
    
    if (phase === 'nebula' && gesture === 'Closed_Fist') {
      setPhase('collapsing');
    }
  }, [gesture, phase, setPhase]);

  useEffect(() => {
    if (phase === 'blooming') {
      // Explosion animation
      gsap.to(animationState.current, {
        progress: 1,
        explosion: 1,
        duration: 2,
        ease: 'power3.out',
        onComplete: () => {
            setPhase('nebula');
            gsap.to(animationState.current, { explosion: 0, duration: 1 });
        }
      });
    } else if (phase === 'collapsing') {
      gsap.to(animationState.current, {
        progress: 0,
        duration: 2,
        ease: 'power3.inOut',
        onComplete: () => setPhase('tree')
      });
    }
  }, [phase, setPhase]);

  // Global Rotation
  useFrame((state, delta) => {
    // Stop rotation if a photo is focused
    if (useStore.getState().focusedPhoto) return;

    if (groupRef.current) {
        if (phase === 'nebula' && gesture === 'Open_Palm') {
            groupRef.current.rotation.y += delta * 0.5;
        } else if (phase === 'tree') {
            groupRef.current.rotation.y += delta * 0.2;
        }
    }
  });

  return (
    <group ref={groupRef}>
      <TreeParticles animationState={animationState} />
      <FairyLights animationState={animationState} />
      <Ornaments animationState={animationState} />
      <TopStar animationState={animationState} />
    </group>
  );
};

export default ChristmasTree;
