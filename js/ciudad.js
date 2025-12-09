class Ciudad{

    #nombre;
    #pais;
    #gentilicio;
    #poblacion;
    #centro;

    constructor(nombre, pais, gentilicio){
        this.#nombre = nombre;
        this.#pais = pais;
        this.#gentilicio = gentilicio;
        this.#poblacion = 0;
        this.#centro = "";

        this.#rellenar();
    }

    #rellenar(){
        this.#poblacion = 5383;
        this.#centro = "47°12'30''N  14°47'51''E";
    }

    getCiudad(){
        var titulo = document.createElement("h2");
        titulo.textContent = this.#nombre;
        document.querySelector("main").appendChild(titulo);
    }
    
    getPais(){
        var pais = document.createElement("h3");
        pais.textContent = "Pais: "+this.#pais;
        document.querySelector("main").appendChild(pais);
    }

    getInfo(){
        var lista = document.createElement("ul");

        var item1 = document.createElement("li")
        item1.textContent = "Gentilicio: "+this.#gentilicio;

        var item2 = document.createElement("li")
        item2.textContent = "Poblacion: "+this.#poblacion;

        lista.appendChild(item1);
        lista.appendChild(item2);

        document.querySelector("main").appendChild(lista);
    }

    writeCoord(){
        var parrafo = document.createElement("p");
        parrafo.textContent = "Coordenadas: "+this.#centro;
        document.querySelector("main").appendChild(parrafo);
    }

    getMetereologiaCarrera(){

        var apiURL = "https://archive-api.open-meteo.com/v1/archive?latitude=47.219722&longitude=14.764722&start_date=2025-08-17&end_date=2025-08-17&daily=sunrise,sunset&hourly=temperature_2m,apparent_temperature,rain,relative_humidity_2m,wind_speed_10m,wind_direction_10m&timezone=auto";
        $.ajax({
            dataType: "json",
            url: apiURL,
            method: 'GET',
            success: (datos) => {
                this.#procesarJSONCarrera(datos);
            },
            error: function(){
                $("h3").html("¡Tenemos problemas!");
            }
        });

    }

    #procesarJSONCarrera(datos){

        var indice = 0;

        var hourly = datos.hourly;

        var horas = hourly.time;

        for(var i=0; i<horas.length; i++){
            if(horas[i] == "2025-08-17T17:00"){
                indice = i;
                break;
            }
        }

        var temperatura_2m = hourly.temperature_2m[indice];
        var sensacion_termica = hourly.apparent_temperature[indice];
        var lluvia = hourly.rain[indice];
        var humedad_relativa = hourly.relative_humidity_2m[indice];
        var velocidad_viento = hourly.wind_speed_10m[indice];
        var direccion_viento = datos.hourly.wind_direction_10m[indice];
        
        var sunrise = datos.daily.sunrise[0];
        var sunrise_parts = sunrise.split("T");

        var sunset = datos.daily.sunset[0];
        var sunset_parts = sunset.split("T");

        var section = document.createElement("section");
        var title = document.createElement("h3");
        title.textContent = "Pronostico metereológico para la carrera";
        section.appendChild(title);
        
        var lista = document.createElement("ul");
        
        var item1 = document.createElement("li");
        item1.textContent = "Temperatura: "+temperatura_2m+" °C";
        lista.appendChild(item1);
        
        var item2 = document.createElement("li");
        item2.textContent = "Sensación térmica: "+sensacion_termica+" °C";
        lista.appendChild(item2);
        
        var item3 = document.createElement("li");
        item3.textContent = "Lluvia: "+lluvia+" mm";
        lista.appendChild(item3);
                
        var item4 = document.createElement("li");
        item4.textContent = "Humedad relativa: "+humedad_relativa+" %";
        lista.appendChild(item4);
                
        var item5 = document.createElement("li");
        item5.textContent = "Velocidad del viento: "+velocidad_viento+" km/h";
        lista.appendChild(item5);
                
        var item6 = document.createElement("li");
        item6.textContent = "Direccion del viento: "+direccion_viento+" °"
        lista.appendChild(item6);
                
        var item7 = document.createElement("li");
        item7.textContent = "Amanecer: "+sunrise_parts[1];
        lista.appendChild(item7);
                
        var item8 = document.createElement("li");
        item8.textContent = "Atardecer: "+sunset_parts[1];
        lista.appendChild(item8);

        section.appendChild(lista);
        
        $("main").append(section);
    }

    
    getMetereologiaEntrenos(){
        
        var urlAPI = "https://archive-api.open-meteo.com/v1/archive?latitude=47.219722&longitude=14.764722&start_date=2025-08-14&end_date=2025-08-16&hourly=temperature_2m,rain,wind_speed_10m,relative_humidity_2m&timezone=auto";

        $.ajax({
           dataType: "json",
           url: urlAPI,
           method: 'GET',
           success: (datos) => {
                this.#procesarJSONEntrenos(datos);
           },
           error: function(){
                $("h3").html("¡Tenemos problemas!");
           } 
        });
    }

    #procesarJSONEntrenos(datos){

        var horasActivas = [
            "2025-08-14T15:00",
            "2025-08-15T10:00",
            "2025-08-15T11:00",
            "2025-08-15T15:00",
            "2025-08-15T16:00",
            "2025-08-16T10:00",
            "2025-08-16T11:00",
            "2025-08-16T15:00"
        ];

        var indices = [];

        var hourly = datos.hourly;
        var horas = hourly.time;

        for(var i=0; i<horas.length; i++){
            if(horasActivas.includes(horas[i])){
                indices.push(i);
            }            
        }

        var section = document.createElement("section");
        var title = document.createElement("h3");
        title.textContent = "Pronostico metereológico para los entrenos";
        section.appendChild(title);

        var dia1 = document.createElement("h4");
        dia1.textContent = "14 de Agosto 2025";
        section.append(dia1);
        var listaDia1 = document.createElement("ul");

        var temperatura_dia1 = hourly.temperature_2m[indices[0]];
        var temp_dia1 = document.createElement("li");
        temp_dia1.textContent = "Temperatura media: "+temperatura_dia1+" °C";
        listaDia1.append(temp_dia1);

        var lluvia_dia1 = hourly.rain[indices[0]];
        var rain_dia1 = document.createElement("li");
        rain_dia1.textContent = "Precipitación media: "+lluvia_dia1+" mm";
        listaDia1.append(rain_dia1);

        var velocidad_viento_dia1 = hourly.wind_speed_10m[indices[0]];
        var wind_dia1 = document.createElement("li");
        wind_dia1.textContent = "Velocidad del viento media: "+velocidad_viento_dia1+" km/h";
        listaDia1.append(wind_dia1);

        var humedad_dia1 = hourly.relative_humidity_2m[indices[0]];
        var hum_dia1 = document.createElement("li");
        hum_dia1.textContent = "Humedad media: "+humedad_dia1+" %";
        listaDia1.append(hum_dia1);
        section.append(listaDia1);


        var media_temp_dia2 = ((hourly.temperature_2m[indices[1]]+
                                hourly.temperature_2m[indices[2]]+
                                hourly.temperature_2m[indices[3]]+
                                hourly.temperature_2m[indices[4]])/4).toFixed(2);
        
        var media_lluvia_dia2 = ((hourly.rain[indices[1]]+
                                  hourly.rain[indices[2]]+
                                  hourly.rain[indices[3]]+
                                  hourly.rain[indices[4]])/4).toFixed(2);

        var media_velocidad_dia2 = ((hourly.wind_speed_10m[indices[1]]+
                                     hourly.wind_speed_10m[indices[2]]+
                                     hourly.wind_speed_10m[indices[3]]+
                                     hourly.wind_speed_10m[indices[4]])/4).toFixed(2);
                                    
        var media_humedad_dia2 = ((hourly.relative_humidity_2m[indices[1]]+
                                   hourly.relative_humidity_2m[indices[2]]+
                                   hourly.relative_humidity_2m[indices[3]]+
                                   hourly.relative_humidity_2m[indices[4]])/4).toFixed(2)
    

        var dia2 = document.createElement("h4");
        dia2.textContent = "15 de Agosto 2025";
        section.append(dia2);

        var listaDia2 = document.createElement("ul");
    
        var temp_dia2 = document.createElement("li");
        temp_dia2.textContent = "Temperatura media: "+media_temp_dia2+" °C";
        listaDia2.append(temp_dia2);
    
        var lluvia_dia2 = document.createElement("li");
        lluvia_dia2.textContent = "Precipitación media: "+media_lluvia_dia2+" mm";
        listaDia2.append(lluvia_dia2);
    
        var vel_dia2 = document.createElement("li");
        vel_dia2.textContent = "Velocidad del viento media: "+media_velocidad_dia2+" km/h";
        listaDia2.append(vel_dia2);

        var hum_dia2 = document.createElement("li");
        hum_dia2.textContent = "Humedad media: "+media_humedad_dia2+" %";
        listaDia2.append(hum_dia2);

        section.append(listaDia2);
        


        var media_temp_dia3 = ((hourly.temperature_2m[indices[5]]+
                                hourly.temperature_2m[indices[6]]+
                                hourly.temperature_2m[indices[7]]
                                )/3).toFixed(2);
        
        var media_lluvia_dia3 = ((hourly.rain[indices[5]]+
                                  hourly.rain[indices[6]]+
                                  hourly.rain[indices[7]])/3).toFixed(2);
    
        var media_velocidad_dia3 = ((hourly.wind_speed_10m[indices[5]]+
                                     hourly.wind_speed_10m[indices[6]]+
                                     hourly.wind_speed_10m[indices[7]])/3).toFixed(2);

        var media_humedad_dia3 = ((hourly.relative_humidity_2m[indices[5]]+
                                   hourly.relative_humidity_2m[indices[6]]+
                                   hourly.relative_humidity_2m[indices[7]])/3).toFixed(2);
    
        
        var dia3 = document.createElement("h4");
        dia3.textContent = "16 de Agosto 2025";
        section.append(dia3);
        var listaDia3 = document.createElement("ul");
        
        var temp_dia3 = document.createElement("li");
        temp_dia3.textContent = "Temperatura media: "+media_temp_dia3+" °C";
        listaDia3.append(temp_dia3);
    
        var lluvia_dia3 = document.createElement("li");
        lluvia_dia3.textContent = "Precipitación media: "+media_lluvia_dia3+" mm";
        listaDia3.append(lluvia_dia3);
    
        var vel_dia3 = document.createElement("li");
        vel_dia3.textContent = "Velocidad del viento media: "+media_velocidad_dia3+" km/h";
        listaDia3.append(vel_dia3);

        var hum_dia3 = document.createElement("li");
        hum_dia3.textContent = "Humedad media: "+media_humedad_dia3+" %";
        listaDia3.append(hum_dia3);

        section.append(listaDia3);

        $("main").append(section);
    }

    


}