import { useState, useEffect } from 'react'
import './App.css'
import Layout from './components/Layout'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Notes from './components/Notes'
import Tasks from './components/Tasks'
import Reminders from './components/Reminders'
import PdfQA from './components/PdfQA'
import MedicalChatBot from './components/MedicalChatbot'
import VideoSummary from './components/VideoSummary'

function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')

  // Check for existing user on app load
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  // Handle login
  const handleLogin = (userData) => {
    setUser(userData)
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setCurrentPage('home')
  }

  // Handle page changes
  const handlePageChange = (pageId) => {
    setCurrentPage(pageId)
  }

  // Render the current page content
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onPageChange={handlePageChange} />
      case 'login':
        return <Login onPageChange={handlePageChange} onLogin={handleLogin} />
      case 'register':
        return <Register onPageChange={handlePageChange} onLogin={handleLogin} />
      case 'notes':
        return user ? <Notes /> : <Login onPageChange={handlePageChange} onLogin={handleLogin} />
      case 'tasks':
        return user ? <Tasks /> : <Login onPageChange={handlePageChange} onLogin={handleLogin} />
      case 'reminders':
        return user ? <Reminders /> : <Login onPageChange={handlePageChange} onLogin={handleLogin} />
      case 'pdf-qa':
        return user ? <PdfQA /> : <Login onPageChange={handlePageChange} onLogin={handleLogin} />
      case 'medical-chatbot':
        return user ? <MedicalChatBot /> : <Login onPageChange={handlePageChange} onLogin={handleLogin} />
      case 'video-summary':
        return user ? <VideoSummary /> : <Login onPageChange={handlePageChange} onLogin={handleLogin} />
      default:
        return <Home />
    }
  }

  return (
    <Layout currentPage={currentPage} onPageChange={handlePageChange} user={user} onLogout={handleLogout}>
      {renderCurrentPage()}
    </Layout>
  )
}

// Feature components moved to components/*.jsx

export default App
