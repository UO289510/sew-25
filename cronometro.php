<?php
    if(session_status() === PHP_SESSION_NONE){
        session_start();
    }
    class Cronometro {

        private $tiempo;

        public function __construct(){
            $this->tiempo = 0;
        }

        function arrancar(){
            $inicio = microtime(true);
            $_SESSION['inicio'] = $inicio;
        }

        function parar(){
            $parar = microtime(true);
            $inicio = $_SESSION['inicio'];
            $this->tiempo = $parar - $inicio;
            $_SESSION['parar'] = $parar;
            $_SESSION['tiempo'] = $this->tiempo;
        }

        function mostrar(){
            $min = floor($_SESSION['tiempo']/60);
            $seg = $_SESSION['tiempo'] % 60;
            $this->tiempo = $_SESSION['tiempo'];
            echo sprintf("Has tardado %02d min y %02d seg", $min, $seg);
        }

        function procesarBoton(){
            if(isset($_POST['arrancar'])) $this->arrancar();
            if(isset($_POST['parar'])) $this->parar();
            if(isset($_POST['mostrar'])) $this->mostrar();
        }

        function getTiempo(){
            return $this->tiempo;
        }
    }
?>

 