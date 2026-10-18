# Leer el Cielo

Sitio de las jornadas astronómicas **Leer el Cielo** (Biblioteca Central Estatal Wigberto Jiménez Moreno, León, Gto.).
Publicado con GitHub Pages en `https://leerelcielo.cosmoalma.com`.

## Estructura

```
index.html                    Página principal: encabezado, pestañas y pie (no lleva contenido de jornadas)
jornadas/
  jornadas.json               Lista de jornadas → una pestaña por cada una
  otono-2026/
    jornada.html              Contenido de la Jornada de Otoño 2026
    poster.jpg                Póster de esa jornada
assets/
  css/style.css               Estilos compartidos
  js/main.js                  Carga jornadas.json, crea pestañas y muestra cada jornada
  img/titulo-leer-el-cielo.png
  logos/                      Logos institucionales en blanco
CNAME                         Dominio personalizado
```

## Agregar una jornada nueva

1. Copia la carpeta `jornadas/otono-2026/` con un nombre nuevo, p. ej. `jornadas/primavera-2027/`.
2. Edita `jornada.html` de la carpeta nueva y reemplaza `poster.jpg`.
   - Las rutas se escriben relativas a esa carpeta: `poster.jpg`, `foto1.jpg`…
   - Para recursos compartidos usa `../../assets/…` (logos, título).
3. Agrégala en `jornadas/jornadas.json`. **La primera de la lista es la que se abre por defecto**, así que pon la más reciente arriba:

```json
[
  { "id": "primavera-2027", "pestana": "Primavera 2027", "titulo": "Jornada de Primavera 2027", "archivo": "jornadas/primavera-2027/jornada.html" },
  { "id": "otono-2026", "pestana": "Otoño 2026", "titulo": "Jornada Astronómica de Otoño 2026 · Una noche con Saturno", "archivo": "jornadas/otono-2026/jornada.html" }
]
```

Cada jornada tiene enlace directo: `https://leerelcielo.cosmoalma.com/#primavera-2027`.

## Probar en tu computadora

Las jornadas se cargan con JavaScript, así que abrir `index.html` con doble clic no funciona. Desde la carpeta del repo:

```
python3 -m http.server
```

y abre `http://localhost:8000`.

## Publicar (GitHub Pages)

Settings → Pages → Deploy from a branch → `main` / `(root)`. El archivo `CNAME` ya contiene `leerelcielo.cosmoalma.com`; en Squarespace debe existir un registro CNAME `leerelcielo` → `alxogm.github.io`.
