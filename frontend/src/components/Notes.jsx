import * as React from 'react'
import Button from './ui/Button'
import NoteCard from './ui/NoteCard'
import { toast } from 'react-toastify'
import { Shadow } from '@react-three/drei'
import notes from '../assets/notes.png'

export default function Notes() {
  const [items, setItems] = React.useState([])
  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')
  const [editingId, setEditingId] = React.useState('')
  const [editTitle, setEditTitle] = React.useState('')
  const [editContent, setEditContent] = React.useState('')
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  const token = localStorage.getItem('token')
  
  React.useEffect(() => {
    if (!token) return
    fetch(`${API}/api/notes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(setItems)
    .catch(() => toast.error('Failed to load notes'))
  }, [token])
  
  async function add() {
    if (!token) return
    try {
      const response = await fetch(`${API}/api/notes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      })
      const created = await response.json()
      setItems([created, ...items])
      setTitle('')
      setContent('')
      toast.success('Note added')
    } catch {
      toast.error('Failed to add note')
    }
  }
  
  async function remove(id) {
    if (!token) return
    try {
      await fetch(`${API}/api/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setItems(items.filter(i => i._id !== id))
      toast.success('Note deleted')
    } catch {
      toast.error('Failed to delete note')
    }
  }
  
  async function saveEdit() {
    if (!token) return
    try {
      const response = await fetch(`${API}/api/notes/${editingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: editTitle, content: editContent })
      })
      const updated = await response.json()
      setItems(items.map(i => i._id === editingId ? updated : i))
      setEditingId('')
      setEditTitle('')
      setEditContent('')
      toast.success('Note updated')
    } catch {
      toast.error('Failed to update note')
    }
  }
  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="rounded-xl gap-4 shadow-xl border border-slate-700 bg-slate-800/90 p-4 sm:p-6 lg:p-8 h-full overflow-auto flex flex-col">
        <div className='flex flex-row items-center gap-1'>
          <img className='h-8' src={notes} />
          <div className='text-cyan-600 font-bold text-2xl' style={{ textShadow: "2px 3px 4px #000" }}>ADD YOUR NOTES</div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-3 flex-shrink-0">
          <input className="flex-1 min-w-0 rounded-lg px-4 py-2.5 bg-slate-900 text-slate-200 placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <Button onClick={add} className="sm:w-auto w-full">Add</Button>
        </div>
        <textarea className="w-full rounded-lg px-4 py-2.5 bg-slate-900 text-slate-200 placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-3 flex-shrink-0" placeholder="Content" rows={5} value={content} onChange={e=>setContent(e.target.value)} />
        <ul className="space-y-3 flex-1 min-h-0">
          <div className='text-white font-bold text-xl' style={{ textShadow: "2px 3px 4px #000" }}>YOUR NOTES</div>
          {items.map(n=>(
            <li key={n._id}>
              <div className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-lg hover:shadow-lg transition">
                {editingId === n._id ? (
                  <div>
                    <input className="w-full rounded-lg px-4 py-2 bg-slate-900 text-slate-200 placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" value={editTitle} onChange={e=>setEditTitle(e.target.value)} placeholder="Title" />
                    <textarea className="mt-2 w-full rounded-lg px-4 py-2 bg-slate-900 text-slate-200 placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" rows={4} value={editContent} onChange={e=>setEditContent(e.target.value)} placeholder="Content" />
                    <div className="mt-3 flex flex-wrap items-center gap-2 justify-end">
                      <button type="button" className="px-4 py-2 rounded-lg text-white bg-cyan-600 hover:bg-cyan-500 transition font-semibold" onClick={saveEdit}>Save</button>
                      <button type="button" className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-700 transition" onClick={()=>{ setEditingId(''); setEditTitle(''); setEditContent('') }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between min-w-0">
                      <h3 className="text-cyan-400 font-semibold truncate pr-2">{n.title}</h3>
                    </div>
                    <p className="mt-2 text-slate-300 break-words">{n.content}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 justify-end">
                      <button type="button" className="px-3 py-2 rounded-md border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 transition" onClick={()=>{ setEditingId(n._id); setEditTitle(n.title); setEditContent(n.content || '') }}>Edit</button>
                      <button type="button" className="px-3 py-2 rounded-md border border-red-500 text-red-400 hover:bg-red-500/10 transition" onClick={()=>remove(n._id)}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="text-sm text-slate-400">No notes yet.</li>
          )}
        </ul>
      </div>
    </div>
  )
}


