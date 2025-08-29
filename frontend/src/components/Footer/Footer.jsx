// src/components/Footer/Footer.jsx
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { IoLogoLinkedin } from "react-icons/io5";
import { SiGmail } from "react-icons/si";
import { FaGithub } from "react-icons/fa";

import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Logo / About */}
        <div className="footer-col">
          <h2 className="footer-logo">Blogging Platform</h2>
          <p className="footer-about">
            A place to read, write, and share amazing stories with the world.
          </p>
        </div>

        {/* Column 2: Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </div>
        </div>

        {/* Column 3: Socials */}
        <div className="footer-col">
          <h3>Follow Us</h3>
          <div className="footer-social">
          
              
               
                  <IoLogoLinkedin />
                  <SiGmail />
                  <FaGithub />
            
          </div>
          <div className="footer-bottom">
        © {new Date().getFullYear()} Blogging Platform. All rights reserved.
        </div>
        </div>
      </div>
    </footer>
  );
}
