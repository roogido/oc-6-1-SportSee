/**
 * @file router.jsx
 * @description
 * Définition centralisée des routes de l’application SportSee.
 *
 * Date : 14 février 2026
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';

import Layout from '../components/layout/Layout/Layout';

import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import NotFound from '../pages/Errors/NotFound';

import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Racine : choix simple. On redirige vers dashboard.
      // ProtectedRoute gérera la redirection vers /login si non auth.
      { index: true, element: <Navigate to="dashboard" replace /> },

      {
        path: 'login',
        element: (
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },

      { path: '*', element: <NotFound /> },
    ],
  },
]);
