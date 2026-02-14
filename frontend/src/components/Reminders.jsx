import * as React from 'react'
import Button from './ui/Button'
import { toast } from 'react-toastify'
import reminders from '../assets/3d-alarm.png'

export default function Reminders() {
  const [items, setItems] = React.useState([])
  const [title, setTitle] = React.useState('')
  const [note, setNote] = React.useState('')
  const [remindAt, setRemindAt] = React.useState('')
  const [now, setNow] = React.useState(Date.now())

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const token = localStorage.getItem('token')

  React.useEffect(() => {
    if (!token) return
    fetch(`${API}/api/reminders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setItems)
      .catch(() => toast.error('Failed to load reminders'))
  }, [token])

  async function add() {
    if (!token) return
    try {
      const response = await fetch(`${API}/api/reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, note, remindAt })
      })
      const created = await response.json()
      setItems([created, ...items])
      setTitle('')
      setNote('')
      setRemindAt('')
      toast.success('Reminder added')
    } catch {
      toast.error('Failed to add reminder')
    }
  }

  async function remove(id) {
    if (!token) return
    try {
      await fetch(`${API}/api/reminders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setItems(items.filter(i => i._id !== id))
      toast.success('Reminder deleted')
    } catch {
      toast.error('Failed to delete reminder')
    }
  }
  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="rounded-xl shadow-xl border border-slate-700 bg-slate-800/90 p-4 sm:p-6 lg:p-8 h-full overflow-auto">
        <div className='flex flex-row items-center gap-1'>
          <img className='h-8' src={reminders} />
          <div className='text-cyan-600 font-bold text-2xl' style={{ textShadow: "2px 3px 4px #000" }}>ADD YOUR REMINDERS</div>
        </div>
        <div className="flex flex-col mt-4 sm:flex-row gap-2 sm:items-center mb-3 flex-wrap">
          <input
            className="flex-1 min-w-0 rounded-lg px-4 py-2.5 bg-slate-900 text-slate-200 placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Reminder title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            className="flex-1 min-w-0 rounded-lg px-4 py-2.5 bg-slate-900 text-slate-200 placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Note (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          <input
            className="rounded-lg px-4 py-2.5 bg-slate-900 text-slate-200 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full sm:w-auto"
            type="datetime-local"
            value={remindAt}
            onChange={e => setRemindAt(e.target.value)}
          />
          <Button onClick={add} className="w-full sm:w-auto">Add</Button>
        </div>
        <ul className="space-y-2">
          <div className='text-white font-bold text-xl' style={{ textShadow: "2px 3px 4px #000" }}>REMINDERS</div>

          {items.map(r => (
            <li
              key={r._id}
              className={`p-3 rounded-md flex items-start justify-between hover:brightness-110 transition border-2 ${new Date(r.remindAt).getTime() < now
                ? "border-green-400"
                : "border-yellow-400"
                }`}

            >
              <div>
                <div className="font-medium text-white">{r.title}</div>
                {r.note && (
                  <div className="text-sm text-slate-300 mb-1">{r.note}</div>
                )}
                <div className="text-xs text-slate-400">{new Date(r.remindAt).toLocaleString()}</div>
              </div>
              <button
                type="button"
                className="px-3 py-2 rounded-md border border-red-500 text-red-400 hover:bg-red-500/10 transition"
                onClick={() => remove(r._id)}
              >
                Delete
              </button>
            </li>
          ))}
          {items.length === 0 && (
            <li className="text-sm text-slate-400">No reminders yet.</li>
          )}
        </ul>
      </div>
    </div>
  )
}


