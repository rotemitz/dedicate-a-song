/**
 * Routing and state persistence utilities
 */

// Get sort parameter from URL query string
export const getSortFromUrl = (searchParams) => {
    const sort = searchParams.get('sort');
    if (sort && ['emotional', 'close_first', 'random'].includes(sort)) {
        return sort;
    }
    return null;
};

// Get saved sort preference from localStorage
export const getSavedSort = () => {
    try {
        return localStorage.getItem('birthday_app_sort') || null;
    } catch {
        return null;
    }
};

// Save sort preference to localStorage
export const saveSort = (sortType) => {
    try {
        localStorage.setItem('birthday_app_sort', sortType);
    } catch {
        // Ignore storage errors
    }
};

// Check if user has visited before
export const hasVisitedBefore = () => {
    try {
        return localStorage.getItem('birthday_app_visited') === 'true';
    } catch {
        return false;
    }
};

// Mark user as having visited
export const markAsVisited = () => {
    try {
        localStorage.setItem('birthday_app_visited', 'true');
    } catch {
        // Ignore storage errors
    }
};

// Convert dedication name to URL-safe slug
export const normalizeDedicationName = (name) => {
    return name
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^\u0590-\u05FFa-z0-9-]/g, ''); // Keep Hebrew, English, numbers, and hyphens
};

// Find dedication by URL slug
export const findDedicationBySlug = (dedications, slug) => {
    if (!slug || !dedications) return null;

    return dedications.find(dedication =>
        normalizeDedicationName(dedication.name) === slug
    );
};

// Get dedication index by slug
export const getDedicationIndexBySlug = (dedications, slug) => {
    if (!slug || !dedications) return -1;

    return dedications.findIndex(dedication =>
        normalizeDedicationName(dedication.name) === slug
    );
};

// Get player state from URL query string ('greeting' or 'song')
export const getPlayerStateFromUrl = (searchParams) => {
    const state = searchParams.get('state');
    if (state && ['greeting', 'song'].includes(state)) {
        return state;
    }
    return null; // Default to natural flow
};
