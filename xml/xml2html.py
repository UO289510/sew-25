import xml.etree.ElementTree as ET
import re
import ast

class HTML(object):
    
    def __init__(self):
        self.contenido = "<!DOCTYPE HTML>\n"
        self.contenido += '\t<html lang="es"><head>\n'
        self.contenido += '\t\t<meta charset="UTF-8" />\n'
        self.contenido += '\t\t<title>MotoGP</title>\n'
        self.contenido += '\t\t<meta name="author" content="Daniel López Fdez"/>\n'
        self.contenido += '\t\t<meta name="description" content="Pagina de información del circuito de la página web MotoGP Desktop"/>\n'
        self.contenido += '\t\t<meta name="keywords" content="carreras, circuito, fecha, austria"/>\n'
        self.contenido += '\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0"/>\n'
        self.contenido += '\t\t<link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />\n'
        self.contenido += '\t\t<link rel="stylesheet" type="text/css" href="../estilo/layout.css" />\n'
        self.contenido += '\t\t</head>\n<body>\n'
        self.contenido += '\t<header>\n\t\t<h1>MotoGP Desktop</h1>\n\t\t<nav>\n'
        self.contenido +='\t\t\t<a href="../index.html" title="Index">Inicio</a>\n'
        self.contenido +='\t\t\t<a href="../piloto.html" title="Información del piloto">Piloto</a>\n'
        self.contenido +='\t\t\t<a href="../circuito.html" title="Información del circuito">Circuito</a>\n'
        self.contenido +='\t\t\t<a href="../metereologia.html" class="active" title="Información metereologica">Metereología</a>\n'
        self.contenido +='\t\t\t<a href="../clasificaciones.html" title="Información de la temporada">Clasificaciones</a>\n'
        self.contenido +='\t\t\t<a href="../juegos.html" title="Zona de juegos y entretenimiento">Juegos</a>\n'
        self.contenido +='\t\t\t<a href="../ayuda.html" title="Página de ayuda">Ayuda</a>\n\t\t</nav>\n\t</header>\n'
        self.contenido +='\n\t<p>Estás en: <a href="../index.html">Inicio</a >>> Info del Circuito </p>\n'
        self.contenido +='\n\t<main>\n\t\t<h2>Info del Circuito</h2>\n'
        self.root = None
        self.ns = {"u": "https://www.uniovi.es"}
    
    def getXPath(self, archivoXML, expresionXPath):
        try:
            arbol = ET.parse(archivoXML)
        except IOError:
            print('No se encuentra el archivo ', archivoXML)
            exit()
        except ET.ParseError:
            print("Error procesando en el archivo XML = ", archivoXML)
            exit()

        self.root = arbol.getroot()

        if ('http' in str(self.root.attrib)):
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

        for hijo in self.root.findall(expresionXPath):
            elements += str(hijo.attrib)
        return elements

    def addToHTML(self, texto):
        self.contenido+=texto
        print(self.contenido+"\n")

    def crearHTML(self):
        self.contenido += "\t\t</main>\n</body>\n</html>\n"
        with open("infoCircuito.html", "w") as html_file:
            html_file.write(self.contenido)
            print("HTML creado correctamente")

    def cargarCaracteristicas(self, xPath, nombreSeccion):
        caracteristicas = self.getXPath("circuitoEsquema.xml", xPath)
        
        caracteristicas = caracteristicas[1:len(caracteristicas)-1]
        caracteristicas = caracteristicas.split(",")
        
        contenido = "\t\t<section>\n\t\t\t\t<h3>"+nombreSeccion+"</h3>\n\t\t\t\t<ul>\n"
        
        for datos in caracteristicas:
            contenido += self.parseDato(datos)
        contenido+= "\t\t\t\t</ul>\n\t\t</section>\n"
        self.addToHTML(contenido)
        
        
    def cargarCarrera(self, xPath, nombreSeccion):
        caracteristicas = self.getXPath("circuitoEsquema.xml", xPath)
        
        caracteristicas = caracteristicas[1:len(caracteristicas)-1]
        caracteristicas = caracteristicas.split(",")
        
        contenido = "\t\t<section>\n\t\t\t\t<h3>"+nombreSeccion+"</h3>\n\t\t\t\t<ul>\n"
        
        contenido += self.parseDato(caracteristicas[0])
        
        hora = caracteristicas[1]
        hora = hora.split("': '")
        nombre = hora[0]
        nombre = nombre[2:len(nombre)].capitalize()
        valor = hora[1]
        valor = valor[0:len(valor)-1]
        contenido+="\t\t\t\t\t<li>"+nombre+": "+valor+"</li>\n"
        
        contenido += self.parseDato(caracteristicas[2])
        contenido += self.parseDato(caracteristicas[3])
        
        contenido+= "\t\t\t\t</ul>\n"
        contenido+= "\t\t\t\t<h4>Resultados de la carrera</h4>\n\t\t\t\t<ul>\n"
        
        ganador = self.root.find("u:resultados/u:ganador", self.ns).text
        tiempo = self.root.find("u:resultados/u:tiempo", self.ns).text
        primero = self.root.find("u:resultados/u:primer_puesto", self.ns).text
        segundo = self.root.find("u:resultados/u:segundo_puesto", self.ns).text
        tercero = self.root.find("u:resultados/u:tercer_puesto", self.ns).text
        
        contenido+="\t\t\t\t\t<li>Ganador: "+ganador+"</li>\n"
        contenido+="\t\t\t\t\t<li>Tiempo: "+tiempo+"</li>\n"
        contenido+="\t\t\t\t\t<li>Podio:\n"
        contenido+="\t\t\t\t\t\t<ol>\n"
        contenido+="\t\t\t\t\t\t\t<li>"+primero+"</li>\n"
        contenido+="\t\t\t\t\t\t\t<li>"+segundo+"</li>\n"
        contenido+="\t\t\t\t\t\t\t<li>"+tercero+"</li>\n"
        contenido+="\t\t\t\t\t\t</ol>\n\t\t\t\t\t</li>\n"
        contenido += "\t\t\t\t</ul>\n"
        contenido+= "\t\t</section>\n"
        self.addToHTML(contenido)
        
    def cargarReferencias(self, xPath, nombreSeccion):
        referencias = self.getXPath("circuitoEsquema.xml", xPath)
        
        bloques = re.findall(r"\{.*?\}", referencias);
        referencias = [ast.literal_eval(b) for b in bloques]
            
        contenido = "\t\t<section>\n\t\t\t\t<h3>"+nombreSeccion+"</h3>\n\t\t\t\t<ul>\n"
        
        for datos in referencias:
            valor = datos['enlace']
            nombre = datos['nombre']
            contenido+='\t\t\t\t\t<li>Enlace: <a href="'+valor+'">'+nombre+'</a></li>\n'
        
        contenido+= "\t\t\t\t</ul>\n\t\t\t</section>\n"
        self.addToHTML(contenido)
        
        
    def cargarGalerias(self, nombreSeccion):
        
        contenido = "\t\t<section>\n\t\t\t\t<h3>"+nombreSeccion+"</h3>\n"
        
        contenido += self.cargarGaleriaImagenes("galeria/galeria_imagenes/*", "Galeria de imagenes")
        contenido += self.cargarGaleriaVideos("galeria/galeria_videos/*", "Galeria de videos")
        
        contenido += "\t\t\t</section>\n"
        self.addToHTML(contenido)
        
        
    def cargarGaleriaImagenes(self, xPath, nombreSeccion):
        imagenes = self.getXPath("circuitoEsquema.xml", xPath)
         
        bloques = re.findall(r"\{.*?\}", imagenes);
        imagenes = [ast.literal_eval(b) for b in bloques]
             
        contenido = "\t\t\t\t<section>\n\t\t\t\t\t\t<h3>"+nombreSeccion+"</h3>\n"
         
        for datos in imagenes:
            valor = datos['src']
            nombre = datos['alt']
            contenido+='\t\t\t\t\t\t<img src="../'+valor+'" alt="'+nombre+'">\n'       
        contenido+= "\t\t\t\t\t</section>\n"
        return contenido
    
    def cargarGaleriaVideos(self, xPath, nombreSeccion):
        videos = self.getXPath("circuitoEsquema.xml", xPath)
         
        bloques = re.findall(r"\{.*?\}", videos);
        videos = [ast.literal_eval(b) for b in bloques]
             
        contenido = "\t\t\t\t<section>\n\t\t\t\t\t<h3>"+nombreSeccion+"</h3>\n"
        
        contenido+="\t\t\t\t\t<video controls>\n"
        for datos in videos:
            valor = datos['src']
            contenido+='\t\t\t\t\t\t<source src="../'+valor+'"'
            tipo = "video/mp4";
            codecs = 'codecs="avc1.42E01E, mp4a.40.2"'
            contenido+=" type='"+tipo+"; "+codecs+"'>\n"
        contenido+= "\t\t\t\t\t</video>\n\t\t\t\t</section>\n"
        return contenido
        
    def parseDato(self, dato):
        contenido = ""
        datos = dato.split(":")
        nombre = datos[0].strip()
        nombre = nombre[1:len(nombre)-1].capitalize()
        valor = datos[1].strip()
        valor = valor[1:len(valor)-1]
        contenido+="\t\t\t\t\t<li>"+nombre+": "+valor+"</li>\n"
        return contenido
        
        
def main():
    nuevoHTML = HTML()
    nuevoHTML.cargarCaracteristicas("caracteristicas/caracteristica", "Caracteristicas")
    nuevoHTML.cargarCarrera("carrera/infoCarrera/dato", "Carrera")
    nuevoHTML.cargarReferencias("referencias/*", "Referencias")
    nuevoHTML.cargarGalerias("Galeria")
    
    nuevoHTML.crearHTML()
    
if __name__ == "__main__":
    main()