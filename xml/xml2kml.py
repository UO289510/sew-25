import xml.etree.ElementTree as ET
import re

class Kml(object):

    def __init__(self):
        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc = ET.SubElement(self.raiz, 'Document')
        self.coordenadas = ""
        self.salida = ""


    def addTramo(self,numero, sector, longitud, latitud, altitud, modoAltitud):
        pm = ET.SubElement(self.doc, 'Tramo')
        ET.SubElement(pm,'numero').text = '\n' + numero + '\n'
        ET.SubElement(pm,'sector').text = '\n' + sector + '\n'
        punto = ET.SubElement(pm,'Punto')
        ET.SubElement(punto,'coordenadas').text = '\n{},{},{}\n'.format(longitud,latitud,altitud)
        ET.SubElement(punto,'altitudeMode').text = '\n' + modoAltitud + '\n'


    def addLineString(self, numero, extrude, tesela, listaCoordenadas, modoAltitud, color, ancho):
        ET.SubElement(self.doc,'name').text = '\n' + numero + '\n'
        pm = ET.SubElement(self.doc,'Placemark')
        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls,'extrude').text = '\n' + extrude + '\n'
        ET.SubElement(ls,'tessellation').text = '\n' + tesela + '\n'
        ET.SubElement(ls,'coordinates').text = '\n' + listaCoordenadas + '\n'
        ET.SubElement(ls,'altitudeMode').text = '\n' + modoAltitud + '\n'

        estilo = ET.SubElement(pm, 'Style')
        linea = ET.SubElement(estilo, 'LineStyle')
        ET.SubElement (linea, 'color').text = '\n' + color + '\n'
        ET.SubElement (linea, 'width').text = '\n' + ancho + '\n'

    def escribir(self, nombreArchivoKML):
        arbol = ET.ElementTree(self.raiz)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)

    def ver(self):
        """
        Muestra el archivo KML. Se utiliza para depurar
        """
        print("\nElemento raiz = ", self.raiz.tag)

        if self.raiz.text != None:
            print("Contenido = "    , self.raiz.text.strip('\n')) #strip() elimina los '\n' del string
        else:
            print("Contenido = "    , self.raiz.text)

        print("Atributos = "    , self.raiz.attrib)

        # Recorrido de los elementos del árbol
        for hijo in self.raiz.findall('.//'): # Expresión XPath
            print("\nElemento = " , hijo.tag)
            if hijo.text != None:
                print("Contenido = ", hijo.text.strip('\n')) #strip() elimina los '\n' del string
            else:
                print("Contenido = ", hijo.text)
            print("Atributos = ", hijo.attrib)

    def getXPath(self,archivoXML, expresionXPath):
        try:
            arbol = ET.parse(archivoXML)
        except IOError:
            print('No se encuentra el archivo ', archivoXML)
            exit()
        except ET.parseError:
            print("Error procesando en el archivo XML = ", archivoXML)
            exit()

        raiz = arbol.getroot()

        if('https' in str(raiz.attrib)):
            cadena = expresionXPath.split('/')
            aux=""
            count=0
            for palabra in cadena:
                count+=1
                aux += "{https://www.uniovi.es}"+palabra
                if(count!=len(cadena)):
                    aux = aux+"/"
            expresionXPath=aux


        elements=""

        for hijo in raiz.findall(expresionXPath):
            elements += str(hijo.attrib)
        return elements

    def cargarSalida(self):
        coord=self.getXPath("circuitoEsquema.xml", "coordenadas/salida")
        coord = coord[1:len(coord)-1]
        coord = coord.split(',')

        lat = coord[0].split(':')[1]
        long = coord[1].split(':')[1]
        alt = coord[2].split(':')[1].split("'")[1]

        lat = self.extraerCoordenadas(lat)
        long = self.extraerCoordenadas(long)
        alt = float(alt)

        #print(lat)
        #print(long)
        #print(alt)

        lat = self.convertirCoordenadas(lat)
        long = self.convertirCoordenadas(long)

        self.addTramo("0" ,"1" ,long ,lat ,alt ,'absolute')

        #print(lat)
        #print(long)
        #print(alt)

        self.coordenadas+=""+str(long)+","+str(lat)+","+str(alt)+"\n"
        self.salida=""+str(long)+","+str(lat)+","+str(alt)+"\n"



    def cargarTramos(self):
        datos=self.getXPath("circuitoEsquema.xml", "coordenadas/tramo")
        datos = re.findall(r'\{.*?\}', datos)

        count = 1

        for dato in datos:
            dato=dato.split(',')
            lat = dato[1].split(":")[1]
            long = dato[2].split(":")[1]
            alt = dato[3].split(":")[1].split("'")[1]
            sec = dato[4].split(":")[1]

            lat = self.convertirCoordenadas(self.extraerCoordenadas(lat))
            long = self.convertirCoordenadas(self.extraerCoordenadas(long))
            alt = float(alt)

            self.addTramo(str(count), sec, long, lat, alt, 'absolute')
            self.coordenadas+=""+str(long)+","+str(lat)+","+str(alt)+"\n"
            count+=1
        self.coordenadas+=self.salida.rstrip()

    def extraerCoordenadas(self, coordenadas):
        #print(coordenadas)
        coordenadas = coordenadas[2:len(coordenadas)-1]
        #print(coordenadas)
        coordenadas = coordenadas.split(" ")
        #print(coordenadas)
        coordenadas[0] = coordenadas[0][0:len(coordenadas[0])-1]
        coordenadas[1] = coordenadas[1][0:len(coordenadas[1])-1]
        coordenadas[2] = coordenadas[2][0:len(coordenadas[2])-2]
        #print(coordenadas)
        return coordenadas

    def convertirCoordenadas(self, coordenadas):
        grados = float(coordenadas[0])
        minutos = float(coordenadas[1])
        segundos = float(coordenadas[2])

        result = grados + (minutos/60) + (segundos/3600)
        return result
        #print(result)

def main():
    nombreKML = "circuito.kml"

    nuevoKML = Kml()

    salida = nuevoKML.cargarSalida()

    tramos = nuevoKML.cargarTramos()

    nuevoKML.addLineString("Circuito","1","1",
                            nuevoKML.coordenadas,'absolute',
                            '#ff0000ff', "5")

    nuevoKML.ver()

    nuevoKML.escribir(nombreKML)
    print("Creado el archivo: ", nombreKML)

if __name__ == "__main__":
    main()