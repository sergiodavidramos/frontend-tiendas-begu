import Link from 'next/link'
import moment from 'moment'
import { API_URL } from '../Config'
const filaProductos = ({
  pro,
  setLotesProducto,
  setAgregarProducto,
  agregarProducto,
}) => {
  moment.locale('es')
  function agregar(pro) {
    setLotesProducto(pro)
    setAgregarProducto(!agregarProducto)
  }
  return (
    <tr>
      <td>{pro.producto.code}</td>
      <td>
        <div className="cate-img-5">
          <img
            src={`${API_URL}/upload/producto/${pro.producto.img[0]}`}
            alt={pro.producto.name}
          />
        </div>
      </td>
      <td>{pro.producto.name}</td>
      {pro.stockLotes.length > 0 ? (
        <td>
          {moment(
            pro.stockLotes[0].lote
              ? pro.stockLotes[0].lote.fechaVencimiento
              : pro.stockLotes[0].fechaVencimiento
          ).format('LL')}
        </td>
      ) : (
        <td>Sin vencimiento</td>
      )}
      <td>
        {pro.producto.status ? (
          <span className="badge-item badge-status">Activo</span>
        ) : (
          <span className="badge-item badge-status-false">Inactivo</span>
        )}
      </td>
      <td>{pro.stockTotal}</td>
      <td className="action-btns">
        <Link href="/productos/[id]" as={`/productos/${pro.producto._id}`}>
          <a className="edit-btn" title="Editar">
            <i className="fas fa-edit"></i>
          </a>
        </Link>
        <a
          className="edit-btn"
          style={{ cursor: 'pointer' }}
          title="Mover Producto"
          onClick={() => agregar(pro)}
        >
          <i className="fas fa-truck-loading"></i>
        </a>
      </td>
    </tr>
  )
}
export default filaProductos
