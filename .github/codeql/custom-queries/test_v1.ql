/**
 * @name Funzione con troppi parametri
 * @description Segnala le funzioni che hanno più di 3 parametri
 * @kind problem
 * @id js/function-too-many-params
 */

import javascript

from Function f
where f.getNumberOfParameters() > 3
select f,
  "Questa funzione ha " +
  f.getNumberOfParameters().toString() +
  " parametri (massimo consigliato: 3)."
