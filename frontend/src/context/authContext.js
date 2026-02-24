/**
 * @file authContext.js
 * @description Contexte React dédié à l'authentification.
 * Fournit l'état et les actions via AuthProvider.
 *
 * @author Salem Hadjali
 * @date 21-02-2026
 */

import { createContext } from "react";

/**
 * Contexte d'authentification.
 * La valeur par défaut est null et doit être fournie par AuthProvider.
 */
export const AuthContext = createContext(null);