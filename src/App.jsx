import "./app.scss";
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";  
import 'primeicons/primeicons.css';
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import React from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Orders from "./pages/orders/Orders";
import MyJobs from "./pages/myJobs/MyJobs";
import Profile from './pages/profilePage/Profile'
import HuntJobs from "./pages/huntJobs/HuntJobs";


function App() {
  var user =false;

  const Layout = () => {
    
    return (
      <div className="app">
        <Navbar />
        <Outlet/>
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
          element: <Home />,
        },
        {
          path: "/myJobs",
          element: <MyJobs />,
        },
        {
          path: "/huntJobs",
          element: <HuntJobs />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/profile",
          element: <Profile />,
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
