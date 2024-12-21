import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'
import Cart from './components/Cart'
import Login from './components/Login'
import Register from './components/Register'
import RestaurantCard from './components/RestaurantCard'
import AdminDashboard from './components/AdminDashboard'
import Profile from './components/Profile'
import AdminRestaurant from './components/AdminRestaurant'
import EditFoodItem from './components/EditFoodItem'
import AdminAddFood from './components/AdminAddFood'
import UserProfile from './components/UserProfile'

function App() {

  const appRouter=createBrowserRouter([
    {
      path:'/',
      element:<Home/>
    },
    {
      path:'/about',
      element:<About/>
    },
    {
      path:'/cart',
      element:<Cart/>
    },
    {
      path:'/login',
      element:<Login/>
    },
    {
      path:'/register',
      element:<Register/>
    },
    {
      path:'/restaurant/:id',
      element:<RestaurantCard/>
    },
    {
      path:'/admin',
      element:<AdminDashboard/>
    },
    {
      path:'/profile',
      element:<Profile/>
    },
    {
      path:'/admin/restaurant/:id',
      element:<AdminRestaurant/>
    },
    {
      path:'/admin/edit/:id',
      element:<EditFoodItem/>
    },
    {
      path:'/admin/add-food-item/:id',
      element:<AdminAddFood/>
    },
    {
      path:'/userProfile',
      element:<UserProfile/>
    }
  ])
  return (
   <div>
    <RouterProvider router={appRouter}></RouterProvider>
   </div>
  )
}

export default App
