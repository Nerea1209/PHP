<?php
header('Access-Control-Allow-Origin: *');

$_POST = json_decode(file_get_contents("php://input"), true);
try {
    $conexion = mysqli_connect("localhost", "jose", "josefa", "login_ampliado");
    mysqli_set_charset($conexion, "utf8");
} catch (Exception $e) {
    die(error_page("ERROR", "<p>Ha habido un error: " . $e->getMessage() . "</p>"));
}

try {
    $consulta = "select * from usuarios where usuario = '" . $_POST["telefono"] . "' and clave = '" . $_POST["password"] . "'";
    $resultado = mysqli_query($conexion, $consulta);
} catch (Exception $e) {
    mysqli_close($conexion);
    die(error_page("ERROR", "<p>Ha habido un error: " . $e->getMessage() . "</p>"));
}

if (mysqli_num_rows($resultado) > 0) {
    $respuesta["usuario"] = "fulanico";
    $respuesta["mensaje"] = "Acceso correcto";
} else {
    $respuesta["mensaje"] = "Acceso incorrecto";
}
echo json_encode($respuesta);
