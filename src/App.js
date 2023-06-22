import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Home from './pages/Home';
import Mainboard from './pages/Mainboard';
import AuthProvider from './context/auth';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

function App() {
  return (

    <AuthProvider>

      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/auth/register' element={<Register />} />
          <Route path='/auth/login' element={<Login />} />
          <Route path='/' element={<Home />} />
          <Route path='/auth/forgot-password' element={<ForgotPassword />} />
          <Route path='/auth/reset-password' element={<ResetPassword />} />
          <Route path='/dashboard' element={<Mainboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
