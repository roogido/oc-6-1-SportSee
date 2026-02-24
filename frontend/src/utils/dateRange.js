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
function toIsoDate(d) {
	return d.toISOString().slice(0, 10);
}

export function getLastNDaysRange(days) {
	if (!Number.isInteger(days) || days <= 0) {
		throw new Error('getLastNDaysRange(days): days must be a positive integer');
	}

	const end = new Date();
	const start = new Date(end);
	start.setDate(end.getDate() - (days - 1));

	return { startDate: toIsoDate(start), endDate: toIsoDate(end) };
}