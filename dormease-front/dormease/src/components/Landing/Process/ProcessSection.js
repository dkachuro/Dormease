import React from "react";
import "./ProcessSection.css";
import { FileText, Clock, UserCheck, Home } from "lucide-react";

const defaultSteps = [
  {
    icon: <FileText className="icon" />,
    title: "Application Submission",
    description: "Fill out and submit your dormitory application online",
    step: "Step 1",
  },
  {
    icon: <Clock className="icon" />,
    title: "Application Processing",
    description: "Our team reviews your application and documentation",
    step: "Step 2",
  },
  {
    icon: <UserCheck className="icon" />,
    title: "Approval",
    description: "Receive confirmation and room assignment details",
    step: "Step 3",
  },
  {
    icon: <Home className="icon" />,
    title: "Move-in",
    description: "Get your keys and move into your new room",
    step: "Step 4",
  },
];

const ProcessSection = ({ steps = defaultSteps }) => {
  return (
    <section className="process-section" id='how-it-works'>
      <div className="process-container">
        <div className="process-header">
          <h2 className="process-title">How It Works</h2>
          <p className="process-subtitle">
            Your journey to campus living in four simple steps
          </p>
        </div>
        <div className="process-grid">
          {steps.map((step, index) => (
            <div className="process-card" key={index}>
              <div className="icon-bg">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              <div className="step-number-process">{step.step}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;