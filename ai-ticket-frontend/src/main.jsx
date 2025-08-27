import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CheckAuth from './comonents/check-auth.jsx'
import Tickets from './pages/tickets.jsx'
import TicketDetailsPage from './pages/ticket.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Admin from './pages/admin.jsx'
import { Navbar } from './comonents/navbar.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
   <Navbar></Navbar>
    <Routes>
      <Route
      path='/'
      element={
        <CheckAuth protectedRoute={true}>
          <Tickets></Tickets>
        </CheckAuth>
      }/>
      <Route
      path='/tickets/:id'
      element={
        <CheckAuth protectedRoute={true}>
          <TicketDetailsPage></TicketDetailsPage>
        </CheckAuth>
      }/>
      <Route
      path='/login'
      element={
        <CheckAuth protectedRoute={true}>
          <Login></Login>
        </CheckAuth>
      }/>
      <Route
      path='/signup'
      element={
        <CheckAuth protectedRoute={true}>
          <Signup></Signup>
        </CheckAuth>
      }/>
      <Route
      path='/admin'
      element={
        <CheckAuth protectedRoute={true}>
         <Admin></Admin>
        </CheckAuth>
      }/>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
