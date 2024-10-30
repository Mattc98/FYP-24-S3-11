// pages/index.js
import React from 'react';

const LandingPage = () => {
  return (
    <div className="bg-neutral-900 text-white min-h-screen flex flex-col items-center justify-center px-4">
      <header className="absolute top-0 left-0 right-0 flex justify-between p-5 text-sm">
        <div className="font-bold text-lg">AuthBook</div>
        <nav className="space-x-6">
          <a href="#features" className="hover:text-gray-400">Features</a>
          <a href="#pricing" className="hover:text-gray-400">Pricing</a>
          <a href="/Login" className="bg-white text-black px-5 py-2 font-medium rounded hover:bg-gray-200">Login</a>
        </nav>
      </header>

      <main className="text-center">
        <div className="text-sm font-semibold bg-gray-800 text-gray-300 px-3 py-1 rounded-full inline-block mb-4">
          100% Secure & Easy access
        </div>
        <h1 className="text-5xl font-bold mb-4">
          Room Booking Management System
        </h1>
        <p className="text-gray-400 mb-8">
          Built for management, by developers. Next.js + Shadcn UI.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/Login"
            className="bg-white text-black px-5 py-2 font-medium rounded hover:bg-gray-200"
          >
            Get Started
          </a>
        </div>
      </main>

      <footer className="absolute bottom-5 text-gray-500">
        
      </footer>
    </div>
  );
};

export default LandingPage;
