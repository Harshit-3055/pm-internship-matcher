"use client";

import React from "react";
import { Briefcase } from "lucide-react";

export default function HomePage({ onSignIn, onSignUp }) {
  const PM_PHOTO_URL = "https://www.pmindia.gov.in/wp-content/uploads/2025/12/01.jpg";
  const GOVT_LOGO_URL = "https://www.logopeople.in/wp-content/uploads/2013/01/government-of-india.jpg";
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="bg-orange-50 border-b border-orange-200 py-3">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center overflow-hidden">
                <img src={PM_PHOTO_URL} alt="Prime Minister" className="w-full h-full object-cover" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Hon'ble Prime Minister</div>
                <div className="text-gray-600">Shri Narendra Modi</div>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-orange-600 font-medium">Government of India</span>
              <span className="text-gray-600">|</span>
              <span className="text-green-600 font-medium">Digital India Initiative</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 rounded-lg p-2">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PM InternMatch</span>
          </div>
          <div className="space-x-4">
            <button onClick={onSignIn} className="text-gray-600 hover:text-gray-900 font-medium">Sign In</button>
            <button onClick={onSignUp} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Get Started</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-xl p-6 mb-12 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden">
              <img src={PM_PHOTO_URL} alt="Prime Minister" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <div className="text-lg font-bold">Launched under the Vision of</div>
              <div className="text-xl font-bold">Hon'ble Prime Minister Shri Narendra Modi</div>
              <div className="text-orange-100">"Empowering Youth through Skill-based Internships"</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm opacity-90 mb-2">Part of Atmanirbhar Bharat & Digital India Mission</div>
            <div className="flex justify-center space-x-8 text-sm">
              <span>🇮🇳 Make in India</span>
              <span>💻 Digital India</span>
              <span>🎯 Skill India</span>
              <span>🚀 Startup India</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Smart AI-Powered <span className="text-indigo-600">Internship Matching</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Revolutionary PM Internship Scheme platform that uses advanced AI algorithms to match 
            students with perfect internship opportunities based on skills, preferences, and career goals.
          </p>
          <div className="space-x-4">
            <button onClick={onSignUp} className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg">Start Your Journey</button>
            <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-indigo-600">Learn More</button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-100 to-green-100 rounded-2xl p-8 mb-16">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mr-6 overflow-hidden">
              <img src={PM_PHOTO_URL} alt="Prime Minister" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Prime Minister's Vision</h3>
              <p className="text-lg text-gray-700 italic">
                "Every young Indian deserves the opportunity to contribute to our nation's growth through meaningful skill development and industry exposure."
              </p>
              <p className="text-right mt-2 text-gray-600 font-medium">- Shri Narendra Modi</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl mb-2">🇮🇳</div>
              <h4 className="font-semibold text-gray-900 mb-1">Atmanirbhar Bharat</h4>
              <p className="text-gray-600 text-sm">Self-reliant India through skilled workforce</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💡</div>
              <h4 className="font-semibold text-gray-900 mb-1">Innovation & Technology</h4>
              <p className="text-gray-600 text-sm">AI-powered solutions for modern challenges</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌟</div>
              <h4 className="font-semibold text-gray-900 mb-1">Youth Empowerment</h4>
              <p className="text-gray-600 text-sm">Creating opportunities for every young Indian</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">10,000+</div>
            <div className="text-gray-600">Students Registered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
            <div className="text-gray-600">Partner Companies</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
            <div className="text-gray-600">Successful Matches</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">24hrs</div>
            <div className="text-gray-600">Average Match Time</div>
          </div>
        </div>

        <div className="bg-white border border-orange-200 rounded-xl p-6 mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-green-400 rounded-full flex items-center justify-center mr-4 overflow-hidden">
              <img src={GOVT_LOGO_URL} alt="Government of India" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Integrated with National Schemes</h3>
              <p className="text-gray-600">Aligned with PM's flagship programs for youth development</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🎓</div>
              <div className="text-sm font-medium text-gray-900">Skill India</div>
              <div className="text-xs text-gray-600">Mission</div>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">💻</div>
              <div className="text-sm font-medium text-gray-900">Digital India</div>
              <div className="text-xs text-gray-600">Initiative</div>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🏭</div>
              <div className="text-sm font-medium text-gray-900">Make in India</div>
              <div className="text-xs text-gray-600">Campaign</div>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-sm font-medium text-gray-900">Startup India</div>
              <div className="text-xs text-gray-600">Program</div>
            </div>
          </div>
        </div>

        <div id="how-it-works" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Our AI Matching Works</h2>
            <p className="text-gray-600 text-lg">Our intelligent system considers multiple factors to find your perfect internship match</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="h-8 w-8 text-indigo-600">👤</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Profile Creation</h3>
              <p className="text-gray-600 text-sm">Upload your resume and complete your detailed profile with skills and preferences</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="h-8 w-8 text-green-600">⭐</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. AI Analysis</h3>
              <p className="text-gray-600 text-sm">Our algorithm analyzes your profile against thousands of internship opportunities</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="h-8 w-8 text-purple-600">✅</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Smart Matching</h3>
              <p className="text-gray-600 text-sm">Get personalized matches with detailed explanations and compatibility scores</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="h-8 w-8 text-orange-600">➡️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">4. Apply Instantly</h3>
              <p className="text-gray-600 text-sm">One-click applications to your matched internships with pre-filled information</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl text-white p-12 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Matching Factors</h2>
            <p className="text-indigo-100 text-lg">Our AI considers every aspect to ensure perfect matches</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-3">
              <span className="h-6 w-6 text-green-400 mt-1 flex-shrink-0">✅</span>
              <div>
                <h3 className="font-semibold mb-1">Skills & Qualifications</h3>
                <p className="text-indigo-100 text-sm">Match based on technical and soft skills</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="h-6 w-6 text-green-400 mt-1 flex-shrink-0">✅</span>
              <div>
                <h3 className="font-semibold mb-1">Location Preferences</h3>
                <p className="text-indigo-100 text-sm">Find opportunities in your preferred cities</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="h-6 w-6 text-green-400 mt-1 flex-shrink-0">✅</span>
              <div>
                <h3 className="font-semibold mb-1">Sector Interests</h3>
                <p className="text-indigo-100 text-sm">Match with your industry preferences</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="h-6 w-6 text-green-400 mt-1 flex-shrink-0">✅</span>
              <div>
                <h3 className="font-semibold mb-1">Affirmative Action</h3>
                <p className="text-indigo-100 text-sm">Fair representation across categories</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="h-6 w-6 text-green-400 mt-1 flex-shrink-0">✅</span>
              <div>
                <h3 className="font-semibold mb-1">Rural Priority</h3>
                <p className="text-indigo-100 text-sm">Special consideration for rural candidates</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="h-6 w-6 text-green-400 mt-1 flex-shrink-0">✅</span>
              <div>
                <h3 className="font-semibold mb-1">Industry Capacity</h3>
                <p className="text-indigo-100 text-sm">Real-time availability tracking</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center bg-gray-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Find Your Perfect Internship?</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">Join thousands of students who have already found their dream internships through our AI-powered platform.</p>
          <div className="space-x-4">
            <button onClick={onSignUp} className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg">Register Now</button>
            <button onClick={onSignIn} className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-gray-200">Sign In</button>
          </div>
        </div>

        <footer className="bg-gradient-to-r from-orange-600 via-white to-green-600 py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-6 mb-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-2 overflow-hidden">
                    <img src={PM_PHOTO_URL} alt="Prime Minister" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-sm text-gray-800 font-medium">Hon'ble Prime Minister</div>
                  <div className="text-xs text-gray-600">Shri Narendra Modi</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-2 overflow-hidden">
                    <img src={GOVT_LOGO_URL} alt="Government of India" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-sm text-gray-800 font-medium">Government of India</div>
                  <div className="text-xs text-gray-600">भारत सरकार</div>
                </div>
              </div>
              <div className="text-center text-gray-700">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="bg-white rounded-lg p-2">
                    <Briefcase className="h-6 w-6 text-indigo-600" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">PM InternMatch</span>
                </div>
                <p className="text-gray-700 mb-2">Empowering the next generation through intelligent internship matching</p>
                <p className="text-sm text-gray-600">An initiative under the Digital India Mission | Developed with pride in India 🇮🇳</p>
              </div>
            </div>
            <div className="border-t border-gray-300 pt-6 text-center">
              <div className="flex flex-wrap justify-center space-x-6 text-sm text-gray-700 mb-4">
                <span>🏛️ Ministry of Skill Development & Entrepreneurship</span>
                <span>📧 Contact: pm-internship@gov.in</span>
                <span>📞 Helpline: 1800-123-4567</span>
              </div>
              <div className="text-xs text-gray-600">©️ 2024 Government of India. All rights reserved. | Privacy Policy | Terms & Conditions</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}


