import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, Text } from '@react-three/drei'
import * as THREE from 'three'

// Simple articulated arm made of primitives
function Arm({ 
  shoulderAngle = 0, 
  elbowAngle = 0, 
  wristAngle = 0,
  fingerCurl = 0,
  isSigning = false 
}: { 
  shoulderAngle?: number
  elbowAngle?: number
  wristAngle?: number
  fingerCurl?: number
  isSigning?: boolean 
}) {
  const shoulderRef = useRef<THREE.Group>(null)
  const elbowRef = useRef<THREE.Group>(null)
  const wristRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (isSigning && shoulderRef.current) {
      // Subtle animation when signing
      shoulderRef.current.rotation.z = shoulderAngle + Math.sin(state.clock.elapsedTime * 2) * 0.1
      if (elbowRef.current) {
        elbowRef.current.rotation.z = elbowAngle + Math.cos(state.clock.elapsedTime * 2) * 0.05
      }
      if (wristRef.current) {
        wristRef.current.rotation.z = wristAngle + Math.sin(state.clock.elapsedTime * 3) * 0.08
      }
    }
  })

  return (
    <group>
      {/* Shoulder */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>

      <group ref={shoulderRef} position={[0, 1.5, 0]}>
        {/* Upper Arm */}
        <mesh position={[0, -0.35, 0]}>
          <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
          <meshStandardMaterial color="#6366f1" />
        </mesh>

        {/* Elbow */}
        <mesh position={[0, -0.75, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#4f46e5" />
        </mesh>

        <group ref={elbowRef} position={[0, -0.75, 0]}>
          {/* Forearm */}
          <mesh position={[0, -0.3, 0]}>
            <capsuleGeometry args={[0.07, 0.5, 8, 16]} />
            <meshStandardMaterial color="#6366f1" />
          </mesh>

          {/* Wrist */}
          <mesh position={[0, -0.6, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#4f46e5" />
          </mesh>

          <group ref={wristRef} position={[0, -0.6, 0]}>
            {/* Palm */}
            <mesh position={[0, -0.12, 0]}>
              <boxGeometry args={[0.12, 0.15, 0.08]} />
              <meshStandardMaterial color="#FDBA74" />
            </mesh>

            {/* Fingers */}
            {['index', 'middle', 'ring', 'pinky'].map((finger, i) => (
              <mesh 
                key={finger}
                position={[(i - 1.5) * 0.035, -0.22, 0]}
                rotation={[fingerCurl * Math.PI / 2, 0, 0]}
              >
                <capsuleGeometry args={[0.02, 0.15 - i * 0.01, 8, 8]} />
                <meshStandardMaterial color="#FDBA74" />
              </mesh>
            ))}

            {/* Thumb */}
            <mesh 
              position={[0.08, -0.15, 0.05]}
              rotation={[0, 0, -Math.PI / 4 + fingerCurl * Math.PI / 3]}
            >
              <capsuleGeometry args={[0.025, 0.12, 8, 8]} />
              <meshStandardMaterial color="#FDBA74" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
}

// Simple humanoid torso/head
function Body() {
  return (
    <group>
      {/* Head */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#FDBA74" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.9, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
        <meshStandardMaterial color="#FDBA74" />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.6, 0.8, 0.3]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>

      {/* Right arm (viewer's left) */}
      <Arm shoulderAngle={0.5} elbowAngle={-0.3} wristAngle={0.2} />

      {/* Left arm (viewer's right) - mirrored */}
      <group scale={[-1, 1, 1]}>
        <Arm shoulderAngle={-0.3} elbowAngle={-0.5} wristAngle={-0.1} />
      </group>
    </group>
  )
}

// Scene with lighting
function Scene({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (groupRef.current) {
      // Reset position when active changes
      groupRef.current.rotation.y = 0
    }
  }, [isActive])

  useFrame((state) => {
    if (groupRef.current && isActive) {
      // Gentle swaying when active
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.02
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      
      <Grid 
        args={[10, 10]} 
        position={[0, 0, 0]}
        cellColor="#e5e7eb"
        sectionColor="#d1d5db"
      />

      <group ref={groupRef}>
        <Body />
      </group>

      {!isActive && (
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.2}
          color="#6b7280"
          anchorX="center"
          anchorY="middle"
        >
          Avatar Standby
        </Text>
      )}
    </>
  )
}

interface AvatarViewerProps {
  isActive?: boolean
  translationData?: any
}

export default function AvatarViewer({ 
  isActive = false,
  translationData 
}: AvatarViewerProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 50 }}
        style={{ background: '#f3f4f6' }}
      >
        <Scene isActive={isActive} />
        <OrbitControls 
          enablePan={false}
          minDistance={2}
          maxDistance={6}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}