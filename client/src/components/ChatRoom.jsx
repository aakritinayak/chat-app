// src/components/ChatRoom.js

import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const SendMessage = gql`
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

const GetParticipants = gql`
query($chatRoomId: ID!) {
  getParticipants(chatRoomId: $chatRoomId) {
    name,
    participants {
      username
    }
  }
}
`

const GetMessage = gql`
query($chatRoomId: ID!){
  getMessages(chatRoomId: $chatRoomId) {
    id,
    sender {
      username
    },
    content
  }
}
`


const ChatRoom = () => {
  const { roomId } = useParams();
  const userId = localStorage.getItem('user');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const {data,loading,error} = useQuery(GetMessage,{
    variables: {chatRoomId:roomId}
  });
  const {data:pdata,loading:ploading,error:perror} = useQuery(GetParticipants,{
    variables: {chatRoomId:roomId}
  });

  const [sendMessage, { data:mdata, loading:mloading, error:merror }] = useMutation(SendMessage);

  const handleSendMessage = async() => {
    try {
        await sendMessage({
          variables: {
            chatRoomId: roomId,
            content: message,
            senderId: userId
          },
        });
        console.log('Room created successfully:', mdata);
        setMessage('')
      } catch (err) {
        console.error('Error creating room:', err.message);
        if (err.graphQLErrors) {
          console.error('GraphQL Errors:', err.graphQLErrors);
        }
        if (err.networkError) {
          console.error('Network Error:', err.networkError);
        }
      }
    if (message.trim()) {
      setMessages([...messages, { id: messages.length + 1, content: message, sender: 'User' }]);
      setMessage('');
    }
  };

  if(loading||ploading){
    return (<div>Loading....</div>)
  }

  if(error){
    return (<div>Error: {error.message}</div>)
  }
  if(perror){
    return (<div>Error: {perror.message}</div>)
  }

  console.log("pdata",pdata.getParticipants.participants)

  return (
    <div className="max-w-4xl mx-auto p-6 flex gap-2">
        <div>
            <div className='h-[500px] rounded-lg shadow-lg w-[300px] overflow-hidden'>
                <div className='h-[100px] bg-blue-500 flex items-center justify-center'>
                    <h1 className='text-4xl text-white'>
                        Pariticipants
                    </h1>
                </div>
                <div className='h-[400px] overflow-scroll'>
                    {pdata.getParticipants.participants?.map((participant)=>{
                        return(<div className='text-lg p-5 border-b-2'>{participant.username}</div>)
                    })}
                </div>
            </div>
        </div>
        <div>
            <h1 className="text-4xl font-bold mb-6">Chat Room {pdata.getParticipants.name}</h1>

            <div className="space-y-4">
                {data.getMessages?.length === 0 || data.getMessages==null ? (
                <p>No messages yet. Be the first to send one!</p>
                ) : (
                <ul className="space-y-2">
                    {data.getMessages.map((msg) => (
                    <li key={msg.id} className="border p-3 rounded-md shadow-md">
                        <strong>{msg.sender.username}: </strong>{msg.content}
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
    </div>
  );
};

export default ChatRoom;