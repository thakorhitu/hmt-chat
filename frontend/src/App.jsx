import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://hmt-chat-backend.onrender.com");

function App() {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  // Receive messages
  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Join room
  const joinRoom = () => {
    if (!username.trim() || !roomCode.trim()) {
      alert("Please enter your name and room code");
      return;
    }

    socket.emit("join-room", roomCode.trim().toUpperCase());

    setRoomCode(roomCode.trim().toUpperCase());
    setJoined(true);
  };

  // Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      username,
      message: message.trim(),
      roomCode,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("send-message", messageData);

    setMessage("");
  };

  // Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Join screen
  if (!joined) {
    return (
      <div className="min-h-screen bg-[#080b12] flex items-center justify-center px-4 relative overflow-hidden">

        {/* Background glow */}
        <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -bottom-20 -right-20"></div>

        <div className="relative w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20">
              💬
            </div>

            <h1 className="text-4xl font-bold text-white tracking-tight">
              HMT Chat
            </h1>

            <p className="text-gray-500 mt-2">
              Private. Simple. Real-time.
            </p>
          </div>

          {/* Card */}
          <div className="bg-[#11151f]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-2xl">

            {/* Name */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Name
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3.5 rounded-xl bg-[#0b0f17] border border-white/10 text-white placeholder-gray-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
              />
            </div>

            {/* Room */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room Code
              </label>

              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Example: HMT123"
                className="w-full px-4 py-3.5 rounded-xl bg-[#0b0f17] border border-white/10 text-white placeholder-gray-600 uppercase outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
              />
            </div>

            {/* Button */}
            <button
              onClick={joinRoom}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              Join Chat
              <span className="ml-2">→</span>
            </button>

          </div>

          <p className="text-center text-xs text-gray-600 mt-5">
            Your messages are shared only with users in the same room.
          </p>

        </div>
      </div>
    );
  }

  // Chat screen
  return (
    <div className="min-h-screen bg-[#080b12] text-white flex justify-center">

      <div className="w-full max-w-5xl h-screen flex flex-col bg-[#0b0f17] shadow-2xl">

        {/* Header */}
        <header className="h-[72px] shrink-0 border-b border-white/10 bg-[#10141d] px-5 md:px-7 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl">
              💬
            </div>

            <div>
              <h1 className="font-bold text-lg">
                HMT Chat
              </h1>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Room:</span>

                <span className="text-gray-300 font-medium">
                  {roomCode}
                </span>
              </div>
            </div>

          </div>

          {/* Online */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>

            <span className="text-xs font-medium text-green-400">
              Online
            </span>
          </div>

        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-4 md:px-7 py-6">

          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">

              <div className="text-center">

                <div className="w-20 h-20 mx-auto rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl mb-5">
                  💬
                </div>

                <h2 className="text-lg font-semibold text-gray-300">
                  No messages yet
                </h2>

                <p className="text-sm text-gray-600 mt-2">
                  Start the conversation!
                </p>

              </div>

            </div>
          ) : (
            <div className="space-y-4">

              {messages.map((msg, index) => {
                const isMe = msg.username === username;

                return (
                  <div
                    key={index}
                    className={`flex ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >

                    <div
                      className={`flex items-end gap-2 max-w-[85%] md:max-w-[70%] ${
                        isMe ? "flex-row-reverse" : ""
                      }`}
                    >

                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                          isMe
                            ? "bg-blue-600"
                            : "bg-gray-700"
                        }`}
                      >
                        {msg.username
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`px-4 py-3 ${
                          isMe
                            ? "bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl rounded-br-md"
                            : "bg-[#171c27] border border-white/5 rounded-2xl rounded-bl-md"
                        }`}
                      >

                        {!isMe && (
                          <p className="text-xs font-semibold text-blue-400 mb-1">
                            {msg.username}
                          </p>
                        )}

                        <p className="text-sm md:text-[15px] leading-relaxed break-words">
                          {msg.message}
                        </p>

                        <div
                          className={`flex items-center justify-end gap-1 mt-1.5 ${
                            isMe
                              ? "text-blue-200/60"
                              : "text-gray-600"
                          }`}
                        >
                          <span className="text-[10px]">
                            {msg.time}
                          </span>

                          {isMe && (
                            <span className="text-[11px]">
                              ✓✓
                            </span>
                          )}
                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

              <div ref={messagesEndRef}></div>

            </div>
          )}

        </main>

        {/* Message Input */}
        <footer className="shrink-0 border-t border-white/10 bg-[#10141d] p-3 md:p-4">

          <div className="flex items-center gap-2 md:gap-3 bg-[#0b0f17] border border-white/10 rounded-2xl p-2 focus-within:border-blue-500/50 transition">

            {/* Attachment */}
            <button
              type="button"
              className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/5 transition"
            >
              📎
            </button>

            {/* Input */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 min-w-0 bg-transparent text-white placeholder-gray-600 outline-none text-sm md:text-[15px]"
            />

            {/* Send */}
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="w-10 h-10 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white flex items-center justify-center transition"
            >
              ➤
            </button>

          </div>

          <p className="hidden md:block text-center text-[10px] text-gray-700 mt-2">
            Press Enter to send
          </p>

        </footer>

      </div>

    </div>
  );
}

export default App;