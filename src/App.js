import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router,Route,Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import NotFound from './components/NotFound';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Footer from './components/Footer';
import { AuthContext } from './context/AuthContext';
import { auth } from './firebase';

function App() {

  const { currentUser } = useContext(AuthContext);


  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to='/login' />
  };
  
  console.log(currentUser);

  
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
  
        <Route path="*" element={<NotFound/>}/>
      </Routes>
      {/* <Footer/> */}
    </Router>
  );
}

export default App;
