import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import DedicationsScreen from './components/DedicationsScreen';
import { AudioProvider } from './context/AudioContext';
import { transformAllDedications, getMediaUrl } from './lib/supabase';

function App() {
  const [showDedications, setShowDedications] = useState(false);
  const [dedications, setDedications] = useState([]);
  const [finaleData, setFinaleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check return visitor
    if (localStorage.getItem('birthday_app_visited')) {
      setShowDedications(true);
    }

    // Load Data
    fetch('data/dedications.json')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to load dedications');
        }
        return res.json();
      })
      .then(data => {
        // Sort by ID as requested
        const sorted = data.dedications.sort((a, b) => a.id - b.id);
        // Transform local paths to Supabase Storage URLs
        const withSupabaseUrls = transformAllDedications(sorted);
        setDedications(withSupabaseUrls);

        // Extract and transform finale data if present
        if (data.finale) {
          setFinaleData({
            ...data.finale,
            video: getMediaUrl(data.finale.video)
          });
        }

        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load dedications", err);
        setError(err.message || 'Failed to load dedications');
        setLoading(false);
      });
  }, []);

  const handleStart = () => {
    // Mark visited
    localStorage.setItem('birthday_app_visited', 'true');

    // Delay for confetti
    setTimeout(() => {
      setShowDedications(true);
    }, 1500);
  };

  const handleBackToWelcome = () => {
    setShowDedications(false);
  };

  if (loading) {
    return (
      <AudioProvider>
        <div className="min-h-screen bg-celebration-cream flex flex-col items-center justify-center">
          {/* Animated spinner */}
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-rose-gold-200 opacity-25"></div>
            <div className="absolute inset-0 rounded-full border-4 border-rose-gold-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-rose-gold-600 font-serif text-xl italic">Preparing your celebration...</p>
        </div>
      </AudioProvider>
    );
  }

  if (error) {
    return (
      <AudioProvider>
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
      </AudioProvider>
    );
  }

  if (dedications.length === 0) {
    return (
      <AudioProvider>
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
      </AudioProvider>
    );
  }

  return (
    <AudioProvider>
      {showDedications ? (
        <DedicationsScreen dedications={dedications} finaleData={finaleData} onBack={handleBackToWelcome} />
      ) : (
        <WelcomeScreen onStart={handleStart} />
      )}
    </AudioProvider>
  );
}

export default App;
