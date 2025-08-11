# Verificación: Badge de conteo y Valor ponderado por etapa

Este checklist confirma que al cambiar la Etapa desde el Detalle:
- El badge de conteo por columna se actualiza.
- El “Valor ponderado” por etapa se recalcula.

Notas:
- Embudo calcula el valor ponderado como la suma de: `value * (probability/100)` de todos los deals en esa etapa.
- Al cambiar de etapa, se realiza un update optimista del estado (cambia la columna y el conteo al instante). La probabilidad puede ajustarse tras la respuesta del servidor, por lo que el valor ponderado puede “acomodarse” unos milisegundos después.
- Mapeo de probabilidad del servidor (SQL):  
  - Ganado → 100  
  - Perdido → 0  
  - Cierre → 90  
  - Negociación → 75  
  - Propuesta → 50  
  - Calificación → 25  
  - Nuevo → mantiene la probabilidad existente (no la fuerza a un valor)  

## Selectores para verificación (data-testid)
- Conteo por etapa: `badge-count-{etapa}`  
  Ejemplos:  
  - `badge-count-nuevo`  
  - `badge-count-calificación`  
  - `badge-count-propuesta`  
  - `badge-count-negociación`  
  - `badge-count-cierre`  
  - `badge-count-ganado`  
  - `badge-count-perdido`  
- Valor ponderado por etapa: `weighted-{etapa}`  
  Ejemplos:  
  - `weighted-nuevo`, `weighted-propuesta`, `weighted-ganado`, etc.

## Escenario A: Cambio desde Detalle impacta Conteo y Valor ponderado
1. Navega a `/pipeline/embudo`.
2. Identifica una etapa origen (p. ej., “Propuesta”) y anota:  
   - Valor del badge: `badge-count-propuesta`  
   - Valor ponderado: `weighted-propuesta`  
3. Doble clic en un card de esa etapa para abrir el Detalle.
4. Cambia la “Etapa” a otra etapa destino (p. ej., “Negociación”).  
   - Se guardará inmediatamente (update optimista).
5. Observa resultados:
   - En origen (“Propuesta”):  
     - `badge-count-propuesta` disminuye en 1.  
     - `weighted-propuesta` disminuye en el aporte de ese deal: `value * (probability/100)` (con la probabilidad previa del deal).
   - En destino (“Negociación”):  
     - `badge-count-negociación` aumenta en 1.  
     - `weighted-negociación` aumenta en `value * (probability/100)`.  
6. En cuanto llegue la respuesta del servidor, la probabilidad se ajusta según el mapeo (p. ej. “Negociación” → 75). Verifica que el valor ponderado de la etapa destino se actualiza para reflejar el nuevo `probability`.

Ejemplo de cálculo:  
- Valor del deal: 4,000  
- Probabilidad antes del cambio: 50% (Propuesta)  
- Probabilidad después del cambio: 75% (Negociación)  
- Aportes esperados:  
  - Propuesta: − 4,000 × 0.50 = −2,000  
  - Negociación (después de confirmación): + 4,000 × 0.75 = +3,000

## Escenario B: Ganado y Perdido
1. Repite el escenario A moviendo un deal a “Ganado”.  
   - Badge “Ganado” aumenta en +1.  
   - `weighted-ganado` aumenta en `value * 1.00` (100%).  
2. Repite moviendo un deal a “Perdido”.  
   - Badge “Perdido” aumenta en +1.  
   - `weighted-perdido` no cambia (aportará 0 porque la probabilidad es 0%).  

## Escenario C: Nuevo (sin forzar probabilidad)
1. Mueve un deal a “Nuevo”.  
2. Confirma:  
   - El badge “Nuevo” suma +1.  
   - El valor ponderado “Nuevo” refleja `value * (probability/100)` del deal (la probabilidad no se fuerza en el servidor; si era 30%, se mantiene 30% hasta que tú la actualices manualmente o desde otro flujo).

## Recuperación en caso de error
- Si ves un toast de error al cambiar etapa, el estado local ya movió el card (optimista). Recarga la página para re-sincronizar con el servidor si el error persiste.
- Vuelve a ejecutar el escenario para confirmar que badge y ponderado están correctos.

## Consejos para automatización
- Selecciona y lee `badge-count-{etapa}` y `weighted-{etapa}` antes y después del cambio.  
- Realiza las aserciones de delta en función del `value` y `probability` del deal que mueves.  
- Espera la resolución de la acción de servidor para validar el ajuste final del valor ponderado si la etapa cambia la probabilidad automáticamente.
