// src/utils/isoDate.js

/**
 * Parse une date ISO "YYYY-MM-DD" en Date locale (sans décalage UTC).
 * Evite les bugs de timezone (Mar/Mer).
 */
export function parseIsoDateLocal(iso) {
	if (typeof iso !== 'string') return new Date(NaN);

	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
	if (!m) return new Date(NaN);

	const year = Number(m[1]);
	const month = Number(m[2]);
	const day = Number(m[3]);

	return new Date(year, month - 1, day);
}

/**
 * Formate une Date locale en "YYYY-MM-DD".
 */
export function toIsoDateLocal(date) {
	if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';

	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');

	return `${y}-${m}-${d}`;
}