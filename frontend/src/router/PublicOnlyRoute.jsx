/**
 * @file PublicOnlyRoute.jsx
 * @description Route accessible uniquement aux utilisateurs non authentifiés.
 * Redirige vers le dashboard si l'utilisateur est déjà connecté.
 *
 * @author Salem Hadjali
 * @date 21-02-2026
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

/**
 * Composant de garde empêchant un utilisateur authentifié
 * d'accéder aux pages publiques (ex: Login).
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export default function PublicOnlyRoute({ children }) {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		// Empêche l'accès à la page publique si déjà connecté
		return <Navigate to="/dashboard" replace />;
	}

	return children;
}
