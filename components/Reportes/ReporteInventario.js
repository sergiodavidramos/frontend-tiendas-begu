import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import moment from 'moment/moment'
const ReporteInventario = ({ productos }) => {
  moment.locale('es')
  return (
    <>
      <div className="card card-static-2 mb-30">
        <div className="card-title-2">
          <h4>Inventario</h4>
        </div>
        <div className="card-body-table">
          <div className="table-responsive" style={{ maxHeight: '500px' }}>
            <table
              className="table ucp-table table-hover table-bordered"
              id="tablaInventario"
            >
              <thead>
                <tr>
                  <th>Codigo Producto</th>
                  <th>Producto</th>
                  <th>Precio Venta</th>
                  <th>Lotes</th>
                  <th>Stock Total</th>
                </tr>
              </thead>
              <tbody>
                {productos.length > 0 &&
                  productos.map((inventario, index) => {
                    return (
                      <tr key={index}>
                        <td>{inventario.producto.code}</td>
                        <td>{inventario.producto.name}</td>
                        <td>{inventario.producto.precioVenta} Bs.</td>
                        <td>
                          {inventario.stockLotes.length <= 0
                            ? 'Sin fecha de vencimiento'
                            : inventario.stockLotes.map((lote) => (
                                <table key={lote._id}>
                                  <thead>
                                    <tr>
                                      <th>Numero Lote</th>
                                      <th>Stock</th>
                                      <th>Fecha Vencimiento</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>{lote.lote.numeroLote}</td>
                                      <td>{lote.lote.stock}</td>
                                      <td>
                                        {moment(
                                          lote.lote.fechaVencimiento
                                        ).format('LL')}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              ))}
                        </td>
                        <td>{inventario.stockTotal} </td>
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
                table="tablaInventario"
                filename={`Inventario: ${moment().format('LL')}`}
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
export default ReporteInventario
