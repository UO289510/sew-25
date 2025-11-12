class Ciudad{

    constructor(name, country, denonym){
        this.name = name;
        this.country = country;
        this.denonym = denonym;
        this.population = 0;
        this.centerPoint = "";

        this.rellenar();
    }

    rellenar(){
        this.population = 5383;
        this.centerPoint = "47°12'30''N  14°47'51''E";
    }

    getCiudad(){
        return ""+this.name;
    }
    
    getPais(){
        return ""+this.country;
    }

    getInfo(){
        return "<ul><li>Gentilicio: "+this.denonym+"</li><li>Poblacion: "+this.population+"</li></ul>";
    }

    writeCoord(){
        document.write("<p>Coordenadas: "+this.centerPoint+"</p>");
    }

}