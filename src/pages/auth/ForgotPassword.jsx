import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const { error } = await resetPassword(email);
    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for password reset instructions.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[65%_35%]">
      {/* Left Column - Marketing Message */}
      <div className="hidden lg:flex relative bg-pink-100 p-8 lg:p-12 flex-col overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-700"></div>
        
        {/* Back Button */}
        <Link
          to="/"
          className="relative z-20 flex items-center gap-2 text-pink-700 hover:text-pink-800 transition-colors group mb-12 self-start"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Content Container - Vertically Centered */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="relative z-10 max-w-2xl mx-auto w-full">
            <div className="inline-flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-8 shadow-sm">
              <svg className="w-5 h-5 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 48 20 C 40 10 30 15 35 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M 52 20 C 60 10 70 15 65 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M 48 30 C 20 -5 0 20 15 45 C 0 65 20 95 48 65 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2"/>
                <path d="M 52 30 C 80 -5 100 20 85 45 C 100 65 80 95 52 65 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2"/>
                <circle cx="25" cy="30" r="3" fill="currentColor" fillOpacity="0.2"/>
                <circle cx="75" cy="30" r="3" fill="currentColor" fillOpacity="0.2"/>
                <rect x="47" y="20" width="6" height="45" rx="3" fill="currentColor"/>
                <circle cx="50" cy="18" r="4" fill="currentColor"/>
              </svg>
              PennyWings
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-pink-800 mb-6 leading-tight">
              Forgot your password? No worries!
            </h1>
            <p className="text-xl text-pink-700 mb-12 leading-relaxed">
              We'll send you a secure link to reset your password and get you back on track with your financial goals.
            </p>
            
            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 hover:bg-white transition-all duration-300 shadow-sm">
                <div className="w-12 h-12 bg-pink-200 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-pink-800 font-semibold text-lg mb-2">Secure Process</h3>
                <p className="text-pink-600 text-sm">Password reset links are encrypted and expire after one use.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 hover:bg-white transition-all duration-300 shadow-sm">
                <div className="w-12 h-12 bg-pink-200 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-pink-800 font-semibold text-lg mb-2">Quick Recovery</h3>
                <p className="text-pink-600 text-sm">Receive your reset link instantly via email.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 hover:bg-white transition-all duration-300 shadow-sm">
                <div className="w-12 h-12 bg-pink-200 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-pink-800 font-semibold text-lg mb-2">Email Verification</h3>
                <p className="text-pink-600 text-sm">We'll verify your email before sending the reset link.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 hover:bg-white transition-all duration-300 shadow-sm">
                <div className="w-12 h-12 bg-pink-200 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.757a2 2 0 110 4H13V7a3 3 0 00-3-3 3 3 0 00-3 3v7a5 5 0 01-5 5h10v-3a2 2 0 114 0v3h1a2 2 0 100-4h-3a2 2 0 100 4h3a2 2 0 100-4h-3" />
                  </svg>
                </div>
                <h3 className="text-pink-800 font-semibold text-lg mb-2">Easy Steps</h3>
                <p className="text-pink-600 text-sm">Simple process to get you back into your account.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="bg-white p-8 lg:p-12 flex flex-col justify-center relative">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Back Button */}
          <Link
            to="/"
            className="lg:hidden flex items-center gap-2 text-pink-700 hover:text-pink-800 transition-colors group mb-8"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-pink-800 mb-3">
              Reset Password
            </h2>
            <p className="text-pink-600 text-lg">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6 border border-red-100">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3 mb-6 border border-green-100">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-pink-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-2 border-pink-200 rounded-xl px-4 py-3 text-sm text-pink-900 placeholder:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-pink-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-pink-700 font-bold hover:text-pink-800 transition"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
