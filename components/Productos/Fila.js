import Link from "next/link";
import moment from "moment";
import { useContext } from "react";
import UserContext from "../UserContext";
import { API_URL } from "../Config";

export default ({ pro }) => {
  const { user } = useContext(UserContext);
  moment.locale("es");
  return (
    <tr>
      <td>{pro.code}</td>
      <td>
        <div className="cate-img-5">
          <img
            src={`${API_URL}/upload/producto/${pro.img[0]}`}
            alt={pro.name}
          />
        </div>
      </td>
      <td>{pro.name}</td>
      <td>{pro.category.name}</td>
      <td>{moment(pro.fechaCaducidad).format("LL") || ""}</td>
      <td>
        {pro.status ? (
          <span className="badge-item badge-status">Activo</span>
        ) : (
          <span className="badge-item badge-status-false">Inactivo</span>
        )}
      </td>
      <td>{pro.stock}</td>
      <td className="action-btns">
        <Link
          legacyBehavior
          href="/productos/[id]/[title]"
          as={`/productos/${pro._id}/${pro.name
            .toLowerCase()
            .replace(/\s/g, "-")}`}>
          <a className="view-shop-btn" title="Ver Producto">
            <i className="fas fa-eye"></i>
          </a>
        </Link>
        {(user.role === "ADMIN-ROLE" || user.role === "GERENTE-ROLE") && (
          <Link
            legacyBehavior
            href="/productos/[id]"
            as={`/productos/${pro._id}`}>
            <a className="edit-btn" title="Editar">
              <i className="fas fa-edit"></i>
            </a>
          </Link>
        )}
      </td>
    </tr>
  );
};
