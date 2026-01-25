import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

function Model({ modelPath }) {
  const modelRef = useRef();
  const { scene } = useGLTF(modelPath);

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.002;
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={4}
      position={[0, 0, 0]}
    />
  );
}

export const ThreeBackground = ({ modelPath = '/star-bg-model.glb' }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        {/* <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.8}  />
        <directionalLight position={[-10, -10, -5]} intensity={0.4}  />
        <pointLight position={[0, 5, 0]} intensity={0.5}/> */}
        
        <Model modelPath={modelPath} />
      </Canvas>
    </div>
  );
};