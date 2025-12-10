<!DOCTYPE HTML>
<html lang="es">
    <head>
        <!-- Datos que describen el documento -->
        <meta charset="UTF-8" />
        <title>MotoGP Desktop - Test de usabilidad</title>
        <link rel="icon" href="../multimedia/favicon.ico">
        <meta name="author" content="Daniel López Fdez"/>
        <meta name="description" content="Prueba de usabilidad"/>
        <meta name="keywords" content="usabilidad, cuestionario, preguntas"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
        <link rel="stylesheet" type="text/css" href="../estilo/layout.css"/>
    </head>

    <body>

        <?php
            if(session_status() === PHP_SESSION_NONE){
                session_start();
            }
            include '../cronometro.php';
            class Cuestionario{
                
                private $db;
                private $dbServer;
                private $dbUser;
                private $dbPass;
                private $dbname;

                private $cronometro;

                public function __construct(){
                    $this->dbServer = 'localhost';
                    $this->dbUser = 'DBUSER2025';
                    $this->dbPass = 'DBPSWD2025';
                    $this->dbname = 'uo289510_db';
                    $this->cronometro = new Cronometro();
                }

                private function cargarCuestionario(){

                    $db = new mysqli($this->dbServer, $this->dbUser, $this->dbPass, $this->dbname);

                    if($db->connect_error){
                        exit ("<h2>ERROR de conexión:".$db->connect_error."</h2>");
                    }

                    $consulta = "SELECT * FROM pregunta;";
                    $resultado = $db->query($consulta);

                    if ($resultado->num_rows > 0) {
                        echo "<form action='#' method='post' name='cuestionario'>";
                        while($fila = $resultado->fetch_assoc()) {
                            echo "<p>" . $fila["texto"] . "</p>";
                            echo "<input type='text' name='respuesta_" . $fila["codigo_pregunta"] . "' required/>";
                        }
                        echo "<input type='submit' class='button' name='terminar' value='Terminar cuestionario'/>";
                        echo "</form>";
                        $this->cronometro->arrancar();
                    } else {
                        echo "<p>No hay preguntas disponibles.</p>";
                    }
                }

                public function terminarCuestionario(){
                    $this->cronometro->parar();
                    $_SESSION['tiempo'] = $this->cronometro->getTiempo();
                    $this->guardarRespuestas();
                }
                
                private function guardarRespuestas(){

                    $db = new mysqli($this->dbServer, $this->dbUser, $this->dbPass, $this->dbname);

                    $prepQuery = $db->prepare("INSERT INTO respuesta (codigo_pregunta, codigo_usuario, respuesta) VALUES (?, ?, ?);");

                    for($i = 1; isset($_POST['respuesta_' . $i]); $i++){
                        $codigoPregunta = $i;
                        $codigoUsuario = $_SESSION['codigo_usuario'];
                        $respuesta = $_POST['respuesta_' . $i];

                        $prepQuery->bind_param('iis', $codigoPregunta, $codigoUsuario, $respuesta);
                        $prepQuery->execute();
                    }

                    $prepQuery->close();

                    $db->close();
                    $this->pedirFeedbackUsuario();
                }
                
                public function preguntarDatosUsuario(){
                    echo "<form action='#' method='post' name='datosUsuario'>";
                    echo "<p>Profesion: <input type='text' name='profesion' required/></p>";
                    echo "<p>Edad: <input type='number' name='edad' required/></p>";
                    echo "<p>Genero: <input type='text' name='genero' required/></p>";
                    echo "<input type='submit' class='button' name='guardarDatosUsuario' value='Guardar datos'/>";
                    echo "</form>";
                }

                public function guardarDatosUsuario(){
                    $db = new mysqli($this->dbServer, $this->dbUser, $this->dbPass, $this->dbname);

                    $prepQuery = $db->prepare("INSERT INTO usuario (profesion, edad, genero) VALUES (?, ?, ?);");

                    $profesion = $_POST["profesion"];
                    $edad = $_POST["edad"];
                    $genero = $_POST["genero"];

                    $prepQuery->bind_param('sis', $profesion, $edad, $genero);
                    $prepQuery->execute();

                    $consulta = "SELECT MAX(codigo_usuario) AS codigo_usuario FROM usuario;";

                    $_SESSION['codigo_usuario'] = $db->query($consulta)->fetch_assoc()['codigo_usuario'];
                    $prepQuery->close();
                    $db->close();

                    $this->cargarCuestionario();
                }

                private function pedirFeedbackUsuario(){

                    $db = new mysqli($this->dbServer, $this->dbUser, $this->dbPass, $this->dbname);
                
                    if ($db->connect_error) {
                        exit("<h2>ERROR de conexión: " . $db->connect_error . "</h2>");
                    }
                    
                    $consulta = "SELECT codigo_dispositivo, nombre FROM dispositivo;";
                    $resultado = $db->query($consulta);
                
                    if ($resultado->num_rows == 0) {
                        echo "<p>No hay dispositivos disponibles.</p>";
                        return;
                    }

                    echo "<h2>Feedback del usuario</h2>";
                    echo "<form action='#' method='post' name='feedback'/>";
                    echo "<p>Valoración: <input type='number' name='valoracion' min='0' max='10'required/></p>";
                    echo "<p>¿Qué dispositivo utilizaste?</p>";
                    while ($fila = $resultado->fetch_assoc()) {
                        $codigo = $fila["codigo_dispositivo"];
                        $nombre = $fila["nombre"];
                        echo "<input type='radio' name='dispositivo' value='$codigo' required/> $nombre";
                    }
                    echo "<p>Comentarios sobre la aplicación: <input type='text' name='comentarios' size='500'/></p>";
                    echo "<p>Feedback para mejorar la aplicación: <input type='text' name='feedback' size='500'/></p>";
                    echo "<input type='submit' class='button' name='guardarFeedbackUsuario' value='Enviar'/>";
                    echo "</form>";
                    $db->close();
                }

                public function guardarFeedbackUsuario(){
                    // Guardar comentarios
                    // Guardar propuestas

                    $db = new mysqli($this->dbServer, $this->dbUser, $this->dbPass, $this->dbname);
                    if ($db->connect_error) {
                        exit("<h2>ERROR de conexión: " . $db->connect_error . "</h2>");
                    }

                    $consulta = "SELECT MAX(codigo_prueba) AS codigo_prueba FROM resultados;";
                    $codigoPrueba = $db->query($consulta)->fetch_assoc()['codigo_prueba'];
                    $codigoPrueba+=1;
                    $_SESSION['codigo_prueba'] = $codigoPrueba;

                    $prepQuery = $db->prepare("INSERT INTO resultados (codigo_usuario, codigo_dispositivo, valoracion) VALUES (?, ?, ?);");

                    $codigo_usuario = $_SESSION['codigo_usuario'];
                    $codigo_dispositivo = $_POST['dispositivo'];
                    $valoracion = $_POST['valoracion'];

                    $prepQuery->bind_param('iii', $codigo_usuario, $codigo_dispositivo, $valoracion);
                    $prepQuery->execute();
                    
                    $prepQuery->close();

                    $comentarios = $_POST['comentarios'];
                    $feedback = $_POST['feedback'];

                    $prepQuery = $db->prepare("INSERT INTO comentarios (codigo_resultado, comentario) VALUES (?, ?);");
                    $prepQuery->bind_param('is', $codigoPrueba, $comentarios);
                    $prepQuery->execute();
                    $prepQuery->close();

                    $prepQuery = $db->prepare("INSERT INTO propuestas (codigo_resultado, propuesta) VALUES (?, ?);");
                    $prepQuery->bind_param('is', $codigoPrueba, $feedback);
                    $prepQuery->execute();

                    $prepQuery->close();
                    $db->close();   

                    $this->pedirObservaciones();
                }

                private function pedirObservaciones(){            
                    echo "<h2>Observaciones del examinador</h2>";
                    echo "<form action='#' method='post' name='observaciones'/>";
                    echo "<p>Pericia informatica del usuario: <input type='number' name='pericia' min='0' max='10' required/></p>";
                    echo "<p>Marcar si ha completado el cuestionario: <input type='checkbox' name='completado'/></p>";
                    echo "<p>Observaciones sobre el usuario: <input type='text' name='observaciones' size=500/></p>";
                    echo "<input type='submit' class='button' name='guardarObservaciones' value='Registrar observaciones'/>";
                    echo "</form>";
                }

                public function guardarObservaciones(){

                    $db = new mysqli($this->dbServer, $this->dbUser, $this->dbPass, $this->dbname);
                    if ($db->connect_error) {
                        exit("<h2>ERROR de conexión: " . $db->connect_error . "</h2>"); 
                    }
                    
                    $codigo_prueba = $_SESSION['codigo_prueba'];
                    $codigo_usuario = $_SESSION['codigo_usuario'];
                    $pericia = $_POST['pericia'];
                    $completado = isset($_POST['completado']) ? 1 : 0;
                    $tiempo = $_SESSION['tiempo'];
                    $observaciones = $_POST['observaciones'];

                    $prepQuery = $db->prepare("UPDATE usuario SET pericia = ? WHERE codigo_usuario = ?;");
                    $prepQuery->bind_param('ii', $pericia, $codigo_usuario);
                    $prepQuery->execute();
                    $prepQuery->close();

                    $prepQuery = $db->prepare("UPDATE resultados SET tiempo = ?, completada = ? WHERE codigo_prueba = ?;");
                    $prepQuery->bind_param('dii', $tiempo, $completado, $codigo_prueba);
                    $prepQuery->execute();
                    $prepQuery->close();

                    $prepQuery = $db->prepare("INSERT INTO observaciones (codigo_usuario, observacion) VALUES (?, ?);");
                    $prepQuery->bind_param('ii', $codigo_usuario, $observaciones);
                    $prepQuery->execute();
                    $prepQuery->close();

                    $db->close();
                }   
            }
        ?>

        <h1>MotoGP Desktop</h1>

        <main>
            <section>
                <h2>Prueba de usabilidad</h2>
                <?php
                    $cuestionario = new Cuestionario();

                    if (isset($_POST['terminar'])) {
                        $cuestionario->terminarCuestionario();
                    }
                    else if(isset($_POST['guardarDatosUsuario'])){
                        $cuestionario->guardarDatosUsuario();
                    }
                    else if(isset($_POST['guardarFeedbackUsuario'])){
                        $cuestionario->guardarFeedbackUsuario();
                    }
                    else if(isset($_POST['guardarObservaciones'])){
                        $cuestionario->guardarObservaciones();
                    }else{
                        $cuestionario->preguntarDatosUsuario();
                    }
                ?>

            </section>

        </main>
    
    </body>
</html>