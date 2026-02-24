/**
 * @file dataProvider.js
 * @description
 * Fournisseur centralisé de données pour l’application.
 *
 * Permet de choisir dynamiquement la source des données :
 * - API réelle (backend)
 * - Données mockées (développement / tests)
 *
 * Le choix se fait via la variable d’environnement VITE_DATA_SOURCE.
 *
 * Ce fichier implémente une abstraction pour découpler
 * la logique métier (hooks / composants) de la source réelle des données.
 * 
 * Date : 22-02-2026
 */

import { createApiProvider } from './providers/apiProvider';
import { createMockProvider } from './providers/mockProvider';

/**
 * Factory responsable de sélectionner le provider adapté.
 *
 * @returns {Object} Instance du provider choisi (API ou Mock)
 */
export function createDataProvider() {
	const source = import.meta.env.VITE_DATA_SOURCE || 'api';
	return source === 'mock'
		? createMockProvider()
		: createApiProvider();
}

/**
 * Instance unique du provider de données utilisée dans l’application.
 * Les hooks métier (ex: useUserInfo) consomment cet objet
 * sans connaître la source réelle des données.
 */
export const dataProvider = createDataProvider();
