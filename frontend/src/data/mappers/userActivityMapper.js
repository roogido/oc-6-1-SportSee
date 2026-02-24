/**
 * @file userActivityMapper.js
 * @description
 * Transforme un tableau de données brutes d’activité (API ou mock)
 * en une structure normalisée exploitable par l’application.
 *
 * - Valide que le payload est bien un tableau.
 * - Convertit les dates en objets Date.
 * - Extrait jour / mois / année pour faciliter l’affichage.
 * - Normalise et sécurise les types numériques.
 *
 * @param {Array} rawArray Tableau brut reçu du backend.
 * @returns {Array} Liste des sessions formatées et typées.
 * 
 * 
 * Date : 22-02-2026
 */

import { parseIsoDateLocal } from '../../utils/isoDate';


export function mapUserActivity(rawArray) {
	if (!Array.isArray(rawArray)) {
		throw new Error('Invalid user-activity payload');
	}

	return rawArray.map((item) => {
		const dateObj = parseIsoDateLocal(item.date);

		return {
			dateIso: item.date,
			date: dateObj,
			day: dateObj.getDate(),
			month: dateObj.getMonth() + 1,
			year: dateObj.getFullYear(),

			distanceKm: Number(item.distance ?? 0),
			durationMin: Number(item.duration ?? 0),

			calories: Number(item.caloriesBurned ?? 0),

			heartRate: {
				min: Number(item.heartRate?.min ?? 0),
				max: Number(item.heartRate?.max ?? 0),
				average: Number(item.heartRate?.average ?? 0),
			},
		};
	});
}
