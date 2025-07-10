
// import { useState } from "react";
import { addDatosContacto } from "./apiDatoContacto";

export default function Formulario ({agregar}) {
    // Hocks funciones de react
    // useState: hock que permite manejar el estado de un componente
    // devuleve array [0]: objeto, [1]: metodo para modificar
    // recibe como argumento el valor incial del objeto
    //const usuarios = useState()[0];
    //const setUsuarios = useState()[1];
    // ES6: destructuring
    // const [contactos, setContactos] = useState([]); // usuarios es un array

    const enviar = async (event) => {
        event.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const tipo = document.getElementById("tipo").value;
        const correo = document.getElementById("correo").value;
        const telefono = document.getElementById("telefono").value;
        const direccion = document.getElementById("direccion").value;


        // 1. Crear contacto
        const nuevoContacto = { nombre, apellido };
        const contactoCreado = await agregar(nuevoContacto); // agregar retorna el contacto insertado
        // 2. Crear dato_contacto relacionado
        if (contactoCreado && contactoCreado.id_contacto) {
            const nuevoDatoContacto = {
                id_contacto: contactoCreado.id_contacto,
                tipo: tipo,
                correo: correo,
                telefono: telefono,
                direccion: direccion
            };
            await addDatosContacto(nuevoDatoContacto);
        }
        // Limpiar formulario
        event.target.reset();
    };

    return (
        <form onSubmit={enviar}>
            <div className="row g-4 my-3">
                <div className="col-md-3">
                    <label className="form-label" htmlFor="nombre">Nombre</label>
                    <input className="form-control" id="nombre" type="text" placeholder="Ingrese el nombre" required />
                </div>
                <div className="col-md-3">
                    <label className="form-label" htmlFor="apellido">Apellido</label>
                    <input className="form-control" id="apellido" type="text" placeholder="Ingrese el apellido" required />
                </div>
                <div className="col-md-3">
                    <label>Tipo de contacto:
                        <select id="tipo" className="form-select" required>
                        <option value="">Seleccione tipo de contacto</option>
                        <option value="Personal">Personal</option>
                        <option value="Trabajo">Trabajo</option>
                        <option value="Casa">Casa</option>
                        </select>
                    </label>
                </div>
                <div className="col-md-3">
                    <label className="form-label" htmlFor="correo">Correo:</label>
                    <input className="form-control" id="correo" type="text" placeholder="Ingrese el correo electrónico" />
                </div>
                <div className="col-md-3">
                    <label className="form-label" htmlFor="telefono">Teléfono:</label>
                    <input className="form-control" id="telefono" type="text" placeholder="Ingrese el telefono" />
                </div>
                <div className="col-md-3">
                    <label className="form-label" htmlFor="direccion">Dirección:</label>
                    <input className="form-control" id="direccion" type="text" placeholder="Ingrese la dirección" />
                </div>
                <div className="col-md-4 my-3">
                    <button type="submit" className="btn btn-primary">Ingresar</button>
                </div>
            </div>
        </form>
    );
}