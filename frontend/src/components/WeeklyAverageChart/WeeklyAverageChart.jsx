//src/components/WeeklyAverageChart/WeeklyAverageChart.jsx

import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from 'recharts';

import styles from './WeeklyAverageChart.module.css';

function CustomTooltip({ active, payload }) {
	if (!active || !payload || payload.length === 0) return null;
	const value = payload[0]?.value;

	return <div className={styles.tooltip}>{value} km</div>;
}

function formatRangeLabel(startIso, endIso) {
	if (!startIso || !endIso) return '';
	const start = new Date(startIso);
	const end = new Date(endIso);
	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '';

	const startStr = start.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }).replace('.', '');
	const endStr = end.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }).replace('.', '');
	return `${startStr} - ${endStr}`;
}

export default function WeeklyAverageChart({ data }) {
	const chartData = Array.isArray(data) ? data : [];

	const first = chartData[0];
	const last = chartData[chartData.length - 1];

	// Titre = moyenne des totals hebdo (arrondie)
	const averageAll = chartData.length
		? Math.round(
				chartData.reduce((sum, w) => sum + (Number(w.totalKm) || 0), 0) / chartData.length
		  )
		: 0;

	const rangeLabel = formatRangeLabel(first?.startIso, last?.endIso);

	// Domaine Y auto propre (Figma semble capé à 30, mais on adapte selon data)
	const maxTotal = chartData.reduce((m, w) => Math.max(m, Number(w.totalKm) || 0), 0);
	const yMax = Math.max(30, Math.ceil(maxTotal / 5) * 5); // min 30, arrondi au 5 supérieur

	return (
		<section className={styles.card}>
			<header className={styles.header}>
				<div>
					<div className={styles.headline}>
						<span className={styles.headlineValue}>{averageAll}km</span>{' '}
						<span className={styles.headlineText}>en moyenne</span>
					</div>
					<p className={styles.subline}>Total des kilomètres 4 dernières semaines</p>
				</div>

				<div className={styles.rangePicker} aria-label="Période">
					<button type="button" className={styles.rangeBtn} aria-label="Période précédente">
						‹
					</button>
					<span className={styles.rangeLabel}>{rangeLabel}</span>
					<button type="button" className={styles.rangeBtn} aria-label="Période suivante">
						›
					</button>
				</div>
			</header>

			<div className={styles.chartArea}>
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={chartData} margin={{ top: 10, right: 18, left: 6, bottom: 10 }}>
						<CartesianGrid strokeDasharray="3 3" vertical={false} />
						<XAxis dataKey="weekLabel" tickLine={false} axisLine={false} />
						<YAxis
							tickLine={false}
							axisLine={false}
							domain={[0, yMax]}
							ticks={[0, 10, 20, 30]}
						/>
						<Tooltip cursor={false} content={<CustomTooltip />} />

						{/* ✅ width 14px + radius + couleur via CSS (fill) */}
						<Bar dataKey="totalKm" barSize={14} radius={[10, 10, 10, 10]} className={styles.bar} />
					</BarChart>
				</ResponsiveContainer>
			</div>

			<footer className={styles.legend}>
				<span className={styles.legendDot} />
				<span className={styles.legendText}>Km</span>
			</footer>
		</section>
	);
}