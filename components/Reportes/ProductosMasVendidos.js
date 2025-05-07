import ReactHTMLTableToExcel from "react-html-table-to-excel";

const ProductosMasVendidos = ({ productos }) => {
  return (
    <>
      <div className="card card-static-2 mb-30">
        <div className="card-title-2">
          <h4>Productos mas vendidos de la sucursal</h4>
        </div>
        <div className="card-body-table">
          <div className="table-responsive" style={{ maxHeight: "500px" }}>
            <table
              className="table ucp-table table-hover table-bordered"
              id="tablaProductosMasVendidos">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Tipo Venta</th>
                  <th>Precio Venta</th>
                  <th>Descuento</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {productos.length > 0 &&
                  productos.map((datoProducto, index) => {
                    return (
                      <tr key={index}>
                        <td>{datoProducto._id.name}</td>
                        <td>{datoProducto._id.tipoVenta}</td>
                        <td>{datoProducto._id.precioVenta}</td>
                        <td>
                          {datoProducto._id.descuento}% / Precio:{" "}
                          {datoProducto._id.precioVenta -
                            (datoProducto._id.precioVenta *
                              datoProducto._id.descuento) /
                              100}
                        </td>
                        <td>{datoProducto.cantidad}</td>
                        <td>{datoProducto.total}</td>
                      </tr>
                    );
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
                table="tablaProductosMasVendidos"
                filename={`Productos mas Vendidos`}
                sheet="pagina 1"
                buttonText="Exportar a Excel"
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
export default ProductosMasVendidos;
