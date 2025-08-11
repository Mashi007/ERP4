# Prueba manual: Cambio de Etapa desde Detalle

![Selector de Etapa en el formulario](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-28fVjGegmFgDyza1wQLRekJfhcc6OA.png)

Objetivo
Verificar que al cambiar la Etapa desde el Detalle de una oportunidad:
- Se guarde inmediatamente (persistencia en servidor).
- La tarjeta (card) desaparezca de su columna anterior y aparezca en la nueva columna del Embudo.
- Se actualicen los contadores y el valor ponderado de cada columna.

Pre-requisitos
- Aplicación ejecutándose.
- Datos de ejemplo cargados (hay oportunidades en varias etapas).

Escenario A — Embudo (/pipeline/embudo)
1) Navega a /pipeline/embudo.
2) Ubica una oportunidad en la columna “Nuevo” (u otra que prefieras).
3) Abre el Detalle con doble clic sobre el card (o botón Editar y luego “Detalle” si corresponde).
4) En el Detalle, cambia la “Etapa” usando el selector (por ejemplo, de “Nuevo” a “Calificación”).
5) Resultado esperado inmediato:
   - Aparece un toast “Etapa actualizada”.
   - La oportunidad se mueve automáticamente a la columna seleccionada (deja de verse en la columna anterior).
   - El contador y el “Valor ponderado” de ambas columnas se ajustan en consecuencia.
6) Cierra el detalle. Reconfirma visualmente el movimiento y los totales.

Escenario B — Oportunidades (/pipeline/oportunidades)
1) Navega a /pipeline/oportunidades.
2) Abre el Detalle (doble clic sobre una tarjeta).
3) Cambia la “Etapa” en el selector.
4) Resultado esperado:
   - Aparece un toast “Etapa actualizada”.
   - Si vuelves a /pipeline/embudo, el card ya estará en la columna de la nueva etapa.
   - Si permaneces en Oportunidades, verás el badge de etapa con la nueva etiqueta.

Validaciones adicionales
- El valor ponderado por columna cambia acorde a: suma(valor * probabilidad / 100) de los deals en esa etapa.
- Los contadores de cada columna (badge) se ajustan.
- Si cambias varias veces de etapa, la oportunidad debe seguir moviéndose a la columna correspondiente.

Recuperación de errores (fallo de red/servidor)
- Si el servidor rechaza el cambio verás un toast “No se pudo actualizar la etapa”.
- En ese caso, recarga la página para re-sincronizar el estado visual con el servidor.

Notas
- El cambio de etapa se hace con guardado inmediato desde el selector del Detalle en Embudo y Oportunidades.
- Los toasts confirman éxito o error. Si sospechas una desincronización, refresca la vista.
