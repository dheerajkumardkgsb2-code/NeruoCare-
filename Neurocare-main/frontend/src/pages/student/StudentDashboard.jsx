import { Outlet, useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../../lib/api.js";
import { SidebarDemo as AppSidebar } from "../../components/Sidebar.jsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from 'react-i18next';
import ThemeToggle from "../../components/ThemeToggle.jsx";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StudentDashboard() {
  const { studentId } = useParams();
  const location = useLocation();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const mainRef = useRef(null);
  const headerRef = useRef(null);
  const quoteRef = useRef(null);
  const modalRef = useRef(null);
  
  const { t, i18n } = useTranslation();
  
  // Get quotes from translations
  const mentalHealthQuotes = t('dashboard.mentalHealthQuotes', { returnObjects: true });

  // Define available languages directly in the component
  const availableLanguages = [
    { code: 'en', name: t('language.english') },
    { code: 'hi', name: t('language.hindi') },
    { code: 'mr', name: t('language.marathi') },
    { code: 'ta', name: t('language.tamil') }
  ];

  // Check if we're on the dashboard home page
  const isDashboardHome = location.pathname === `/student/${studentId}`;

  useEffect(() => {
    // Close modal when clicking outside
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Check if the click was on the language button
        const languageButton = document.querySelector('.language-selector-button');
        if (!languageButton || !languageButton.contains(event.target)) {
          setLanguageMenuOpen(false);
        }
      }
    };

    // Close modal when pressing Escape key
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setLanguageMenuOpen(false);
      }
    };

    if (languageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [languageMenuOpen]);

  useEffect(() => {
    // Rotate quotes every 10 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % mentalHealthQuotes.length);
    }, 10000);

    return () => clearInterval(quoteInterval);
  }, [mentalHealthQuotes.length]);

  useEffect(() => {
    // Animate header on load
    if (headerRef.current) {
      gsap.fromTo(headerRef.current, 
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }

    // Animate quote cards with stagger effect
    if (quoteRef.current && isDashboardHome) {
      const quoteCards = quoteRef.current.querySelectorAll('.quote-card');
      gsap.fromTo(quoteCards,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }, [isDashboardHome, mentalHealthQuotes.length]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId) {
        setError(t('errors.noStudentId'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(`/students/${studentId}`);
        
        if (response.data) {
          setStudent(response.data);
        } else {
          setError(t('errors.noStudentData'));
        }
      } catch (err) {
        console.error("StudentDashboard - Error:", err);
        setError(err.response?.data?.message || t('errors.loadFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId, t]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguageMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="nc-page flex min-h-screen">
        <AppSidebar role="student" id={studentId} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-indigo-700 font-medium">{t('loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nc-page flex min-h-screen">
        <AppSidebar role="student" id={studentId} />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('errors.somethingWrong')}</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {t('errors.tryAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nc-page flex min-h-screen">
      {/* Sidebar */}
      <AppSidebar role="student" id={studentId} />
      
      {/* Main Content */}
      <div ref={mainRef} className="nc-dashboard-main pl-16 md:pl-48 flex-1 min-w-0 overflow-auto transition-all duration-300">
        {/* Header */}
        <header ref={headerRef} className="nc-dashboard-header relative px-4 sm:px-8 py-5 sm:py-8 mb-6">
          <div className="relative flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">
                {t('dashboard.title')}
              </h1>
              <p className="text-indigo-700 dark:text-slate-300">
                {t('dashboard.welcome', { name: student?.fullName || 'Student' })}
              </p>
              {student?.email && (
                <p className="text-sm text-indigo-600/80 dark:text-slate-400 mt-1">{student.email}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Language Selector Button */}
              <button
                onClick={() => setLanguageMenuOpen(true)}
                className="language-selector-button flex items-center gap-2 px-2 sm:px-4 py-2 nc-surface rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <span className="hidden sm:inline text-indigo-700 dark:text-indigo-200 font-medium">
                  {availableLanguages.find(lang => lang.code === i18n.language)?.name || t('language.english')}
                </span>
                <svg 
                  className="w-4 h-4 text-indigo-600 dark:text-indigo-300"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <ThemeToggle inline />
              
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {student?.username?.charAt(0) || 'S'}
              </div>
            </div>
          </div>
        </header>

        {/* Language Selection Modal */}
        {languageMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-sm">
            <div 
              ref={modalRef}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in"
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">{t('language.selectLanguage')}</h3>
                <button 
                  onClick={() => setLanguageMenuOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 max-h-96 overflow-y-auto">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg mb-2 transition-all ${
                      i18n.language === lang.code 
                        ? 'bg-indigo-100 text-indigo-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex-1 text-left">{lang.name}</span>
                    {i18n.language === lang.code && (
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <button 
                  onClick={() => setLanguageMenuOpen(false)}
                  className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {t('language.close')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="px-8">
          {/* Pass studentId to the Outlet component */}
          <Outlet context={{ studentId }} />
        </div>

        {/* Quotes Section - Only show on dashboard home */}
        {isDashboardHome && (
          <div ref={quoteRef} className="mt-12 px-8 pb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-indigo-800">{t('dashboard.dailyInspiration')}</h2>
              <div className="flex space-x-2">
                {mentalHealthQuotes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuote(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentQuote ? 'bg-indigo-500 w-6' : 'bg-indigo-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 mb-8">
              <p className="text-xl text-gray-800 italic mb-4">"{mentalHealthQuotes[currentQuote]?.text}"</p>
              <p className="text-indigo-600 text-right">— {mentalHealthQuotes[currentQuote]?.author}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentalHealthQuotes.map((quote, index) => (
                <div 
                  key={index} 
                  className="quote-card bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-md border border-white/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <p className="text-gray-700 italic mb-3">"{quote.text}"</p>
                  <p className="text-indigo-600 text-sm text-right">— {quote.author}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}