import { useRef } from 'react'
import { Shield, Target, Zap, Radio, Camera, Key, Lock, Map } from "lucide-react"
import { useFrame } from '@react-three/fiber'
import { Box, Sphere, Torus, Cone, Cylinder, Text } from '@react-three/drei'

export type MemoryItemType =
  | 'shield'
  | 'target'
  | 'lightning'
  | 'radio'
  | 'camera'
  | 'key'
  | 'lock'
  | 'map'

export const MemoryItem = ({ type, position }: { type: MemoryItemType, position: [number, number, number] }) => {
  const ref = useRef<any>()

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta
    }
  })

  switch (type) {
    case 'shield':
      return (
        <Sphere ref={ref} position={position} args={[0.6, 32, 32]} castShadow>
          <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
        </Sphere>
      )
    case 'target':
      return (
        <Torus ref={ref} position={position} args={[0.5, 0.15, 16, 32]} castShadow>
          <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
        </Torus>
      )
    case 'lightning':
      return (
        <Cone ref={ref} position={position} args={[0.5, 1.2, 4]} castShadow>
          <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
        </Cone>
      )
    case 'radio':
      return (
        <Box ref={ref} position={position} args={[0.8, 0.8, 0.8]} castShadow>
          <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
        </Box>
      )
    case 'camera':
      return (
        <Cylinder ref={ref} position={position} args={[0.5, 0.5, 0.9, 32]} castShadow>
          <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
        </Cylinder>
      )
    case 'key':
      return (
        <Box ref={ref} position={position} args={[0.9, 0.3, 0.3]} castShadow>
          <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
        </Box>
      )
    case 'lock':
      return (
        <Cylinder ref={ref} position={position} args={[0.5, 0.5, 0.6, 8]} castShadow>
          <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
        </Cylinder>
      )
    case 'map':
      return (
        <Box ref={ref} position={position} args={[0.9, 0.6, 0.15]} castShadow>
          <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
        </Box>
      )
  }
}