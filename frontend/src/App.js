import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

const App = () => {
  const isLoggedIn = false; // Set this to the logged-in status from your authentication logic

  return (
    <Router>
      <Routes>
        {/* <Route path="/logout" element={<RegisterPage />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* <Route path="/crud" element={<CRUD />} /> */}
        {/* <Route path="/edit/:id" element={<Edit/>} /> */}

        <Route
            path=""
            element={isLoggedIn ? <Navigate to="/crud" /> : <Navigate to="/login" />}
          />

      </Routes>
    </Router>
  );
};

export default App;