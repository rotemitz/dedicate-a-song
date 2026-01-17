import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import OrderSelectionScreen from './components/OrderSelectionScreen';
import DedicationsScreen from './components/DedicationsScreen';
import { AudioProvider } from './context/AudioContext';
import { transformAllDedications, getMediaUrl } from './lib/supabase';

// Sorting functions for dedications
const sortDedications = (dedications, orderType) => {
  const sorted = [...dedications];

  switch (orderType) {
    case 'emotional':
      // Sort by emotional_journey priority (ascending)
      return sorted.sort((a, b) =>
        (a.sort_priority?.emotional_journey || 999) - (b.sort_priority?.emotional_journey || 999)
      );

    case 'close_first':
      // Sort by close_first priority (ascending)
      return sorted.sort((a, b) =>
        (a.sort_priority?.close_first || 999) - (b.sort_priority?.close_first || 999)
      );

    case 'random':
      // Fisher-Yates shuffle
      for (let i = sorted.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
      }
      return sorted;

    default:
      return sorted;
  }
};

function App() {
  // Screen state: 'welcome' | 'order_select' | 'dedications'
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [dedications, setDedications] = useState([]);
  const [sortedDedications, setSortedDedications] = useState([]);
  const [autoStartPlayer, setAutoStartPlayer] = useState(false);
  const [finaleData, setFinaleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Return visitors skip to order selection (they've already seen welcome)
    // Comment out for testing: if (localStorage.getItem('birthday_app_visited')) {
    //   setCurrentScreen('order_select');
    // }

    // Load Data
    fetch('data/dedications.json')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to load dedications');
        }
        return res.json();
      })
      .then(data => {
        // Transform local paths to Supabase Storage URLs (don't sort yet)
        const withSupabaseUrls = transformAllDedications(data.dedications);
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

    // Delay for confetti, then show order selection
    setTimeout(() => {
      setCurrentScreen('order_select');
    }, 1500);
  };

  const handleOrderSelect = (orderType) => {
    // Sort dedications based on selected order
    const sorted = sortDedications(dedications, orderType);
    setSortedDedications(sorted);
    setAutoStartPlayer(true);
    setCurrentScreen('dedications');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
    setAutoStartPlayer(false);
  };

  const handleBackToOrderSelect = () => {
    setCurrentScreen('order_select');
    setAutoStartPlayer(false);
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
      {currentScreen === 'welcome' && (
        <WelcomeScreen onStart={handleStart} />
      )}
      {currentScreen === 'order_select' && (
        <OrderSelectionScreen onSelect={handleOrderSelect} />
      )}
      {currentScreen === 'dedications' && (
        <DedicationsScreen
          dedications={sortedDedications}
          finaleData={finaleData}
          onBack={handleBackToOrderSelect}
          autoStartPlayer={autoStartPlayer}
          onAutoStartHandled={() => setAutoStartPlayer(false)}
        />
      )}
    </AudioProvider>
  );
}

export default App;
