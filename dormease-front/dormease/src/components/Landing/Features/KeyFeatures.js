import React from "react";
import "./KeyFeatures.css";

function KeyFeatures() {
  const features = [
    {
      image: "/images/database.jpg",
      title: "Automated Applications and Notifications",
      description: "Submit and track your dormitory application with just a few clicks"
    },
    {
      image: "/images/image.png",
      title: "Real-time Room Selection",
      description: "Browse and select available rooms in real-time with interactive floor plans"
    },
    {
      image: "/images/digsign.jpg",
      title: "Digital Contract Signing",
      description: "Complete your housing agreement electronically with secure digital signatures"
    }, 
    {
      image: "/images/support.png",
      title: "Support & Helpdesk Integration",
      description: "Submit maintenance requests and get assistance through the university's helpdesk."
    }
  ];

  return (
    <section className="key-features" id="feature">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Key Features</h2>
          <p className="features-subtitle">
            Experience the next generation of dormitory management with our innovative features
          </p>
        </div>
        
        <div className="features-list">
          {features.map((feature, index) => (
            <div className="feature-item" key={index}>
              <div className="feature-content">
                <div className="feature-number">{index + 1}.</div>
                <div className="feature-text">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
              <div className="feature-icon-container">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="feature-image"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default KeyFeatures;
