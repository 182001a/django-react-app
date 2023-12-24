import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Logout from './components/Logout';
import Home from './components/Home';
import Navbar from "./components/Navbar";
import { AppProvider } from './AppContext';
import './index.scss';
import Follow from "./components/Follow";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AppProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/following" element={<Follow />} />
        </Routes>
      </Router>
    </AppProvider>
  </React.StrictMode>
);
