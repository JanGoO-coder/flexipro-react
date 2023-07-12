import React from "react";
import "./Featured.scss";

function Featured() {
  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Find the perfect <span>Technicians</span> services
          </h1>
          <div className="search">
            <div className="searchInput">
              <img src="./img/search.png" alt="" />
              <input type="text" placeholder='Search for Best Technicians"' />
            </div>
            <button>Search</button>
          </div>
          <div className="popular">
            <span>Popular:</span>
            <button>Electrical Services</button>
            <button>computer technician</button>
            <button>Plumbing Heating</button>
            <button>Cad Technicians</button>
          </div>
        </div>
        <div className="right">
          <img src="./img/techinician.png" alt=""  style={{width:'auto'}}/>
        </div>
      </div>
    </div>
  );
}

export default Featured;
