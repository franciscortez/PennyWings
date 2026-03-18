import { useState, useEffect, useRef } from "react"; // trigger-reload
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Swal from 'sweetalert2'

export default function Login() {
  const { signIn, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    if (user) {
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
        popupRef.current = null;
      }
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleGoogleLogin = async () => {
    const { data, error } = await signInWithGoogle();
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Google Login Error',
        text: error.message,
        confirmButtonColor: '#EC4899',
      });
      return;
    }
    
    if (data?.url) {
      const width = 500;
      const height = 650;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        data.url,
        'google-login-popup',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
      );
      popupRef.current = popup;

      if (!popup) {
        Swal.fire({
          icon: 'warning',
          title: 'Popup Blocked',
          text: 'Please enable popups for this site to sign in with Google.',
          confirmButtonColor: '#EC4899',
        });
        return;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: signInError } = await signIn(form.email, form.password);
    if (signInError) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: signInError.message,
        confirmButtonColor: '#EC4899',
        customClass: { popup: 'rounded-[2.5rem]' }
      });
      setLoading(false);
    } else {
      setLoading(false);
      navigate("/dashboard");
    }
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
              Welcome back to your financial journey
            </h1>
            <p className="text-xl text-pink-700 mb-12 leading-relaxed">
              Continue tracking your expenses, managing your budgets, and achieving your financial goals with ease.
            </p>
            
            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 hover:bg-white transition-all duration-300 shadow-sm">
                <div className="w-12 h-12 bg-pink-200 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-pink-800 font-semibold text-lg mb-2">Real-time Tracking</h3>
                <p className="text-pink-600 text-sm">Monitor your expenses and income as they happen across all your accounts.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 hover:bg-white transition-all duration-300 shadow-sm">
                <div className="w-12 h-12 bg-pink-200 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-pink-800 font-semibold text-lg mb-2">Smart Budgets</h3>
                <p className="text-pink-600 text-sm">Set intelligent budget limits and get alerts before you overspend.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 hover:bg-white transition-all duration-300 shadow-sm">
                <div className="w-12 h-12 bg-pink-200 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-pink-800 font-semibold text-lg mb-2">Visual Analytics</h3>
                <p className="text-pink-600 text-sm">Beautiful charts and insights to understand your spending patterns.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 hover:bg-white transition-all duration-300 shadow-sm">
                <div className="w-12 h-12 bg-pink-200 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-pink-800 font-semibold text-lg mb-2">Secure & Private</h3>
                <p className="text-pink-600 text-sm">Bank-level encryption keeps your financial data safe and private.</p>
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
              Sign In
            </h2>
            <p className="text-pink-600 text-lg">
              Enter your credentials to access your account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6 border border-red-100">
              {error}
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
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border-2 border-pink-200 rounded-xl px-4 py-3 text-sm text-pink-900 placeholder:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-pink-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-pink-600 hover:text-pink-700 font-bold">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-pink-200 rounded-xl px-4 py-3 text-sm text-pink-900 placeholder:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pink-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-pink-400 font-medium">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-pink-100 hover:border-pink-200 text-pink-700 font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center gap-3 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.28.81-.56z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>

          <div className="mt-8 text-center">
            <p className="text-sm text-pink-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-pink-700 font-bold hover:text-pink-800 transition"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
