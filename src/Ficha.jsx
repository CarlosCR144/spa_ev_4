export default function Ficha({ id_contacto, nombre, apellido, eliminar, datosContacto, onEditar }) {
    return (
        <div className="card">
            <div className="card-header">
                Contacto ID: {id_contacto}
            </div>
            <div className="card-body">
                <ul>
                    <li>Nombre: {nombre}</li>
                    <li>Apellido: {apellido}</li>
                    <li>Datos contacto:</li>
                    <ul>
                        {datosContacto && datosContacto.length > 0 ? (
                            datosContacto.map((dato, idx) => (
                                <li key={dato.id_dato_contacto || idx}>
                                    {dato.tipo}: {dato.correo || dato.telefono || dato.direccion}
                                </li>
                            ))
                        ) : (
                            <li>No hay datos de contacto disponibles.</li>
                        )}
                    </ul>
                </ul>
                <button className="btn btn-primary m-1" onClick={onEditar}>Editar</button>
                <button onClick={eliminar} className="btn btn-danger m-1">Eliminar</button>
            </div>
        </div>
    );
}