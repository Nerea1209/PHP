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
                tabla_productos += "<tr><th>COD</th><th>Nombre Corto</th><th>PVP</th><th><form onsubmit='event.preventDefault();'> <button class='enlace' type='submit' name='btnInsertar' onclick='form_insertar()'>Productos+</button></form></th></tr>";
                $.each(data.productos, function (key, tupla) {
                    tabla_productos += "<tr><form action='index.php' method='post'>";
                    tabla_productos += "<td><button class='enlace' type='submit' name='btnDetalles' onclick='obtener_producto(\"" + tupla["cod"] + "\")' value='" + tupla["cod"] + "'>" + tupla["cod"] + "</button></td>";
                    tabla_productos += "<td>" + tupla["nombre_corto"] + "</td>";
                    tabla_productos += "<td>" + tupla["PVP"] + " €</td>";
                    tabla_productos += "<td><button class='enlace' onclick='confirmar_borrar(\"" + tupla["cod"] + "\");'>Borrar</button> - <button class='enlace' onclick='form_editar(\"" + tupla["cod"] + "\");' > Editar</button ></td > ";
                    tabla_productos += "</form></tr>";
                });
                tabla_productos += "</table>";
                $('#errores').html("");
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
                form += "<form onsubmit='event.preventDefault();comprobar_nuevo();'>";
                form += "<p><label for='cod'>Código: </label> <input type='text' name='cod' id='cod' maxlength='12'><span class='error' id='error_cod'></span></p>";
                form += '<p><label for="nombre">Nombre: </label><input type="text" name="nombre" id="nombre" maxlength="200"></p>';
                form += '<p><label for="nombre_corto">Nombre corto: </label><input type="text" name="nombre_corto" id="nombre_corto" maxlength="50"><span class="error" id="error_nombre_corto"></span></p>';
                form += '<p><label for="pvp">PVP: </label><input type="text" name="pvp" id="pvp"><span class="error" id="error_precio"></span></p>';
                form += '<p><label for="descripcion">Descripción: </label><textarea name="descripcion" id="descripcion"></textarea></p>';
                form += '<p><label for="familia">Seleccione una familia: </label><select name="familia" id="familia">'
                $.each(data.familias, function (key, tupla) {
                    form += "<option value='" + tupla["cod"] + "'>" + tupla["nombre"] + "</option>";
                })
                form += '</select></p>';
                form += '<p><button name="btnVolver" onclick="volver()">Volver</button><button>Continuar</button></p></form>';
                $('#errores').html("");
                $('#respuesta').html(form);
            }
        })

        .fail(function (a, b) {
            $('#errores').html(error_ajax_jquery(a, b));
            $('#principal').html("");
        });
}

