// src/data/selectors/weeklyAverageDistance.js

function parseIsoDate(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) throw new Error(`Invalid ISO date: ${iso}`);
	return d;
}

function startOfIsoWeek(date) {
	// ISO week starts Monday
	const d = new Date(date);
	const day = d.getDay(); // 0=Sun, 1=Mon, ...
	const diff = (day === 0 ? -6 : 1) - day; // shift to Monday
	d.setDate(d.getDate() + diff);
	d.setHours(0, 0, 0, 0);
	return d;
}

function addDays(date, days) {
	const d = new Date(date);
	d.setDate(d.getDate() + days);
	return d;
}

function toIsoDate(d) {
	return d.toISOString().slice(0, 10);
}

/**
 * Build 4 weekly buckets ending at endDateIso (inclusive).
 * Returns buckets from oldest -> newest labeled S1..S4.
 *
 * @param {Array} sessions mapped sessions from mapUserActivity()
 * @param {string} endDateIso ISO (YYYY-MM-DD)
 * @param {number} weeks number of weeks (default 4)
 * @returns {Array<{ weekLabel: string, startIso: string, endIso: string, averageKm: number }>}
 */
export function buildWeeklyAverageDistance(sessions, endDateIso, weeks = 4) {
	if (!Array.isArray(sessions)) {
		throw new Error('buildWeeklyAverageDistance: sessions must be an array');
	}

	const endDate = parseIsoDate(endDateIso);
	const endWeekStart = startOfIsoWeek(endDate);

	const starts = [];
	for (let i = weeks - 1; i >= 0; i -= 1) {
		starts.push(addDays(endWeekStart, -7 * i));
	}

	const buckets = starts.map((start, idx) => {
		const end = addDays(start, 6);
		return {
			weekLabel: `S${idx + 1}`,
			startIso: toIsoDate(start),
			endIso: toIsoDate(end),
			totalKm: 0,
			activeDays: 0,
		};
	});

	for (const s of sessions) {
		const iso = s?.dateIso;
		if (typeof iso !== 'string') continue;

		for (const b of buckets) {
			if (iso >= b.startIso && iso <= b.endIso) {
				const km = Number(s.distanceKm) || 0;
				b.totalKm += km;
				if (km > 0) b.activeDays += 1;
				break;
			}
		}
	}

	return buckets.map((b) => {
		const denom = b.activeDays > 0 ? b.activeDays : 1;
		const avg = b.totalKm / denom;

		return {
			weekLabel: b.weekLabel,
			startIso: b.startIso,
			endIso: b.endIso,
			totalKm: Number(b.totalKm.toFixed(1)),
			averageKm: Number(avg.toFixed(1)),
		};
	});
}
