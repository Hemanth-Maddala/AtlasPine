import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MedicalChatbot() {
  const token = localStorage.getItem('token');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your medical assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    if(inputMessage.length <= 0 ){
      toast.info("Meditating daily a minute can reduce stress and improve focus! and u can start it from now 😉.",
        {
          autoClose: false, 
          closeOnClick: true,
          pauseOnHover: true,
        }
      );
    }

    try {
      const response = await fetch(`${API}/api/medical`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage.text })
      });

      const data = await response.json();
      console.log('Medical bot response:', data);
      const botMessage = {
        id: messages.length + 2,
        text: data.answer || "Sorry, I couldn’t get a response.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "⚠️ Error connecting to medical AI service.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="p-6 md:p-10 h-full">
      <div className="max-w-4xl mx-auto bg-slate-800/90 rounded-xl shadow-lg h-full min-h-0 flex flex-col p-4 sm:p-6">
        {/* Header */}
        <div className="bg-cyan-800 p-4 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">🩺</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white" style={{textShadow: "2px 3px 4px #000"}}>Medical Assistant</h2>
              <p className="text-blue-100 text-sm">Ask me anything about your health</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-700 text-slate-200'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-700 text-slate-200 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="border-t border-slate-700 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about symptoms, medications, or general health questions..."
              className="flex-1 px-4 py-2 bg-slate-900 text-slate-200 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-slate-700 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setInputMessage("What are the symptoms of fever?")}
              className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm hover:bg-slate-600 transition-colors"
            >
              Fever symptoms
            </button>
            <button
              onClick={() => setInputMessage("Medicine or tablet for headache?")}
              className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm hover:bg-slate-600 transition-colors"
            >
              Headache Medicine
            </button>
            <button
              onClick={() => setInputMessage("What should I do for a cold?")}
              className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm hover:bg-slate-600 transition-colors"
            >
              Cold remedies
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
