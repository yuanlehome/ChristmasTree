import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../../store';
import { generateDecorations } from '../../utils/geometry';

const DECORATION_COUNT = 30;

// Dynamic import of photos
function importAll(r) {
    return r.keys().map(r);
}

let localPhotos = [];
try {
    localPhotos = importAll(require.context('../../assets/photos', false, /\.(png|jpe?g|svg)$/));
} catch (e) {
    console.warn("No photos found in src/assets/photos");
}

const Ornaments = ({ animationState }) => {
  const { phase } = useStore();
  const decorationData = useMemo(() => generateDecorations(DECORATION_COUNT, 3.5, 8), []);

  return (
    <group>
      {decorationData.map((data, i) => (
          <PhotoOrnament 
            key={i} 
            index={i}
            initialPosition={data.position} 
            color={data.color} 
            scale={data.scale}
            photoUrl={localPhotos[i % localPhotos.length]} 
            animationState={animationState}
            phase={phase}
          />
      ))}
    </group>
  );
};

const PhotoOrnament = ({ index, initialPosition, color, scale, photoUrl, animationState, phase }) => {
    const meshRef = useRef();
    const texture = useLoader(THREE.TextureLoader, photoUrl ? photoUrl : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=');
    const { setFocusedPhoto } = useStore();
    
    if (texture) {
        texture.center.set(0.5, 0.5);
    }

    const handleClick = (e) => {
        console.log('Clicked ornament:', index, 'Url:', photoUrl);
        e.stopPropagation();
        setFocusedPhoto({ url: photoUrl, color: color, timestamp: Date.now() });
    };

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();

        // Position Logic
        const targetPos = initialPosition.clone();
        
        // Bobbing
        targetPos.y += Math.sin(time + index) * 0.1;

        meshRef.current.position.copy(targetPos);

        // Gentle Rotation
        meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;

        // Scale
        const baseScale = scale * 0.5; 
        const currentScale = baseScale; 
        meshRef.current.scale.set(currentScale, currentScale, currentScale);
        
        // Ensure visibility
        meshRef.current.visible = true;
    });

    return (
        <group ref={meshRef} onClick={handleClick}>
            {/* Click Hitbox - Transparent Sphere for 360-degree interaction */}
            {/* visible=true for raycasting, opacity=0 for invisibility, depthWrite=false to prevent occlusion issues */}
            <mesh visible={true} renderOrder={999}>
                 <sphereGeometry args={[1.5, 8, 8]} />
                 <meshBasicMaterial 
                    color="red" 
                    transparent 
                    opacity={0} 
                    side={THREE.DoubleSide} 
                    depthWrite={false} 
                 />
            </mesh>

            {/* Back Side (Color) */}
            <mesh rotation={[0, Math.PI, 0]} position={[0, 0, -0.02]}> 
                <circleGeometry args={[1, 32]} />
                {photoUrl ? (
                     <meshBasicMaterial map={texture} toneMapped={false} side={THREE.FrontSide} />
                ) : (
                    <meshStandardMaterial color={color} roughness={0.2} metalness={1} side={THREE.FrontSide} />
                )}
            </mesh>
            
            {/* Front Side (Photo) */}
            <mesh position={[0, 0, 0.02]}> 
                <circleGeometry args={[1, 32]} />
                {photoUrl ? (
                    <meshBasicMaterial map={texture} toneMapped={false} side={THREE.FrontSide} />
                ) : (
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} side={THREE.FrontSide} />
                )}
            </mesh>

            {/* Ring Decoration */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1, 0.05, 16, 32]} />
                <meshStandardMaterial color="#FFD700" roughness={0.1} metalness={1} />
            </mesh>
        </group>
    );
};

export default Ornaments;
