import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { routes } from './routes/Router';
import { useDedications } from './contexts/DedicationsContext';

function App() {
  console.log('[App] Version: 3.0.0 - Routing enabled');

  const { loading, error, dedications } = useDedications();

  if (loading) {
    return (
      <div className="min-h-screen bg-celebration-cream flex flex-col items-center justify-center">
        {/* Animated spinner */}
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-rose-gold-200 opacity-25"></div>
          <div className="absolute inset-0 rounded-full border-4 border-rose-gold-500 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-rose-gold-600 font-serif text-xl italic">Preparing your celebration...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-celebration-cream flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-floating text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-gold-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-rose-gold-500 text-3xl">error</span>
          </div>
          <h2 className="text-celebration-charcoal font-serif text-2xl font-bold mb-3">
            Unable to Load Dedications
          </h2>
          <p className="text-celebration-charcoal/60 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 text-white rounded-full font-bold hover:shadow-md transition-all"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (dedications.length === 0) {
    return (
      <div className="min-h-screen bg-celebration-cream flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-gold-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-rose-gold-500 text-4xl">music_note</span>
          </div>
          <h2 className="text-celebration-charcoal font-serif text-2xl font-bold mb-3">
            No Dedications Yet
          </h2>
          <p className="text-celebration-charcoal/60">
            Check back soon for heartfelt messages!
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}

export default App;

