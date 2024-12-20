import { useQuery, gql } from '@apollo/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ChatRoom from './components/ChatRoom';
import ProtectRoute from './components/ProtectedRouter';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { useEffect, useState } from 'react';


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsAuthenticated(user!=null);
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectRoute user={isAuthenticated} />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:roomId" element={<ChatRoom />} />
        </Route>
        <Route element={<ProtectRoute user={!isAuthenticated} redirect='/' />}>
          <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated}/>} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}