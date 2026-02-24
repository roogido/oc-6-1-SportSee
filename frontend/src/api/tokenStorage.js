/**
 * @file tokenStorage.js
 * @description Gestion centralisée du stockage local
 * du token JWT et de l'identifiant utilisateur.
 * Abstraction autour de localStorage pour l'authentification.
 *
 * @author Salem Hadjali
 * @date 21-02-2026
 */

const TOKEN_KEY = 'sportsee.jwt';
const USER_ID_KEY = 'sportsee.userId';


export function getToken() {
	return localStorage.getItem(TOKEN_KEY);
}

export function getUserId() {
	return localStorage.getItem(USER_ID_KEY);
}

export function setAuth({ token, userId }) {
	localStorage.setItem(TOKEN_KEY, token);
	localStorage.setItem(USER_ID_KEY, String(userId));
}

export function clearAuth() {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(USER_ID_KEY);
}
