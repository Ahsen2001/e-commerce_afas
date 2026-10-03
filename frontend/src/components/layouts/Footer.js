import React from "react";
import { Link } from "react-router-dom";
import "../../App.css";

export default function Footer() {
  return (
    <footer className="tv-footer">

      <div className="tv-footer-container">

        {/* Brand */}
        <div className="tv-footer-box">
          <h2 className="tv-logo">
            TravelVista<span>.LK</span>
          </h2>
          <p>
            Sri Lanka's smart tourism platform. Explore in 360°, shop local, travel better.
          </p>

          <div className="tv-socials">
            <i className="fa fa-facebook"></i>
            <i className="fa fa-instagram"></i>
            <i className="fa fa-twitter"></i>
            <i className="fa fa-youtube"></i>
          </div>
        </div>

        {/* Explore */}
        <div className="tv-footer-box">
          <h4>Explore</h4>
          <Link to="/experiences">Destinations</Link>
          <Link to="/experiences">360° Experiences</Link>
          <Link to="/experiences">Heritage Sites</Link>
          <Link to="/experiences">Beaches</Link>
          <Link to="/experiences">Wildlife</Link>
        </div>

        {/* Shop */}
        <div className="tv-footer-box">
          <h4>Shop</h4>
          <Link to="/search">All Products</Link>
          <Link to="/search">Handicrafts</Link>
          <Link to="/search">Spices & Tea</Link>
          <Link to="/search">Clothing</Link>
          <Link to="/search">Accessories</Link>
        </div>

        {/* Support */}
        <div className="tv-footer-box">
          <h4>Support</h4>
          <Link to="/">About Us</Link>
          <Link to="/">Contact</Link>
          <Link to="/">FAQs</Link>
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Terms</Link>
        </div>

      </div>

      {/* Bottom */}
      <div className="tv-footer-bottom">
        <p>
          © {new Date().getFullYear()} TravelVista.LK — All rights reserved.
        </p>

        <div className="tv-payments">
          <i className="fa fa-cc-visa"></i>
          <i className="fa fa-cc-mastercard"></i>
          <i className="fa fa-cc-amex"></i>
        </div>
      </div>

    </footer>
  );
}