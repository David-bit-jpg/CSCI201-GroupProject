import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import AddContactForm from './AddContactForm';
import ContactList from './ContactsList';
import SelectContactsPage from './SelectContactsPage';
import ChatWindow from './ChatWindow';
import ChatList from './ChatList';
import GuestChat from './GuestChat';
// import LoginFake from './LoginFAKE';



import { UserProvider } from './UserContext'; // Import UserProvider from UserContext

const App = () => {
  const isLoggedIn = false; // Replace this with your authentication logic

  return (
    <Router>
      <UserProvider> {/* Wrap the entire application with UserProvider */}
        <Routes>
          {/* <Route path="/logout" element={<RegisterPage />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/addContact" element={<AddContactForm />} />
          <Route path="/getContacts" element={<ContactList />} />
          <Route path="/select-contacts" element={<SelectContactsPage />} />
          <Route path="/ChatWindow/:chatID"  element={<ChatWindow />} />
          <Route path="/seeChat" element={<ChatList />} />
          <Route path="/GuestChat/:chatID/:guestID" element={<GuestChat />} />
          {/* <Route path="LoginFake" element={<LoginFake />} /> */}


          

          <Route
            path=""
            element={isLoggedIn ? <Navigate to="/addContact" /> : <Navigate to="/login" />}
          />
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default App;
