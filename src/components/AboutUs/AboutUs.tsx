// src/components/AboutUs/AboutUs.tsx
import React from 'react';
import './AboutUs.scss';

const AboutUs: React.FC = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-content">
        <h1>About Our Company</h1>
        <p>
          Welcome to our tech store! We are passionate about bringing the latest and most innovative
          technology products to our customers. Our mission is to provide a seamless shopping
          experience with a wide range of high-quality electronics, from smartphones to smart home devices.
        </p>
        <p>
          Founded in 2023, our company started with a simple idea: to make technology accessible
          to everyone. We believe that technology should empower and inspire, and we strive to curate
          a collection of products that do just that. Our team is dedicated to providing
          exceptional customer service and support, ensuring you find the perfect device for your needs.
        </p>
        <div className="mission-statement">
          <h3>Our Vision</h3>
          <p>
            To be the leading online destination for tech enthusiasts and everyday users alike,
            recognized for our commitment to quality, innovation, and customer satisfaction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;