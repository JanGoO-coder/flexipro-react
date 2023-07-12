import React from "react";
import "./Footer.scss";

function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <div className="top">
          <div className="item">
            <h2>Technician Categories</h2>
            <span>Heated & Plumbing</span>
            <span>Electrical Technician</span>
            <span>wiring</span>
            <span>Space aircraft</span>
            <span>computer networking</span>
            <span>Car mechanic</span>
            <span>Data recovery</span>
            <span>Cad Technician</span>
            <span>Pipe Fitting</span>
            <span>Space Science</span>
            <span>Sitemap</span>
          </div>
          <div className="item">
            <h2>About</h2>
            <span>Partnerships</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Intellectual Property Claims</span>
            <span>Investor Relations</span>
            <span>Contact Sales</span>
          </div>
          <div className="item">
            <h2>Support</h2>
            <span>Help & Support</span>
            <span>Trust & Safety</span>
            <span>Selling on Technicians</span>
            <span>Buying on Technicians</span>
          </div>
          <div className="item">
            <h2>Community</h2>
            <span>Technicians Success Stories</span>
            <span>Community hub</span>
            <span>Forum</span>
            <span>Events</span>
            <span>Blog</span>
            <span>Influencers</span>
            <span>Affiliates</span>
            <span>Podcast</span>
            <span>Invite other Technicians</span>
            <span>Become a Technician</span>
            <span>Community Standards</span>
          </div>
          <div className="item">
            <h2>More From Technician Marketplace</h2>
            <span>Technicians Business</span>
            <span>Technicians Workspace</span>
            <span>Technicians team rent</span>
            <span>Technicians car services</span>
            <span>Technicians house keeping</span>
            <span>Technicians Tools kit</span>
            <span>Technicians tower repair</span>
            <span>Learn Technician Jobs</span>
            <span>Technicians Workshops</span>
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <h2>Technicians</h2>
            <span>© Technicians International Ltd. 2023</span>
          </div>
          <div className="right">
            <div className="social">
              <img src="/img/twitter.png" alt="" />
              <img src="/img/facebook.png" alt="" />
              <img src="/img/linkedin.png" alt="" />
              <img src="/img/pinterest.png" alt="" />
              <img src="/img/instagram.png" alt="" />
            </div>
            <div className="link">
              <img src="/img/language.png" alt="" />
              <span>English</span>
            </div>
            <div className="link">
              <img src="/img/coin.png" alt="" />
              <span>USD</span>
            </div>
            <img src="/img/accessibility.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
