<?php
if(!isset($conexion))
{
    try{
        $conexion=mysqli_connect(SERVIDOR_BD,USUARIO_BD,CLAVE_BD,NOMBRE_BD);
        mysqli_set_charset($conexion,"utf8");
    }
    catch(Exception $e)
    {
        die("<p>Ha habido un error: ".$e->getMessage()."</p></body></html>");
    }
}

try{
    $consulta="select * from usuarios where tipo != 'admin'";
    $resultado=mysqli_query($conexion, $consulta);
}
catch(Exception $e)
{
    mysqli_close($conexion);
    die("<p>Ha habido un error: ".$e->getMessage()."</p></body></html>");
}

echo "<table>";
echo "
<tr>
    <th>Nombre de Usuario</th>
    <th>Borrar</th>
    <th>Editar</th>
    <th><form action='index.php' method='post'><button class='enlace' name='btnInsertar' title='Insertar Usuario'>+</button></form></th>
</tr>";

while($tupla=mysqli_fetch_assoc($resultado))
{
    echo "<tr>";
    echo "<td><form action='index.php' method='post'><button class='enlace' type='submit' value='".$tupla["id_usuario"]."' name='btnDetalle' title='Detalles del Usuario'>".$tupla["nombre"]."</button></form></td>";
    echo "<td><form action='index.php' method='post'><input type='hidden' name='nombre_usuario' value='".$tupla["nombre"]."'><button class='enlace' type='submit' value='".$tupla["id_usuario"]."' name='btnBorrar'><img src='images/borrar.png' alt='Imagen de Borrar' title='Borrar Usuario'></button></form></td>";
    echo "<td><form action='index.php' method='post'><button class='enlace' type='submit' value='".$tupla["id_usuario"]."' name='btnEditar'><img src='images/editar.png' alt='Imagen de Editar' title='Editar Usuario'></button></form></td>";
    echo "</tr>";
}
echo "</table>";
mysqli_free_result($resultado);

if (isset($_SESSION["mensaje"])) {
    echo "<p>".$_SESSION["mensaje"]."</p>";
    unset($_SESSION["mensaje"]);
    // session_destroy();
} 

?>