  import { useEffect, useState, useRef } from 'react';
  import { io } from 'socket.io-client';

  const Chat = () => {
    const [username, setUsername] = useState('');
    const [usernameInput, setUsernameInput] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [typingUser, setTypingUser] = useState('');
    const [room, setRoom] = useState('general');
    const socketRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Connect socket only after username is set
    useEffect(() => {
      if (!isJoined) return;

      socketRef.current = io(import.meta.env.VITE_SERVER_URL);

      socketRef.current.on('connect', () => {
        // Register username with server immediately after connect
        socketRef.current.emit('join-chat', {
          username,
          room,
        });
      });

      socketRef.current.on('receive-message', (data) => {
        setMessages((prev) => [...prev, data]);
      });

      socketRef.current.on('user-typing', ({ username: typingName, isTyping }) => {
        setTypingUser(isTyping ? typingName : '');
      });

      return () => {
        socketRef.current.disconnect();
      };
    }, [isJoined, username]);

    // Handle username form submit
    const handleJoin = (e) => {
      e.preventDefault();
      if (!usernameInput.trim()) return;
      setUsername(usernameInput.trim());
      setIsJoined(true);
    };

    // Handle typing indicator with debounce
    const handleInputChange = (e) => {
      setInput(e.target.value);

      // Emit typing: true
      socketRef.current?.emit('typing', true);

      // Clear previous timeout
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      // After 2s of no typing, emit typing: false
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('typing', false);
      }, 2000);
    };

    const sendMessage = () => {
      if (!input.trim()) return;

      socketRef.current.emit('send-message', { text: input });

      // Stop typing indicator when message is sent
      socketRef.current.emit('typing', false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      setInput('');
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') sendMessage();
    };

    // Username gate — shown before joining
    if (!isJoined) {
  return (
    <div className="max-w-md mx-auto mt-24 bg-white border border-gray-200 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Join Chat Room
      </h2>

      <form onSubmit={handleJoin} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>

          <input
            id="username"
            name="username"
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Enter your username..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="room"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Room
          </label>

          <select
            id="room"
            name="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="general">General</option>
            <option value="tech-support">Tech Support</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Join Chat
        </button>
      </form>
    </div>
  );
}

  return (
  <div className="max-w-2xl mx-auto mt-10 bg-white border border-gray-200 rounded-xl shadow-lg p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-1">
      {room === "general"
        ? "General Chat Room"
        : "Tech Support Chat Room"}
    </h2>

    <p className="text-sm text-gray-500">
      Logged in as <span className="font-semibold">{username}</span>
    </p>

    <p className="text-sm text-gray-500 mb-4">
      Channel: <span className="font-semibold">{room}</span>
    </p>

    {/* Messages */}
    <div className="h-[400px] overflow-y-auto border border-gray-200 rounded-xl p-4 mb-3 flex flex-col gap-3 bg-gray-50">
      {messages.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No messages yet. Say hello 👋
        </p>
      )}

      {messages.map((msg, index) => (
        <div
          key={index}
          className={`rounded-xl px-4 py-3 shadow-sm ${
            msg.username === username
              ? "bg-indigo-100 ml-8"
              : "bg-white border border-gray-200 mr-8"
          }`}
        >
          <span className="text-xs font-semibold text-indigo-700">
            {msg.username}
          </span>

          <span className="ml-2 text-xs text-gray-400">
            {msg.timestamp}
          </span>

          <p className="mt-1 text-gray-700 break-words">
            {msg.text}
          </p>
        </div>
      ))}
    </div>

    {/* Typing Indicator */}
    <div className="h-5 text-xs text-gray-500 italic mb-2">
      {typingUser && `${typingUser} is typing...`}
    </div>

    {/* Input */}
    <div className="flex gap-3">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />

      <button
        onClick={sendMessage}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
      >
        Send
      </button>
    </div>
  </div>
);
  };

  export default Chat;