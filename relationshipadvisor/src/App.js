import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ChattingWithGemini from "./AI";

function App() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Welcome back! 💖 I'm HeartSense. Ready for another heartfelt conversation?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async() => {
    if (input.trim() === "") return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev)=>[...prev, newMessage]);

    const data = await ChattingWithGemini(newMessage.text);

    if(data){
      setMessages((prev)=>[...prev, {sender : "bot" , text : data}]);
    }
    

    setInput("");
  };

  const handleClear=()=>{
    setMessages([
      {
        sender: "bot",
        text: "Welcome back! 💖 I'm HeartSense. Ready for another heartfelt conversation?",
      },
    ])
  }

  return (
    <div className="app-container d-flex justify-content-center align-items-center vh-100">
      <div className="chat-box shadow-lg">
        <div className="chat-header text-center">
          💖 <strong>HeartSense – Relationship Advisor</strong>
        </div>

        <div className="chat-body">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.sender === "user" ? "user-msg" : "bot-msg"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-footer d-flex align-items-center p-2">
          <input
            type="text"
            className="form-control rounded-pill me-2"
            placeholder="Share your thoughts..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="btn send-btn rounded-pill" onClick={handleSend}>
            Send ❤️
          </button>
          <button className="btn send-btn rounded-pill mx-2" onClick={handleClear}>
            clear {"\u{1F5D1}"} 

          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
