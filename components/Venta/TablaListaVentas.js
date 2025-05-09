import moment from "moment";
import Link from "next/link";
const TablaListaPedidos = ({ ventas }) => {
  moment.locale("es");
  return (
    <div className="card-body-table">
      <div className="table-responsive">
        <table className="table ucp-table table-hover">
          <thead>
            <tr>
              <th>Item</th>
              <th style={{ width: "150px" }}>Fecha</th>
              <th style={{ width: "150px" }}>Cliente</th>
              <th style={{ width: "300px" }}>Sucursal</th>
              <th style={{ width: "130px" }}>Vendido por</th>
              <th style={{ width: "80px" }}>Estado</th>
              <th style={{ width: "80px" }}>Total</th>
              <th style={{ width: "50px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length > 0 &&
              ventas.map((venta, index) => (
                <tr key={index}>
                  <td>
                    {venta.detalleVenta.detalle.map((pro) => {
                      return (
                        <div key={pro._id}>
                          <Link
                            legacyBehavior
                            href="/productos/[id]/[title]"
                            as={`/productos/${
                              pro.producto._id
                            }/${pro.producto.name
                              .toLowerCase()
                              .replace(/\s/g, "-")}`}>
                            <a target="_blank">{pro.producto.name} </a>
                          </Link>
                          {pro.cantidad}-{pro.producto.tipoVenta}
                          <br />
                        </div>
                      );
                    })}
                  </td>
                  <td>
                    <span className="delivery-time">
                      {moment(venta.fecha).format("LLLL")}
                    </span>
                  </td>
                  <td>{venta.client.nombre_comp}</td>
                  <td style={{ width: "15%" }}>{venta.idSucursal.nombre}</td>
                  <td>{venta.user.idPersona.nombre_comp}</td>
                  <td>
                    {venta.state ? (
                      <span className="badge-item badge-status">Vendido</span>
                    ) : (
                      <span className="badge-item badge-status-false">
                        Cancelado
                      </span>
                    )}
                  </td>
                  <td>{venta.total.toFixed(2)} Bs</td>
                  <td className="action-btns">
                    <Link
                      legacyBehavior
                      href="/venta/editar/[id]"
                      as={`/venta/editar/${venta._id}`}>
                      <a className="views-btn">
                        <i className="fas fa-edit"></i>
                      </a>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TablaListaPedidos;
