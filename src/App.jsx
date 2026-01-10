import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import DedicationsScreen from './components/DedicationsScreen';

function App() {
  const [showDedications, setShowDedications] = useState(false);
  const [dedications, setDedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check return visitor
    if (localStorage.getItem('birthday_app_visited')) {
      setShowDedications(true);
    }

    // Load Data
    fetch('data/dedications.json')
      .then(res => res.json())
      .then(data => {
        // Sort by ID as requested
        const sorted = data.dedications.sort((a, b) => a.id - b.id);
        setDedications(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load dedications", err);
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

  if (loading) {
    return <div className="screen active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  // We can just conditionally render components
  // But for the fading transition, we might keep both mounted or use CSS
  // For simplicity: Conditional render.

  if (showDedications) {
    return <DedicationsScreen dedications={dedications} />;
  }

  return <WelcomeScreen onStart={handleStart} />;
}

export default App;
