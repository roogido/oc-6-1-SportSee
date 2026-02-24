/**
 * @file useUserActivity.js
 * @description
 * Hook personnalisé permettant de récupérer l’activité utilisateur
 * sur une plage de dates donnée.
 *
 * Gère :
 * - l’appel asynchrone via dataProvider
 * - l’état de chargement
 * - la gestion des erreurs
 * - la protection contre les mises à jour après démontage
 * 
 * Date : 23-02-2026
 */

import { useEffect, useState } from 'react';
import { dataProvider } from '../data/dataProvider';

/**
 * Récupère les données d’activité utilisateur.
 *
 * @param {Object} params
 * @param {string} params.startWeek Date de début (ISO)
 * @param {string} params.endWeek Date de fin (ISO)
 * @returns {Object} { data, isLoading, error }
 */
export function useUserActivity({ startWeek, endWeek }) {

	// États locaux du hook
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {

		// Permet d’éviter un setState si le composant est démonté
		let alive = true;

		(async () => {
			try {
				setIsLoading(true);   // Active le loader
				setError(null);       // Reset erreur précédente

				// Appel au provider (mock ou API selon config)
				const result = await dataProvider.getUserActivity({
					startWeek,
					endWeek,
				});

				// Mise à jour du state uniquement si toujours monté
				if (alive) setData(result);

			} catch (e) {
				// Capture erreur réseau / logique
				if (alive) setError(e);

			} finally {
				// Désactive le loader dans tous les cas
				if (alive) setIsLoading(false);
			}
		})();

		// Cleanup : exécuté au démontage ou avant relance de l’effet
		return () => {
			alive = false;
		};

	// Relance l’effet si la plage de dates change
	}, [startWeek, endWeek]);

	return { data, isLoading, error };
}
