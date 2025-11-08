import { useState } from "react";
import "./App.css";

export default function App() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(
    "Welcome! Ask me any question about Data Structures or Algorithms."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "AIzaSyCoBogDH4HWvkm-qOClpnmKPTO8_q7DgLk"; // Replace with your Gemini API key
  const MODEL_NAME = "gemini-2.5-flash";
  const SYSTEM_PROMPT =
    "You are a Data Structures and Algorithms (DSA) Instructor Bot.Your role is to teach, explain, and guide users only in topics related to DSA, coding problems, and algorithmic thinking.Behavioral Rules:Only answer questions related to DSA, programming concepts, algorithms, or problem-solving.If a user asks a question unrelated to DSA (like about health, entertainment, news, etc.), politely reply:“I’m your DSA instructor and can only answer questions related to Data Structures and Algorithms. Please ask me a DSA-related question.” write code in java and only answer whate is being asked donot add extra things from your side just ask user if they want to know about other related parts. Always share time and space complexity. Explain concepts in simple, step-by-step language suitable for students.Always include code examples (preferably in Java, C++, or Python) when relevant.Be encouraging and educational, like a personal tutor.When asked for problem-solving help, give hints first, and then the complete solution if requested.Example Queries You Should Answer:“What is the difference between stack and queue?”“Explain merge sort with code.”“How to detect a cycle in a linked list?”“Write a code to find the maximum subarray sum.”Example Queries You Should Reject:“What is the weather today?”“Tell me a joke.”“What’s your name?”Your goal is to help the user master DSA by providing structured explanations, time complexity analysis, and clean sample code.";

  const handleAsk = async () => {
    if (!question.trim()) {
      setError("Please enter your question first!");
      return;
    }

    setError("");
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch( 
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: question }] }],
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "API Error");

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from instructor.";

      const formatted = text
        .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
        .replace(/`([^`]+)`/g, "<code>$1</code>");

      setResponse(formatted);
    } catch (err) {
      setResponse(`<div class="error"><i class="fas fa-bug"></i> ${err.message}</div>`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuestion("");
    setResponse("Welcome! Ask me any question about Data Structures or Algorithms.");
    setError("");
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">DSA Instructor</div>
        <div className="menu-item active">
          <i className="fas fa-home"></i> Dashboard
        </div>
        <div className="menu-item">
          <i className="fas fa-book"></i> Learn Topics
        </div>
        <div className="menu-item">
          <i className="fas fa-code"></i> Practice
        </div>
        <div className="menu-item">
          <i className="fas fa-cog"></i> Settings
        </div>
      </aside>

      {/* Main Area */}
      <main className="main">
        <header className="header">
          <h1>Master Data Structures & Algorithms</h1>
          <button className="btn" onClick={handleReset}>
            Reset
          </button>
        </header>

        <div className="card">
          <h2>
            <i className="fas fa-graduation-cap"></i> Instructor’s Response
          </h2>
          <div
            className="output"
            dangerouslySetInnerHTML={{ __html: response }}
          ></div>
        </div>
        
        <div className="card">
          <h2>
            <i className="fas fa-question-circle"></i> Ask Your DSA Question
          </h2>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., Explain Dijkstra’s Algorithm or How to implement a binary search tree?"
          />
          {error && <div className="error">{error}</div>}
          <button className="btn ask-btn" onClick={handleAsk} disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Thinking...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i> Ask Instructor
              </>
            )}
          </button>
        </div>

        
      </main>
    </div>
  );
}
