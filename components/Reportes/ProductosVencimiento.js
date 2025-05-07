import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import moment from 'moment/moment'
const ProductosVencimiento = ({ productos }) => {
  moment.locale('es')
  return (
    <>
      <div className="card card-static-2 mb-30">
        <div className="card-title-2">
          <h4>Productos proximos a Vencer</h4>
        </div>
        <div className="card-body-table">
          <div className="table-responsive" style={{ maxHeight: '500px' }}>
            <table
              className="table ucp-table table-hover table-bordered"
              id="tablaProdcutosVencimiento"
            >
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Lote</th>
                  <th>Stock Lote</th>
                  <th>Fecha vencimiento</th>
                  <th>Stock Total</th>
                </tr>
              </thead>
              <tbody>
                {productos.length > 0 &&
                  productos.map((proVence, index) => {
                    return (
                      <tr key={index}>
                        <td>{proVence.producto.name}</td>
                        <td>{proVence.stockLotes.numeroLote}</td>
                        <td>{proVence.stockLotes.stock}</td>
                        <td>
                          {moment(
                            proVence.stockLotes.fechaVencimiento
                          ).format('LL')}{' '}
                        </td>
                        <td>{proVence.stockTotal} </td>
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
                table="tablaProdcutosVencimiento"
                filename={`Productos proximos a vencer`}
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
export default ProductosVencimiento
