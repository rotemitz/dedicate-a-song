import React from 'react';
import { Navigate } from 'react-router-dom';
import WelcomeScreen from '../components/WelcomeScreen';
import OrderSelectionScreen from '../components/OrderSelectionScreen';
import DedicationsScreen from '../components/DedicationsScreen';
import { hasVisitedBefore } from '../lib/routingUtils';

/**
 * Root redirect component
 * First-time visitors go to welcome, return visitors go to dedications
 */
const RootRedirect = () => {
    const visited = hasVisitedBefore();
    return <Navigate to={visited ? '/dedications' : '/welcome'} replace />;
};

/**
 * Route configuration
 */
export const routes = [
    {
        path: '/',
        element: <RootRedirect />
    },
    {
        path: '/welcome',
        element: <WelcomeScreen />
    },
    {
        path: '/sorting',
        element: <OrderSelectionScreen />
    },
    {
        path: '/dedications',
        element: <DedicationsScreen />
    },
    {
        path: '/dedication/:name',
        element: <DedicationsScreen />
    }
];
