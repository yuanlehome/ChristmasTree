import React, { useRef, useEffect } from 'react';
import { useThree, useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../store';
import gsap from 'gsap';

const PhotoOverlay = () => {
    const { focusedPhoto, setFocusedPhoto } = useStore();
    const meshRef = useRef();
    
    // Load texture if url exists
    // Note: useLoader hook needs to be conditional or handled carefully. 
    // R3F hooks order rules apply. 
    // Better to load texture inside a child component that is only rendered when photo exists.
    
    if (!focusedPhoto) return null;

    // Use timestamp or url as key to force re-mount on change
    return <OverlayContent key={focusedPhoto.timestamp || focusedPhoto.url} photo={focusedPhoto} onClose={() => setFocusedPhoto(null)} />;
};

const OverlayContent = ({ photo, onClose }) => {
    const meshRef = useRef();
    const texture = useLoader(THREE.TextureLoader, photo.url ? photo.url : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=');

    if (texture) {
        texture.center.set(0.5, 0.5);
    }

    // Lock overlay to camera using useFrame
    useFrame((state) => {
        if (!meshRef.current) return;
        
        const camera = state.camera;
        // Position exactly 6 units in front of camera
        const vector = new THREE.Vector3(0, 0, -6);
        vector.applyQuaternion(camera.quaternion);
        vector.add(camera.position);
        
        meshRef.current.position.copy(vector);
        meshRef.current.lookAt(camera.position);
    });

    useEffect(() => {
        if (meshRef.current) {
            // Intro Animation
            meshRef.current.scale.set(0.1, 0.1, 0.1);
            gsap.to(meshRef.current.scale, {
                x: 3, y: 3, z: 3,
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
        }
    }, [photo]); 

    const handleBackdropClick = (e) => {
        e.stopPropagation();
        onClose();
    };

    return (
        <group>
             {/* The Zoomed Photo Group */}
             <group ref={meshRef}> 
                 {/* Backdrop attached to this group so it covers view */}
                 <mesh position={[0, 0, -0.1]} onClick={handleBackdropClick} renderOrder={9999}>
                     <planeGeometry args={[100, 100]} />
                     <meshBasicMaterial color="black" transparent opacity={0.8} depthTest={false} />
                 </mesh>
 
                 <mesh rotation={[0, Math.PI, 0]} renderOrder={10000}> 
                     <circleGeometry args={[1, 32]} />
                     <meshStandardMaterial color={photo.color} roughness={0.2} metalness={1} side={THREE.BackSide} depthTest={false} />
                 </mesh>
                 <mesh onClick={handleBackdropClick} renderOrder={10000}> 
                     <circleGeometry args={[1, 32]} />
                     {photo.url ? (
                         <meshStandardMaterial 
                             map={texture} 
                             emissiveMap={texture}
                             emissive="white"
                             emissiveIntensity={3}
                             toneMapped={false} 
                             side={THREE.FrontSide} 
                             depthTest={false} 
                         />
                     ) : (
                         <meshStandardMaterial color={photo.color} emissive={photo.color} emissiveIntensity={0.5} depthTest={false} />
                     )}
                 </mesh>
             </group>
        </group>
    );
}

export default PhotoOverlay;
