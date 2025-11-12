class Memoria{

    elements = [
        {element: "Yamaha", source: "img/memoria/yamaha.png"},
        {elemet: "Yamaha", source: "img/memoria/yamaha.png"},
        {element: "Ducati", source: "img/memoria/ducati.png"},
        {element: "Ducati", source: "img/memoria/ducati.png"},
        {element: "Honda", source: "img/memoria/honda.png"},
        {element: "Honda", source: "img/memoria/honda.png"},
        {element: "Suzuki", source: "img/memoria/suzuki.png"},
        {element: "Suzuki", source: "img/memoria/suzuki.png"},
        {element: "KTM", source: "img/memoria/ktm.png"},
        {element: "KTM", source: "img/memoria/ktm.png"},
        {element: "Aprilia", source: "img/memoria/aprilia.png"},
        {element: "Aprilia", source: "img/memoria/aprilia.png"}
    ];

    constructor(){
        this.tablero_bloqueado=true;
        this.primera_carta=null;
        this.segunda_carta=null;
        this.barajarCartas();
        this.tablero_bloqueado=false;
    }

    voltearCarta(carta){

        if(carta.getAttribute("data-estado")==="revelada" || carta.getAttribute("data-estado")==="volteada" || this.tablero_bloqueado){
            return;
        }
        carta.setAttribute("data-estado", "volteada");
        if(this.primera_carta===null){
            this.primera_carta=carta;
        }else{
            this.segunda_carta=carta;
            this.comprobarPareja();
        }
    }

    barajarCartas(){
        for(var i=0; i<this.elements.length; i++){
            var j = Math.floor(Math.random() * (i+1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }

        var index = 0;

        document.querySelectorAll("article img").forEach(card => {
            card.setAttribute("src", this.elements[index].source);
            card.setAttribute("alt", this.elements[index].element);
            index++;
        });

    }

    reiniciarAtributos(){
        this.tablero_bloqueado=false;
        this.primera_carta=null;
        this.segunda_carta=null;
    }

    deshabilitarCartas(){
        setTimeout(() =>{
            this.primera_carta.setAttribute("data-estado","revelada");
            this.segunda_carta.setAttribute("data-estado","revelada");
            this.comprobarJuego();
            this.reiniciarAtributos();
        }, 1000);
    }

    comprobarJuego(){
        document.querySelectorAll("article").forEach(card =>{
            if(card.getAttribute("data-estado")!="revelada"){
                return false;
            }
        });
        return true;
    }

    cubrirCartas(){
        this.tablero_bloqueado=true;
        setTimeout(() =>{
            this.primera_carta.removeAttribute("data-estado");
            this.segunda_carta.removeAttribute("data-estado");
            this.reiniciarAtributos();
        }, 1500);
    }

    comprobarPareja(){
        var img1 = this.primera_carta.children[1];
        var img2 = this.segunda_carta.children[1];

        var alt1 = img1.getAttribute("alt");
        var alt2 = img2.getAttribute("alt");

        (alt1===alt2) ? this.deshabilitarCartas() : this.cubrirCartas();
    }

}