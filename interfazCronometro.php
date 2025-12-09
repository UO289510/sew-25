<!DOCTYPE HTML>
<html lang="es">
    <head>
        <!-- Datos que describen el documento -->
        <meta charset="UTF-8" />
        <title>MotoGP</title>
        <meta name="author" content="Daniel López Fdez"/>
        <meta name="description" content="Juego del cronometro"/>
        <meta name="keywords" content="entretenimiento, reaccion, cronometro"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
        <link rel="stylesheet" type="text/css" href="estilo/layout.css"/>
    </head>

    <body>
        <?php include 'cronometro.php';?>
        <header>
            <h1>MotoGP Desktop</h1>
            <nav>
                <a href="index.html" title="Index">Inicio</a>
                <a href="piloto.html" title="Información del piloto">Piloto</a>
                <a href="circuito.html" title="Información del circuito">Circuito</a>
                <a href="metereologia.html" title="Información metereologica">Metereología</a>
                <a href="clasificaciones.php" title="Información de la temporada">Clasificaciones</a>
                <a href="juegos.html" title="Zona de juegos y entretenimiento">Juegos</a>
                <a href="ayuda.html" title="Página de ayuda">Ayuda</a>
                <a href="cronometro.php" class="active" title="Cronometro">Cronometro</a>
            </nav>
        </header>

        <p>Estas en <a href="index.html">Inicio</a>>> <a href="juegos.html">Juegos</a><<<strong>Cronometro</strong></p>

        <main>
           
            <form action="#" method="post" name="botones">
                <input type="submit" class="button" name="arrancar" value="Arrancar"/>
                <input type="submit" class="button" name="parar" value="Parar"/>
                <input type="submit" class="button" name="mostrar" value="Mostrar"/>
            </form>

             <?php
                $cronometro = new Cronometro();                   
                if(count($_POST)>0){
                    $cronometro->procesarBoton();
                }
            ?>

        </main>
    </body>
</html>