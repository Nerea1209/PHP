const DIR_SERV = "http://localhost/Proyectos/EjerciciosAjax/Pract1/servicios_rest";

$(document).ready(function () {
    obtener_productos();
});

// Devuelve todos los productos
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
                tabla_productos += "<tr><th>COD</th><th>Nombre Corto</th><th>PVP</th><th><form action='index.html' method='post'> <button class='enlace' type='submit' name='btnInsertar' onclick='form_insertar()'>Productos+</button></form></th></tr>";
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

// Devuelve el producto con dicho cod
function obtener_producto(id) {
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
                // Devuelve la familia con dicho cod
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

// Vacía respuesta
function volver() {
    $("#respuesta").html("");
}

// Crea formulario de insertar
function form_insertar() {
    $.ajax({
        url: DIR_SERV + "/familias",
        dataType: "json",
        type: "GET"
    })
        .done(function (data) {
            if (data.mensaje_error) {
                $('#errores').html(data.mensaje_error);
                $('#principal').html("");
            }
            else {
                // Si obtengo las familias monto el formulario
                var form = "<h2>Creando un producto</h2>";
                form += "<form onsubmit='event.preventDefault(); '>";
                form += "<p><label for='cod'>Código: </label> <input type='text' name='cod' id='cod' maxlength='12'></p>";
                form += '<p><label for="nombre">Nombre: </label><input type="text" name="nombre" id="nombre" maxlength="200"></p>';

                // <p>
                //     <label for="nombre">Nombre: </label>
                //     <input type="text" name="nombre" id="nombre" maxlength="200" value="<?php if (isset($_POST["nombre"])) echo $_POST["nombre"] ?>">
                // </p>
                // <p>
                //     <label for="nombre_corto">Nombre corto: </label>
                //     <input type="text" name="nombre_corto" id="nombre_corto" maxlength="50" value="<?php if (isset($_POST["nombre_corto"])) echo $_POST["nombre_corto"] ?>">
                //     <?php
                //     if (isset($_POST["nombre_corto"]) && $error_nombre_corto)
                //         echo "<span class='error'> Campo vacío</span>";
                //     ?>
                // </p>
                // <p>
                //     <label for="descripcion">Descripción: </label>
                //     <textarea name="descripcion" id="descripcion"><?php if (isset($_POST["descripcion"])) echo $_POST["descripcion"] ?></textarea>
                // </p>
                // <p>
                //     <label for="pvp">PVP: </label>
                //     <input type="text" name="pvp" id="pvp" maxlength="11" value="<?php if (isset($_POST["pvp"])) echo $_POST["pvp"] ?>">
                //     <?php
                //     if (isset($_POST["pvp"]) && $error_pvp) {
                //         if ($_POST["pvp"] == "")
                //             echo "<span class='error'> Campo vacío</span>";
                //         else if (!is_numeric($_POST["pvp"]))
                //             echo "<span class='error'> No es un número</span>";
                //         else
                //             echo "<span class='error'> Tiene que ser un valor positivo</span>";
                //     }
                //     ?>
                // </p>
                // <p>
                //     <label for="familia">Seleccione una familia: </label>
                //     <select name="familia" id="familia">
                //         <?php
                //         // Obtenemos las familias
                //         $url = DIR_SERV . "/familias";
                //         $respuesta = consumir_servicios_REST($url, "GET");
                //         $obj = json_decode($respuesta);
                //         if (!$obj) {
                //             session_destroy();
                //             die("<p>Error consumiendo el servicio: " . $url . "</p>" . $respuesta);
                //         }

                //         if (isset($obj->error)) {
                //             session_destroy();
                //             die("<p>" . $obj->error . "</select></p></body></html>");
                //         }

                //         foreach ($obj->familias as $tupla) {
                //             if (isset($_POST["familia"]) && $tupla->cod == $_POST["familia"])
                //                 echo "<option selected value='" . $tupla->cod . "'>$tupla->nombre</option>";
                //             else
                //                 echo "<option value='" . $tupla->cod . "'>$tupla->nombre</option>";
                //         }
                //         ?>
                //     </select>
                // </p>
                // <p>
                //     <button type="submit" name="btnVolver">Volver</button>
                //     <button type="submit" name="btnContInsertar">Continuar</button>
                // </p>

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
