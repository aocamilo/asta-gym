"use client";

import React, { useState } from "react";

export default function ClassificationPage() {
  // State for the click counter
  const [clickCount, setClickCount] = useState(0);
  // State for the active menu item
  const [activeMenu, setActiveMenu] = useState("Home");
  // State for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleLearnMoreClick = () => {
    setClickCount((prevCount) => prevCount + 1);
  };

  const handleMenuClick = (menuItem: string) => {
    setActiveMenu(menuItem);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = () => {
    // Basic submission logic (e.g., log to console)
    console.log("Form Submitted:", { name, email });
    // You would typically send this data to a server here
    alert(`Thank you, ${name}! We received your email: ${email}`);
    // Clear fields after submission
    setName("");
    setEmail("");
  };

  return (
    <div id="page-container">
      {/* Navigation Bar */}
      <div id="nav-bar" className="navigation-container">
        <div className="logo-container">
          <span>Logo</span>
        </div>
        <div className="menu-container">
          {["Home", "About", "Services", "Contact"].map((item) => (
            <div
              key={item}
              className={`menu-item ${activeMenu === item ? "active" : ""}`}
              onClick={() => handleMenuClick(item)}
              style={{
                cursor: "pointer",
                fontWeight: activeMenu === item ? "bold" : "normal",
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <div id="cta-button" className="button primary-button">
          Sign Up
        </div>
      </div>

      {/* Hero Section */}
      <div id="hero-section" className="section hero">
        <h1>Welcome to Our Landing Page</h1>
        <p>This is a description of what we offer.</p>
        <p>Button Clicks: {clickCount}</p>
        <div
          id="learn-more-button"
          className="button secondary-button"
          onClick={handleLearnMoreClick}
          style={{ cursor: "pointer" }}
        >
          Learn More
        </div>
      </div>

      {/* Features/Cards Section */}
      <div id="features-section" className="section features">
        <h2>Features</h2>
        <div className="card-container">
          <div className="card">
            <h3>Feature One</h3>
            <p>Description of feature one.</p>
          </div>
          <div className="card">
            <h3>Feature Two</h3>
            <p>Description of feature two.</p>
          </div>
          <div className="card">
            <h3>Feature Three</h3>
            <p>Description of feature three.</p>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div id="contact-section" className="section contact-form">
        <h2>Contact Us</h2>
        <div className="form-container">
          <div className="form-group">
            <span className="form-label">Name:</span>
            <input
              type="text"
              id="name-input"
              className="form-input"
              value={name}
              onChange={handleNameChange}
              placeholder="Your Name"
            />
          </div>
          <div className="form-group">
            <span className="form-label">Email:</span>
            <input
              type="email"
              id="email-input"
              className="form-input"
              value={email}
              onChange={handleEmailChange}
              placeholder="Your Email"
            />
          </div>
          <div
            id="submit-button"
            className="button primary-button"
            onClick={handleSubmit}
            style={{ cursor: "pointer", marginTop: "10px" }}
          >
            Submit
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div id="footer" className="section footer">
        <p>© 2024 Your Company. All rights reserved.</p>
        <div className="footer-links">
          <span className="footer-link">Privacy Policy</span>
          <span className="footer-link">Terms of Service</span>
        </div>
      </div>
    </div>
  );
}
