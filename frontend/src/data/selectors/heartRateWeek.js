// src/data/selectors/heartRateWeek.js

import { parseIsoDateLocal, toIsoDateLocal } from '../../utils/isoDate';

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function startOfIsoWeek(date) {
	const d = new Date(date);
	const day = d.getDay(); // 0=Dim, 1=Lun...
	const diff = (day === 0 ? -6 : 1) - day; // vers lundi
	d.setDate(d.getDate() + diff);
	d.setHours(0, 0, 0, 0);
	return d;
}

function addDays(date, days) {
	const d = new Date(date);
	d.setDate(d.getDate() + days);
	return d;
}

/**
 * Construit les données BPM pour la "dernière semaine ISO" visible,
 * avec navigation via weekOffset (‹ / ›).
 *
 * @param {Array} sessions Tableau de sessions mappées (doivent avoir dateIso, heartRate.*)
 * @param {number} weekOffset Décalage de semaine (0 = dernière semaine, -1 = semaine précédente, +1 = suivante)
 * @returns {{range:{startIso:string,endIso:string},days:Array}}
 */
export function buildLastIsoWeekHeartRate(sessions, weekOffset = 0) {
	if (!Array.isArray(sessions)) {
		throw new Error('buildLastIsoWeekHeartRate: sessions must be an array');
	}

	if (sessions.length === 0) {
		return { range: { startIso: '', endIso: '' }, days: [] };
	}

	// Dernière date dispo (ISO triable)
	const sorted = [...sessions].sort((a, b) =>
		a.dateIso > b.dateIso ? 1 : -1,
	);
	const lastIso = sorted[sorted.length - 1]?.dateIso;

	if (typeof lastIso !== 'string' || !lastIso) {
		return { range: { startIso: '', endIso: '' }, days: [] };
	}

	// Date de référence (locale) + navigation par semaines
	const refDate = parseIsoDateLocal(lastIso);
	if (Number.isNaN(refDate.getTime())) {
		return { range: { startIso: '', endIso: '' }, days: [] };
	}

	// Décale la semaine affichée (‹ / ›)
	refDate.setDate(refDate.getDate() + weekOffset * 7);

	const weekStart = startOfIsoWeek(refDate);

	const startIso = toIsoDateLocal(weekStart);
	const endIso = toIsoDateLocal(addDays(weekStart, 6));

	// Index des sessions de la semaine par dateIso
	const byIso = new Map();
	for (const s of sessions) {
		if (typeof s?.dateIso !== 'string') continue;
		if (s.dateIso >= startIso && s.dateIso <= endIso)
			byIso.set(s.dateIso, s);
	}

	const days = DAY_LABELS.map((label, idx) => {
		const iso = toIsoDateLocal(addDays(weekStart, idx));
		const s = byIso.get(iso);

		return {
			dayLabel: label,
			min: Number(s?.heartRate?.min ?? 0),
			max: Number(s?.heartRate?.max ?? 0),
			avg: Number(s?.heartRate?.average ?? 0),
		};
	});

	return { range: { startIso, endIso }, days };
}
