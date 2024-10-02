import LoginForm from "./components/LoginForm/LoginForm";
import Image from 'next/image';

export default async function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="relative flex flex-col items-center w-full">
      
        {/* Login Form Section */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-4xl font-bold text-white text-center mb-6">FYP-24-S3-11</h2>
          {/* Logo Section */}
          <div className="mb-8">
            <Image
              src="/images/logo.png" // Replace with your actual image path
              alt="Company Logo"
              width={500}
              height={500}
              className="object-contain h-100 w-100" // Logo styled to fit nicely
            />
          </div>
          <h2 className="text-4xl font-bold text-white text-center mb-6">Login to your account</h2>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
