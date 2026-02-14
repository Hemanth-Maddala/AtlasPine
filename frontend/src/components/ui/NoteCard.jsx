import React from 'react'

export default function NoteCard({ title, content, className = '', children }) {
  return (
    <div className={`backdrop-blur-xl bg-white/30 border border-white/20 shadow-lg rounded-2xl p-6 md:p-8 mb-6 transition-transform hover:scale-[1.01] hover:shadow-xl ${className}`}>
      {title && <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-cyan-500 to-sky-500 bg-clip-text text-transparent mb-3">{title}</h2>}
      {content && <p className="text-gray-700 md:text-base text-sm">{content}</p>}
      {children}
    </div>
  )
}
