import { useState } from "react"
import Button from "./ui/Button"
import { toast } from "react-toastify"

export default function Login({ onPageChange, onLogin }) {
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    const form = new FormData(e.currentTarget)

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Login failed")
      }

      const data = await response.json()
      localStorage.setItem("token", data.token)
      localStorage.setItem(
        "user",
        JSON.stringify({ id: data.id, name: data.name, email: data.email })
      )

      toast.success("Logged in successfully")
      onLogin(data)
      onPageChange("notes")
    } catch (err) {
      console.error(err)
      toast.error(err?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full min-h-0 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl shadow-xl border border-slate-700 bg-slate-800/90 p-5 sm:p-6 lg:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ textShadow: "2px 3px 4px #000" }}>
            Welcome back
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed">
            Sign in to capture ideas, plan tasks, and never miss a reminder.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
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
                {loading ? "Logging in..." : "Login"}
              </Button>

              <button
                type="button"
                className="text-cyan-400 hover:text-cyan-300 underline text-sm"
                onClick={() => onPageChange("register")}
                disabled={loading}
              >
                Create an account
              </button>
            </div>
          </form>

          <div className="mt-6 text-sm text-slate-400">
            <p>
              Tips: Use notes to draft thoughts, tasks to track progress, and
              reminders to stay on time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
