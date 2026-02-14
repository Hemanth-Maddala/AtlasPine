import home from '../assets/mansion.png'
import notes from '../assets/notes.png'
import tasks from '../assets/task.png'
import reminders from '../assets/3d-alarm.png'
import pdf from '../assets/document.png'
import medical from '../assets/stethoscope.png'
import video from '../assets/video-chat.png'
import heading from '../assets/header.jpg'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Decal, useTexture, Text } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'

/* ------------------- Heading ------------------- */
const Heading = () => {
  return (
    <Float
      speed={4}
      rotationIntensity={0}
      floatIntensity={4}
      position={[0, 0, 0]}
    >
      <Text
        fontSize={4}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
      >
        AtlasPine
      </Text>
    </Float>
  )
}

/* ------------------- Ball Icon ------------------- */
function BallIcon({ image, size }) {
  const texture = useTexture(image)

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={4}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 0, 2]} />
      <mesh castShadow receiveShadow scale={size}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#67e8f9"
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal position={[0, 0, 1]} rotation={[0, Math.PI, 0]} map={texture} />
      </mesh>
    </Float>
  )
}

/* ------------------- Sidebar ------------------- */
export default function Sidebar({ currentPage, onPageChange, isOpen, onToggle, user, onLogout }) {
  const navigationItems = [
    { id: 'home', label: 'My Productivity', icon: home },
    { id: 'notes', label: 'Notes', icon: notes },
    { id: 'tasks', label: 'Tasks', icon: tasks },
    { id: 'reminders', label: 'Reminders', icon: reminders },
    { id: 'pdf-qa', label: 'PDF Q&A', icon: pdf },
    { id: 'medical-chatbot', label: 'Medical Chatbot', icon: medical },
    { id: 'video-summary', label: 'Video Summary', icon: video },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0
          border-r transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col shadow-xl lg:shadow-none
        `}
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-3">
            {navigationItems.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 flex-shrink-0">
                  <Canvas camera={{ position: [0, 0, 3] }}>
                    <BallIcon image={item.icon} size={1.4} />
                    <OrbitControls enableZoom={false} enablePan={false} />
                  </Canvas>
                </div>
                <button
                  onClick={() => {
                    onPageChange(item.id)
                    onToggle() // close sidebar on mobile
                  }}
                  className={`
                    flex-1 min-w-0 px-3 py-2 rounded-lg text-left text-sm transition truncate
                    ${currentPage === item.id
                      ? 'bg-cyan-600 text-white shadow-[0_0_16px_rgba(6,182,212,0.4)]'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-cyan-200'
                    }
                  `}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User / Auth */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => onPageChange('login')}
                className={`w-full px-3 py-2 border border-slate-600 text-slate-300 rounded-lg ${currentPage === 'login'
                    ? 'bg-cyan-600 text-white shadow-[0_0_16px_rgba(6,182,212,0.4)]'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-cyan-200'
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => onPageChange('register')}
                className={`w-full px-3 py-2 border border-slate-600 text-slate-300 rounded-lg ${currentPage === 'register'
                    ? 'bg-cyan-600 text-white shadow-[0_0_16px_rgba(6,182,212,0.4)]'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-cyan-200'
                  }`}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
