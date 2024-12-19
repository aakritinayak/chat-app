import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Link } from "react-router-dom";

// Correct mutation definition
const SIGN_UP = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      username
      email
    }
  }
`;

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Use the useMutation hook to handle the mutation
  const [createUser, { data, loading, error }] = useMutation(SIGN_UP);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    try {
      // Trigger the mutation with the variables
      await createUser({
        variables: {
          username,
          email,
          password,
        },
      });
    } catch (err) {
      console.error('Error during sign up:', err);
    }
  };

  // Loading and error states
  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error.message}</h2>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Sign Up</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg mt-6 hover:bg-green-600 transition"
          >
            Sign Up
          </button>
        </form>
        {data && <p className="mt-4 text-center text-green-500">Welcome, {data.createUser.username}!</p>}
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;