import React from 'react'

export default function Button({ className = '', children, ...props }) {
  return (
    <button
      className={`px-5 py-2 rounded-lg text-white bg-cyan-600 hover:bg-cyan-500 transition-all duration-200 hover:-translate-y-0.5 font-semibold uppercase tracking-wide btn-glow ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
