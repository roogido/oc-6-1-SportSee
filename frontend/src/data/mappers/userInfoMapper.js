/**
 * @file userInfoMapper.js
 * @description
 * Transforme les données brutes utilisateur (payload API ou mock)
 * en un format normalisé et sécurisé pour l’application.
 *
 * - Valide la structure minimale attendue.
 * - Applique des valeurs par défaut.
 * - Force les types (Number, null, etc.).
 *
 * Date : 22-02-2026
 * 
 * @param {Object} raw Données brutes reçues.
 * @returns {Object} Objet utilisateur formaté et prêt à l’usage.
 */

export function mapUserInfo(raw) {
	if (!raw || !raw.profile || !raw.statistics) {
		throw new Error('Invalid user-info payload');
	}

	const { profile, statistics } = raw;

	return {
		user: {
			firstName: profile.firstName ?? '',
			lastName: profile.lastName ?? '',
			createdAt: profile.createdAt ?? null,
			age: Number(profile.age ?? 0),
			weightKg: Number(profile.weight ?? 0),
			heightCm: Number(profile.height ?? 0),
			profilePictureUrl: profile.profilePicture ?? null,
		},
		stats: {
			totalDistanceKm: Number(statistics.totalDistance ?? 0),
			totalSessions: Number(statistics.totalSessions ?? 0),
			totalDurationMin: Number(statistics.totalDuration ?? 0),
		},
	};
}
