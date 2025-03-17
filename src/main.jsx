import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import SignUP from './components/LandingPage/Sign-up.jsx'
import Login from './components/LandingPage/Login.jsx'
import React from 'react'

const router = createBrowserRouter([{
  path:'/',
  element:<SignUP /> 
},
{
  path:'/login',
  element:<Login/>
}]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
    </React.StrictMode>
)
