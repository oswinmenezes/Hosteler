import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
// 1. INITIALIZE GEMINI
// Replace with your actual API Key from Google AI Studio
const API_KEY = "AIzaSyB7931gK4qR5c7WojPBWtawTYPCUd82Wg8"; 
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const context = "ST JOSEPH ENGINEERING COLLEGE MANGALORE. ADDRESS: Vamanjoor, Mangaluru, Karnataka 575028. COLLEGE OFFICE: +91 824 2263753, 2263754, 2263755, 2263756. FAX: +91 824 2263751. ADMISSIONS: Mobile +91 9972932972, +91 9972695974, Office +91 824 2868155, 106. EMAIL: admissions@sjec.ac.in, office@sjec.ac.in. DIRECTOR: Rev Fr Wilfred Prakash DSouza, Tel +91 824 2263758, Email sjec@sjec.ac.in. ASST DIRECTOR: Rev Fr Kenneth Rayner Crasta, Tel +91 824 2263960. PRINCIPAL: Dr Rio DSouza, Tel +91 824 2263732, Email principal@sjec.ac.in. GENTS HOSTEL WARDEN: +91 824 2263955, gents.hostel@sjec.ac.in. LADIES HOSTEL WARDEN: +91 824 2263953, ladies.hostel@sjec.ac.in. RECRUITMENT: recruitment@sjec.ac.in. WEB SUPPORT: support@sjec.ac.in. CODES: CET E129, PGCET MBA B300, MCA C484.";

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
  You are Amphi, the official Campus Assistant for St Joseph Engineering College (SJEC), Mangaluru.
  
  CONTEXT DATA:
  ${context}

  STRICT SCOPE & KNOWLEDGE RULES:
  1. ONLY answer questions about SJEC (Admissions, Departments, Hostels, Campus life, Placements, etc.).
  2. PRIORITIZE THE CONTEXT DATA: Always look at the "CONTEXT DATA" section above to find specific names, phone numbers, and codes (E129, B300, C484).
  3. IF THE ANSWER IS NOT IN CONTEXT: Use your general knowledge about SJEC to answer. 
  4. IF STILL UNKNOWN: If you cannot find the answer in the provided context or your internal knowledge, politely direct the user to the official SJEC office at +91 824 2263753 or email office@sjec.ac.in.
  5. OUT-OF-SCOPE: If the user asks about unrelated topics (cooking, math, global news), respond ONLY with: "I am specialized only in SJEC campus queries. Please ask me something related to the college!"
  6. Be professional, encouraging, and clear.
`;

      // 3. CALL GEMINI
      const result = await model.generateContent(`${systemInstruction}\n\nStudent Query: ${text} use context if you dont have a answer${context}`);
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
            }}><ReactMarkdown>{msg.text}</ReactMarkdown>
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