// src/components/ChatRoom.js

import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const getMessage = gql`
mutation($chatRoomId: ID!, $content: String!, $senderId: ID!){
  sendMessage(chatRoomId: $chatRoomId, content: $content, senderId: $senderId) {
    id,
    content,
    chatRoom {
      id
    },
    sender {
      id,
      username
    }
  }
}
`

const ChatRoom = () => {
  const { roomId } = useParams();
//   const userId = localStorage.getItem('user');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

//   const [getMessages, { data, loading, error }] = useMutation(getMessage);

  const handleSendMessage = () => {
    // try {
    //     await getMessages({
    //       variables: {
    //         name: roomName,
    //         content: message,
    //         senderId: userId
    //       },
    //     });
    //     console.log('Room created successfully:', data);
    //     setRoomName(''); // Clear input
    //   } catch (err) {
    //     console.error('Error creating room:', err.message);
    //     if (err.graphQLErrors) {
    //       console.error('GraphQL Errors:', err.graphQLErrors);
    //     }
    //     if (err.networkError) {
    //       console.error('Network Error:', err.networkError);
    //     }
    //   }
    if (message.trim()) {
      setMessages([...messages, { id: messages.length + 1, content: message, sender: 'User' }]);
      setMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Chat Room {roomId}</h1>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <p>No messages yet. Be the first to send one!</p>
        ) : (
          <ul className="space-y-2">
            {messages.map((msg) => (
              <li key={msg.id} className="border p-3 rounded-md shadow-md">
                <strong>{msg.sender}: </strong>{msg.content}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          className="border p-3 w-full rounded-md"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-3 w-full mt-2 rounded-md"
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;