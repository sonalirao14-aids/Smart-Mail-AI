import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [logs, setLogs] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // 🧠 CONTEXT MEMORY
  const [context, setContext] = useState({
    lastIntent: "",
    lastData: null
  });

  const chatEndRef = useRef(null);

  useEffect(() => {
    const data = [
      {
        email: "Let's meet tomorrow at 3 PM",
        intent: "Meeting",
        action: "📅 Calendar event created"
      },
      {
        email: "Submit report ASAP",
        intent: "Urgent",
        action: "💬 WhatsApp alert sent"
      },
      {
        email: "Finish UI design",
        intent: "Task",
        action: "📝 Task added"
      }
    ];
    setLogs(data);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  // 🎙️ VOICE
  const speakSummary = () => {
    const text = `You have ${logs.length} updates today including ${logs.map(l => l.intent).join(", ")}`;
    const utter = new SpeechSynthesisUtterance(text);

    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  const pauseSpeech = () => {
    speechSynthesis.pause();
    setIsPaused(true);
  };

  const resumeSpeech = () => {
    speechSynthesis.resume();
    setIsPaused(false);
  };

  const stopSpeech = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // 🧠 INTENT DETECTION
  const detectIntent = (text) => {
    if (/hi|hello|hey/.test(text)) return "greeting";
    if (/how are you|how's it going/.test(text)) return "smalltalk";

    if (/meeting|schedule/.test(text)) return "meeting";
    if (/urgent|asap/.test(text)) return "urgent";
    if (/task|todo|work/.test(text)) return "task";
    if (/summary|overview/.test(text)) return "summary";

    if (/what about that|that one|it/.test(text)) return "followup";

    if (/thank/.test(text)) return "thanks";

    return "unknown";
  };

  // 🤖 SMART RESPONSE ENGINE
  const generateResponse = (input) => {
    const text = input.toLowerCase();
    const intent = detectIntent(text);

    let response = "";

    // 💬 HUMAN
    if (intent === "greeting") {
      response = "🌙 Hey! I'm Luna. Ready to organize your day ✨";
    }

    else if (intent === "smalltalk") {
      response = "😊 I'm doing great! Staying productive with you. How are you?";
    }

    else if (intent === "thanks") {
      response = "💜 Always happy to help!";
    }

    // 📅 MEETINGS
    else if (intent === "meeting") {
      const meetings = logs.filter(l => l.intent === "Meeting");

      if (meetings.length === 0) {
        response = "📭 No meetings scheduled.";
      } else {
        response = `📅 You have ${meetings.length} meeting(s):\n` +
          meetings.map(m => `• ${m.email}`).join("\n");
      }

      setContext({ lastIntent: "meeting", lastData: meetings });
    }

    // 🚨 URGENT
    else if (intent === "urgent") {
      const urgent = logs.filter(l => l.intent === "Urgent");

      response = urgent.length
        ? `🚨 ${urgent.length} urgent email(s):\n` +
          urgent.map(u => `• ${u.email}`).join("\n")
        : "✨ No urgent emails.";

      setContext({ lastIntent: "urgent", lastData: urgent });
    }

    // 📝 TASKS
    else if (intent === "task") {
      const tasks = logs.filter(l => l.intent === "Task");

      response = tasks.length
        ? `📝 Your tasks:\n` +
          tasks.map(t => `• ${t.email}`).join("\n")
        : "🎉 No tasks pending!";

      setContext({ lastIntent: "task", lastData: tasks });
    }

    // 📊 SUMMARY
    else if (intent === "summary") {
      const summary = logs.reduce((acc, l) => {
        acc[l.intent] = (acc[l.intent] || 0) + 1;
        return acc;
      }, {});

      response =
        `🌙 Summary:\n` +
        Object.entries(summary)
          .map(([k, v]) => `• ${k}: ${v}`)
          .join("\n");

      setContext({ lastIntent: "summary", lastData: summary });
    }

    // 🔁 FOLLOW-UP
    else if (intent === "followup") {
      if (context.lastIntent && context.lastData) {
        response = `👉 Continuing from ${context.lastIntent}:\n`;

        if (Array.isArray(context.lastData)) {
          response += context.lastData.map(d => `• ${d.email}`).join("\n");
        } else {
          response += JSON.stringify(context.lastData, null, 2);
        }
      } else {
        response = "🤔 Can you clarify what you're referring to?";
      }
    }

    // 🤖 FALLBACK
    else {
      response = "🤖 I didn’t fully get that, but I can help with meetings, tasks, urgent emails, or summaries!";
    }

    return response;
  };

  // 💬 CHAT HANDLER
  const handleChat = (textInput) => {
    const text = textInput || chatInput;
    if (!text.trim()) return;

    setChatHistory((prev) => [...prev, { role: "user", text }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateResponse(text);
      setChatHistory((prev) => [...prev, { role: "bot", text: reply }]);
      setIsTyping(false);
    }, 800);
  };

  const suggestions = [
    "What meetings do I have?",
    "Any urgent emails?",
    "Summarize my week",
    "Show my tasks",
    "How are you?"
  ];

  return (
    <div className="layout">

      {/* LEFT */}
      <div className="left-panel">
        <h2>🌿 Upcoming</h2>

        {logs.map((item, i) => (
          <div key={i} className="reminder">
            <span className={`badge ${item.intent.toLowerCase()}`}>
              {item.intent}
            </span>
            <p>{item.action}</p>
          </div>
        ))}

        <div className="voice-box">
          <h3>🌙 Luna Summary</h3>
          <p>{logs.length} updates today</p>

          <div className="voice-controls">
            <button onClick={speakSummary}>▶</button>
            <button onClick={pauseSpeech}>⏸</button>
            <button onClick={resumeSpeech}>⏵</button>
            <button onClick={stopSpeech}>⏹</button>
          </div>

          {isSpeaking && <div className="voice-wave"></div>}
        </div>
      </div>

      {/* CENTER */}
      <div className="main">
        <h1 className="title">SmartMail AI</h1>

        <div className="card feed">
          <h3>📡 Live Feed</h3>
          {logs.map((item, i) => (
            <div key={i} className="feed-item">
              <p><strong>{item.email}</strong></p>
              <span>{item.action}</span>
            </div>
          ))}
        </div>

        <div className="card chatbox">
          <h3>🌙 Luna</h3>

          <div className="chat-history">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`chat-row ${msg.role}`}>
                <div className="chat-bubble">{msg.text}</div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-row bot">
                <div className="chat-bubble typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          <div className="suggestions">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => handleChat(s)}>
                {s}
              </button>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Luna..."
            />
            <button onClick={() => handleChat()}>➤</button>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="right-panel">
        <h3>📅 Today</h3>
        <p>{new Date().toDateString()}</p>

        <div className="calendar">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="day">{i + 1}</div>
          ))}
          <div className="koala">🐨🌿</div>
        </div>
      </div>

    </div>
  );
}

export default App;