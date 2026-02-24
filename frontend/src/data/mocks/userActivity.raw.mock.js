/**
 * @file userActivity.raw.mock.js
 * @description
 * Données brutes simulées représentant la réponse backend
 * pour l’activité hebdomadaire de l’utilisateur.
 *
 * Structure proche d’une réponse API réelle (tableau de sessions).
 * Ces données sont transformées via un mapper
 * avant d’être exploitées dans l’application.
 * 
 * Date : 22-02-2026
 */

export const mockUserActivityRaw = [
	{
		date: '2025-12-01',
		distance: 4.8,
		duration: 31,
		heartRate: { min: 143, max: 179, average: 166 },
		caloriesBurned: 345,
	},
	{
		date: '2025-12-07',
		distance: 4.5,
		duration: 30,
		heartRate: { min: 144, max: 178, average: 166 },
		caloriesBurned: 330,
	},
	{
		date: '2025-12-14',
		distance: 3.8,
		duration: 25,
		heartRate: { min: 145, max: 180, average: 168 },
		caloriesBurned: 285,
	},
	{
		date: '2025-12-21',
		distance: 5.0,
		duration: 33,
		heartRate: { min: 143, max: 177, average: 165 },
		caloriesBurned: 360,
	},
	{
		date: '2025-12-28',
		distance: 6.8,
		duration: 44,
		heartRate: { min: 141, max: 177, average: 163 },
		caloriesBurned: 475,
	},
];