// Comprueba errores e inserta
function comprobar_nuevo() {
    $('#error_cod').html("");
    $('#error_nombre_corto').html("");
    $('#error_precio').html("");


    var cod = $('#cod').val();
    var nombre_corto = $('#nombre_corto').val();
    var pvp = $('#pvp').val();

    if (cod == "" || nombre_corto == "" || pvp == "" || !parseInt(pvp) || pvp < 0) {
        if (cod == "") {
            $('#error_cod').html(" Campo vacío");
        }
        if (nombre_corto == "") {
            $('#error_nombre_corto').html(" Campo vacío");
        }

        if (pvp == "") {
            $('#error_precio').html(" Campo vacío");
        } else if (!parseInt(pvp) || pvp < 0) {
            $('#error_precio').html(" El precio tiene que ser un número positivo");
        } else {
            $('#error_precio').html("");
        }
    } else {
        $.ajax({
            url: encodeURI(DIR_SERV + "/repetido/producto/cod/" + cod),
            type: "GET",
            dataType: "json"
        })
            .done(function (data) {
                if (data.mensaje_error) {
                    $('#errores').html(data.mensaje_error);
                    $('#respuesta').html("");
                    $('#productos').html("");
                }
                else if (data.repetido) {
                    //Informo código repetido y compruebo también nombre corto  pero ya no inserto
                    $('#error_cod').html("Código repetido");

                    $.ajax({
                        url: encodeURI(DIR_SERV + "/repetido/producto/nombre_corto/" + nombre_corto),
                        type: "GET",
                        dataType: "json"
                    })
                        .done(function (data) {
                            if (data.mensaje_error) {
                                $('#errores').html(data.mensaje_error);
                                $('#respuesta').html("");
                                $('#productos').html("");
                            }
                            if (data.repetido) {
                                $('#error_nombre_corto').html("Nombre corto repetido");
                            }
                        })
                        .fail(function (a, b) {
                            $('#errores').html(error_ajax_jquery(a, b));
                            $('#respuesta').html("");
                            $('#productos').html("");
                        });
                }
                else {
                    //Compruebo nombre corto y si está repetido informo y no inserto, pero si no está repetido inserto
                    $.ajax({
                        url: encodeURI(DIR_SERV + "/repetido/producto/nombre_corto/" + nombre_corto),
                        type: "GET",
                        dataType: "json"
                    })
                        .done(function (data) {
                            if (data.mensaje_error) {
                                $('#errores').html(data.mensaje_error);
                                $('#respuesta').html("");
                                $('#productos').html("");
                            }
                            if (data.repetido) {
                                $('#error_nombre_corto').html("Nombre corto repetido");
                            }
                            else {
                                var nombre = $('#nombre').val();
                                var descripcion = $('#descripcion').val();
                                var PVP = $('#pvp').val();
                                var familia = $('#familia').val();

                                $.ajax({
                                    url: DIR_SERV + "/producto/insertar",
                                    type: "POST",
                                    dataType: "json",
                                    data: { "cod": cod, "nombre": nombre, "nombre_corto": nombre_corto, "descripcion": descripcion, "PVP": PVP, "familia": familia }
                                })
                                    .done(function (data) {
                                        if (data.mensaje_error) {
                                            $('#errores').html(data.mensaje_error);
                                            $('#respuesta').html("");
                                            $('#productos').html("");
                                        }
                                        else {
                                            $('#respuesta').html("<p class='mensaje'>El producto con cod: <strong>" + cod + "</strong> se ha insertado con éxito<p>");
                                            obtener_productos();
                                        }

                                    })
                                    .fail(function (a, b) {
                                        $('#errores').html(error_ajax_jquery(a, b));
                                        $('#respuesta').html("");
                                        $('#productos').html("");
                                    });
                            }
                        })
                        .fail(function (a, b) {
                            $('#errores').html(error_ajax_jquery(a, b));
                            $('#respuesta').html("");
                            $('#productos').html("");
                        });

                }

            })
            .fail(function (a, b) {
                $('#errores').html(error_ajax_jquery(a, b));
                $('#respuesta').html("");
                $('#productos').html("");
            });
    }
}

// Muestra formulario para confirmar el borrar
function confirmar_borrar(cod) {
    html_conf_borrar = "<p class='centrado'>Se dispone usted a borrar el producto: <strong>" + cod + "</strong></p>";
    html_conf_borrar += "<p class='centrado'>¿Estás Seguro?</p>";
    html_conf_borrar += "<p class='centrado'><button onclick='volver();'>Volver</button> <button onclick='borrar(\"" + cod + "\")'>Continuar</button></p>";
    $('#respuesta').html(html_conf_borrar);
}

// Borra un elemento segun cod
function borrar(cod) {
    $.ajax({
        url: encodeURI(DIR_SERV + "/producto/borrar/" + cod),
        type: "DELETE",
        dataType: "json"
    })
        .done(function (data) {
            if (data.mensaje_error) {
                $('#errores').html(data.mensaje_error);
                $('#respuesta').html("");
                $('#productos').html("");
            }
            else {
                $('#errores').html("");
                $('#respuesta').html("<p class='mensaje'>El producto con cod: <strong>" + cod + "</strong> se ha borrado con éxito.</p>");
                obtener_productos();
            }
        })
        .fail(function (a, b) {
            $('#errores').html(error_ajax_jquery(a, b));
            $('#respuesta').html("");
            $('#productos').html("");
        });
}

