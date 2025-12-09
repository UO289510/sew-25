<!DOCTYPE HTML>
<html lang="es">
    <head>
        <!-- Datos que describen el documento -->
        <meta charset="UTF-8" />
        <title>MotoGP</title>
        <meta name="author" content="Daniel López Fdez"/>
        <meta name="description" content="Configuracion del test"/>
        <meta name="keywords" content="test, pruebas, configuración"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
        <link rel="stylesheet" type="text/css" href="../estilo/layout.css"/>
    </head>

    <body>

    <?php
    class Configuracion{
        private $db;
        private $dbServer;
        private $dbUser;
        private $dbPass;
        private $dbname;
    
        public function __construct(){
            $this->dbServer = 'localhost';
            $this->dbUser = 'DBUSER2025';
            $this->dbPass = 'DBPSWD2025';
            $this->dbname = 'uo289510_db';
        }


        public function eliminarBD(){
            $db = new mysqli($this->dbServer, $this->dbUser, $this->dbPass, $this->dbname);
        
            if($db->connect_errno){
                echo "Error de conexión: " . $this->db->connect_error;
            }
            
            $consulta = "DROP DATABASE " . $this->dbname . ";";

            if($db->query($consulta))
                echo "<p>Eliminada la base de datos 'agenda'</p>";
            else
                echo "<p>No se ha podido eliminar la base de datos 'agenda'. Error: " . $db->error . "</p>";
            //cerrar la conexión
            $db->close();  
        }


        public function reiniciarBD(){

            $db = new mysqli($this->dbServer, $this->dbUser, $this->dbPass, $this->dbname);
        
            if($db->connect_errno){
                echo "Error de conexión: " . $this->db->connect_error;
            }

            $tablas = ['usuario', 'resultados', 'propuestas', 'observaciones', 'comentarios', 'dispositivo', 'respuesta', 'pregunta'];

            foreach($tablas as $tabla){
                $consulta = "DELETE FROM " . $tabla . ";";
                if($db->query($consulta))
                    echo "<p>Vaciada la tabla '" . $tabla . "'</p>";
                else
                    echo "<p>No se ha podido vaciar la tabla '" . $tabla . "'. Error: " . $db->error . "</p>";
            }
            echo "<p>Base de datos reiniciada.</p>";
        }


        public function exportarBD(){

            $db = new mysqli($this->dbServer, $this->dbUser, $this->dbPass, $this->dbname);

            if($db->connect_error){
                echo("Error de conexión: " . $db->connect_error);
            }

            $tablas = ['usuario', 'resultados', 'propuestas', 'observaciones', 'comentarios', 'dispositivo'];

            $archivo = fopen(__DIR__ . "/datos_exportados.csv", "w");

            foreach($tablas as $tabla){
                $consulta = "SELECT * FROM " . $tabla . ";";
                $resultado = $db->query($consulta);

                if($resultado) {
                    echo "Error en la consulta: " . $db->error;
                }

                $columnas = array();
                while ($campo = $resultado->fetch_field()) {
                    $columnas[] = $campo->name;
                }

                fputcsv($archivo, $columnas);
                while ($fila = $resultado->fetch_assoc()) {
                    fputcsv($archivo, $fila);
                }

            }
            fclose($archivo);
            $db->close();
            echo "<p>Base de datos exportada.</p>";
        }

        public function crearBD(){

            $db = new mysqli($this->dbServer, $this->dbUser, $this->dbPass);

            if ($db->connect_error) {
                die("Error de conexión: " . $db->connect_error);
            }

            $sql = "CREATE DATABASE IF NOT EXISTS `$this->dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
            if (!$db->query($sql)) {
                echo "No se pudo crear la base de datos: " . $db->error;
                return;
            }

            $db->select_db($this->dbname);

            $tablas = [
                "CREATE TABLE IF NOT EXISTS usuario (
                    `codigo_usuario` int(2) NOT NULL,
                    `profesion` varchar(100) NOT NULL,
                    `edad` int(2) NOT NULL,
                    `genero` varchar(100) NOT NULL,
                    `pericia` int(3) NOT NULL
                );",
                "CREATE TABLE IF NOT EXISTS `resultados` (
                    `codigo_prueba` int(2) NOT NULL,
                    `codigo_usuario` int(2) NOT NULL,
                    `codigo_dispositivo` int(2) NOT NULL,
                    `tiempo` double DEFAULT NULL,
                    `completada` tinyint(1) NOT NULL DEFAULT 1,
                    `valoracion` int(2) NOT NULL
                );",
                "CREATE TABLE IF NOT EXISTS `propuestas` (
                    `codigo_propuesta` int(2) NOT NULL,
                    `codigo_resultado` int(2) NOT NULL,
                    `propuesta` varchar(500) NOT NULL
                );",
                "CREATE TABLE IF NOT EXISTS `observaciones` (
                    `codigo_observacion` int(2) NOT NULL,
                    `codigo_usuario` int(2) NOT NULL,
                    `Comentarios` text NOT NULL
                );",
                "CREATE TABLE IF NOT EXISTS `dispositivo` (
                    `codigo_dispositivo` int(2) NOT NULL,
                    `nombre` varchar(100) NOT NULL
                );",
                "CREATE TABLE IF NOT EXISTS `comentarios` (
                    `codigo_comentario` int(2) NOT NULL,
                    `codigo_resultado` int(2) NOT NULL,
                    `comentario` varchar(500) NOT NULL
                );",
                "CREATE TABLE IF NOT EXISTS `respuesta` (
                    `codigo_respuesta` int(2) NOT NULL,
                    `codigo_pregunta` int(2) NOT NULL,
                    `codigo_usuario` int(2) NOT NULL,
                    `respuesta` varchar(500) NOT NULL
                );",
                "CREATE TABLE IF NOT EXISTS `pregunta` (
                    `codigo_pregunta` int(2) NOT NULL,
                    `texto` varchar(500) NOT NULL
                    );"
            ];

            $indices = [
                "ALTER TABLE `comentarios`
                    ADD PRIMARY KEY (`codigo_comentario`),
                    ADD KEY `idx_codigo_resultado` (`codigo_resultado`);",
                "ALTER TABLE `dispositivo`
                    ADD PRIMARY KEY (`codigo_dispositivo`);",
                "ALTER TABLE `observaciones`
                    ADD PRIMARY KEY (`codigo_observacion`),
                    ADD KEY `idx_codigo_usuario` (`codigo_usuario`);",
                "ALTER TABLE `propuestas`
                    ADD PRIMARY KEY (`codigo_propuesta`),
                    ADD KEY `fk_codigo_resultado` (`codigo_resultado`);",
                "ALTER TABLE `resultados`
                    ADD PRIMARY KEY (`codigo_prueba`),
                    ADD KEY `fk_codigo_usuario` (`codigo_usuario`),
                    ADD KEY `fk_codigo_dispositivo` (`codigo_dispositivo`);",
                "ALTER TABLE `usuario`
                    ADD PRIMARY KEY (`codigo_usuario`);",
                "ALTER TABLE `comentarios`
                    MODIFY `codigo_comentario` int(2) NOT NULL AUTO_INCREMENT;",
                "ALTER TABLE `dispositivo`
                    MODIFY `codigo_dispositivo` int(2) NOT NULL AUTO_INCREMENT;",
                "ALTER TABLE `observaciones`
                    MODIFY `codigo_observacion` int(2) NOT NULL AUTO_INCREMENT;",
                "ALTER TABLE `propuestas`
                    MODIFY `codigo_propuesta` int(2) NOT NULL AUTO_INCREMENT;",
                "ALTER TABLE `resultados`
                    MODIFY `codigo_prueba` int(2) NOT NULL AUTO_INCREMENT;",
                "ALTER TABLE `usuario`
                    MODIFY `codigo_usuario` int(2) NOT NULL AUTO_INCREMENT;",
                "ALTER TABLE `pregunta`
                    ADD PRIMARY KEY (`codigo_pregunta`);",
                "ALTER TABLE `pregunta`
                    MODIFY `codigo_pregunta` int(2) NOT NULL AUTO_INCREMENT;",
                "ALTER TABLE `respuesta`
                    ADD PRIMARY KEY (`codigo_respuesta`),
                    ADD KEY `fk_codigo_pregunta` (`codigo_pregunta`),
                    ADD KEY `codigo_usuario` (`codigo_usuario`);",
                "ALTER TABLE `respuesta`
                    MODIFY `codigo_respuesta` int(2) NOT NULL AUTO_INCREMENT;"
        ];

            $filtros = [
                "ALTER TABLE `comentarios`
                    ADD CONSTRAINT `fk_comentarios_resultados` FOREIGN KEY (`codigo_resultado`) REFERENCES `resultados` (`codigo_prueba`) ON DELETE CASCADE ON UPDATE CASCADE;",
                "ALTER TABLE `observaciones`
                    ADD CONSTRAINT `fk_observaciones_usuario` FOREIGN KEY (`codigo_usuario`) REFERENCES `usuario` (`codigo_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;",
                "ALTER TABLE `propuestas`
                    ADD CONSTRAINT `fk_codigo_resultado` FOREIGN KEY (`codigo_resultado`) REFERENCES `resultados` (`codigo_prueba`) ON DELETE CASCADE ON UPDATE CASCADE;",
                "ALTER TABLE `resultados`
                    ADD CONSTRAINT `fk_codigo_dispositivo` FOREIGN KEY (`codigo_dispositivo`) REFERENCES `dispositivo` (`codigo_dispositivo`) ON UPDATE CASCADE,
                    ADD CONSTRAINT `fk_codigo_usuario` FOREIGN KEY (`codigo_usuario`) REFERENCES `usuario` (`codigo_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;",
                "ALTER TABLE `respuesta`
                    ADD CONSTRAINT `fk_codigo_pregunta` FOREIGN KEY (`codigo_pregunta`) REFERENCES `pregunta` (`codigo_pregunta`) ON DELETE CASCADE ON UPDATE CASCADE,
                    ADD CONSTRAINT `fk_resp_usuario` FOREIGN KEY (`codigo_usuario`) REFERENCES `usuario` (`codigo_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;"
            ];

            

            foreach($tablas as $tabla){
                if($db->query($tabla))
                    echo "<p>Creada la tabla.</p>";
                else
                    echo "<p>No se ha podido crear la tabla. Error: " . $db->error . "</p>";
            }

            foreach($indices as $indice){
                if($db->query($indice))
                    echo "<p>Índices creados.</p>";
                else
                    echo "<p>No se han podido crear los índices. Error: " . $db->error . "</p>";
            }

            foreach($filtros as $filtro){
                if($db->query($filtro))
                    echo "<p>Restricciones de clave foránea creadas.</p>";
                else
                    echo "<p>No se han podido crear las restricciones de clave foránea. Error: " . $db->error . "</p>";

            }

            $db->close();

            echo "<p>Base de datos creada.</p>";

        }

        public function añadirDatosPorDefecto(){
            
            $db = new mysqli($this->dbServer, $this->dbUser, $this->dbPass, $this->dbname);

            if ($db->connect_error) {
                die("Error de conexión: " . $db->connect_error);
            }
        
            $preguntas = [
                "¿Cuál es el nombre del piloto protagonista de la página web?",
                "¿Cuál fue su puntuación en la temporada pasada?",
                "¿Cuál es el nombre del circuito de la aplicación?",
                "¿Cual es su longitud total (en metros)?",
                "¿En que pais se encuentra el circuito?",
                "¿Quién ganó la última carrera realizada en el circuito?",
                "¿Cual fue su tiempo total?",
                "¿Cual es el nombre de la localidad donde se encuentra el circuito?",
                "¿Cual es su población?",
                "¿Que temperatura media hubo el día de la carrera?"
            ];

            $dispositivos = ['Ordenador', 'Móvil', 'Tablet'];

             foreach($preguntas as $pregunta){
                $consulta = "INSERT INTO `pregunta` (`texto`) VALUES ('" . $pregunta . "');";
                if($db->query($consulta))
                    echo "<p>Pregunta insertada.</p>";
                else
                    echo "<p>No se ha podido insertar la pregunta. Error: " . $db->error . "</p>";
            }

            foreach($dispositivos as $dispositivo){
                $consulta = "INSERT INTO `dispositivo` (`nombre`) VALUES ('" . $dispositivo . "');";
                if($db->query($consulta))
                    echo "<p>Dispositivo insertado.</p>";
                else
                    echo "<p>No se ha podido insertar el dispositivo. Error: " . $db->error . "</p>";
            }

            $db->close();
            echo "<p>Datos por defecto añadidos.</p>";
        }
    }  
    ?>

    <h1>MotoGP Desktop</h1>

    <main>
        <section>
            <h2>Configuración</h2>
            <form action="#" method="post" name="botones">
                <input type="submit" class="button" name="crear" value="Crear base de datos"/>
                <input type="submit" class="button" name="reiniciar" value="Reiniciar base de datos"/>
                <input type="submit" class="button" name="rellenar" value="Añadir datos por defecto"/>
                <input type="submit" class="button" name="exportar" value="Exportar base de datos"/>
                <input type="submit" class="button" name="borrar" value="Eliminar base de datos"/>
            </form>

        </section>

    <?php
        $configuracion = new Configuracion();                   
        if(count($_POST)>0){
            if(isset($_POST['crear'])) $configuracion->crearBD();
            if(isset($_POST['reiniciar'])) $configuracion->reiniciarBD();
            if(isset($_POST['rellenar'])) $configuracion->añadirDatosPorDefecto();
            if(isset($_POST['exportar'])) $configuracion->exportarBD();
            if(isset($_POST['borrar'])) $configuracion->eliminarBD();
        }
    ?>

    </main>
    
    </body>
</html>