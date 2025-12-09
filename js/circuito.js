class Circuito {

    constructor(){
        this.#comprobarApiFile();
    }

    #comprobarApiFile(){
        if(!window.File){
            $("main").append("<p>Este navegador no soporta la API File</p>");
        }
        this.#leerArchivoHTML();
    }

    async #leerArchivoHTML() {
        try {
            const respuesta = await fetch("xml/infoCircuito.html");
            if (!respuesta.ok) {
                throw new Error("No se pudo cargar InfoCircuito.html");
            }

            const contenido = await respuesta.text();

            // Parseamos el HTML con DOMParser
            const parser = new DOMParser();
            const doc = parser.parseFromString(contenido, "text/html");

            // Seleccionamos el <main> de circuito.html donde vamos a insertar la info
            const main = document.querySelector("main");

            // Añadimos el título principal
            const titulo = doc.querySelector("h2");
            if (titulo) {
                const nuevoTitulo = document.createElement("h2");
                nuevoTitulo.textContent = titulo.textContent;
                main.appendChild(nuevoTitulo);
            }

            // Recorremos todas las secciones del archivo
            const secciones = doc.querySelectorAll("section");
            secciones.forEach(sec => {
                const nuevaSeccion = document.createElement("section");

                // Copiamos el título de la sección
                const h3 = sec.querySelector("h3");
                if (h3) {
                    const nuevoH3 = document.createElement("h3");
                    nuevoH3.textContent = h3.textContent;
                    nuevaSeccion.appendChild(nuevoH3);
                }

                // Copiamos listas <ul>
                const ul = sec.querySelector("ul");
                if (ul) {
                    const nuevoUl = document.createElement("ul");
                    ul.querySelectorAll("li").forEach(li => {
                        const nuevoLi = document.createElement("li");
                        nuevoLi.innerHTML = li.innerHTML; // conserva enlaces si los hay
                        nuevoUl.appendChild(nuevoLi);
                    });
                    nuevaSeccion.appendChild(nuevoUl);
                }

                // Copiamos subsecciones (ej. galería)
                const subsecciones = sec.querySelectorAll("section");
                subsecciones.forEach(sub => {
                    const nuevaSub = document.createElement("section");

                    const h4 = sub.querySelector("h4");
                    if (h4) {
                        const nuevoH4 = document.createElement("h4");
                        nuevoH4.textContent = h4.textContent;
                        nuevaSub.appendChild(nuevoH4);
                    }

                    // Copiamos imágenes
                    const img = sub.querySelector("img");
                    if (img) {
                        const nuevaImg = document.createElement("img");
                        nuevaImg.src = img.src;
                        nuevaImg.alt = img.alt;
                        nuevaSub.appendChild(nuevaImg);
                    }

                    // Copiamos vídeos
                    const video = sub.querySelector("video");
                    if (video) {
                        const nuevoVideo = document.createElement("video");
                        nuevoVideo.src = video.src;
                        nuevoVideo.controls = true; // añadimos controles
                        nuevaSub.appendChild(nuevoVideo);
                    }

                    nuevaSeccion.appendChild(nuevaSub);
                });

                main.appendChild(nuevaSeccion);
            });

        } catch (error) {
            console.error("Error al leer el archivo:", error);
        }
    }

}

class CargadorSVG {

    constructor(){

    }

    leerArchivoSVG(file) {
        this.archivo = file[0];

        const lector = new FileReader();

        lector.onload = (evento) => {
            const contenidoSVG = evento.target.result;
            this.insertarSVG(contenidoSVG);
        };

        lector.readAsText(this.archivo); // leemos el archivo como texto
    }

    insertarSVG(contenido) {
        // Creamos un contenedor para mostrar el SVG
        const contenedor = document.createElement("div");
        contenedor.innerHTML = contenido; // insertamos el SVG directamente
        document.body.appendChild(contenedor);
    }

}

class CargadorKML {

    constructor(){

    }

    leerArchivoKML(file){
        this.archivo = file[0];

        if (this.archivo.name.toLowerCase().endsWith(".kml")) {
            const lector = new FileReader();

            lector.onload = (evento) => {
                const kmlDoc = $.parseXML(lector.result);
                const kml = $(kmlDoc);

                const doc = kml[0];
                const firstNode = doc.firstChild;
                const tramos = firstNode.firstChild.children;

                var placemark = tramos[tramos.length-1].children;
                var lineString = placemark[0];

                const coordenadas = [];
                const infoTramos = [];

                for (let t = 0; t < tramos.length - 2; t++) {
                    const data = tramos[t].children;

                    let numero = data[0].textContent.charAt(1);
                    let sector = data[1].textContent.charAt(1);
                    let punto = data[2].children;

                    let coord = punto[0].textContent.replace(/\n/g, '').split(",");
                    let modoAltitud = punto[1].textContent.replace(/\n/g, '');

                    let longitud = parseFloat(coord[0]);
                    let latitud = parseFloat(coord[1]);
                    let altura = parseFloat(coord[2]);

                    coordenadas[t] = [longitud, latitud];

                    let info = `Tramo: ${numero} - Sector: ${sector} - { long: ${longitud} lat: ${latitud} altura: ${altura} m (${modoAltitud})}`;
                    infoTramos[t] = info;
                }

                // Creamos el contenedor del mapa
                const mapa = document.createElement("div");
                mapa.style.width = "600px";
                mapa.style.height = "400px";

                const container = document.createElement("section");
                container.appendChild(mapa);
                document.querySelector("main").appendChild(container);

                // Llamamos al método que inserta la capa en el mapa
                this.insertarCapaKML(coordenadas, mapa);
            };
            lector.readAsText(this.archivo);
        } else {
            const errorArchivo = document.createElement("p");
            errorArchivo.innerText = "Error: ¡¡¡ Archivo no válido !!!";
            document.querySelector("main").appendChild(errorArchivo);
        }
    }


    insertarCapaKML(coordenadas, mapa){
        const centroLat = coordenadas[0][0];
        const centroLong = coordenadas[0][1];

        mapboxgl.accessToken = "pk.eyJ1IjoidW8yODk1MTAiLCJhIjoiY200OG93MnNnMDI2YjJpcjRieXM5cDUybSJ9.HJAZajuwP81PRQqybk2eZw";
        const map = new mapboxgl.Map({
            container: mapa,
            style: 'mapbox://styles/mapbox/streets-v12',
            zoom: 15,
            center: [centroLat, centroLong],
            attributionControl: false
        });

        map.on('load', () => {
            map.addSource('route', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': coordenadas
                    }
                }
            });

            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': 'red',
                    'line-width': 5
                }
            });
        });
    }

}