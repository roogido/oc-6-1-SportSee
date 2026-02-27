/**
 * @file router.jsx
 * @description
 * Configuration des routes de l’application SportSee.
 * Définit la navigation et les protections d’accès.
 *
 * Date : 14 février 2026
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';

import Layout from '../components/layout/Layout/Layout';

import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import NotFound from '../pages/Errors/NotFound';


/**
 * Configuration principale du routeur.
 * Définit les routes publiques et protégées.
 * (Utilise l’historique HTML5)
 */
export const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			// Route par défaut du parent "/" : Redirige vers dashboard 
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
