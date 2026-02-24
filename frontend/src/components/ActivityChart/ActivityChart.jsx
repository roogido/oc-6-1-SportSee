/**
 * @file ActivityChart.jsx
 * @description
 * Composant graphique affichant l’activité utilisateur
 * sous forme de diagramme en barres (Recharts).
 *
 * Reçoit des données déjà normalisées (via mapper)
 * et affiche distance et durée par session.
 * 
 * Date : 23-02-2026
 */

import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from 'recharts';


/**
 * Tooltip personnalisé affiché au survol d’une barre.
 *
 * @param {Object} props
 * @param {boolean} props.active Indique si le tooltip est actif.
 * @param {Array} props.payload Données du point survolé.
 * @param {string|number} props.label Valeur de l’axe X (dayIndex).
 * @returns {JSX.Element|null}
 */
function CustomTooltip({ active, payload, label }) {
    // Ne rien afficher si inactif ou données absentes
	if (!active || !payload || payload.length === 0) return null;

    // Extraction des valeurs correspondant aux dataKey des Bar
	const distance = payload.find((p) => p.dataKey === 'distanceKm')?.value;
	const duration = payload.find((p) => p.dataKey === 'durationMin')?.value;

	return (
		<div
			style={{
				color: 'black',
				background: '#fff',
				border: '1px solid #ddd',
				padding: 8,
			}}
		>
			<div>Jour: J{label}</div>
			<div>{distance} km</div>
			<div>{duration} min</div>
		</div>
	);
}

/**
 * Graphique d’activité utilisateur.
 *
 * @param {Object} props
 * @param {Array} props.data Tableau des sessions normalisées.
 * @returns {JSX.Element}
 */
export default function ActivityChart({ data }) {

    // Ajoute un index séquentiel pour l’axe X (J1, J2, ...)
	const chartData = data.map((d, index) => ({
		...d,
		dayIndex: index + 1,
	}));

	return (
		<div style={{ width: '100%', maxWidth: 800, minWidth: 320 }}>
			<h3 style={{ margin: '0 0 12px' }}>Activité</h3>

			{/* Conteneur responsive avec hauteur fixe (nécessaire pour Recharts) */}
			<ResponsiveContainer
				width="100%"
				height={320}
				minWidth={320}
				minHeight={320}
			>
				<BarChart data={chartData} barCategoryGap={20}>
                    {/* Grille visuelle */}
					<CartesianGrid strokeDasharray="3 3" />

                    {/* Axe horizontal basé sur l’index de jour */}
					<XAxis dataKey="dayIndex" />

                    {/* Axe vertical (valeurs numériques) */}
					<YAxis />

                    {/* Tooltip personnalisé */}
					<Tooltip content={<CustomTooltip />} />

                    {/* Séries de données */}
					<Bar dataKey="distanceKm" />
					<Bar dataKey="durationMin" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
