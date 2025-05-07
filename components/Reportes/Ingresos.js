import ReactHTMLTableToExcel from "react-html-table-to-excel";
import moment from "moment/moment";
let totalIngresos = 0;
const IngresosSucursal = ({ ingresos }) => {
  moment.locale("es");
  return (
    <>
      <div className="card card-static-2 mb-30">
        <div className="card-title-2">
          <h4>Todos los ingresos de la sucursal</h4>
        </div>
        <div className="card-body-table">
          <div className="table-responsive" style={{ maxHeight: "500px" }}>
            <table
              className="table ucp-table table-hover table-bordered"
              id="tablaIngresos">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Tipo Venta</th>
                  <th>Precio Venta</th>
                  <th>Descuento</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {ingresos.length > 0 &&
                  ingresos.map((datoIngreso, index) => {
                    totalIngresos += datoIngreso.detalle.subTotal;
                    return (
                      <tr key={index}>
                        <td>{moment(datoIngreso.fecha).format("LL")}</td>
                        <td>{datoIngreso.detalle.producto.name}</td>
                        <td>{datoIngreso.detalle.tipoVenta}</td>
                        <td>{datoIngreso.detalle.precioVenta}</td>
                        <td>
                          {datoIngreso.detalle.descuento}% / Precio:{" "}
                          {datoIngreso.detalle.precioVenta -
                            (datoIngreso.detalle.precioVenta *
                              datoIngreso.detalle.descuento) /
                              100}
                        </td>
                        <td>{datoIngreso.detalle.cantidad}</td>
                        <td>{datoIngreso.detalle.subTotal} Bs</td>
                      </tr>
                    );
                  })}
                {
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Total:</td>
                    <td>{totalIngresos}</td>
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
                table="tablaIngresos"
                filename={`Ingresos`}
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
export default IngresosSucursal;
