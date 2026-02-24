// src/components/WeeklyAverageChart/WeeklyAverageChart.jsx
import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from 'recharts';

import { parseIsoDateLocal } from '../../utils/isoDate';
import styles from './WeeklyAverageChart.module.css';

function CustomTooltip({ active, payload }) {
	if (!active || !payload || payload.length === 0) return null;
	const value = payload[0]?.value;
	return <div className={styles.tooltip}>{value} km</div>;
}

function formatRangeLabel(startIso, endIso) {
	if (!startIso || !endIso) return '';

	const start = parseIsoDateLocal(startIso);
	const end = parseIsoDateLocal(endIso);

	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '';

	const startStr = start
		.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
		.replace('.', '');
	const endStr = end
		.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
		.replace('.', '');

	return `${startStr} - ${endStr}`;
}

export default function WeeklyAverageChart({ data, rangeLabel, onPrev, onNext }) {
	const chartData = Array.isArray(data) ? data : [];

	const first = chartData[0];
	const last = chartData[chartData.length - 1];

	// Titre = moyenne des totals hebdo (arrondie)
	const averageAll = chartData.length
		? Math.round(
				chartData.reduce((sum, w) => sum + (Number(w.totalKm) || 0), 0) / chartData.length
		  )
		: 0;

	const computedRangeLabel =
		rangeLabel ?? formatRangeLabel(first?.startIso, last?.endIso);

	// Domaine Y auto propre
	const maxTotal = chartData.reduce((m, w) => Math.max(m, Number(w.totalKm) || 0), 0);
	const yMax = Math.max(30, Math.ceil(maxTotal / 5) * 5);

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
					<button
						type="button"
						className={styles.rangeBtn}
						aria-label="Période précédente"
						onClick={onPrev}
						disabled={!onPrev}
					>
						‹
					</button>

					<span className={styles.rangeLabel}>{computedRangeLabel}</span>

					<button
						type="button"
						className={styles.rangeBtn}
						aria-label="Période suivante"
						onClick={onNext}
						disabled={!onNext}
					>
						›
					</button>
				</div>
			</header>

			<div className={styles.chartArea}>
				<ResponsiveContainer width="100%" height={330}>
					<BarChart data={chartData} margin={{ top: 10, right: 18, left: 6, bottom: 10 }}>
						<CartesianGrid
							strokeDasharray="3 3"
							vertical={false}
							stroke="#D9D9D9"
							strokeWidth={1}
						/>

						<XAxis
							dataKey="weekLabel"
							tickLine={false}
							axisLine={{ stroke: '#000000', strokeWidth: 1, shapeRendering: 'crispEdges' }}
							tick={{ fontSize: 12, fill: '#8C8C8C' }}
						/>

						<YAxis
							tickLine={false}
							axisLine={{ stroke: '#000000', strokeWidth: 1, shapeRendering: 'crispEdges' }}
							domain={[0, yMax]}
							ticks={[0, 10, 20, 30]}
							tick={{ fontSize: 12, fill: '#8C8C8C' }}
						/>

						<Tooltip cursor={false} content={<CustomTooltip />} />

						<Bar
							dataKey="totalKm"
							barSize={14}
							radius={[10, 10, 10, 10]}
							className={styles.bar}
						/>
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