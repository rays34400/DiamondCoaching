import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import '../../styles/entraineur/messagerie-entraineur.css';


const MessagerieEntraineur = ({ keyClient }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [keyEntraineur, setKeyEntraineur] = useState('');
  const [socket, setSocket] = useState(null);

  // 1. Init Socket.IO
  useEffect(() => {
    const newSocket = io('https://messageapi-1rc2.onrender.com');
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  // 2. Load keyEntraineur
  useEffect(() => {
    const fetchKey = async () => {
      const res = await axios.get(
        `https://entraineurapi.onrender.com/api/entraineurs/${user.id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setKeyEntraineur(res.data.keyEntraineur);
    };
    if (user?.id && user?.token) fetchKey();
  }, [user]);

  
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(
        `https://messageapi-1rc2.onrender.com/api/messages/conversation/${keyClient}/${keyEntraineur}`
      );
      setMessages(res.data);
    };
    if (keyClient && keyEntraineur) {
      fetchMessages();
      socket?.emit('joinRoom', { keyClient, keyEntraineur });
      socket?.on('receiveMessage', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }
    return () => {
      socket?.off('receiveMessage');
    };
  }, [keyClient, keyEntraineur, socket]);

  
  useEffect(() => {
    const container = document.querySelector('.messages-list');
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  // 5. Send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const msgPayload = {
      senderKey: keyEntraineur,
      receiverKey: keyClient,
      contenu: newMessage,
    };
    const res = await axios.post(`https://messageapi-1rc2.onrender.com/api/messages/send`, msgPayload);
    socket?.emit('sendMessage', msgPayload);
    setMessages((prev) => [...prev, res.data.data]);
    setNewMessage('');
  };

  return (
    <div className="messagerie-container">
      <h3>Messagerie avec le client</h3>
      <div className="messages-list">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-bubble ${msg.senderKey === keyEntraineur ? 'sent' : 'received'}`}
          >
            {msg.contenu}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrire un message..."
        />
        <button onClick={sendMessage}>Envoyer</button>
      </div>
    </div>
  );
};

export default MessagerieEntraineur;
