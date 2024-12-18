import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Alert } from "shards-react";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';


import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";


import Chat from "./Chat";

const ChatApp = () => <Chat />;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <ChatApp /> {/* Rendered the ChatApp component */}
  </StrictMode>
);
