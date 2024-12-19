import { useQuery, gql } from '@apollo/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ChatRoom from './components/ChatRoom';
import ProtectRoute from './components/ProtectedRouter';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';


export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectRoute user={localStorage.getItem('user')!=null} />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:roomId" element={<ChatRoom />} />
        </Route>
        <Route element={<ProtectRoute user={localStorage.getItem('user')==null} redirect='/' />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}