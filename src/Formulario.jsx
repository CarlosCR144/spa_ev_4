
import { useState, useEffect, useRef } from "react";
import { addDatosContacto, deleteDatosContacto } from "./apiDatoContacto";

export default function Formulario ({agregar, contactoEdit, cancelarEdicion }) {
    const [datosContacto, setDatosContacto] = useState([]);

    const [tipo, setTipo] = useState("");
    const [medioContacto, setMedioContacto] = useState("");
    const [contenidoContacto, setContenidoContacto] = useState("");

    const [idsAEliminar, setIdsAEliminar] = useState([]);

    const tempId = useRef(0);

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");


    useEffect(() => {
        if (contactoEdit) {
            setNombre(contactoEdit.nombre);
            setApellido(contactoEdit.apellido);
            const datosTransformados = (contactoEdit.dato_contacto || []).map(dato => {
                let medio = "";
                let contenido = "";
                if (dato.correo) {
                    medio = "correo";
                    contenido = dato.correo;
                } else if (dato.telefono) {
                    medio = "telefono";
                    contenido = dato.telefono;
                } else if (dato.direccion) {
                    medio = "direccion";
                    contenido = dato.direccion;
                }
                return { ...dato, medio, contenido };
            });
            setDatosContacto(datosTransformados);
            setIdsAEliminar([]);
        } else {
            setNombre("");
            setApellido("");
            setDatosContacto([]);
            setIdsAEliminar([]);
        }
        setTipo("");
        setMedioContacto("");
        setContenidoContacto("");
    }, [contactoEdit]);

    // Función para agregar un dato_contacto al array local
    const agregarDatoContacto = (e) => {
        e.preventDefault();
        if (!tipo || !medioContacto || !contenidoContacto) {
            window.Swal?.fire('Debe completar todos los campos de dato de contacto.', '', 'warning');
            return;
        }
        if (medioContacto === "correo" && !contenidoContacto.includes("@")) {
            window.Swal?.fire('El contenido debe ser un correo electrónico válido.', '', 'error');
            return;
        }
        if (medioContacto === "telefono" && !/^\d+$/.test(contenidoContacto)) {
            window.Swal?.fire('El contenido debe ser un número de teléfono válido.', '', 'error');
            return;
        }
        if (medioContacto === "direccion" && contenidoContacto.trim() === "") {
            window.Swal?.fire('El contenido debe ser una dirección válida.', '', 'error');
            return;
        }
        // Agregar al array local, con id temporal si es nuevo
        const nuevoDato = {
            tipo,
            correo: medioContacto === "correo" ? contenidoContacto : null,
            telefono: medioContacto === "telefono" ? contenidoContacto : null,
            direccion: medioContacto === "direccion" ? contenidoContacto : null,
            medio: medioContacto,
            contenido: contenidoContacto,
        };
        if (!contactoEdit || !contactoEdit.id_contacto) {
            nuevoDato.id_temp = `temp_${tempId.current++}`;
        }
        setDatosContacto([...datosContacto, nuevoDato]);
        setTipo("");
        setMedioContacto("");
        setContenidoContacto("");
    };

    const eliminarDatoContacto = (id) => {
        if (window.Swal) {
            window.Swal.fire({
                title: '¿Seguro que deseas eliminar este dato de contacto?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then(result => {
                if (result.isConfirmed) {
                    if (contactoEdit && contactoEdit.id_contacto) {
                        const dato = datosContacto.find(d => d.id_dato_contacto === id);
                        if (dato && dato.id_dato_contacto) {
                            setIdsAEliminar(idsAEliminar => [...idsAEliminar, dato.id_dato_contacto]);
                        }
                        setDatosContacto(datosContacto.filter(d => d.id_dato_contacto !== id));
                    } else {
                        setDatosContacto(datosContacto.filter(d => d.id_temp !== id));
                    }
                }
            });
        } else {
            if (window.confirm("¿Seguro que deseas eliminar este dato de contacto?")) {
                if (contactoEdit && contactoEdit.id_contacto) {
                    const dato = datosContacto.find(d => d.id_dato_contacto === id);
                    if (dato && dato.id_dato_contacto) {
                        setIdsAEliminar(idsAEliminar => [...idsAEliminar, dato.id_dato_contacto]);
                    }
                    setDatosContacto(datosContacto.filter(d => d.id_dato_contacto !== id));
                } else {
                    setDatosContacto(datosContacto.filter(d => d.id_temp !== id));
                }
            }
        }
    };

    const enviar = async (event) => {
        event.preventDefault();
        if (!nombre || !apellido) return;
        if (datosContacto.length === 0) {
            window.Swal?.fire('Debe agregar al menos un dato de contacto antes de ingresar el contacto.', '', 'warning');
            return;
        }
        const editando = !!contactoEdit;
        const nuevoContacto = { nombre, apellido, id_contacto: contactoEdit?.id_contacto };
        if (!editando) {
            const contactoCreado = await agregar(nuevoContacto, [], false);
            for (const dato of datosContacto) {
                const nuevoDatoContacto = {
                    id_contacto: contactoCreado.id_contacto,
                    tipo: dato.tipo,
                    correo: dato.correo,
                    telefono: dato.telefono,
                    direccion: dato.direccion
                };
                await addDatosContacto(nuevoDatoContacto);
            }
        } else {
            // EDICIÓN: eliminar los datos marcados y agregar los nuevos
            for (const id of idsAEliminar) {
                await deleteDatosContacto(id);
            }
            for (const dato of datosContacto) {
                if (!dato.id_dato_contacto) {
                    const nuevoDatoContacto = {
                        id_contacto: contactoEdit.id_contacto,
                        tipo: dato.tipo,
                        correo: dato.correo,
                        telefono: dato.telefono,
                        direccion: dato.direccion
                    };
                    await addDatosContacto(nuevoDatoContacto);
                }
            }
            await agregar(nuevoContacto, datosContacto, true);
        }
        setDatosContacto([]);
        setNombre("");
        setApellido("");
        setTipo("");
        setMedioContacto("");
        setContenidoContacto("");
        setIdsAEliminar([]);
        if (cancelarEdicion) cancelarEdicion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    

    return (
        <form onSubmit={enviar}>
            <div className="row g-4 my-3">
                <div className="col-md-6">
                    <label className="form-label" htmlFor="nombre">Nombre:</label>
                    <input className="form-control" id="nombre" type="text" placeholder="Ingrese el nombre" required value={nombre} onChange={e => setNombre(e.target.value)} disabled={!!contactoEdit} />
                </div>
                <div className="col-md-6">
                    <label className="form-label" htmlFor="apellido">Apellido:</label>
                    <input className="form-control" id="apellido" type="text" placeholder="Ingrese el apellido" required value={apellido} onChange={e => setApellido(e.target.value)} disabled={!!contactoEdit} />
                </div>
            </div>


            <div className="row g-4 my-3 align-items-end">
                <div className="col-md-3">
                    <label>Tipo de contacto:</label>
                    <select className="form-select" value={tipo} onChange={e => setTipo(e.target.value)}>
                        <option value="">Seleccione tipo de contacto</option>
                        <option value="Personal">Personal</option>
                        <option value="Trabajo">Trabajo</option>
                        <option value="Casa">Casa</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <label>Medio contacto:</label>
                    <select className="form-select" value={medioContacto} onChange={e => setMedioContacto(e.target.value)}>
                        <option value="">Seleccione medio de contacto</option>
                        <option value="correo">Correo</option>
                        <option value="telefono">Teléfono</option>
                        <option value="direccion">Dirección</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label">Contenido contacto:</label>
                    <input className="form-control" type="text" value={contenidoContacto} onChange={e => setContenidoContacto(e.target.value)} placeholder="Ingrese el contacto" />
                </div>
                <div className="col-md-2">
                    <button className="btn btn-success w-100" onClick={agregarDatoContacto} type="button">Agregar dato de contacto</button>
                </div>
            </div>


            {datosContacto.length > 0 && (
                <div className="row mb-3">
                    <div className="col-12">
                        <ul className="list-group">
                            {datosContacto.map((dato) => (
                                <li key={dato.id_dato_contacto || dato.id_temp}
                                    className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>
                                        <b>{dato.tipo}</b> - {dato.medio}: {dato.contenido}
                                    </span>
                                    <button className="btn btn-danger btn-sm" type="button" onClick={() => eliminarDatoContacto(dato.id_dato_contacto || dato.id_temp)}>
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            <div className="row">
                <div className="col-md-4 ">
                    <button type="submit" className="btn btn-primary">{contactoEdit ? 'Guardar cambios' : 'Ingresar'}</button>
                    {contactoEdit && (
                        <button type="button" className="btn btn-secondary ms-2" onClick={cancelarEdicion}>Cancelar</button>
                    )}
                </div>
            </div>
        </form>
    );
}