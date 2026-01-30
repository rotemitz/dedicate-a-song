import React, { createContext, useContext, useState, useEffect } from 'react';
import { transformAllDedications, getMediaUrl } from '../lib/storage';

const DedicationsContext = createContext(null);

// Sorting functions
const sortDedications = (dedications, orderType) => {
    const sorted = [...dedications];

    switch (orderType) {
        case 'emotional':
            return sorted.sort((a, b) =>
                (a.sort_priority?.emotional_journey || 999) - (b.sort_priority?.emotional_journey || 999)
            );

        case 'close_first':
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

export const DedicationsProvider = ({ children }) => {
    const [dedications, setDedications] = useState([]);
    const [finaleData, setFinaleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load dedications data on mount
    useEffect(() => {
        // Use absolute path from root to support deep linking
        const dataPath = import.meta.env.BASE_URL + 'data/dedications.json';

        fetch(dataPath)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to load dedications');
                }
                return res.json();
            })
            .then(data => {
                // Transform local paths to storage URLs
                const withStorageUrls = transformAllDedications(data.dedications);
                setDedications(withStorageUrls);

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

    // Get sorted dedications
    const getSortedDedications = (sortType) => {
        if (!sortType) return dedications;
        return sortDedications(dedications, sortType);
    };

    const value = {
        dedications,
        finaleData,
        loading,
        error,
        getSortedDedications
    };

    return (
        <DedicationsContext.Provider value={value}>
            {children}
        </DedicationsContext.Provider>
    );
};

export const useDedications = () => {
    const context = useContext(DedicationsContext);
    if (!context) {
        throw new Error('useDedications must be used within a DedicationsProvider');
    }
    return context;
};
