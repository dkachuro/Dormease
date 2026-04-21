import React, { useState } from 'react';
import './FaqSection.css';

const FaqSection = () => {
  const [activeId, setActiveId] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: 'How do I apply for a dormitory room?',
      answer: 'You can apply online by logging into your account and filling out the digital application form.'
    },
    {
      id: 2,
      question: 'How can I track my application status?',
      answer: 'After submission, you can track your application status in the "My Applications" section of your dashboard. You will also receive an email notification whenever your application status is updated.'
    },
    {
      id: 3,
      question: 'Can I choose my room myself?',
      answer: 'Yes! We offer an interactive map where you can view and select available rooms in real-time.'
    },
    {
      id: 4,
      question: 'Can I change my selected room after confirmation?',
      answer: 'Yes, but only before the move-in period ends. Please contact the administration through the in-app chat or helpdesk.'
    }
  ];

  const toggleQuestion = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className="faq-section-landing" id="faq">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">Find answers to common questions about dormitory applications</p>
        </div>
        
        <div className="faq-list">
          {faqItems.map((item) => (
            <div className="faq-item" key={item.id}>
              <button 
                className={`faq-question ${activeId === item.id ? 'active' : ''}`}
                onClick={() => toggleQuestion(item.id)}
                aria-expanded={activeId === item.id}
              >
                <div className="faq-question-content">
                  <div className="faq-number">{item.id}.</div>
                  <span>{item.question}</span>
                </div>
                <svg className="faq-arrow" viewBox="0 0 24 24">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>
              </button>
              <div 
                className={`faq-answer ${activeId === item.id ? 'active' : ''}`}
                aria-hidden={activeId !== item.id}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;