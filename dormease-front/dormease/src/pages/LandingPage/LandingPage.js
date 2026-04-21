// SignupPage.jsx
import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import HeroSection from '../../components/Landing/Hero/HeroSection';
import ProcessSection from '../../components/Landing/Process/ProcessSection'
import KeyFeatures from '../../components/Landing/Features/KeyFeatures'
import FaqSection from '../../components/Landing/FAQ/FaqSection'


const SignupPage = () => {
  return (
    <div className="signup-page">
      <Header />
      <main className="signup-main">
        <HeroSection />
        <ProcessSection />
        <KeyFeatures />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};


export default SignupPage;
