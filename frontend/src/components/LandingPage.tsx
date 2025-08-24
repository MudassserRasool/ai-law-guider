import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Search, FileText, CheckCircle, User, Bot, ArrowUp } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="text-blue-500" size={28} />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 text-transparent bg-clip-text">
            LegalVision
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-sm">
          <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">How it Works</a>
        </div>
        
        <div className="hidden md:flex items-center space-x-3">
          <button 
            onClick={() => navigate('/auth')} 
            className="px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/5 transition-all"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/auth')} 
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Get Started
          </button>
        </div>
        
        <button className="md:hidden text-white/80 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 text-transparent bg-clip-text">
                AI Civic Copilot
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-white/90">
                Smart Law & Policy Assistant
              </h2>
              <p className="text-lg text-white/70 md:pr-12">
                Get accurate legal guidance, rights protection, and official resources in one place. Navigate complex legal situations with AI assistance.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button 
                onClick={() => navigate('/auth')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-3"
              >
                Start Your Legal Journey <ArrowRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="hidden md:block relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gray-800/90 backdrop-blur-sm border border-white/10 p-6 rounded-3xl shadow-2xl overflow-hidden">
              <div className="mb-6 flex items-start space-x-4 p-4 bg-gray-700/30 rounded-xl">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-white/80">My landlord increased rent by 10% this month without proper notice. Is this legal in California?</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl border backdrop-blur-sm border-green-400/30 bg-green-400/10">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle size={20} className="text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white mb-2 text-sm">
                        Answer
                      </h4>
                      <p className="text-white/80 text-sm leading-relaxed">
                        NO - This violates California Civil Code Section 1947.12, which limits annual rent increases to 5% + CPI (not exceeding 10%).
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl border backdrop-blur-sm border-blue-400/30 bg-blue-400/10">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <ArrowRight size={20} className="text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white mb-2 text-sm">
                        Next Steps
                      </h4>
                      <p className="text-white/80 text-sm leading-relaxed">
                        File complaint with local rent control board within 30 days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats section removed */}
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-white/70 max-w-2xl mx-auto">Get the legal guidance you need in just a few simple steps</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30"></div>
            <div className="relative p-6 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-white/10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <FileText size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload</h3>
              <p className="text-white/70 text-sm">Share your legal documents or describe your situation</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30"></div>
            <div className="relative p-6 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-white/10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                <Search size={24} className="text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Research</h3>
              <p className="text-white/70 text-sm">Our AI analyzes relevant laws and precedents</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30"></div>
            <div className="relative p-6 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-white/10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <CheckCircle size={24} className="text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Guidance</h3>
              <p className="text-white/70 text-sm">Receive clear explanations and next steps</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30"></div>
            <div className="relative p-6 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-white/10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Take Action</h3>
              <p className="text-white/70 text-sm">Download official documents and follow recommendations</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-16 md:py-24 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
          <p className="text-white/70 max-w-2xl mx-auto">Everything you need to navigate complex legal situations</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered Legal Analysis</h3>
            <p className="text-white/70">Get instant analysis of legal documents and situations with our advanced AI technology.</p>
          </div>
          
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Up-to-Date Legal Information</h3>
            <p className="text-white/70">Access the most current laws and regulations, updated in real-time as legislation changes.</p>
          </div>
          
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-500/50 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Document Generation</h3>
            <p className="text-white/70">Create legally sound documents tailored to your specific situation and jurisdiction.</p>
          </div>
          
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Natural Language Interface</h3>
            <p className="text-white/70">Ask questions in plain English and get clear, jargon-free explanations and advice.</p>
          </div>
          
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-red-500/50 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Data Privacy & Security</h3>
            <p className="text-white/70">Your sensitive legal information is protected with enterprise-grade encryption and security.</p>
          </div>
          
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Cloud Storage</h3>
            <p className="text-white/70">Access your legal documents and history from any device, securely stored in the cloud.</p>
          </div>
        </div>
      </section>
      
      {/* Animated Showcase Section */}
      <section className="container mx-auto px-6 py-16 md:py-24 overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See LegalVision in Action</h2>
          <p className="text-white/70 max-w-2xl mx-auto">Explore how our AI simplifies complex legal matters</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Animated Showcase */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 rounded-3xl blur-lg"></div>
            <div className="relative h-[500px] rounded-3xl bg-gray-800/80 backdrop-blur-sm border border-white/10 p-4 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-gray-900 to-transparent z-10 rounded-t-3xl flex items-center px-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="mx-auto bg-gray-800/50 rounded-full px-4 py-1 text-xs text-white/70">
                  LegalVision AI Assistant
                </div>
              </div>
              
              <div className="absolute top-12 left-0 right-0 bottom-0 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 pt-4 px-4">
                {/* Animated typing effect */}
                <div className="flex gap-3 p-4 justify-start mb-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="max-w-[80%]">
                    <div className="p-4 rounded-2xl rounded-bl-md bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      <p className="typing-animation">My landlord wants to increase my rent by 15% with only 10 days notice. Is this legal in California?</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 p-4 justify-end mb-4 opacity-0 animate-fade-in" style={{ animationDelay: '2.5s' }}>
                  <div className="max-w-[80%]">
                    <div className="p-4 rounded-2xl rounded-br-md bg-gray-900/90 backdrop-blur-sm text-white border border-white/10">
                      <p>Based on California rental laws, I can provide you with the following analysis:</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                </div>
                
                <div className="flex gap-3 p-4 justify-end mb-4 opacity-0 animate-fade-in" style={{ animationDelay: '3.5s' }}>
                  <div className="max-w-[80%]">
                    <div className="p-4 rounded-2xl rounded-br-md bg-gray-900/90 backdrop-blur-sm text-white border border-white/10">
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl border backdrop-blur-sm border-red-400/30 bg-red-400/10 hover:scale-[1.02] transition-all duration-200">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <CheckCircle size={20} className="text-red-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white mb-2 text-sm">
                                ✅ Legal Assessment
                              </h4>
                              <p className="text-white/80 text-sm leading-relaxed">
                                This is NOT legal. Under California law (Civil Code Section 1947.12), rent increases are capped at 5% + CPI (not exceeding 10% total) annually, and require 30 days written notice for increases under 10%.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 rounded-xl border backdrop-blur-sm border-blue-400/30 bg-blue-400/10 hover:scale-[1.02] transition-all duration-200">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <ArrowRight size={20} className="text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white mb-2 text-sm">
                                📋 Next Steps
                              </h4>
                              <p className="text-white/80 text-sm leading-relaxed">
                                Respond to your landlord in writing citing Civil Code Section 1947.12. If they persist, file a complaint with your local rent board.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                </div>
                
                <div className="flex gap-3 p-4 justify-end opacity-0 animate-fade-in" style={{ animationDelay: '5s' }}>
                  <div className="max-w-[80%]">
                    <div className="p-4 rounded-2xl rounded-br-md bg-gray-900/90 backdrop-blur-sm text-white border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <FileText size={20} className="text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">Would you like me to generate a formal response letter to your landlord?</p>
                        </div>
                        <button className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-lg">
                          Generate
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right: Feature Highlights */}
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-50"></div>
              <div className="relative p-6 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  Real-time Legal Analysis
                </h3>
                <p className="text-white/70">LegalVision analyzes your situation in real-time, providing accurate legal information specific to your jurisdiction and circumstances.</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-green-500/20 rounded-xl blur opacity-50"></div>
              <div className="relative p-6 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  Automated Document Generation
                </h3>
                <p className="text-white/70">Generate legal documents, formal responses, and compliant forms with just one click, personalized to your specific situation.</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl blur opacity-50"></div>
              <div className="relative p-6 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  Step-by-Step Action Plans
                </h3>
                <p className="text-white/70">Receive clear, actionable guidance with prioritized steps to address your legal situation effectively and efficiently.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Future Roadmap Section */}
      <section className="container mx-auto px-6 py-12 md:py-16 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Future Roadmap</h2>
          <p className="text-white/70 max-w-2xl mx-auto">Our vision for LegalVision's evolution and upcoming features</p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500 rounded-full"></div>
          
          {/* Timeline items */}
          <div className="space-y-8">
            {/* Item 1 */}
            <div className="relative flex items-center">
              <div className="w-1/2 pr-8 text-right">
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold mb-2">Q4 2025</span>
                  <h3 className="text-lg font-semibold mb-2">Multilingual Support</h3>
                  <p className="text-white/70 text-sm">Expanding our service with support for multiple languages, making legal guidance accessible to non-English speakers.</p>
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-blue-500 border-4 border-gray-900 z-10"></div>
              <div className="w-1/2 pl-8"></div>
            </div>
            
            {/* Item 2 */}
            <div className="relative flex items-center">
              <div className="w-1/2 pr-8"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-purple-500 border-4 border-gray-900 z-10"></div>
              <div className="w-1/2 pl-8">
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold mb-2">Q1 2026</span>
                  <h3 className="text-lg font-semibold mb-2">AI Legal Assistant Mobile App</h3>
                  <p className="text-white/70 text-sm">A dedicated mobile application with offline capabilities and push notifications for case updates and legal changes.</p>
                </div>
              </div>
            </div>
            
            {/* Item 3 */}
            <div className="relative flex items-center">
              <div className="w-1/2 pr-8 text-right">
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold mb-2">Q2 2026</span>
                  <h3 className="text-lg font-semibold mb-2">Live Legal Professional Connect</h3>
                  <p className="text-white/70 text-sm">Integration with a network of legal professionals for cases requiring human expertise, with seamless handoff from AI.</p>
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-green-500 border-4 border-gray-900 z-10"></div>
              <div className="w-1/2 pl-8"></div>
            </div>
            
            {/* Item 4 */}
            <div className="relative flex items-center">
              <div className="w-1/2 pr-8"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-orange-500 border-4 border-gray-900 z-10"></div>
              <div className="w-1/2 pl-8">
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold mb-2">Q4 2026</span>
                  <h3 className="text-lg font-semibold mb-2">Interactive Legal Document Builder</h3>
                  <p className="text-white/70 text-sm">Advanced document creation with interactive form building, collaborative editing, and e-signature integration.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section removed */}

      {/* CTA Section removed */}
      
      {/* Footer removed */}
      
      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => navigate('/auth')} 
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          aria-label="Chat with LegalVision AI"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        <div className="absolute right-0 bottom-16 bg-white text-gray-800 py-2 px-4 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Chat with LegalVision AI
        </div>
      </div>
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <div className="fixed bottom-8 left-8 z-50">
          <button 
            onClick={scrollToTop} 
            className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </button>
          <div className="absolute left-0 bottom-14 bg-white text-gray-800 py-1 px-3 rounded-lg shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none text-xs whitespace-nowrap">
            Back to top
          </div>
        </div>
      )}
    </div>
  );
};
