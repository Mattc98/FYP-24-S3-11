// pages/index.js
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { HoverEffect } from "./components/ui/card-hover-effect2";

const LandingPage = () => {
  const websiteFeatures = [
    {
      title: "Multi-factor Authentication",
      description:
        "Secure way to ensure authorised access to your office rooms",
      link: "",
    },
    {
      title: "Cloud Based SAAS",
      description:
        "Easy to set up your room management system.",
      link: "",
    },
    {
      title: "User friendly",
      description:
        "Straight forward instuctions for all users, Very simple",
      link: "",
    },
    {
      title: "Mobile App Included",
      description:
        "All Users can download the app today and begin booking.",
      link: "",
    },
    {
      title: "Accessible anywhere",
      description:
        "Book a room for your meeting at home, at the mall, Anywhere.",
      link: "",
    },
  ];
  return (
    <div className="bg-neutral-900 text-white min-h-screen flex flex-col items-center justify-start px-4">
      <header className="absolute top-0 left-0 right-0 flex justify-between p-5 text-sm">
        <div className="font-bold text-lg">AuthBook</div>
        <nav className="space-x-6">
          <a href="#features" className="hover:text-gray-400">Features</a>
          <a href="#pricing" className="hover:text-gray-400">Pricing</a>
          <a href="/Login" className="bg-white text-black px-5 py-2 font-medium rounded hover:bg-gray-200">Login</a>
        </nav>
      </header>

      <main className="flex flex-col items-center justify-center text-center flex-grow min-h-screen">
        <div className="text-sm font-semibold bg-gray-800 text-gray-300 px-3 py-1 rounded-full inline-block mb-4">
          100% Secure & Easy access
        </div>
        <h1 className="text-5xl font-bold mb-4">
          Room Booking Management System
        </h1>
        <p className="text-gray-400 mb-8">
          Built for management, by developers.
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

      <div id="features" className=" text-center pb-16 text-white lg:w-[1000px]">
        <h1 className="text-4xl font-bold mb-4">Features</h1>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <HoverEffect items={websiteFeatures} />
        </div>
      </div>
      <div id="pricing" className=" text-center pb-16 text-white">
        <h1 className="text-4xl font-bold mb-4">Pricing</h1>
        <p className="text-gray-400 mb-8">Flexible plans for every team.</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic</CardTitle>
              <CardDescription>For starting companies.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Manage up to 50 rooms</p>
              <p>Create up to 500 Users</p>
              <p>Admin accounts provided</p>
            </CardContent>
            <CardFooter>
              <p>$49.99/month</p>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>For medium sized companies</CardDescription>
            </CardHeader>
            <CardContent>
            <p>Manage up to 250 rooms</p>
            <p>Create up to 2500 Users</p>
            <p>Admin accounts provided</p>
            </CardContent>
            <CardFooter>
              <p>$99.99/month</p>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>For Huge companies</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Manage up to 500 rooms</p>
              <p>Create Unlimited Users</p>
              <p>Admin accounts provided</p>
            </CardContent>
            <CardFooter>
              <p>$199.99/month</p>
            </CardFooter>
          </Card>
        </div>
        
      </div>
      <footer className="bottom-5 text-gray-500 p-10 flex">
        {/* Footer content */}
        © 2024 FYP-24-S3-11. All rights reserved.
      </footer> 
    </div>
    
  );
};

export default LandingPage;
