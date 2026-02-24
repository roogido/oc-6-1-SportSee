/**
 * @file router.jsx
 * @description
 * Définition centralisée des routes de l’application SportSee.
 *
 * Date : 14 février 2026
 */

import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout/Layout';
import PublicOnlyRoute from './PublicOnlyRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import NotFound from "../pages/Errors/NotFound";
import ProtectedRoute from './ProtectedRoute';


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/login",
        element: (
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
