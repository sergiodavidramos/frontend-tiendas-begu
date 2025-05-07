import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import moment from 'moment/moment'
const TrasladoProductos = ({ traslados }) => {
  moment.locale('es')
  return (
    <>
      <div className="card card-static-2 mb-30">
        <div className="card-title-2">
          <h4>Movimiento de Productos entre sucursales</h4>
        </div>
        <div className="card-body-table">
          <div className="table-responsive" style={{ maxHeight: '500px' }}>
            <table
              className="table ucp-table table-hover table-bordered"
              id="tablaTrasladoProductos"
            >
              <thead>
                <tr>
                  <th>Fecha Enviado</th>
                  <th>Fecha Recibido</th>
                  <th>Sucursal Origen</th>
                  <th>Sucursal Destino</th>
                  <th>Usuario que Envio</th>
                  <th>Usuario que Recibio</th>
                  <th>Productos Trasladodos</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {traslados.length > 0 &&
                  traslados.map((movido, index) => {
                    return (
                      <tr key={index}>
                        <td>{moment(movido.fechaEnvio).format('LLL')}</td>
                        <td>{moment(movido.fechaRecibo).format('LLL')}</td>
                        <td>{movido.sucursalOrigen.nombre}</td>
                        <td>{movido.sucursalDestino.nombre}</td>
                        <td>
                          {movido.enviaUsuario.idPersona.nombre_comp}
                        </td>
                        <td>
                          {movido.recibeUsuario.idPersona.nombre_comp}
                        </td>
                        <td>
                          {movido.movimiento.length <= 0
                            ? ''
                            : movido.movimiento.map((producto) => (
                                <table key={producto._id}>
                                  <thead>
                                    <tr>
                                      <th>Producto</th>
                                      <th>Cantidad</th>
                                      <th>Precio Compra</th>
                                      <th>Precio Venta</th>
                                      <th>Tipo Venta</th>
                                      {producto.numeroLote && (
                                        <>
                                          <th>Numero Lote</th>
                                          <th>Fecha Vencimiento</th>
                                        </>
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>{producto.productos.name}</td>
                                      <td>{producto.cantidad}</td>
                                      <td>
                                        {producto.productos.precioCompra}
                                      </td>
                                      <td>
                                        {producto.productos.precioVenta}
                                      </td>
                                      <td>
                                        {producto.productos.tipoVenta}
                                      </td>
                                      {producto.numeroLote && (
                                        <>
                                          <td>{producto.numeroLote}</td>
                                          <td>
                                            {moment(
                                              producto.fechaVencimiento
                                            ).format('LL')}
                                          </td>
                                        </>
                                      )}
                                    </tr>
                                  </tbody>
                                </table>
                              ))}
                        </td>
                        <td>
                          {movido.estadoRecibido ? (
                            <span className="badge-item badge-status">
                              Recibido
                            </span>
                          ) : (
                            <span className="badge-item badge-status-false">
                              No recibido
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-body-table-footer">
          <ul>
            <li>
              <ReactHTMLTableToExcel
                id="botonExportExcel"
                className="download-btn hover-btn"
                table="tablaTrasladoProductos"
                filename={`Reporte traslado productos: ${moment().format(
                  'LL'
                )}`}
                sheet="pagina 1"
                buttonText="Exportar a Excel"
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
export default TrasladoProductos
