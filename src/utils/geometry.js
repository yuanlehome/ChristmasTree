import * as THREE from 'three';

// Helper to mix colors
const lerpColor = (color1, color2, factor) => {
    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);
    return c1.lerp(c2, factor);
};

export const generateTreePoints = (count = 5000, radius = 2.5, height = 6) => {
  const points = [];
  const particleData = []; // Store extra data like color, scale, rotation

  // Layered Spiral Algorithm (Phyllotaxis-inspired)
  // Create layers of branches
  const layers = 15;
  const pointsPerLayer = Math.floor(count / layers);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.399 radians

  for (let l = 0; l < layers; l++) {
      const layerProgress = l / layers; // 0 (bottom) to 1 (top)
      const y = (layerProgress * height) - (height / 2);
      
      // Radius at this height (Cone shape)
      const maxR = radius * (1 - layerProgress); 
      
      // Create branches in this layer
      for (let i = 0; i < pointsPerLayer; i++) {
          const t = i / pointsPerLayer;
          const theta = i * goldenAngle + (l * Math.PI / 3); // Offset each layer
          
          // Distribution along the branch: more density towards outer tips for "fluffiness"
          // We use sqrt to push points outwards
          const branchR = maxR * Math.sqrt(t); 
          
          // Add some randomness to clump them like needles
          const jitterX = (Math.random() - 0.5) * 0.3;
          const jitterY = (Math.random() - 0.5) * 0.2;
          const jitterZ = (Math.random() - 0.5) * 0.3;

          const x = branchR * Math.cos(theta) + jitterX;
          const z = branchR * Math.sin(theta) + jitterZ;
          const finalY = y - (branchR * 0.5) + jitterY; // Droop effect: branches hang down slightly as they go out

          points.push(new THREE.Vector3(x, finalY, z));

          // Calculate Color:
          // Inner/Bottom = Darker Green, Outer/Top = Lighter Green/Gold
          // Mix based on height (layerProgress) and radius (t)
          const isTip = t > 0.8;
          const baseColor = lerpColor('#003300', '#006600', layerProgress); // Dark to Med Green
          const tipColor = lerpColor('#44aa44', '#aaffaa', layerProgress); // Light to Pale Green
          
          const finalColor = lerpColor(baseColor, tipColor, t);
          
          // Calculate Scale: Tips are smaller
          const scale = 0.5 + Math.random() * 0.5;

          particleData.push({
              color: finalColor,
              scale: scale,
              rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
          });
      }
  }

  return { points, particleData };
};

export const generateNebulaPoints = (count = 5000, radius = 8, spread = 2) => {
  const points = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    // Ring distribution with some spread
    // Gaussian-like distribution for spread
    const r = radius + (Math.random() + Math.random() - 1) * spread;
    
    const x = r * Math.cos(theta);
    const z = r * Math.sin(theta);
    // Nebula is flat but has volume
    const y = (Math.random() - 0.5) * spread * 0.5; 
    
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
};

export const generateDecorations = (count = 60, radius = 2.5, height = 6) => {
    const points = [];
    // Perfect Spiral for tinsel/garland look
    const turns = 6;
    for (let i = 0; i < count; i++) {
        const t = i / count;
        const y = (t * height) - (height / 2);
        const r = (radius * (1 - t)) + 0.2; // Slightly outside the tree radius
        const theta = t * Math.PI * 2 * turns;

        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);

        points.push({
            position: new THREE.Vector3(x, y, z),
            color: getRandomColor(),
            scale: 0.8 + Math.random() * 0.4
        });
    }
    return points;
}

export const generateFairyLights = (count = 300, radius = 2.5, height = 6) => {
    const points = [];
    const lightColors = ['#ff0000', '#ffff00', '#0000ff', '#ffffff']; // Red, Yellow, Blue, White
    
    // Create multiple spiral strands for lights
    const strands = 3;
    const pointsPerStrand = Math.floor(count / strands);
    
    for(let s = 0; s < strands; s++) {
        for(let i = 0; i < pointsPerStrand; i++) {
            const t = i / pointsPerStrand;
            const y = (t * height) - (height / 2);
            // Spiral shape matching the tree cone but slightly embedded
            const r = (radius * (1 - t)) * 0.95 + 0.1; 
            const theta = t * Math.PI * 12 + (s * Math.PI * 2 / strands);
            
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            
            points.push({
                position: new THREE.Vector3(x, y, z),
                color: lightColors[Math.floor(Math.random() * lightColors.length)],
                phaseOffset: Math.random() * Math.PI * 2 // For twinkling
            });
        }
    }
    return points;
};

const colors = ['#FFD700', '#C0C0C0', '#ff0000', '#ffffff']; // Gold, Silver, Red, White

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}
