import { useState } from "react"
import Button from "./ui/Button"
import { toast } from "react-toastify"

export default function Register({ onPageChange, onLogin }) {
  const [loading, setLoading] = useState(false)
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  async function onSubmit(e) {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    const form = new FormData(e.currentTarget)

    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          password: form.get("password"),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Registration failed")
      }

      const data = await response.json()
      localStorage.setItem("token", data.token)
      localStorage.setItem(
        "user",
        JSON.stringify({ id: data.id, name: data.name, email: data.email })
      )

      toast.success("Account created")
      onLogin(data)
      onPageChange("notes")
    } catch (err) {
      console.error(err)
      toast.error(err?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full min-h-0 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl shadow-xl border border-slate-700 bg-slate-800/90 p-5 sm:p-6 lg:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ textShadow: "2px 3px 4px #000" }}>
            Create your account
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed">
            Get started with notes, tasks, and reminders — built for speed and clarity.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <input
              className="w-full rounded-lg px-4 py-2.5 bg-slate-900 text-slate-200 placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              name="name"
              placeholder="Name"
              required
              disabled={loading}
            />
            <input
              className="w-full rounded-lg px-4 py-2.5 bg-slate-900 text-slate-200 placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              name="email"
              type="email"
              placeholder="Email"
              required
              disabled={loading}
            />
            <input
              className="w-full rounded-lg px-4 py-2.5 bg-slate-900 text-slate-200 placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              name="password"
              type="password"
              placeholder="Password"
              required
              disabled={loading}
            />

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Register"}
              </Button>

              <button
                type="button"
                className="text-cyan-400 hover:text-cyan-300 underline text-sm"
                onClick={() => onPageChange("login")}
                disabled={loading}
              >
                Have an account? Login
              </button>
            </div>
          </form>

          <div className="mt-6 text-sm text-slate-400">
            <p>
              Pro tip: Capture your ideas as notes, then convert them into actionable tasks with due dates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
