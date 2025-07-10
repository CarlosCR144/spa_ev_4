import { useEffect, useState } from "react";
import Ficha from "./Ficha";
import Formulario from "./Formulario";
import { getContactos, addContacto, deleteContacto } from "./apiContactos";
// import { getDatosContacto, addDatosContacto, deleteDatosContacto } from "./apiDatoContacto"

export default function Demo() {
    // Estado para almacenar el arreglo de usuarios obtenidos de la base de datos
    const [arrContactos, setArrContactos] = useState([]);
    // Estado para mostrar un mensaje de carga mientras se obtienen los datos
    const [loading, setLoading] = useState(true);

    // useEffect se ejecuta una vez al montar el componente para cargar los usuarios desde Supabase
    useEffect(() => {
        // Llama a la función que obtiene los usuarios desde la API
        getContactos().then(data => {
            setArrContactos(data); // Actualiza el estado con los usuarios obtenidos
            setLoading(false);    // Oculta el mensaje de carga
        });
    }, []); // El array vacío indica que solo se ejecuta una vez al montar

    // Función para agregar un usuario a la base de datos y al estado local
    const agregarContacto = async (nuevo) => {
        // Llama a la función que inserta el usuario en la base de datos
        const res = await addContacto(nuevo);
        // res es un array con el usuario insertado (Prefer: return=representation)
        setArrContactos([...arrContactos, res[0]]); // Agrega el nuevo usuario al estado
    };

    // Función para eliminar un usuario de la base de datos y del estado local
    const eliminarContacto = async (id_contacto) => {
        await deleteContacto(id_contacto); // Elimina el usuario en la base de datos
        // Filtra el usuario eliminado del estado local
        setArrContactos(arrContactos.filter(c => c.id_contacto !== id_contacto));
    };

    // Si los datos están cargando, muestra un mensaje
    if (loading) return <div>Cargando contactos...</div>;

    // Renderiza el formulario y la lista de usuarios
    return (
        <div className="container my-5">
            <h2>Demostración de componentes</h2>
            {/* Componente para agregar usuarios */}
            <Formulario agregar={agregarContacto}></Formulario>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {
                    // Mapea cada usuario a un componente Ficha
                    arrContactos.map((contacto) => (
                        <div className="col" key={contacto.id_contacto}>
                            <Ficha
                                nombre={contacto.nombre}
                                apellido={contacto.apellido}
                                // Pasa la función para eliminar el usuario
                                eliminar={() => eliminarContacto(contacto.id_contacto)}
                            ></Ficha>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}