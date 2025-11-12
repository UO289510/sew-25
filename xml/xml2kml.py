import xml.etree.ElementTree as ET




def main():
    miArchivoXML = input('Introduzca un archivo XML = ')
    nuevoKML = Kml()
    
    salida = nuevoKml.cargarSalida()
    tramos = nuevoKml.cargarTramos()
    
   nuevoKML.addLineString("Circuito","1","1",
                           nuevoKML.coordenadas,'relativeToGround',
                           '#ff0000ff', "5")
   nuevoKML.ver()
   nuevoKML.escribir("circuito.kml")
   print("Creado el archivo: circuito.kml")
    
if __name__ == "__main__":
    main()