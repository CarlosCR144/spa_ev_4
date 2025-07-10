import { useEffect, useState } from "react";
import Ficha from "./Ficha";
import Formulario from "./Formulario";
import { addContacto, deleteContacto, getContactosDatosContacto } from "./apiContactos";
// import { getDatosContacto, addDatosContacto, deleteDatosContacto } from "./apiDatoContacto"

export default function Demo() {
    // Estado para almacenar el arreglo de usuarios obtenidos de la base de datos
    const [arrContactos, setArrContactos] = useState([]);
    // Estado para mostrar un mensaje de carga mientras se obtienen los datos
    const [loading, setLoading] = useState(true);
    // Estado para contacto en edición
    const [contactoEdit, setContactoEdit] = useState(null);

    // useEffect se ejecuta una vez al montar el componente para cargar los usuarios desde Supabase
    useEffect(() => {
        // Llama a la función que obtiene los usuarios desde la API
        // getContactos().then(data => {
        getContactosDatosContacto().then(data => {
            setArrContactos(data); // Actualiza el estado con los usuarios obtenidos
            setLoading(false);    // Oculta el mensaje de carga
            console.log("Contactos obtenidos GETCONTACTOS:", data);
        });
    }, []); // El array vacío indica que solo se ejecuta una vez al montar

    // getContactosDatosContacto().then(data => {
    //     console.log("Datos de contacto obtenidos:", data);
    //     }
    // )

    // Función para agregar o actualizar un contacto
    const agregarContacto = async (nuevo, datosContacto = [], editando = false) => {
        if (editando && contactoEdit) {
            setArrContactos(arrContactos.map(c =>
                c.id_contacto === contactoEdit.id_contacto
                    ? { ...c, dato_contacto: datosContacto }
                    : c
            ));
            setContactoEdit(null);
            return contactoEdit;
        } else {
            const res = await addContacto(nuevo);
            setTimeout(async () => {
                const data = await getContactosDatosContacto();
                setArrContactos(data);
            }, 500);
            return res[0];
        }
    };

    const eliminarContacto = async (id_contacto) => {
        if (window.Swal) {
            const result = await window.Swal.fire({
                title: '¿Seguro que deseas eliminar este contacto?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });
            if (!result.isConfirmed) return;
        } else {
            if (!window.confirm('¿Seguro que deseas eliminar este contacto?')) return;
        }
        await deleteContacto(id_contacto);
        setArrContactos(arrContactos.filter(c => c.id_contacto !== id_contacto));
    };

    // Si los datos están cargando, muestra un mensaje
    if (loading) return <div>Cargando contactos...</div>;

    return (
        <div className="container my-5">
            <h2>Agenda de contactos</h2>
            <Formulario
                agregar={agregarContacto}
                contactoEdit={contactoEdit}
                cancelarEdicion={() => setContactoEdit(null)}
            />
            <hr />
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {
                    arrContactos.map((contacto) => (
                        <div className="col" key={contacto.id_contacto}>
                            <Ficha
                                id_contacto={contacto.id_contacto}
                                nombre={contacto.nombre}
                                apellido={contacto.apellido}
                                datosContacto={contacto.dato_contacto}
                                eliminar={() => eliminarContacto(contacto.id_contacto)}
                                onEditar={() => {
                                    setContactoEdit(contacto);
                                    setTimeout(() => {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }, 100);
                                }}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}