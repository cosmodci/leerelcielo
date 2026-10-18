# Leer el Cielo

Sitio de las jornadas astronómicas **Leer el Cielo**, organizadas por la Biblioteca Central Estatal Wigberto Jiménez Moreno (León, Gto.) y la División de Ciencias e Ingenierías de la Universidad de Guanajuato, con la participación del Centro de Investigaciones en Óptica (CIO) y otras instituciones.

Publicado con GitHub Pages en `https://cosmodci.github.io/leerelcielo/`.

## Qué tiene el sitio

- **Inicio** (`#inicio`): presentación del programa, banner de la jornada más reciente, banner y tarjetas de las jornadas anteriores y la sección **Leer el Cielo en municipios**.
- **Una subpágina por jornada** (`#<id>`, p. ej. `#otono-2026`): programa, invitados, sedes y póster para descargar, con enlaces a la jornada anterior y a la siguiente.

El banner del inicio usa la **primera jornada de `jornadas.json`**. Si su fecha todavía no pasa dice «Próxima jornada»; si ya pasó, «Jornada más reciente».

## Estructura

```
index.html                    Encabezado, vista de inicio, vista de jornada y pie
jornadas/
  jornadas.json               Lista de jornadas, de la más reciente a la más antigua
  otono-2026/                 Una carpeta por jornada:
    jornada.html                contenido de la subpágina
    poster.jpg                  póster completo
    poster-mini.jpg             miniatura (~520 px de ancho) para banners y tarjetas
  abril-2026/  octubre-2025/  marzo-2025/  marzo-2024/  abril-2023/
assets/
  css/style.css               Estilos compartidos
  js/main.js                  Lee jornadas.json, arma el inicio y carga cada subpágina
  img/titulo-leer-el-cielo.png
  logos/                      Logos institucionales en blanco
```

Jornadas publicadas:

| id | Jornada | Tipo |
|---|---|---|
| `otono-2026` | Una noche con Saturno · 23 oct 2026 | Biblioteca Central |
| `abril-2026` | Jornada de Astronomía · 24 abr 2026 | Biblioteca Central |
| `octubre-2025` | Semana de la Ciencia 2025 · 24 oct 2025 | Biblioteca Central |
| `marzo-2025` | Luna Roja, el eclipse del 13 de marzo · 12–13 mar 2025 | Biblioteca Central |
| `marzo-2024` | Kánder Turehrnhe («Mirar las estrellas») · 13–15 mar 2024, Dolores Hidalgo | Municipios |
| `abril-2023` | Día Mundial de la Astronomía · 28 abr 2023 | Biblioteca Central |

## Agregar una jornada nueva

1. Crea la carpeta `jornadas/<id>/` (p. ej. `jornadas/primavera-2027/`) con:
   - `jornada.html`: copia una jornada existente como plantilla. Las rutas se escriben relativas a esa carpeta (`poster.jpg`); para recursos compartidos usa `../../assets/…`.
   - `poster.jpg` y `poster-mini.jpg` (miniatura de unos 520 px de ancho).
2. Agrega su entrada **al inicio** de `jornadas/jornadas.json`:

```json
{
  "id": "primavera-2027",
  "pestana": "Primavera 2027",
  "titulo": "Jornada de Primavera 2027 · Título de la jornada",
  "tema": "Título corto para el banner",
  "fecha": "2027-04-23",
  "fecha_texto": "Viernes 23 de abril de 2027",
  "horario": "16:00 – 21:00 h",
  "lugar": "Biblioteca Central Estatal Wigberto Jiménez Moreno, León",
  "resumen": "Una o dos líneas sobre las actividades.",
  "poster": "jornadas/primavera-2027/poster-mini.jpg",
  "archivo": "jornadas/primavera-2027/jornada.html",
  "tipo": "sede"
}
```

- `fecha` (AAAA-MM-DD) decide si el banner dice «Próxima jornada» o «Jornada más reciente».
- `tipo`: `"sede"` para la Biblioteca Central o `"municipios"` para las jornadas en otros municipios (aparecen en su propia sección del inicio).
- `pestana` es el nombre corto que se muestra en el menú y en los enlaces anterior/siguiente.
- Si falta un dato, escribe `[POR CONFIRMAR]` en el texto: el sitio lo resalta.

Cada jornada tiene enlace directo: `https://cosmodci.github.io/leerelcielo/#primavera-2027`.

## Probar en tu computadora

Las jornadas se cargan con JavaScript, así que abrir `index.html` con doble clic no funciona. Desde la carpeta del repo:

```
python3 -m http.server
```

y abre `http://localhost:8000`.

## Publicar (GitHub Pages)

Settings → Pages → Deploy from a branch → `main` / `(root)`.
