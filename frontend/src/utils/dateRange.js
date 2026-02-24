/**
 * @file dateRange.js
 * @description
 * Utilitaire permettant de générer une plage de dates
 * correspondant aux 7 derniers jours (inclus).
 *
 * Les dates sont retournées au format ISO simplifié (YYYY-MM-DD)
 * pour être utilisées dans les appels API.
 * 
 * Date : 21-02-2026
 */

/**
 * Calcule la plage des 7 derniers jours.
 *
 * @returns {Object} {
 *   startWeek: string (YYYY-MM-DD),
 *   endWeek: string (YYYY-MM-DD)
 * }
 */
export function getLast7DaysRange() {

	// Date actuelle (fin de période)
	const end = new Date();

	// Copie de la date actuelle pour éviter de modifier "end"
	const start = new Date(end);

	// Recul de 6 jours pour obtenir une plage de 7 jours au total
	start.setDate(end.getDate() - 6);

	// Convertit une Date en format ISO court (YYYY-MM-DD)
	const toIso = (d) => d.toISOString().slice(0, 10);

	return {
		startWeek: toIso(start),
		endWeek: toIso(end),
	};
}