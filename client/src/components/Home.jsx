import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// GraphQL Queries and Mutations
const GetRoom = gql`
  query {
    getChatRooms {
      id
      name
    }
  }
`;

const CreateRoom = gql`
  mutation CreateRoom($name: String!, $participantIds: [ID!]!) {
    createChatRoom(name: $name, participantIds: $participantIds) {
      id
      name
    }
  }
`;

const Home = () => {
  const [roomName, setRoomName] = useState('');
  const userId = localStorage.getItem('user');

  // Fetch chat rooms
  const { data, loading, error } = useQuery(GetRoom);


  const [createChatRoom, {loading: mloading, error: merror }] = useMutation(CreateRoom, {
    refetchQueries: [{ query: GetRoom }], 
  });

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;
    console.log('Creating room with:', { name: roomName, participantIds: [userId] });
    try {
      const { data } = await createChatRoom({
        variables: {
          name: roomName,
          participantIds: [userId],
        },
      });
      console.log('Room created successfully:', data);
      setRoomName(''); // Clear input
    } catch (err) {
      console.error('Error creating room:', err.message);
      if (err.graphQLErrors) {
        console.error('GraphQL Errors:', err.graphQLErrors);
      }
      if (err.networkError) {
        console.error('Network Error:', err.networkError);
      }
    }
  };

  // Handle loading and error states
  if (loading) return <h2>Loading chat rooms...</h2>;
  if (error) return <h2>Error: {error.message}</h2>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Chat Rooms</h1>

      <div className="mb-4">
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter new chat room name"
          className="border p-3 w-full rounded-md"
        />
        <button
          onClick={handleCreateRoom}
          className={`bg-blue-500 text-white p-3 w-full mt-2 rounded-md ${mloading ? 'opacity-50' : ''}`}
          disabled={mloading}
        >
          {mloading ? 'Creating...' : 'Create Room'}
        </button>
        {merror && <p className="text-red-500 mt-2">Error: {merror.message}</p>}
      </div>

      <div>
        {data.getChatRooms.length === 0 ? (
          <p>No chat rooms available. Create one!</p>
        ) : (
          <ul className="space-y-2">
            {data.getChatRooms.map((room) => (
              <li key={room.id} className="flex items-center justify-between">
                <Link
                  to={`/chat/${room.id}`}
                  className="text-blue-600 hover:underline text-xl"
                >
                  {room.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;