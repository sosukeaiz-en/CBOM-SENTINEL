import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

function CBOMNetwork() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const { nodes, edges } = useMemo(() => {
    const nodeCount = 35;
    const nodes = [];
    const radius = 3;

    // Central Application Node
    nodes.push({
      position: new THREE.Vector3(0, 0, 0),
      color: "#3B82F6", // Blue
      size: 0.25,
      type: "App",
    });

    // Generate random nodes
    for (let i = 1; i < nodeCount; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = Math.random() * radius * 0.8 + 0.5;
      
      const pos = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

      // Randomly assign quantum risk (vulnerable vs safe)
      const isVulnerable = Math.random() > 0.6;
      
      nodes.push({
        position: pos,
        color: isVulnerable ? "#EF4444" : "#10B981", // Red if vulnerable, Green if safe
        size: isVulnerable ? 0.12 : 0.08,
        type: isVulnerable ? "Vulnerable" : "Safe",
      });
    }

    // Generate edges (connections)
    const edges = [];
    for (let i = 0; i < nodeCount; i++) {
      // Connect to center sometimes
      if (i !== 0 && Math.random() > 0.4) {
        edges.push([nodes[i].position, nodes[0].position]);
      }
      
      // Connect to neighbors
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < 1.5) {
          edges.push([nodes[i].position, nodes[j].position]);
        }
      }
    }

    return { nodes, edges };
  }, []);

  return (
    <group ref={groupRef}>
      {/* Edges */}
      {edges.map((edge, i) => (
        <Line 
          key={`edge-${i}`}
          points={edge}
          color="rgba(255,255,255,0.15)"
          lineWidth={0.5}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <group key={`node-${i}`} position={node.position}>
          <Sphere args={[node.size, 16, 16]}>
            <meshStandardMaterial 
              color={node.color}
              emissive={node.color}
              emissiveIntensity={node.type === "Vulnerable" ? 1.5 : 0.5}
              roughness={0.2}
            />
          </Sphere>
          {/* Subtle pulse for vulnerable nodes */}
          {node.type === "Vulnerable" && (
            <Sphere args={[node.size * 1.5, 16, 16]}>
              <meshBasicMaterial color="#EF4444" transparent opacity={0.2} wireframe />
            </Sphere>
          )}
        </group>
      ))}

      {/* Floating Rings around the network (simulating scanner) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.3} />
      </mesh>
      
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />
    </group>
  );
}

export default function QuantumCore3D() {
  return (
    <div className="w-full h-[400px] lg:h-[450px] rounded-xl overflow-hidden relative" style={{ background: "rgba(11,17,32,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}>
      {/* Contextual Label */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="font-mono text-[10px] text-slate-400 tracking-widest uppercase">Live CBOM Network Analysis</span>
      </div>
      
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none font-mono text-[10px] text-slate-500 flex flex-col gap-1">
        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"/> Application Target</div>
        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"/> Quantum-Vulnerable Asset</div>
        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"/> PQC-Safe Asset</div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] to-transparent z-10 pointer-events-none" />
      <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
        <CBOMNetwork />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}
