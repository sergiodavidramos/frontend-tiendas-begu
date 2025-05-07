import moment from 'moment'
import Link from 'next/link'
const TablaListaPedidos = ({ compras }) => {
  moment.locale('es')
  return (
    <div className="card-body-table">
      <div className="table-responsive">
        <table className="table ucp-table table-hover">
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
            {compras.length > 0 &&
              compras.map((datoEgreso, index) => {
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
                                      {datoEgreso.productos[index].name}
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
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default TablaListaPedidos
