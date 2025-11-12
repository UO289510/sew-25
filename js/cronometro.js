class Cronometro{

    constructor(){

        this.tiempo = 0;

    }

    arrancar(){
        try{
            this.inicio = Temporal.Now.instant();
        }catch(err){
            this.inicio = new Date();
        }
        this.corriendo = setInterval(this.actualizar.bind(this), 100);
    }

    
    actualizar(){
        
        var ahora;

        try{
            ahora = Temporal.Now.instant();
            this.tiempo = ahora.epochMilliseconds - this.inicio.epochMilliseconds;
        }catch(err){
            ahora = new Date();
            this.tiempo = ahora.getTime() - this.inicio.getTime();
        }
        
        this.mostrar();
    }

    mostrar(){
        if(typeof this.tiempo !== "number"){
            this.tiempo = 0;
        }

        var minutos = parseInt(this.tiempo / 60000);
        var segundos = parseInt(this.tiempo  % 60000 / 1000);
        var decimas = parseInt(this.tiempo % 1000 / 100);
    
        var formato = String(minutos).padStart(2, "0") +
        ":" + String(segundos).padStart(2, "0") + ":" + decimas;

        var parrafo = document.querySelector("main p:first-of-type");
        parrafo.textContent = formato;
    }

    parar(){
        clearInterval(this.corriendo);
    }

    reiniciar(){
        clearInterval(this.corriendo);
        this.tiempo = 0;
        this.mostrar();
    }
}