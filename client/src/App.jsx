import { useQuery, gql } from '@apollo/client';

const GET_MESSAGES = gql`
  query {
    messages {
      id
      content
      user
    }
  }
`;

export default function App() {
  const { loading, error, data } = useQuery(GET_MESSAGES);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error.message}</h2>;

  return (
    <div>
      <h2>Messages</h2>
      <ul>
        {data.messages.map((message) => (
          <div key={message.id}>
            <p><strong>User:</strong> {message.user}</p>
            <p><strong>Message:</strong> {message.content}</p>
            <hr />
          </div>
        ))}
      </ul>
    </div>
  );
}