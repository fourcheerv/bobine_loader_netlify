import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState } from 'react';
import { Cylinder, Box, Html } from '@react-three/drei';
import { Button } from '@/components/ui/button';

const bobineTypes = [
  { height: 1.6, diameters: [1.5, 1.25], weights: [2500, 2300], stackCurrent: 4, stackFuture: 5 },
  { height: 1.2, diameters: [1.5, 1.25], weights: [1800, 1300], stackCurrent: 5, stackFuture: 6 },
  { height: 0.8, diameters: [1.5, 1.25], weights: [1200, 900], stackCurrent: 8, stackFuture: 10 },
];

const optimizePlacement = (bobines) => {
  let sortedBobines = [...bobines].sort((a, b) => bobineTypes[b.type].height - bobineTypes[a.type].height);
  let positions = [];
  let x = -2.5, z = -5, maxRowHeight = 0;

  sortedBobines.forEach((bobine, index) => {
    let bobineData = bobineTypes[bobine.type];
    positions.push({ ...bobine, position: [x, bobineData.height / 2, z] });
    
    x += bobineData.diameters[0] / 2000 + 0.2;
    maxRowHeight = Math.max(maxRowHeight, bobineData.height);
    
    if (x > 2.5) {
      x = -2.5;
      z += bobineData.diameters[0] / 1000 + 0.2;
    }
  });

  return positions;
};

export default function BobineLoader() {
  const [bobines, setBobines] = useState([
    { id: 1, type: 0 },
    { id: 2, type: 1 },
    { id: 3, type: 2 },
    { id: 4, type: 0 },
  ]);

  const optimize = () => {
    setBobines(optimizePlacement(bobines));
  };

  return (
    <div style={{ height: '100vh' }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls />
        
        <Box args={[6, 0.2, 12]} position={[0, 0, 0]}>
          <meshStandardMaterial color="gray" />
        </Box>
        
        {bobines.map((bobine) => (
          <Cylinder 
            key={bobine.id} 
            args={[bobineTypes[bobine.type].diameters[0] / 2000, bobineTypes[bobine.type].diameters[0] / 2000, bobineTypes[bobine.type].height, 32]} 
            position={bobine.position}
          >
            <meshStandardMaterial color="brown" />
          </Cylinder>
        ))}
      </Canvas>
      <Html position={[-2, 2, 0]}>
        <Button onClick={optimize}>Optimiser Placement</Button>
      </Html>
    </div>
  );
}