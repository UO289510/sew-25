class Noticias{

    #busqueda;
    #url;

    constructor(){
        this.#url = "https://api.thenewsapi.com/v1/news/all?api_token=fysmy53gDIdrZc6kDQuED9SylT3BAWcmrK7LHloz";
        this.#busqueda = "&search=motogp+red bull ring+austria&language=es";
        this.#buscar();
    }

    #buscar(){
        fetch(this.#url + this.#busqueda)
            .then(response => {
                if(!response.ok){
                    throw new Error("Error en la petición: " + response.status);
                }
                return response.json();
            })
            .then(json => {
                this.#procesarInformacion(json);
            })
            .catch(error => {
                console.error("Error en la busqueda:", error);
            });
    }

    #procesarInformacion(json) {
        if(!json || !json.data){
            throw new Error("Formato de JSON no válido");
        }

        let noticiasProcesadas = [];
        for(let noticia of json.data){
            noticiasProcesadas.push({
                titulo: noticia.title,
                entradilla: noticia.description,
                enlace: noticia.url,
                fuente: noticia.source
            });
        }
        
        var section = document.createElement("section");
        var title = document.createElement("h2");
        title.textContent = "Noticias relacionadas";
        section.appendChild(title);
        for(var noticia of noticiasProcesadas){

            var sectionNoticia = document.createElement("section");
            var h3 = document.createElement("h3");
            h3.textContent = noticia.titulo;
            var h4 = document.createElement("h4");
            h4.textContent = noticia.entradilla;
            var p1 = document.createElement("p");
            p1.textContent = "De "+noticia.fuente;
            var enlace = document.createElement("a");
            enlace.href = noticia.enlace;
            enlace.textContent = noticia.enlace;

            sectionNoticia.append(h3);
            sectionNoticia.append(h4);
            sectionNoticia.append(p1);
            sectionNoticia.append(enlace);
            section.append(sectionNoticia);
        }

        $("main").append(section);

    }

}