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
            var respuesta = await fetch("xml/infoCircuito.html");
            if (!respuesta.ok) {
                throw new Error("No se pudo cargar InfoCircuito.html");
            }

            var contenido = await respuesta.text();

            var parser = new DOMParser();
            var doc = parser.parseFromString(contenido, "text/html");

            var main = document.querySelector("main");

            var secciones = doc.querySelectorAll("main > section");

            var seccionCaracteristicas = secciones[0];
            var seccionCarrera = secciones[1];
            var seccionReferencias = secciones[2];
            var seccionGaleria = secciones[3];

            var seccionImagenes = seccionGaleria.children[1];
            
            var imagenes = seccionImagenes.children;
            for(var i=1; i<imagenes.length; i++){
                var img = imagenes[i];
                var src = img.getAttribute("src");
                if(src.includes("https") || src.includes("http")){
                    src = src.replace(/^https?:\/\/[^/]+\//,"");
                }else{
                    src = src.replace("../", "");
                }
                img.setAttribute("src", src);
            }

            var seccionVideos = seccionGaleria.children[2];
            var videos = seccionVideos.children;
            for(var i=1; i<videos.length; i++){
                var video = videos[i];
                var source = video.children[0];
                var src = source.src;
                if(src.includes("https") || src.includes("http")){
                    source.setAttribute("src", src.replace(/^https?:\/\/[^/]+\//,""));
                }else{
                    source.setAttribute("src", src.replace("../",""));
                }

            }
        
            main.appendChild(seccionImagenes);
            main.appendChild(seccionCaracteristicas);
            main.appendChild(seccionVideos);
            main.appendChild(seccionCarrera);
            main.appendChild(seccionReferencias);

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

        if(this.archivo.name.toLowerCase().endsWith(".svg")){
            var lector = new FileReader();
    
            lector.onload = (evento) => {
                var contenidoSVG = evento.target.result;
                this.#insertarSVG(contenidoSVG);
            };
    
            lector.readAsText(this.archivo);
        }else{
            var errorArchivo = document.createElement("p");
            errorArchivo.innerText = "Error: Inserte un svg válido.";
            document.querySelector("main").appendChild(errorArchivo);
        }
    }

    #insertarSVG(contenido) {

        var contenedor = document.createElement("section");
        contenedor.innerHTML = contenido;
        var svg = contenedor.children[0];

        var title = document.createElement("h3");
        title.textContent = "Altimetria";

        contenedor.insertBefore(title, svg);

        if(!svg.hasAttribute("viewBox")){
            var width = svg.getAttribute("width");
            var height = svg.getAttribute("height");
            svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        }

        document.querySelector("main").appendChild(contenedor);
    }

}

class CargadorKML {

    constructor(){

    }

    leerArchivoKML(file){
        this.archivo = file[0];

        if (this.archivo.name.toLowerCase().endsWith(".kml")) {
            var lector = new FileReader();

            lector.onload = (evento) => {
                var kmlDoc = $.parseXML(lector.result);
                var kml = $(kmlDoc);

                var doc = kml[0];
                var firstNode = doc.firstChild;
                var tramos = firstNode.firstChild.children;

                var placemark = tramos[tramos.length-1].children;

                var coordenadas = [];
                var infoTramos = [];

                for (let t = 0; t < tramos.length - 2; t++) {
                    var data = tramos[t].children;

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

                var mapa = document.createElement("div");
                document.querySelector("body").appendChild(mapa);

                this.insertarCapaKML(coordenadas, mapa);
            };
            lector.readAsText(this.archivo);
        } else {
            var errorArchivo = document.createElement("p");
            errorArchivo.innerText = "Error: ¡¡¡ Archivo no válido !!!";
            document.querySelector("main").appendChild(errorArchivo);
        }
    }


    insertarCapaKML(coordenadas, mapa){
        var centroLat = coordenadas[0][0];
        var centroLong = coordenadas[0][1];

        mapboxgl.accessToken = "pk.eyJ1IjoidW8yODk1MTAiLCJhIjoiY200OG93MnNnMDI2YjJpcjRieXM5cDUybSJ9.HJAZajuwP81PRQqybk2eZw";
        var map = new mapboxgl.Map({
            container: mapa,
            style: 'mapbox://styles/mapbox/streets-v12',
            zoom: 14,
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