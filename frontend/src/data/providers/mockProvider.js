/**
 * @file mockProvider.js
 * @description
 * Fournisseur de données simulées (mock) pour le développement.
 * Reproduit l’interface du provider API afin de permettre
 * le basculement mock/API sans modifier la logique métier.
 *
 * Les données brutes sont transformées via des mappers
 * pour garantir un format cohérent dans l’application.
 * 
 * Date : 22-02-2026
 * 
 * @returns {Object} Un provider avec les méthodes async :
 * - getUserInfo()
 * - getUserActivity({ startWeek, endWeek })
 * - getProfileImage()
 */

// Données brutes simulées (comme si elles venaient d'une API)
import { mockUserInfoRaw } from '../mocks/userInfo.raw.mock';
import { mockUserActivityRaw } from '../mocks/userActivity.raw.mock';

// Mappers : transforment les données brutes en format exploitable par l'app
import { mapUserInfo } from '../mappers/userInfoMapper';
import { mapUserActivity } from '../mappers/userActivityMapper';

// Simule un délai réseau (Promise + setTimeout)
function delay(ms = 200) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Factory qui crée un provider mock (même interface que l'API réelle)
export function createMockProvider() {
	return {

		// Simule la récupération des infos utilisateur
		async getUserInfo() {
			await delay(); // simulation latence réseau
			return mapUserInfo(mockUserInfoRaw); // transformation des données
		},

		// Simule la récupération de l'activité utilisateur
		async getUserActivity({ startWeek, endWeek } = {}) {
			// startWeek/endWeek ignorés en mock pour l’instant 
			await delay();
			return mapUserActivity(mockUserActivityRaw);
		},

		// Méthode non implémentée en mock (permet de tester la gestion d'erreur)
		async getProfileImage() {
			await delay();
			throw new Error('Mock profile image not implemented yet');
		},
	};
}