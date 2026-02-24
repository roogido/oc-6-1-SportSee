/**
 * @file userInfo.raw.mock.js
 * @description
 * Données brutes simulées représentant la réponse backend
 * pour les informations utilisateur.
 *
 * Format volontairement proche d’une réponse API réelle.
 * Ces données sont ensuite transformées via un mapper
 * avant d’être utilisées dans l’application.
 * 
 * Date : 22-02-2026
 */

export const mockUserInfoRaw = {
	profile: {
		firstName: 'SophieZ',
		lastName: 'Martin',
		createdAt: '2025-01-01',
		age: 32,
		weight: 60,
		height: 165,
		profilePicture: 'http://localhost:8000/images/sophie.jpg',
	},
	statistics: {
		totalDistance: '2250.2',
		totalSessions: 348,
		totalDuration: 14625,
	},
};
