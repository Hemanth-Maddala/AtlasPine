import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial, Text, RenderTexture, PerspectiveCamera } from "@react-three/drei"
import * as random from "maath/random/dist/maath-random.esm"

export default function App() {
  return (
    <div className="absolute inset-0" style={{ background: "var(--bg-base)" }}>
      {/* Mobile / Small screens */}
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-8 text-center md:hidden h-full">
        <h1 className="text-5xl font-bold text-white">ATLASPINE</h1>
        <p className="text-cyan-300 mb-4">All Your Need Is Here</p>
        <div className="flex flex-col items-center gap-1">
          <span className="text-slate-400">You Can Get Access To</span>
          <RotatingWordMobile />
        </div>
      </div>

      {/* Desktop / Medium+ screens */}
      <div className="hidden md:block absolute inset-0">
        <Canvas camera={{ position: [0, 0, 10] }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 2, 2]} intensity={2} />
          <Stars />
          <TextBackground />
          <RotatingSentence />
        </Canvas>
      </div>
    </div>
  )
}

function RotatingWordMobile() {
  const words = ["Notes", "Tasks", "Reminders", "PDF Q&A"]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return <span className="text-cyan-400 font-semibold text-xl">{words[index]}</span>
}

function Stars() {
  const ref = useRef()
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(6000), { radius: 13 })
  )

  useFrame((_, delta) => {
    ref.current.rotation.x -= delta / 15
    ref.current.rotation.y -= delta / 20
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#22d3ee"
          size={0.028}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  )
}

function TextBackground() {
  return (
    <Text fontSize={2} position={[-1, 3.5, 0]} anchorX="center" anchorY="middle">
      ATLASPINE
      <Text fontSize={0.8} position={[6, -1.5, 0]}>
        All Your Need Is Here
      </Text>
      <meshBasicMaterial toneMapped={false}>
        <RenderTexture attach="map">
          <color attach="background" args={["#67e8f9"]} />
          <PerspectiveCamera makeDefault manual aspect={1} position={[0, 0, 10]} />
          <ambientLight intensity={1} />
          <Stars />
        </RenderTexture>
      </meshBasicMaterial>
    </Text>
  )
}

function RotatingSentence() {
  const words = ["Notes", "Tasks", "Reminders", "PDF Q&A"]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <group>
      <Text fontSize={0.7} position={[-5.5, 0, 0]} color="white" anchorX="left" anchorY="middle">
        You Can Get Access To
      </Text>
      <Text fontSize={0.9} position={[2, 0, 0]} color="#22d3ee" anchorX="left" anchorY="middle">
        {words[index]}
      </Text>
    </group>
  )
}
