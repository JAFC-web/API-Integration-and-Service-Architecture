## Instalacion

Instala las dependencias:
npm install

Inicia el servidor:
npm start

LocalHost:
http://localhost:3000

## Como Funciona
Cuando se ejecuta el proyecto con npm start, se prende el servidor y este crea una direccion local desde donde se carga la pagina de la aplicacion.

Cuando el usuario abre la pagina en el navegador, se muestran las diferentes secciones que tiene la app, cada una conectada a una API distinta (NASA, YouTube, Mastodon y Mapbox) Mastodon usa una API publica.

Cada vez que el usuario hace una busqueda o le da click a un boton, se manda una peticion al servidor, este se encarga de ir a buscar la informacion a la API que corresponda y la regresa de vuelta ya lista para usarse.

Finalmente esa informacion se muestra en la pagina de forma automatica, sin que el usuario tenga que recargar nada, asi se pueden ver imágenes, videos, publicaciones y ubicaciones.

## Extra
No sabia que hacer XD. asta que vi lo de la api de la NASA y se me ocurrio tipo una pagina tematica sobre el espacio, haci que esto es lo que salio xD