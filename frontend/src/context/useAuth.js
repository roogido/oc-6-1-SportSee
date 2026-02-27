/**
 * @file useAuth.js
 * @description Hook personnalisé permettant d'accéder au contexte d'authentification.
 *
 * @author Salem Hadjali
 * @date 21-02-2026
 */

import { useContext } from 'react';
import { AuthContext } from './authContext';


/**
 * Retourne le contexte Auth.
 * Doit être utilisé à l'intérieur d'un AuthProvider.
 *
 * @returns {{ token: string|null, userId: number|null, isAuthenticated: boolean, login: Function, logout: Function }}
 */
export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}
