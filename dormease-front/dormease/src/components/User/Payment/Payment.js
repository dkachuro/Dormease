import React from 'react';
import './Payment.css';
import firstStep from '../../../assets/images/1.png';
import secondStep from '../../../assets/images/2.png';
import thirdStep from '../../../assets/images/3.png';



const Payment = () => {

    const handleImageClick = (e) => {
  e.currentTarget.classList.toggle('zoomed');
};

  return (
    <div className="payment-container">
      <h1>Payment Instructions</h1>
      <p className="payment-subtitle">Follow these steps to complete your payment</p>
      
      <div className="instruction-steps">
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Select Education Payment Category</h3>
            <p>Choose 'Payments' → 'Education' → 'Universities and Colleges'</p>
            <img src={firstStep} alt="Payment method selection" className="screenshot-image" onClick={handleImageClick}/>
          </div>
        </div>
        
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Select Payment Name</h3>
            <p>Choose 'Institution Name' → Select 'Astana IT University' → 'Deposit for the first 3 month' or 'Monthly payment for accommodation'</p>
            <img src={secondStep} alt="Payment details form" className="screenshot-image"  onClick={handleImageClick}
/>
          </div>
        </div>
        
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Enter Payment Details & Confirm Payment</h3>
            <p>Fill in your information and click "Pay" to complete the transaction</p>
            <img src={thirdStep} alt="Confirmation screen" className="screenshot-image"   onClick={handleImageClick}
/>
          </div>
        </div>
      </div>
      
    
    </div>
  );
};

export default Payment;