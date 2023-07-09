import "./app.scss";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from "react-router-dom";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Orders from "./pages/orders/Orders";
import MyJobs from "./pages/myJobs/MyJobs";
import Profile from './pages/profilePage/Profile'
import HuntJobs from "./pages/huntJobs/HuntJobs";
import jwt_decode from "jwt-decode";
import axios from "axios";
import CompanyProfile from "./pages/profilePage/CompanyProfile";
import Categories from "./pages/myJobs/categories";

function App() {
  const [userRole, setUserRole] = useState('company');
  const [reload , setReload] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  const verifyUserRole = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      // Check if the token has expired
      if (currentTime > expirationTime) {
        setIsExpired(true);
      }
      else {
        setIsExpired(false);
      }

      setUserRole(decodedToken.user_role);
    }
    else setIsExpired(true)
  };
  
  useLayoutEffect(()=>{
    verifyUserRole()
  },[])
    

  useEffect(() => {
    verifyUserRole();
   
  }, []);

 
  
  const PrivateRoute = ({ element, allowedRoles }) => {
    console.log('isExpired',isExpired, 'routes  ',userRole,allowedRoles,allowedRoles.includes(userRole))
    if (allowedRoles.includes(localStorage.getItem("token")?jwt_decode(localStorage.getItem("token")).user_role:"") && !isExpired) {
      return element;
    } else {
      return <Navigate to = '/login'/>; // Return null while the redirect is happening
    }
  };
  

  const Layout = () => {
    return (
      <div className="app">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home allowedRoles={['employee', 'company']}/>,
        },
        {
          path: "/myJobs",
          element: <PrivateRoute element={<MyJobs />} allowedRoles={[ 'company']} />,
        },
        {
          path: "/jobCategories",
          element: <PrivateRoute element={<Categories />} allowedRoles={[ 'company']} />,
        },
        {
          path: "/huntJobs",
          element: <PrivateRoute element={<HuntJobs />} allowedRoles={['employee']} />,
        },
        {
          path: "/orders",
          element: <PrivateRoute element={<Orders />} allowedRoles={['company']} />,
        },
        {
          path: "/profile",
          element: <PrivateRoute element={<Profile />} allowedRoles={['employee']} />,
        },
        {
          path: "/company-profile",
          element: <PrivateRoute element={<CompanyProfile />} allowedRoles={['company']} />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
