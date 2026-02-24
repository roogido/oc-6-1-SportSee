/**
 * @file AuthProvider.jsx
 * @description Fournit le contexte d'authentification à l'application.
 * Gère l'état du token, l'utilisateur et les actions login/logout.
 *
 * @author Salem Hadjali
 * @date 21-02-2026
 */

import { useCallback, useMemo, useState } from 'react';
import { loginRequest } from '../api/authApi';
import { clearAuth, getToken, getUserId, setAuth } from '../api/tokenStorage';
import { AuthContext } from './authContext';

/**
 * Provider d'authentification.
 * Encapsule l'application et expose l'état + actions via AuthContext.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export function AuthProvider({ children }) {
	// Initialisation lazy depuis le localStorage (exécutée une seule fois)
	const [token, setToken] = useState(() => getToken());
	const [userId, setUserId] = useState(() => getUserId());

	const isAuthenticated = Boolean(token);

	// Fonction stable de connexion
	const login = useCallback(async ({ username, password }) => {
		const { token: newToken, userId: newUserId } = await loginRequest({
			username,
			password,
		});

		// Persistance + mise à jour du state React
		setAuth({ token: newToken, userId: newUserId });
		setToken(newToken);
		setUserId(newUserId);

		return { token: newToken, userId: newUserId };
	}, []);

	// Fonction stable de déconnexion
	const logout = useCallback(() => {
		clearAuth();
		setToken(null);
		setUserId(null);
	}, []);

	// Stabilise la valeur du contexte pour éviter les rerenders inutiles
	const value = useMemo(
		() => ({ token, userId, isAuthenticated, login, logout }),
		[token, userId, isAuthenticated, login, logout],
	);

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}
