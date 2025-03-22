import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import SignUP from './components/LandingPage/Sign-up.jsx'
import Login from './components/LandingPage/Login.jsx'

const router = createBrowserRouter([
  {
    path:'/',
    element:<Login/>,
  },
  {
    path:'/sign-up',
    element:<SignUP/>
  }
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
