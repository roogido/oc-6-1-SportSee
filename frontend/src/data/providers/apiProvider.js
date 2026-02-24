/**
 * @file apiProvider.js
 * @description
 * Fournisseur de données connecté au backend réel.
 * Implémente la même interface que le mockProvider
 * afin de permettre un basculement transparent mock/API.
 *
 * - Récupère le token d’authentification.
 * - Effectue les appels HTTP via apiFetch.
 * - Transforme les payloads bruts via des mappers.
 *
 * Date : 22-02-2026
 * 
 * @returns {Object} Provider exposant :
 * - getUserInfo()
 * - getUserActivity({ startWeek, endWeek })
 * - getProfileImage()
 */

import { apiFetch } from '../../api/apiClient';
import { getToken } from '../../api/tokenStorage';
import { mapUserInfo } from '../mappers/userInfoMapper';
import { mapUserActivity } from "../mappers/userActivityMapper";


export function createApiProvider() {
	return {
		async getUserInfo() {
			const token = getToken();
			const raw = await apiFetch('/api/user-info', { token });
			return mapUserInfo(raw);
		},

		async getUserActivity({ startWeek, endWeek }) {
			const token = getToken();
			const qs = new URLSearchParams({ startWeek, endWeek }).toString();
			const raw = await apiFetch(`/api/user-activity?${qs}`, { token });
			return mapUserActivity(raw);
		},

		async getProfileImage() {
			const token = getToken();
			return apiFetch('/api/profile-image', { token });
		},
	};
}
