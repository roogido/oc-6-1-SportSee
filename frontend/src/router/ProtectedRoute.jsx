/**
 * @file ProtectedRoute.jsx
 * @description
 * Composant de protection des routes privées.
 * Vérifie l’état d’authentification et redirige vers /login
 * si l’utilisateur n’est pas connecté.
 *
 * Permet également de mémoriser la route d’origine
 * afin de rediriger l’utilisateur après connexion.
 * 
 * Date : 21-02-2026
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

/**
 * Protège l’accès à une route.
 *
 * @param {Object} props
 * @param {JSX.Element} props.children Composant à rendre si autorisé.
 * @returns {JSX.Element}
 */
export default function ProtectedRoute({ children }) {

	// Récupère l’état d’authentification global
	const { isAuthenticated } = useAuth();

	// Récupère la route actuelle
	const location = useLocation();

	// Si non authentifié → redirection vers /login
	if (!isAuthenticated) {
		return (
			<Navigate 
				to="/login" 
				replace 
				state={{ from: location.pathname }} // mémorise la route initiale
			/>
		);
	}

	// Si authentifié : rend le composant protégé
	return children;
}