class Carrusel {

    #busqueda;
    #actual;
    #maximo;
    #datos;

    constructor() {
        this.#busqueda = "&tags=Red+Bull+Ring%2C+Spielberg%2C+MotoGP&dimension_search_mode=min&height=640&width=640&tagmode=all&format=json";
        this.#actual = 0;
        this.#maximo = 5;
        this.#datos = {};
        this.#getFotografias();
    }

    #getFotografias(){
        var flickrAPI = "https://www.flickr.com/services/feeds/photos_public.gne?jsoncallback=?"+this.#busqueda;
        $.ajax({
            dataType: "json",
            url: flickrAPI,
            method: 'GET',
            success: (datos) => {
                this.#procesarJSONFotografias(datos);
            },
            error: function(){
                $("h3").html("¡Tenemos problemas!");
            }
        });
    }

    #procesarJSONFotografias(datos){

        var content = datos.items;

        for(let i=0; i<this.#maximo; i++){
            this.#datos[i] = {
                author: content[i].author,
                author_id: content[i].author_id,
                date_taken: content[i].date_taken,
                description: content[i].description,
                link: content[i].link,
                media: content[i].media.m.replace("_m","_z"),
                published: content[i].published,
                tags: content[i].tags,
                title: content[i].title
            };
        }
        this.#mostrarFotografias();
    }

    #mostrarFotografias(){
        
        var article = document.createElement("article");
        var title = document.createElement("h3");
        title.textContent = "Imagenes del circuito de Red Bull Ring";
        article.appendChild(title);

        var image = document.createElement("img");
        image.src = this.#datos[this.#actual].media;
        image.alt = this.#datos[this.#actual].title;
        article.appendChild(image);

        $("main").append(article);

        setInterval(this.#cambiarFotografia.bind(this), 3000);
    }

    #cambiarFotografia(){
        this.#actual++;
        if(this.#actual >= this.#maximo){
            this.#actual = 0;
        }

        $("main article img").attr("src", this.#datos[this.#actual].media);
        $("main article img").attr("alt", this.#datos[this.#actual].title);
    }

}