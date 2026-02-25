// src/data/selectors/weekKpis.js
export function buildWeekKpis(sessions = [], range = { startIso: '', endIso: '' }) {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return { distanceKm: 0, durationMin: 0, sessionsCount: 0 };
  }

  const { startIso, endIso } = range;

  // fallback : si pas de range valide on prend toutes les sessions
  const filtered = Array.isArray(sessions)
    ? sessions.filter((s) => {
        if (!startIso || !endIso) return true;
        if (typeof s?.dateIso !== 'string') return false;
        return s.dateIso >= startIso && s.dateIso <= endIso;
      })
    : [];

  const distanceKm = filtered.reduce((sum, s) => sum + (Number(s.distanceKm) || 0), 0);
  const durationMin = filtered.reduce((sum, s) => sum + (Number(s.durationMin) || 0), 0);
  const sessionsCount = filtered.length;

  return { distanceKm, durationMin, sessionsCount };
}