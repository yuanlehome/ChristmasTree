import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const TopStar = ({ animationState }) => {
  const starRef = useRef();

  useFrame((state, delta) => {
    if (!starRef.current) return;
    const time = state.clock.getElapsedTime();
    const { progress } = animationState.current;

    starRef.current.rotation.y += delta;
    starRef.current.rotation.z = Math.sin(time) * 0.1;
    starRef.current.position.y = 4 + Math.sin(time) * 0.1;
    const starScale = 1 - progress;
    starRef.current.scale.set(starScale, starScale, starScale);
  });

  return (
    <mesh ref={starRef} position={[0, 4, 0]} raycast={() => null}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial 
            color="#FFD700" 
            emissive="#FFD700" 
            emissiveIntensity={10} 
            toneMapped={false}
        />
        <pointLight intensity={5} distance={10} color="#FFD700" decay={2} />
    </mesh>
  );
};

export default TopStar;
