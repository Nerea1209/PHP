<?php
define("SERVIDOR_BD", "localhost");
define("USUARIO_BD", "jose");
define("CLAVE_BD", "josefa");
define("NOMBRE_BD", "bd_foro2");

function obtener_usuarios()
{
    try {
        $conexion = new PDO("mysql:host=" . SERVIDOR_BD . ";dbname=" . NOMBRE_BD, USUARIO_BD, CLAVE_BD, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
    } catch (PDOException $e) {

        return array("error" => "No se ha podido conectar a la base de batos: " . $e->getMessage());
    }
    try {
        $consulta = "select * from usuarios";
        $sentencia = $conexion->prepare($consulta);
        $sentencia->execute();
    } catch (PDOException $e) {
        $sentencia = null;
        $conexion = null;
        return array("error" => "No se ha podido realizar la consulta: " . $e->getMessage());
    }

    $respuesta["usuarios"] = $sentencia->fetchAll(PDO::FETCH_ASSOC);
    $sentencia = null;
    $conexion = null;
    return $respuesta;
}

function obtener_usuario($codigo)
{
    try {
        $conexion = new PDO("mysql:host=" . SERVIDOR_BD . ";dbname=" . NOMBRE_BD, USUARIO_BD, CLAVE_BD, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
    } catch (PDOException $e) {
        return array("error" => "No se ha podido conectar a la base de batos: " . $e->getMessage());
    }
    try {
        $consulta = "select * from usuarios where id_usuario=?";
        $sentencia = $conexion->prepare($consulta);
        $sentencia->execute([$codigo]);
    } catch (PDOException $e) {
        $sentencia = null;
        $conexion = null;
        return array("error" => "No se ha podido realizar la consulta: " . $e->getMessage());
    }

    if ($sentencia->rowCount() > 0)
        $respuesta["usuario"] = $sentencia->fetch(PDO::FETCH_ASSOC);
    else
        $respuesta["mensaje"] = "El usuario con cod: " . $codigo . " no se encuentra en la BD";

    $sentencia = null;
    $conexion = null;
    return $respuesta;
}

function insertar_usuario($datos)
{
    try {
        $conexion = new PDO("mysql:host=" . SERVIDOR_BD . ";dbname=" . NOMBRE_BD, USUARIO_BD, CLAVE_BD, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
    } catch (PDOException $e) {
        return array("error" => "No se ha podido conectar a la base de batos: " . $e->getMessage());
    }

    try {
        $consulta = "insert into usuarios (nombre, usuario, clave, email) values (?,?,?,?)";
        $sentencia = $conexion->prepare($consulta);
        $sentencia->execute($datos);
    } catch (PDOException $e) {
        $sentencia = null;
        $conexion = null;
        return array("error" => "No se ha podido realizar la consulta: " . $e->getMessage());
    }

    $respuesta["ult_id"] = $conexion->lastInsertId();
    $sentencia = null;
    $conexion = null;
    return $respuesta;
}

function login($usuario, $clave)
{
    try {
        $conexion = new PDO("mysql:host=" . SERVIDOR_BD . ";dbname=" . NOMBRE_BD, USUARIO_BD, CLAVE_BD, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
    } catch (PDOException $e) {
        return array("error" => "No se ha podido conectar a la base de batos: " . $e->getMessage());
    }

    try {
        $consulta = "select * from usuarios where usuario = ? and clave = ?";
        $sentencia = $conexion->prepare($consulta);
        $sentencia->execute([$usuario, $clave]);
    } catch (PDOException $e) {
        $sentencia = null;
        $conexion = null;
        return array("error" => "No se ha podido realizar la consulta: " . $e->getMessage());
    }

    if ($sentencia->rowCount() > 0)
        $respuesta["usuario"] = $sentencia->fetch(PDO::FETCH_ASSOC);
    else
        $respuesta["mensaje"] = "El usuario no se encuentra en la bd";

    $sentencia = null;
    $conexion = null;
    return $respuesta;
}

function actualizar_usuario($datos)
{
    try {
        $conexion = new PDO("mysql:host=" . SERVIDOR_BD . ";dbname=" . NOMBRE_BD, USUARIO_BD, CLAVE_BD, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
    } catch (PDOException $e) {
        return array("error" => "No se ha podido conectar a la base de batos: " . $e->getMessage());
    }

    try {
        $consulta = "update usuarios set nombre=?, usuario=?, clave=?, email=? where id_usuario=?";
        if ($datos[2] == "") {
            $consulta = "update usuarios set nombre=?, usuario=?, email=? where id_usuario=?";
            $datos = [$datos[0], $datos[1], $datos[3], $datos[4]];
        } else
            $consulta = "update usuarios set nombre=?, usuario=?, clave=?, email=? where id_usuario=?";
        $sentencia = $conexion->prepare($consulta);
        $sentencia->execute($datos);
    } catch (PDOException $e) {
        $sentencia = null;
        $conexion = null;
        return array("error" => "No se ha podido realizar la consulta: " . $e->getMessage());
    }

    if ($sentencia->rowCount() > 0)
        $respuesta["mensaje"] = "El usuario con id: " . $datos[4] . " se ha actualizado correctamente";
    else
        $respuesta["mensaje"] = "El usuario con id: " . $datos[4] . " no se encontraba en la BD";

    $sentencia = null;
    $conexion = null;
    return $respuesta;
}

function borrar_usuario($codigo)
{
    try {
        $conexion = new PDO("mysql:host=" . SERVIDOR_BD . ";dbname=" . NOMBRE_BD, USUARIO_BD, CLAVE_BD, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
    } catch (PDOException $e) {
        return array("error" => "No se ha podido conectar a la base de batos: " . $e->getMessage());
    }

    try {
        $consulta = "delete from usuarios where id_usuario=?";
        $sentencia = $conexion->prepare($consulta);
        $sentencia->execute([$codigo]);
    } catch (PDOException $e) {
        $sentencia = null;
        $conexion = null;
        return array("error" => "No se ha podido realizar la consulta: " . $e->getMessage());
    }

    if ($sentencia->rowCount() > 0)
        $respuesta["mensaje"] = "El usuario con id " . $codigo . " se ha borrado correctamente";
    else
        $respuesta["mensaje"] = "El usuario con id " . $codigo . " no se encontraba en la BD";

    $sentencia = null;
    $conexion = null;
    return $respuesta;
}

function repetido($tabla, $columna, $valor, $columna_id = null, $valor_id = null)
{
    try {
        $conexion = new PDO("mysql:host=" . SERVIDOR_BD . ";dbname=" . NOMBRE_BD, USUARIO_BD, CLAVE_BD, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
    } catch (PDOException $e) {
        return array("mensaje_error" => "No se ha podido conectar a la base de batos: " . $e->getMessage());
    }

    try {
        if (isset($columna_id)) {
            $consulta = "select * from " . $tabla . " where " . $columna . "=? AND " . $columna_id . "<>?";
            $datos = [$valor, $valor_id];
        } else {
            $consulta = "select * from " . $tabla . " where " . $columna . "=?";
            $datos = [$valor];
        }
        $sentencia = $conexion->prepare($consulta);
        $sentencia->execute($datos);
    } catch (PDOException $e) {
        $sentencia = null;
        $conexion = null;
        return array("mensaje_error" => "No se ha podido realizar la consulta: " . $e->getMessage());
    }

    $respuesta["repetido"] = ($sentencia->rowCount()) > 0;
    $sentencia = null;
    $conexion = null;
    return $respuesta;
}