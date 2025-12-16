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

            var titulo = doc.querySelector("h2");
            if (titulo) {
                var nuevoTitulo = document.createElement("h2");
                nuevoTitulo.textContent = titulo.textContent;
                main.appendChild(nuevoTitulo);
            }

            var secciones = doc.querySelectorAll("main > section");
            secciones.forEach(sec => {
                var nuevaSeccion = document.createElement("section");

                var h3 = sec.querySelector("h3");
                if (h3) {
                    var nuevoH3 = document.createElement("h3");
                    nuevoH3.textContent = h3.textContent;
                    nuevaSeccion.appendChild(nuevoH3);
                }

                var ul = sec.querySelector("ul");
                if (ul) {
                    var nuevoUl = document.createElement("ul");
                    ul.querySelectorAll("li").forEach(li => {
                        var nuevoLi = document.createElement("li");
                        nuevoLi.innerHTML = li.innerHTML;
                        nuevoUl.appendChild(nuevoLi);
                    });
                    nuevaSeccion.appendChild(nuevoUl);
                }

                var subsecciones = sec.querySelectorAll("section");
                subsecciones.forEach(sub => {
                    var nuevaSub = document.createElement("section");

                    var h4 = sub.querySelector("h4");
                    if (h4) {
                        var nuevoH4 = document.createElement("h4");
                        nuevoH4.textContent = h4.textContent;
                        nuevaSub.appendChild(nuevoH4);
                    }

                    var img = sub.querySelector("img");
                    if (img) {
                        var nuevaImg = document.createElement("img");
                        
                        var srcImagen = img.src;
                        srcImagen = srcImagen.replace(/^https?:\/\/[^/]+\//,"");
                        nuevaImg.src = srcImagen;
                        nuevaImg.alt = img.alt;
                        nuevaSub.appendChild(nuevaImg);
                    }

                    var video = sub.querySelector("video");
                    if (video) {

                        var nuevoVideo = document.createElement("video");
                        nuevoVideo.controls = true;

                        var source = video.children[0];
                        var srcVideo = source.src;
                        srcVideo = srcVideo.replace(/^https?:\/\/[^/]+\//,"");
                        source.setAttribute("src", srcVideo);
                        nuevoVideo.appendChild(source);
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