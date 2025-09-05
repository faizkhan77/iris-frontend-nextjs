// components/Scene.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, OrbitControls } from "@react-three/drei";

export default function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 0, 5]} />
      <Sphere args={[1, 100, 200]} scale={2.5}>
        <MeshDistortMaterial
          color="#805AD5"
          attach="material"
          distort={0.5}
          speed={1.5}
        />
      </Sphere>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.0} />
    </Canvas>
  );
}
