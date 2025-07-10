export default function Ficha({ nombre, apellido, eliminar }) {
    return (
        <div className="card">
            <div className="card-header">
                Bienvenido {nombre} {apellido}!
            </div>
            <div className="card-body">
                <ul>
                    <li>Nombre: {nombre}</li>
                    <li>Apellido: {apellido}</li>
                </ul>
                <button className="btn btn-primary m-1">Detalles</button>
                <button onClick={eliminar} className="btn btn-danger m-1">Eliminar</button>
            </div>
        </div>
    );
}