// Crea formulario de editar
function form_editar(id) {
    $.ajax({
        url: DIR_SERV + "/familias",
        dataType: "json",
        type: "GET"
    })
        .done(function (data1) {
            if (data1.mensaje_error) {
                $('#errores').html(data1.mensaje_error);
                $('#principal').html("");
            }
            else {
                // Si obtengo las familias, obtengo los datos del objeto a editar
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
                            obtener_productos()
                        } else {
                            // Creamos el formulario con los datos del producto

                            var form = "<h2>Editando el producto con id " + id + "</h2>";
                            form += "<form onsubmit='event.preventDefault();comprobar_editar(\"" + id + "\");'>";
                            if (data.producto["nombre"])
                                form += '<p><label for="nombre">Nombre: </label><input type="text" name="nombre" id="nombre" maxlength="200" value=' + data.producto["nombre"] + '></p>';
                            else
                                form += '<p><label for="nombre">Nombre: </label><input type="text" name="nombre" id="nombre" maxlength="200"></p>';
                            form += '<p><label for="nombre_corto">Nombre corto: </label><input type="text" name="nombre_corto" id="nombre_corto" maxlength="50"  value=' + data.producto["nombre_corto"] + '><span class="error" id="error_nombre_corto"></span></p>';
                            form += '<p><label for="pvp">PVP: </label><input type="text" name="pvp" id="pvp" value=' + data.producto["PVP"] + '><span class="error" id="error_precio"></span></p>';
                            if (data.producto["descripcion"])
                                form += '<p><label for="descripcion">Descripción: </label><textarea name="descripcion" id="descripcion">' + data.producto["descripcion"] + '</textarea></p>';
                            else
                                form += '<p><label for="descripcion">Descripción: </label><textarea name="descripcion" id="descripcion"></textarea></p>';
                            form += '<p><label for="familia">Seleccione una familia: </label><select name="familia" id="familia">'
                            $.each(data1.familias, function (key, tupla) {
                                if (data.producto["familia"] == tupla["cod"])
                                    form += "<option value='" + tupla["cod"] + "' selected>" + tupla["nombre"] + "</option>";
                                else
                                    form += "<option value='" + tupla["cod"] + "'>" + tupla["nombre"] + "</option>";
                            })
                            form += '</select></p>';
                            form += '<p><button name="btnVolver" onclick="volver()">Volver</button><button>Continuar</button></p></form>';
                            $('#errores').html("");
                            $('#respuesta').html(form);
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

// Comprueba errores y edita
function comprobar_editar(cod) {
    $('#error_nombre_corto').html("");
    $('#error_precio').html("");

    var nombre_corto = $('#nombre_corto').val();
    var pvp = $('#pvp').val();

    if (nombre_corto == "" || pvp == "" || !parseInt(pvp) || pvp < 0) {
        if (nombre_corto == "") {
            $('#error_nombre_corto').html(" Campo vacío");
        }

        if (pvp == "") {
            $('#error_precio').html(" Campo vacío");
        } else if (!parseInt(pvp) || pvp < 0) {
            $('#error_precio').html(" El precio tiene que ser un número positivo");
        } else {
            $('#error_precio').html("");
        }
    } else {


        //Compruebo nombre corto y si está repetido informo y no inserto, pero si no está repetido inserto
        $.ajax({
            url: encodeURI(DIR_SERV + "/repetido/producto/nombre_corto/" + nombre_corto + "/cod/" + cod),
            type: "GET",
            dataType: "json"
        })
            .done(function (data) {
                if (data.mensaje_error) {
                    $('#errores').html(data.mensaje_error);
                    $('#respuesta').html("");
                    $('#productos').html("");
                }
                if (data.repetido) {
                    $('#error_nombre_corto').html("Nombre corto repetido");
                }
                else {
                    var nombre = $('#nombre').val();
                    var descripcion = $('#descripcion').val();
                    var PVP = $('#pvp').val();
                    var familia = $('#familia').val();

                    $.ajax({
                        url: DIR_SERV + "/producto/actualizar/" + cod,
                        type: "PUT",
                        dataType: "json",
                        data: { "nombre": nombre, "nombre_corto": nombre_corto, "descripcion": descripcion, "PVP": PVP, "familia": familia }
                    })
                        .done(function (data) {
                            if (data.mensaje_error) {
                                $('#errores').html(data.mensaje_error);
                                $('#respuesta').html("");
                                $('#productos').html("");
                            }
                            else {
                                $('#respuesta').html("<p class='mensaje'>El producto con cod: <strong>" + cod + "</strong> se ha actualizado con éxito<p>");
                                obtener_productos();
                            }
                        })
                        .fail(function (a, b) {
                            $('#errores').html(error_ajax_jquery(a, b));
                            $('#respuesta').html("");
                            $('#productos').html("");
                        });
                }
            })
            .fail(function (a, b) {
                $('#errores').html(error_ajax_jquery(a, b));
                $('#respuesta').html("");
                $('#productos').html("");
            });
    }
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
