const DIR_SERV = "http://localhost/Proyectos/EjerciciosAjax/Pract1/servicios_rest";

$(document).ready(function () {
    obtener_productos();
});

function obtener_productos() {
    $.ajax({
        url: DIR_SERV + "/productos",
        dataType: "json",
        type: "GET"
    })
        .done(function (data) {
            if (data.mensaje_error) {
                $('#errores').html(data.mensaje_error);
                $('#principal').html("");
            }
            else {
                var tabla_productos = "<table>";
                tabla_productos += "<tr><th>COD</th><th>Nombre Corto</th><th>PVP</th><th><form action='index.html' method='post'> <button class='enlace' type='submit' name='btnInsertar'>Productos+</button></form></th></tr>";
                $.each(data.productos, function (key, tupla) {
                    tabla_productos += "<tr><form action='index.php' method='post'>";
                    tabla_productos += "<td><button class='enlace' type='submit' name='btnDetalles' onclick='obtener_producto(\"" + tupla["cod"] + "\")' value='" + tupla["cod"] + "'>" + tupla["cod"] + "</button></td>";
                    tabla_productos += "<td>" + tupla["nombre_corto"] + "</td>";
                    tabla_productos += "<td>" + tupla["PVP"] + " €</td>";
                    tabla_productos += "<td><button class='enlace' type='submit' name='btnBorrar' value='" + tupla["cod"] + "'>Borrar</button> - <button button button class='enlace' type = 'submit' name = 'btnEditar' value = '" + tupla["cod"] + "' > Editar</button ></td > ";
                    tabla_productos += "</form></tr>";
                });
                tabla_productos += "</table>";
                $('#errores').html("");
                $('#respuesta').html("");
                $('#tabla').html(tabla_productos);
            }
        })

        .fail(function (a, b) {
            $('#errores').html(error_ajax_jquery(a, b));
            $('#principal').html("");
        });
}

function obtener_producto(id) {
    /*
    $detalles = $obj->producto;
    echo "<h3>Detalles del producto con id <strong>" . $detalles->cod . "</strong></h3>";
    echo "<p><strong>Código: </strong>" . $detalles->cod . "</p>";
    if ($detalles->nombre)
        echo "<p><strong>Nombre: </strong>" . $detalles->nombre . "</p>";
    else
        echo "<p><strong>Nombre: </strong>No tiene.</p>";
    
    echo "<p><strong>Nombre corto: </strong>" . $detalles->nombre_corto . "</p>";
    if ($detalles->descripcion)
        echo "<p><strong>Descripción: </strong>" . $detalles->descripcion . "</p>";
    else
        echo "<p><strong>Descripción: </strong> No tiene.</p>";
    echo "<p><strong>PVP: </strong>" . str_replace(".", ",", $detalles->PVP) . "€</p>";
    
    $url = DIR_SERV . "/familia/" . $detalles->familia;
    $respuesta = consumir_servicios_REST($url, "GET");
    $obj = json_decode($respuesta);
    if (!$obj) {
        session_destroy();
        die("<p>Error consumiendo el servicio: " . $url . "</p>" . $respuesta);
    }
    
    if (isset($obj->error)) {
        session_destroy();
        die("<p>" . $obj->error . "</select></p></body></html>");
    }
    
    echo "<p><strong>Familia: </strong>" . $detalles->familia . "</p>";
    */

    $.ajax({
        url: DIR_SERV + "/producto/" + id,
        dataType: "json",
        type: "GET"
    })
        .done(function (data) {
            if (data.mensaje_error) {
                $('#errores').html(data.mensaje_error);
                $('#principal').html("");
            } else if (data.mensaje) {
                $('#errores').html("");
                $('#respuesta').html(data.mensaje);
            } else {
                $.ajax({
                    url: DIR_SERV + "/familia/" + data.producto["familia"],
                    dataType: "json",
                    type: "GET"
                })
                    .done(function (data2) {
                        if (data2.mensaje_error) {
                            $('#errores').html(data.mensaje_error);
                            $('#principal').html("");
                        } else {
                            var detalles = "<h3>Detalles del producto con id <strong>" + data.producto["cod"] + "</strong></h3>";
                            detalles += "<p><strong>Código: </strong>" + data.producto["cod"] + "</p>";
                            if (data.producto["nombre"])
                                detalles += "<p><strong>Nombre: </strong>" + data.producto["nombre"] + "</p>";
                            else
                                detalles += "<p><strong>Nombre: </strong>No tiene.</p>";
                            detalles += "<p><strong>Nombre corto: </strong>" + data.producto["nombre_corto"] + "</p>";
                            if (data.producto["descripcion"])
                                detalles += "<p><strong>Descripción: </strong>" + data.producto["descripcion"] + "</p>";
                            else
                                detalles += "<p><strong>Descripción: </strong>No tiene.</p>";
                            if (data2.mensaje) {
                                detalles += "<p><strong>Familia: </strong>" + data2.mensaje + "</p>";
                            } else {
                                detalles += "<p><strong>Familia: </strong>" + data2.familia["nombre"] + "</p>";
                            }
                            detalles += "<p><button onclick='volver()'>Volver</button></p>";
                            $('#errores').html("");
                            $('#respuesta').html(detalles);
                        }
                    })
                    .fail(function (a, b) {
                        $('#errores').html(error_ajax_jquery(a, b));
                        $('#principal').html("");
                    });

            }
        })

        .fail(function (a, b) {
            $('#errores').html(error_ajax_jquery(a, b));
            $('#principal').html("");
        });
}

function volver() {
    $("#respuesta").html("");
}


function error_ajax_jquery(jqXHR, textStatus) {
    var respuesta;
    if (jqXHR.status === 0) {
        respuesta = 'Not connect: Verify Network.';
    } else if (jqXHR.status == 404) {
        respuesta = 'Requested page not found [404]';
    } else if (jqXHR.status == 500) {
        respuesta = 'Internal Server Error [500].';
    } else if (textStatus === 'parsererror') {
        respuesta = 'Requested JSON parse failed.';
    } else if (textStatus === 'timeout') {
        respuesta = 'Time out error.';
    } else if (textStatus === 'abort') {
        respuesta = 'Ajax request aborted.';
    } else {
        respuesta = 'Uncaught Error: ' + jqXHR.responseText;
    }
    return respuesta;
}
