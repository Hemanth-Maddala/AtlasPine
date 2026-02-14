import { useState, useRef, useEffect } from 'react'
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Button from './ui/Button'
import video from '../assets/video-chat.png'

export default function VideoSummary() {
  const [videoUrl, setVideoUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const summaryRef = useRef(null)
  const token = localStorage.getItem('token');

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSummarize = async () => {
    if (!videoUrl.trim()) {
      toast.warning('Please paste a valid video URL to summarize.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return
    }

    setIsLoading(true)
    setSummary('')

    toast.info('🎬 Analyzing video content...', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })

    try {
      const response = await fetch(`${API}/api/summarize_video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ url: videoUrl })
      });

      const data = await response.json();

      if (data.summary) {
        setSummary(data.summary)
        toast.success('✅ Video summary generated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        setSummary('Sorry, no summary available for this video.')
        toast.warning('⚠️ No summary could be generated for this video.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }

    } catch (error) {
      console.error('Error summarizing video:', error)
      setSummary('The URL provided is not valid or the service is unavailable. Please check and try again.')
      toast.error('❌ Failed to summarize video. Please check the URL and try again.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setVideoUrl('')
    setSummary('')
    toast.info('🧹 Cleared all content', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  // Auto-scroll to summary when it's generated
  useEffect(() => {
    if (summary && summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [summary])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <div className='flex flex-row items-center gap-2'>
          <img className='h-8' src={video} />
          <div className='text-cyan-600 font-bold text-2xl' style={{ textShadow: "2px 3px 4px #000" }}>ADD YOUR REMINDERS</div>
        </div>
        <div className="h-1 w-28 bg-gradient-to-r from-cyan-600 to-sky-600 rounded-full" />
        <p className="text-slate-400">
          Paste a video URL below. We will generate a concise summary...
        </p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-sky-300">Video URL</label>
        <input
          type="url"
          placeholder="https://..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        <div className="flex gap-3">
          <Button
            onClick={handleSummarize}
            disabled={isLoading}
            className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {isLoading ? 'Analyzing...' : 'Summarize'}
          </Button>
          <button
            onClick={handleClear}
            disabled={isLoading}
            className={`px-5 py-2 rounded-lg text-slate-200 border border-slate-600 hover:bg-slate-800 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-2" ref={summaryRef}>
        <label className="block text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">Summary</label>
        <div className="min-h-40 max-h-96 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-200 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex flex-col items-center space-y-3">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-slate-400 text-sm">Analyzing video content...</p>
              </div>
            </div>
          ) : summary ? (
            <p className="whitespace-pre-wrap leading-7">{summary}</p>
          ) : (
            <p className="text-slate-500">The summary will appear here.</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}


