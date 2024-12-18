import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App';

const client = new ApolloClient({
  uri: 'https://flyby-router-demo.herokuapp.com/',
  cache: new InMemoryCache(),
});


const Chat = () => {
    return (
        <div>CHAT</div>
    )
}

export default ()=>{
    <ApolloProvider client={client}>
        <Chat />
    </ApolloProvider>
}