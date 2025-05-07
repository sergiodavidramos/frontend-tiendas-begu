import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import moment from 'moment/moment'
let totalEgresos = 0
const EgresosSucursal = ({ egresos }) => {
  moment.locale('es')
  return (
    <>
      <div className="card card-static-2 mb-30">
        <div className="card-title-2">
          <h4>Todos los Egresos de la sucursal</h4>
        </div>
        <div className="card-body-table">
          <div className="table-responsive" style={{ maxHeight: '500px' }}>
            <table
              className="table ucp-table table-hover table-bordered"
              id="tablaEgresos"
            >
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Personal</th>
                  <th>Detalle</th>
                  <th>Numero factura</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {egresos.length > 0 &&
                  egresos.map((datoEgreso, index) => {
                    totalEgresos += datoEgreso.total
                    return (
                      <tr key={index}>
                        <td>{moment(datoEgreso.fecha).format('LL')}</td>
                        <td>
                          {datoEgreso.user.length > 0
                            ? datoEgreso.user[0].email
                            : ''}
                        </td>
                        <td>
                          {datoEgreso.detalleTexto
                            ? datoEgreso.detalleTexto
                            : datoEgreso.detalleCompra[0].detalle.map(
                                (det, index) => (
                                  <table key={det._id}>
                                    <thead>
                                      <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Tipo Venta</th>
                                        <th>Sub Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>
                                          {
                                            datoEgreso.productos[index]
                                              .name
                                          }
                                        </td>

                                        <td>{det.cantidad}</td>
                                        <td>
                                          {
                                            datoEgreso.productos[index]
                                              .tipoVenta
                                          }
                                        </td>
                                        <td>{det.subTotal} Bs.</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                )
                              )}
                        </td>
                        <td>{datoEgreso.numeroFacturaCompra}</td>
                        <td>{datoEgreso.total} Bs.</td>
                      </tr>
                    )
                  })}
                {
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <strong>Total:</strong>{' '}
                    </td>
                    <td>
                      <strong>{totalEgresos.toFixed(2)} Bs.</strong>
                    </td>
                  </tr>
                }
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
                table="tablaEgresos"
                filename={`Egresos de la sucursal`}
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
export default EgresosSucursal
