import { useState, useEffect } from 'react';
import '@/App.css';
import Login from '@/pages/Login.jsx';
import Register from '@/pages/Register.jsx';
import NotFound from '@/components/errors/NotFound.jsx';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from '@/pages/Dashboard';
import Profile from "@/pages/Profile.jsx";
import TentorFavorites from '@/pages/TentorFavorites';
import Home from '@/pages/Home';
import AdminDashboard from '@/pages/AdminDashboard.jsx';
import LoginAdmin from '@/pages/LoginAdmin.jsx';
import DetailPostAdmin from '@/pages/DetailPostAdmin.jsx';
import OTPVerification from '@/pages/OTPVerification.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DetailPost from './pages/DetailPost';
import { UserProvider } from "@/contexts/UserContextProvider.jsx";
import { formToJSON } from 'axios';
import EmailConfirmation from './pages/EmailConfirmation';
import NewPassword from './pages/NewPassword';

function App() {
  // Theme initialization
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (theme === 'dark' || (!theme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Theme toggle function
  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
  };

  return (
    <BrowserRouter>
      <UserProvider>
        {/* Theme toggle button - you can move this to a Layout component later */}
        <button 
          onClick={toggleTheme}
          className="fixed bottom-4 left-4 z-50 p-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-lg"
        >
          <span className="dark:hidden">🌙 Dark</span>
          <span className="hidden dark:inline">☀️ Light</span>
        </button>
        
        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/admin/login" element={<LoginAdmin/>} />
            <Route path='/forget' element={<EmailConfirmation/>}/>
            <Route path='/verification' element={<OTPVerification/>}/>
            <Route path='/changePassword' element={<NewPassword/>}/>
            
            <Route path="/admin/tentor/:id" element={
              <PrivateRoute>
                <DetailPostAdmin/>
              </PrivateRoute>
            } />

            <Route path="/admin/dashboard" element={
              <PrivateRoute>
                <AdminDashboard/>
              </PrivateRoute>
            } />

            <Route path="/tentor/:id" element={
              <PrivateRoute>
                <DetailPost />
              </PrivateRoute>
            } />
            
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }/>
              <Route
              path="/profile/favorites"
              element={
                <PrivateRoute>
                  <TentorFavorites />
                </PrivateRoute>
              }/>
            <Route path="*" element={<NotFound />} />
          </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
