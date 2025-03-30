import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import SignUP from './components/Pages/Sign-up.jsx'
import Login from './components/Pages/Login.jsx'
import LandingPage from './components/Pages/LandingPage.jsx'
import CategoryPage from './components/Pages/CategoriesPage.jsx'
import ActualSpecificCategoryPage from './components/Pages/SpecificCategoryPage.jsx'
import Checkout from './components/Pages/Checkout.jsx'
import CreateCampaign from './components/Pages/CreateCampaign.jsx'
import CampaignDetails from './components/Pages/CampaignDetails.jsx'

const router = createBrowserRouter([
  {
    path:'/',
    element:<Login/>,
  },
  {
    path:'/sign-up',
    element:<SignUP/>
  },
  {
    path:'/landing-page',
    element:<LandingPage/>
  },
  {
    path:'/category-page',
    element:<CategoryPage/>
  },
  {
    path:'/specific-category-page',
    element:<ActualSpecificCategoryPage/>
  },
  {
    path:'/checkout',
    element:<Checkout/>
  },
  {
    path:'/createCampaign',
    element:<CreateCampaign/>
  },
  {
    path:'/campaignDetails',
    element:<CampaignDetails/>
  }
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
