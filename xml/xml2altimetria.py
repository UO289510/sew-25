import xml.etree.ElementTree as ET
import re

class Svg(object):

    def __init__(self):
        self.svg_width = 5000
        self.svg_height = 300
        self.puntos = []
        self.distancias = []
        self.alturas = []

    def addTramo(self, distancia, sector, latitud, longitud, altitud):
        # Calcula la posición X e Y y la añade a la lista de puntos

        escala_x = 40.5
        escala_y = 0.3
        desplazamiento_x = 30

        x = len(self.puntos)*escala_x + desplazamiento_x # Escalado de longitud, ajusta según tus necesidades
        y_base = 300  # Base de Y para que el 0 esté en la parte inferior
        y = y_base - (float(altitud) * escala_y)  # Escala de altitud, ajusta según tus necesidades
        self.puntos.append(f"{x},{y}")
        self.distancias.append(distancia)
        self.alturas.append(altitud)

    def crear_svg(self):
        # Iniciar el contenido SVG
        svg_content = '<?xml version="1.0" encoding="utf-8"?>'
        svg_content += f'<svg width="{self.svg_width}" height="{self.svg_height}" xmlns="http://www.w3.org/2000/svg">\n'

        # Base de Y (nivel del mar)
        y_base = self.svg_height  

        # Unir los puntos en un string separado por espacios
        puntos_str = ' '.join(self.puntos)

        # Añadir extremos en la línea del mar para cerrar la polilínea
        primer_x, _ = map(float, self.puntos[0].split(","))
        ultimo_x, _ = map(float, self.puntos[-1].split(","))
        puntos_str += f' {ultimo_x},{y_base} {primer_x},{y_base} {self.puntos[0]}'

        # Dibujar polilínea cerrada con relleno
        svg_content += f'  <polyline points="{puntos_str}" stroke="blue" stroke-width="2" fill="lightblue" fill-opacity="0.5"/>\n'

        # Línea horizontal del nivel del mar
        svg_content += f'  <line x1="{primer_x}" y1="{y_base}" x2="{ultimo_x}" y2="{y_base}" stroke="black" stroke-width="1" stroke-dasharray="5,5"/>\n'

        distancia = 0.0
        for i, punto in enumerate(self.puntos):
            x, y = map(float, punto.split(","))
            distancia += float(self.distancias[i])
            distancia = round(distancia, 2)
            altura = self.alturas[i]
            
            y_label = y-23
            
            svg_content += f'  <text x="{x}" y="{y_label}" style="writing-mode: tb; glyph-orientation-vertical: 1;">\n'
            svg_content += f' {i} --- {altura}m ({distancia}m)\n'
            svg_content += f'  </text>\n'

        # Cerrar la etiqueta SVG
        svg_content += '</svg>'

        # Guardar el contenido SVG en un archivo
        with open("altimetria.svg", "w") as svg_file:
            svg_file.write(svg_content)

        print("SVG generado correctamente con polilínea cerrada y línea de nivel del mar.")


    def getXPath(self, archivoXML, expresionXPath):
        try:
            arbol = ET.parse(archivoXML)
        except IOError:
            print('No se encuentra el archivo ', archivoXML)
            exit()
        except ET.ParseError:
            print("Error procesando en el archivo XML = ", archivoXML)
            exit()

        raiz = arbol.getroot()

        if ('http' in str(raiz.attrib)):
            cadena = expresionXPath.split('/')
            aux = ""
            count = 0
            for palabra in cadena:
                count += 1
                aux += "{https://www.uniovi.es}" + palabra
                if count != len(cadena):
                    aux = aux + "/"
            expresionXPath = aux

        elements = ""

        for hijo in raiz.findall(expresionXPath):
            elements += str(hijo.attrib)
        return elements

    def cargarTramos(self):
        datos = self.getXPath("circuitoEsquema.xml", "coordenadas/salida")
        datos = datos[1:len(datos)-1]
        datos = datos.split(",")

        lat = datos[0].split(':')[1]
        long = datos[1].split(':')[1]
        alt = datos[2].split(':')[1].split("'")[1]

        lat = self.convertirCoordenadas(self.extraerCoordenadas(lat))
        long = self.convertirCoordenadas(self.extraerCoordenadas(long))
        alt = float(alt)

        self.addTramo(0, "", lat, long, alt)  # Usamos valores vacíos para el número y sector


        datos = self.getXPath("circuitoEsquema.xml", "coordenadas/tramo")
        datos = re.findall(r'\{.*?\}', datos)

        for dato in datos:
            dato = dato.split(',')
            distancia = dato[0].split(":")[1].split("'")[1]
            lat = dato[1].split(":")[1]
            long = dato[2].split(":")[1]
            alt = dato[3].split(":")[1].split("'")[1]

            lat = self.convertirCoordenadas(self.extraerCoordenadas(lat))
            long = self.convertirCoordenadas(self.extraerCoordenadas(long))
            alt = float(alt)

            print(lat)
            print(long)

            self.addTramo(distancia, "", lat, long, alt)  # Usamos valores vacíos para el número y sector

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
    nuevoSvg = Svg()

    tramos = nuevoSvg.cargarTramos()
    nuevoSvg.crear_svg()

    print("Creado el archivo: altimetriaPrueba.svg")

if __name__ == "__main__":
    main()