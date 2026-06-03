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
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
        <h2>Join Chat Room</h2>
        <form onSubmit={handleJoin} style={{ display: 'flex', gap: '8px' }}>
          <label htmlFor="username">Username</label>
          <input
            id='username'
            name='username'
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Enter your username..."
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          />
          <label htmlFor="room">Room</label>
          <select
            id='room'
            name='room'
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          >
            <option value="general">General</option>
            <option value="tech-support">Tech Support</option>
          </select>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              background: '#4f46e5',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Join
          </button>
        </form>
      </div>
    );
  }

  // Chat UI — shown after joining
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>
        {room === 'general'
        ? 'General Chat Room'
        : 'Tech Support Chat Room'}
      </h2>
      <p style={{ color: '#888', fontSize: '13px' }}>
        Logged in as <strong>{username}</strong>
      </p>

      <p style={{ color: '#888', fontSize: '13px' }}>
        Channel: <strong>{room}</strong>
        </p>
        
      {/* Message list */}
      <div style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        height: '300px',
        overflowY: 'auto',
        padding: '12px',
        marginBottom: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {messages.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center' }}>
            No messages yet. Say hello!
          </p>
        )}
        {messages.map((msg, index) => (
          <div key={index} style={{
            background: msg.username === username ? '#ede9fe' : '#f1f1f1',
            borderRadius: '6px',
            padding: '8px 12px',
          }}>
            <span style={{ fontSize: '12px', color: '#6d28d9', fontWeight: 600 }}>
              [{msg.username}]
            </span>
            <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>
              {msg.timestamp}
            </span>
            <p style={{ margin: '4px 0 0' }}>{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Typing indicator */}
      <div style={{ height: '18px', fontSize: '12px', color: '#888', marginBottom: '6px' }}>
        {typingUser && `${typingUser} is typing...`}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '10px 20px',
            background: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;