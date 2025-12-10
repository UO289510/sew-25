<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>MotoGP Desktop - Clasificaciones</title>
    <link rel="icon" href="multimedia/favicon.ico">
    <meta name="author" content="Daniel López Fdez"/>
    <meta name="description" content="Pagina de clasificaciones de la página web MotoGP Desktop"/>
    <meta name="keywords" content="clasificaciones, temporada, motogp, carreras"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
</head>

<body>

    <?php
        class Clasificacion {

            private $documento;

            function __construct(){
                $this->documento = "xml/circuitoEsquema.xml";
            }

            function consultar(){
                
                $datos = file_get_contents($this->documento);

                if($datos==null){
                    echo "<h3>Error en el archivo XML recibido</h3>";
                }else{
                    echo "<h2>Clasificacion</h2>";
                }
                
                $datos =preg_replace("/>\s*</",">\n<",$datos);
                $xml = new SimpleXMLElement($datos);

                $resultados = $xml->resultados;
                
                $html = "<section><ul>";
                $html .= "<li>Ganador: " . $resultados->ganador . "</li>";
                $html .= "<li>Tiempo: " . $resultados->tiempo . "</li></ul></section>";
                $html .= "<section><h3>Podio</h3><ol><li>" . $resultados->primer_puesto . "</li>";
                $html .= "<li>" . $resultados->segundo_puesto . "</li>";
                $html .= "<li>" . $resultados->tercer_puesto . "</li></ol></section>";
            
                echo $html;
            }
        }
    ?>

    <header>
        <h1><a href="index.html">MotoGP Desktop</a></h1>
        <nav>
            <a href="index.html" title="Index">Inicio</a>
            <a href="piloto.html" title="Información del piloto">Piloto</a>
            <a href="circuito.html" title="Información del circuito">Circuito</a>
            <a href="metereologia.html" title="Información metereologica">Metereología</a>
            <a href="clasificaciones.php" class="active" title="Información de la temporada">Clasificaciones</a>
            <a href="juegos.html" title="Zona de juegos y entretenimiento">Juegos</a>
            <a href="ayuda.html" title="Página de ayuda">Ayuda</a>
            <a href="interfazCronometro.php" title="Cronometro">Cronometro</a>
        </nav>
    </header>

    <p>Estas en <a href="index.html">Inicio</a> >> <strong>Clasificaciones</strong></p>

    <main>
        <?php
            $clasificacion = new Clasificacion();
            $clasificacion->consultar();
        ?>
    </main>
</body>
</html>