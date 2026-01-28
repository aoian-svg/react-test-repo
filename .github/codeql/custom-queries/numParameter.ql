/**
 * @name Funzione con troppi parametri
 * @description Segnala le funzioni che hanno più di 3 parametri
 * @kind problem
 * @id js/function-too-many-params
 * @problem.severity warning
 */

import javascript

from Function f
where f.getNumParameter() > 3
select f,
  "Questa funzione ha " +
  f.getNumParameter().toString() +
  " parametri (massimo consigliato: 3)."
