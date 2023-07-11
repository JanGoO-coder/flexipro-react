import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.scss";
import jwt_decode from "jwt-decode";


function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [userRole, setUserRole] = useState(null);

  // useEffect(() => {
  //   // const handlePathnameChange = () => {
  //     // };
      
  //     // // Listen for the "popstate" event which occurs when the pathname changes
  //     // window.addEventListener("popstate", handlePathnameChange);
      
  //       localStorage.setItem("previousLocation", window.location.pathname);
  //   console.log("window.location.pathname", window.location.pathname);
  // }, [window.location.pathname]);

  const verifyUserRole = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserRole(decodedToken.user_role);
    }
  };

  useEffect(() => {
    verifyUserRole();
  }, []);

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  
  const logOut = ()=>{
    localStorage.removeItem('token');
    window.location.reload()
  }

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">Jobs Market</span>
          </Link>
          <span className="dot">.</span>
        </div>
        <div className="links">
          <span>Business Profile</span>
          <span>Explore</span>
          <span>English</span>
          {/* {!currentUser?.isSeller && <span>Become a Seller</span>} */}
          {userRole ? (
            <div className="user" onClick={()=>setOpen(!open)}>
              <img
                src="https://images.pexels.com/photos/1115697/pexels-photo-1115697.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <span>{userRole}</span>
              {open && <div className="options">
                {userRole=='employee' ?
                  <>
                    <Link className="link" to="/profile">
                      Profile
                    </Link>
                    
                    <Link className="link" to="/huntJobs">
                      Find Jobs
                    </Link>
                    <Link className="link" to="/user-jobs">
                    User Jobs
                    </Link>
                    <Link className="link" to="/job-offers">
                      Job Offers
                    </Link>

                   
                  </>:<>
                  <Link className="link" to="/company-profile">
                      Profile
                    </Link>
                    <Link className="link" to="/myJobs">
                      Post Jobs
                    </Link>
                <Link className="link" to="/orders">
                  Orders
                </Link>
                <Link className="link" to="/company-jobs">
                    Company Jobs
                    </Link>
                    <Link className="link" to="/all-users">
                      All Users
                    </Link>
                    <Link className="link" to="/offer-history">
                        Offer History
                    </Link>
                <Link className="link" to="/job-categories">
                  Job Categories
                </Link>
                  </>
                }
                <Link className="link" onClick={()=>logOut()}>
                  Logout
                </Link>  
                  
              </div>}
            </div>
          ) : (
            <>
             
              <Link className="link" to="/login">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <Link className="link menuLink" to="/">
              Graphics & Design
            </Link>
            <Link className="link menuLink" to="/">
              Video & Animation
            </Link>
            <Link className="link menuLink" to="/">
              Writing & Translation
            </Link>
            <Link className="link menuLink" to="/">
              AI Services
            </Link>
            <Link className="link menuLink" to="/">
              Digital Marketing
            </Link>
            <Link className="link menuLink" to="/">
              Music & Audio
            </Link>
            <Link className="link menuLink" to="/">
              Programming & Tech
            </Link>
            <Link className="link menuLink" to="/">
              Business
            </Link>
            <Link className="link menuLink" to="/">
              Lifestyle
            </Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;