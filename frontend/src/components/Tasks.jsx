import * as React from 'react'
import Button from './ui/Button'
import { toast } from 'react-toastify'
import tasks from '../assets/task.png'

export default function Tasks() {
  const [items, setItems] = React.useState([])
  const [title, setTitle] = React.useState('')
  const [status, setStatus] = React.useState('todo')

  const token = localStorage.getItem('token')
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  React.useEffect(() => {
    if (!token) return
    fetch(`${API}/api/tasks`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setItems)
      .catch(() => toast.error('Failed to load tasks'))
  }, [token])

  async function add() {
    if (!token) return
    try {
      const response = await fetch(`${API}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, status })
      })
      const created = await response.json()
      setItems([created, ...items])
      setTitle('')
      setStatus('todo')
      toast.success('Task added')
    } catch {
      toast.error('Failed to add task')
    }
  }

  async function remove(id) {
    if (!token) return
    try {
      await fetch(`${API}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setItems(items.filter(i => i._id !== id))
      toast.success('Task deleted')
    } catch {
      toast.error('Failed to delete task')
    }
  }

  async function updateStatus(id, newStatus) {
    if (!token) return
    try {
      const response = await fetch(`${API}/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      const updated = await response.json()
      setItems(items.map(i => i._id === id ? updated : i))
      toast.success('Task updated')
    } catch {
      toast.error('Failed to update task')
    }
  }
  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="rounded-xl shadow-xl border border-slate-700 bg-slate-800/90 p-4 sm:p-6 lg:p-8 h-full overflow-auto">
        <div className='flex flex-row items-center gap-1'>
          <img className='h-8' src={tasks} />
          <div className='text-cyan-600 font-bold text-2xl' style={{ textShadow: "2px 3px 4px #000" }}>ADD YOUR TASKS</div>
        </div>
        <div className="flex flex-col mt-4 sm:flex-row gap-2 sm:items-center mb-3 flex-wrap">
          <input className="flex-1 min-w-0 rounded-lg px-4 py-2.5 bg-slate-900 text-slate-200 placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} />
          <select className="rounded-lg px-4 py-2.5 bg-slate-900 text-slate-200 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:w-auto w-full" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
          <Button onClick={add} className="sm:w-auto w-full">Add</Button>
        </div>
        <ul className="space-y-2">
          <div className='text-white font-bold text-xl' style={{ textShadow: "2px 3px 4px #000" }}>YOUR TASKS</div>
          {items.map(t => (
            <li key={t._id} className="p-4 border border-slate-700 rounded-lg flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between hover:bg-slate-800/80 transition">
              <div className="flex items-start gap-3 min-w-0">
                <span className={`mt-1 inline-block h-3 w-3 rounded-full flex-shrink-0 ${t.status === 'todo' ? 'bg-amber-400' : t.status === 'in_progress' ? 'bg-blue-400' : 'bg-green-400'}`}></span>
                <div className="min-w-0">
                  <div className="font-medium text-white break-words">{t.title}</div>
                  <div className="text-xs text-slate-400">{t.status}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <select className="rounded-md px-3 py-2 bg-slate-900 text-slate-200 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  value={t.status}
                  onChange={e => updateStatus(t._id, e.target.value)}
                >
                  <option value="todo">To do</option>
                  <option value="in_progress">In progress</option>
                  <option value="done">Done</option>
                </select>
                <button type="button" className="px-3 py-2 rounded-md border border-red-500 text-red-400 hover:bg-red-500/10 transition text-sm" onClick={() => remove(t._id)}>Delete</button>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="text-sm text-slate-400">No tasks yet.</li>
          )}
        </ul>
      </div>
    </div>
  )
}


