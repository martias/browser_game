# Las aventuras de Sir Valentin

Primera version jugable del juego familiar inspirado por Sir Valentin, Dragon Gata y Princesa Mimi.

## Como probarlo

1. Abre `index.html` en un navegador moderno.
2. Si el navegador bloquea algunas interacciones locales, levanta un servidor simple:

```bash
python3 -m http.server 8000
```

3. Luego abre `http://localhost:8000`.

## Controles

- `Saltar`: evita obstaculos.
- `Esconder`: solo se activa cerca de un arbol.
- `Escudo` / `Corona` / `Volar`: habilidad especial del personaje elegido. Dura 5 segundos y luego recarga 10 segundos.
- `Moneda`: cara aleja mucho a Dragon Gata, cruz la acerca mucho. Solo se usa una vez por partida.

Tambien puedes usar teclado:

- `Flecha arriba`: saltar
- `Flecha abajo`: esconder
- `Flecha derecha`: moneda
- `Flecha izquierda`: habilidad especial

## Lo que ya incluye

- Pantalla de titulo en espanol
- Escena corta de introduccion
- Nivel unico de 3 minutos aproximados
- Tres zonas visuales antes del castillo
- Dragon Gata como barra de peligro
- Llaves doradas, arboles para esconderse y habilidades especiales por personaje
- Sir Valentin se vuelve inmortal con su escudo
- Princesa Mimi lanza su corona e inmoviliza a Dragon Gata
- Mago Manuel vuela con su baston y un escudo naranja
- Escena del castillo con Mago Manuel
- Quiz con 20 acertijos posibles
- Rescate de Princesa Mimi y carrera final a la aldea

## Siguiente iteracion sugerida

- Añadir arte pixel real en spritesheets
- Sonidos y musica
- Ajustar dificultad con feedback de tus hijos
- Exportarlo como app para iPad o migrarlo a SpriteKit/Swift
