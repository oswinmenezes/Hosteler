import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. INITIALIZE GEMINI
// Replace with your actual API Key from Google AI Studio
const API_KEY = "AIzaSyAwhf7Jf-QOT_weo5Z8n7z6grV5I72QPb0"; 
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export default function StudentChatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your SJEC Campus Assistant. Ask me anything about our college in Mangaluru!", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom whenever a new message arrives
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add User Message to UI
    const userMessage = { id: Date.now(), text: text, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // 2. STRICT SYSTEM PROMPT (Guardrails)
      const systemInstruction = `
        You are the official Campus Assistant for St Joseph Engineering College (SJEC), Mangaluru.
        IDENTITY:
        - Your name is Amphi
        - You are located in Vamanjoor, Mangaluru.
        
        STRICT SCOPE RULES:
        1. ONLY answer questions about SJEC (Admissions, Departments, Hostels, Campus life, Placements, Mangaluru location).
        2. If the user asks about anything UNRELATED to the college (e.g., general science, global history, cooking, celebrities, or random math), 
           respond ONLY with: "I am specialized only in SJEC campus queries. Please ask me something related to the college!"
        3. Do not provide code or solve homework unless it's specifically about an SJEC course or lab.
        4. Be professional and encouraging to students.
      `;

      // 3. CALL GEMINI
      const result = await model.generateContent(`${systemInstruction}\n\nStudent Query: ${text}`);
      const response = result.response;
      const botText = response.text();

      // Add Bot Response to UI
      const botResponse = {
        id: Date.now() + 1,
        text: botText,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botResponse]);

    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages((prev) => [...prev, { 
        id: Date.now() + 1, 
        text: "I'm having a connection issue . Please try again later.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="view-container" style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      <h2 className="section-title">Campus Chatbot</h2>

      <div style={{ 
        flex: 1, 
        background: '#ffffff', 
        borderRadius: '12px', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}>
        
        {/* Messages List Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              background: msg.sender === 'user' ? '#2563eb' : '#f1f5f9',
              color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
              padding: '10px 16px',
              borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
              maxWidth: '80%',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div style={{ alignSelf: 'flex-start', color: '#64748b', fontSize: '12px', marginLeft: '5px', fontStyle: 'italic' }}>
              Amphi is typing...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Bottom Input Area */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} 
          style={{ 
            padding: '20px', 
            borderTop: '1px solid #e2e8f0', 
            display: 'flex', 
            gap: '15px', 
            background: '#fff',
            alignItems: 'center'
          }}
        >
          <div style={{ flex: 8 }}>
            <input 
              type="text" 
              className="search-box"
              style={{ width: '100%', margin: 0, padding: '12px' }} 
              placeholder="Ask about SJEC Mangaluru..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
            />
          </div>

          <div style={{ flex: 2 }}>
            <button 
              type="submit" 
              className="btn-primary btn-full" 
              style={{ margin: 0, whiteSpace: 'nowrap' }}
              disabled={isTyping || !inputValue.trim()}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}