/**
 * @file authApi.js
 * @description Fonctions liées à l’authentification.
 * Encapsule les appels API relatifs au login.
 *
 * @author Salem Hadjali
 * @date 21-0-2026
 */

import { apiFetch } from './apiClient';


/**
 * Effectue une requête de connexion.
 *
 * @param {{ username: string, password: string }} credentials
 * @returns {Promise<{ token: string, userId: number }>}
 */
export async function loginRequest({ username, password }) {
	return apiFetch('/api/login', {
		method: 'POST',
		body: { username, password },
	});
}
