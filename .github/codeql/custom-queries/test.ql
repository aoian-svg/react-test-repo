/**
 * @name Classi troppo lunghe
 * @description Segnala tutte le classi che hanno più di 20 righe di codice
 * @kind problem
 * @id js/long-class
 */

import javascript

/**
 * Ritorna true se la classe supera un numero di righe
 */
predicate isLongClass(Class c, int threshold) {
  c.getLocation().getEndLine() - c.getLocation().getStartLine() + 1 > threshold
}

from Class c
where isLongClass(c, 20)
select c, "Questa classe supera le 20 righe di codice."
