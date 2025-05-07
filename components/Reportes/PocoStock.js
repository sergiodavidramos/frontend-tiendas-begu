import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import moment from 'moment/moment'
const PocoStock = ({ productos }) => {
  moment.locale('es')
  return (
    <>
      <div className="card card-static-2 mb-30">
        <div className="card-title-2">
          <h4>Productos con poco cantidad en Stock</h4>
        </div>
        <div className="card-body-table">
          <div className="table-responsive" style={{ maxHeight: '500px' }}>
            <table
              className="table ucp-table table-hover table-bordered"
              id="tablaCantidadStock"
            >
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Tipo venta</th>
                  <th>Lotes</th>
                  <th>Stock Total</th>
                </tr>
              </thead>
              <tbody>
                {productos.length > 0 &&
                  productos.map((proStock, index) => {
                    return (
                      <tr key={index}>
                        <td>{proStock.producto.name}</td>
                        <td>{proStock.producto.tipoVenta}</td>
                        <td>
                          {proStock.stockLotes.length <= 0
                            ? ''
                            : proStock.stockLotes.map((lote, index) => (
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
                                      <td>{lote.numeroLote}</td>
                                      <td>{lote.stock}</td>
                                      <td>
                                        {moment(
                                          lote.fechaVencimiento
                                        ).format('LL')}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              ))}
                        </td>
                        <td>{proStock.stockTotal} </td>
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
                table="tablaCantidadStock"
                filename={`Productos con poco Stock`}
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
export default PocoStock
