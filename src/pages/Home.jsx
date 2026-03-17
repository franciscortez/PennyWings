import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react"; // trigger-reload
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const features = [
    {
      title: "Smart Tracking",
      desc: "Automatically categorize your spending so you know exactly where your money flows.",
      icon: (
        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Goal Setting",
      desc: "Set and track savings goals for that dream vacation or comfortable emergency fund.",
      icon: (
        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Seamless Sync",
      desc: "Connect your bank cards and e-wallets securely to see your financial ecosystem in one place.",
      icon: (
        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-pink-50 font-sans text-gray-800 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center px-4 py-20 md:py-32 min-h-[90vh]">
        {/* Animated Background Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>

        <div className="relative max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12 z-10">
          {/* Left Side: Text and CTAs */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-pink-600 px-4 py-2 rounded-full text-sm font-medium mb-2 shadow-sm border border-pink-200 transition-transform hover:scale-105 duration-300">
              <svg className="w-5 h-5 text-pink-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 48 20 C 40 10 30 15 35 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M 52 20 C 60 10 70 15 65 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M 48 30 C 20 -5 0 20 15 45 C 0 65 20 95 48 65 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2"/>
                <path d="M 52 30 C 80 -5 100 20 85 45 C 100 65 80 95 52 65 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2"/>
                <circle cx="25" cy="30" r="3" fill="currentColor" fillOpacity="0.2"/>
                <circle cx="75" cy="30" r="3" fill="currentColor" fillOpacity="0.2"/>
                <rect x="47" y="20" width="6" height="45" rx="3" fill="currentColor"/>
                <circle cx="50" cy="18" r="4" fill="currentColor"/>
              </svg>
              PennyWings Tracker
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Watch your savings{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-700">
                flutter
              </span>{" "}
              to new heights.
            </h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
              Take flight with your finances. Transform complex tracking into a
              beautiful, guided journey. Manage cards, e-wallets, and goals with
              ease.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white font-medium rounded-xl shadow-lg shadow-pink-200/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-300/50 text-center"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 bg-white border-2 border-pink-300 hover:border-pink-400 hover:bg-pink-50 text-pink-700 font-medium rounded-xl transition-all duration-300 text-center"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right Side: Hero Visual */}
          <div className="flex-1 w-full relative max-w-md mx-auto md:max-w-none group">
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-300 to-pink-200 rounded-[2.5rem] transform rotate-3 scale-105 opacity-50 blur-lg transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110"></div>
            <div className="relative bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-pink-200 transition-transform duration-500 transform group-hover:-translate-y-2">
              {/* Mockup UI Elements */}
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <div className="text-sm text-gray-400 font-medium mb-1">
                      Total Balance
                    </div>
                    <div className="text-3xl font-bold text-gray-800">
                      ₱12,450.00
                    </div>
                  </div>
                  <div className="h-14 w-14 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center shadow-inner border border-white">
                    <svg className="w-10 h-10 text-pink-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 48 20 C 40 10 30 15 35 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M 52 20 C 60 10 70 15 65 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M 48 30 C 20 -5 0 20 15 45 C 0 65 20 95 48 65 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2"/>
                      <path d="M 52 30 C 80 -5 100 20 85 45 C 100 65 80 95 52 65 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="25" cy="30" r="3" fill="currentColor" fillOpacity="0.2"/>
                      <circle cx="75" cy="30" r="3" fill="currentColor" fillOpacity="0.2"/>
                      <rect x="47" y="20" width="6" height="45" rx="3" fill="currentColor"/>
                      <circle cx="50" cy="18" r="4" fill="currentColor"/>
                    </svg>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold text-gray-800">
                    Recent Transactions
                  </div>
                  {[
                    { 
                      name: "Coffee Shop", 
                      amount: "-₱250.00", 
                      icon: (
                        <svg className="w-5 h-5 text-gray-400 font-medium mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      )
                    },
                    {
                      name: "Monthly Salary",
                      amount: "+₱45,000.00",
                      icon: (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                      pos: true,
                    },
                    { 
                      name: "Grocery Store", 
                      amount: "-₱2,450.20", 
                      icon: (
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      )
                    },
                  ].map((tx, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 rounded-xl bg-gray-50/80 hover:bg-pink-50 transition-all duration-300 border border-transparent hover:border-pink-200 hover:shadow-sm transform hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          {tx.icon}
                        </div>
                        <span className="font-medium text-gray-700">
                          {tx.name}
                        </span>
                      </div>
                      <span
                        className={`font-semibold ${tx.pos ? "text-emerald-500" : "text-red-500"}`}
                      >
                        {tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 3. FEATURES SECTION */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-700">
              thrive
            </span>{" "}
            financially
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-16">
            Ditch the complicated spreadsheets. Our tools are designed to be
            gorgeous, intuitive, and highly effective.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-[2rem] bg-pink-50/50 border border-pink-200 hover:shadow-xl hover:shadow-pink-200/50 transition-all duration-500 flex flex-col items-center text-center transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 5. FOOTER */}
      <footer className="bg-gray-50 border-t border-pink-200 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-8 h-8 text-pink-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 48 20 C 40 10 30 15 35 20" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M 52 20 C 60 10 70 15 65 20" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M 48 30 C 20 -5 0 20 15 45 C 0 65 20 95 48 65 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2"/>
              <path d="M 52 30 C 80 -5 100 20 85 45 C 100 65 80 95 52 65 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2"/>
              <circle cx="25" cy="30" r="3" fill="currentColor" fillOpacity="0.2"/>
              <circle cx="75" cy="30" r="3" fill="currentColor" fillOpacity="0.2"/>
              <rect x="47" y="20" width="6" height="45" rx="3" fill="currentColor"/>
              <circle cx="50" cy="18" r="4" fill="currentColor"/>
            </svg>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-700">
              PennyWings
            </span>
            Budget
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <a
              href="#"
              className="hover:text-pink-600 transition-colors duration-300"
            >
              Privacy
            </a>
            <Link
              to="/terms-and-conditions"
              className="hover:text-pink-600 transition-colors duration-300"
            >
              Terms
            </Link>
            <a
              href="#"
              className="hover:text-pink-600 transition-colors duration-300"
            >
              Contact
            </a>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} PennyWings. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
