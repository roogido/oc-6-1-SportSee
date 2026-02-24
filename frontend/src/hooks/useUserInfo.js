/**
 * @file useUserInfo.js
 * @description
 * Hook personnalisé chargé de récupérer les informations
 * utilisateur au montage du composant.
 *
 * Gère :
 * - les données retournées
 * - l’état de chargement
 * - les erreurs éventuelles
 *
 * Date : 22-02-2026
 *
 * @returns {{
 *   data: object|null,
 *   isLoading: boolean,
 *   error: Error|null
 * }}
 */

import { useEffect, useState } from "react";
import { dataProvider } from "../data/dataProvider";


export function useUserInfo() {

  /**
   * Données utilisateur récupérées depuis le provider.
   */
  const [data, setData] = useState(null);

  /**
   * Indique si le chargement est en cours.
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Contient une éventuelle erreur lors de l’appel API.
   */
  const [error, setError] = useState(null);

  useEffect(() => {

    /**
     * Flag de sécurité permettant d’éviter une mise à jour
     * du state si le composant est démonté avant la fin
     * de la requête asynchrone.
     */
    let alive = true;

    /**
     * Fonction asynchrone auto-exécutée pour effectuer
     * l’appel API (useEffect ne peut pas être async).
     */
    (async () => {
      try {

        /** Active l’état de chargement */
        setIsLoading(true);

        /** Réinitialise les erreurs précédentes */
        setError(null);

        /**
         * Appel au dataProvider pour récupérer
         * les informations utilisateur.
         */
        const result = await dataProvider.getUserInfo();

        /**
         * Mise à jour des données uniquement si
         * le composant est encore monté.
         */
        if (alive) setData(result);

      } catch (e) {

        /**
         * Capture et stockage de l’erreur
         * si le composant est encore monté.
         */
        if (alive) setError(e);

      } finally {

        /**
         * Désactive le loading une fois
         * la requête terminée.
         */
        if (alive) setIsLoading(false);
      }
    })();

    /**
     * Fonction de nettoyage exécutée :
     * - au démontage du composant
     * - avant une éventuelle ré-exécution de l’effet
     */
    return () => {
      alive = false;
    };

  }, []); // Exécuté une seule fois au montage

  return { data, isLoading, error };
}
