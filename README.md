# Nuestro Pequeño Mundo ❤️

Web romántica personalizada para **Belén**, con fecha de inicio de la relación: **23 de octubre de 2025**.

## Cómo abrirla

1. Descomprimí el ZIP.
2. Abrí `index.html` con doble clic, desde Chrome, Edge o Firefox.
3. La web funciona sin servidor ni instalación de dependencias. Para las tipografías de Google Fonts se necesita internet; sin conexión se usan fuentes de respaldo.

## Archivos

- `index.html` — estructura y ocho secciones de la web.
- `styles.css` — colores pastel, diseño adaptable y animaciones.
- `script.js` — contador, cartas, corazones, planes, estrellas, fotos y música.
- `config.js` — **editá este archivo** para personalizar nombres, mensajes, fechas, recuerdos, razones, planes, fotos y canción.
- `assets/` — carpeta para guardar tus fotos y música antes de publicar.

## Personalizar fotos

1. Copiá fotos a `assets/`, por ejemplo `assets/foto1.jpg` y `assets/foto2.jpg`.
2. En `config.js` buscá `fotos: []` y cambialo por:

```js
fotos: ["assets/foto1.jpg", "assets/foto2.jpg"],
```

3. Guardá el archivo y actualizá la web.

El botón **Agregar fotos ahora** sirve para probar imágenes sin editar archivos, pero **esas fotos no se guardan de forma permanente**; al recargar se perderán las que fueron agregadas con el botón.

## Personalizar música

1. Copiá un archivo `.mp3` a `assets/`, por ejemplo `assets/nuestra-cancion.mp3`.
2. En `config.js`, cambiá:

```js
musica: "assets/nuestra-cancion.mp3"
```

La reproducción se inicia solo cuando la persona toca el botón de reproducir. También puede elegir un archivo temporalmente desde su dispositivo. Usá audio que tengas derecho a compartir, especialmente si vas a publicar la página.

## Personalizar mensajes

Modificá los valores de `cartas`, `razones`, `momentos`, `estrellas`, `planes` y `regaloFinal` en `config.js`. Mantené las comillas, comas y llaves tal como están. Los recuerdos actuales son genéricos y están listos para reemplazarlos por momentos reales.

## Publicar gratis en GitHub Pages

1. Creá un repositorio de GitHub (por ejemplo, `nuestro-pequeno-mundo`).
2. Subí `index.html`, `styles.css`, `script.js`, `config.js` y la carpeta `assets/`.
3. En el repositorio entrá a **Settings → Pages**.
4. Elegí **Deploy from a branch**, rama `main`, carpeta `/ (root)`, y guardá.
5. GitHub Pages proporcionará la URL pública cuando termine la publicación.

**Privacidad:** si publicás el repositorio y GitHub Pages de forma pública, otras personas podrían acceder a los mensajes, fotos y música mediante el enlace o el repositorio. Evitá subir información que quieran mantener privada. Esta web no incluye autenticación ni un acceso con contraseña.

## Secciones incluidas

1. Bienvenida personalizada.
2. Contador de días, horas, minutos, segundos y próximo aniversario.
3. Línea del tiempo y galería.
4. Sobres con cartas interactivas.
5. Razones para amarla sin repetirse hasta completar el ciclo.
6. Frasco de planes aleatorios por categoría.
7. Cielo interactivo de estrellas.
8. Regalo sorpresa con carta y animación final.

Todo el proyecto usa HTML, CSS y JavaScript puros. Sin cuentas, base de datos ni frameworks.
