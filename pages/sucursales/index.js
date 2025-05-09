import TopNavbar from "../../components/Navbar";
import SideNav from "../../components/Navbar/SideNav";
import Link from "next/link";
import { useEffect, useContext, useState } from "react";
import UserContext from "../../components/UserContext";
import Notifications, { notify } from "react-notify-toast";
import Footer from "../../components/Footer";
import { API_URL } from "../../components/Config";

const Sucursal = () => {
  const { signOut } = useContext(UserContext);
  const [sucursal, setSucursales] = useState(false);
  const [user, setUser] = useState({});
  useEffect(() => {
    const tokenLocal = localStorage.getItem("fribar-token");
    const u = localStorage.getItem("fribar-user");
    if (!tokenLocal) {
      signOut();
    } else {
      setUser(JSON.parse(u));
      fetch(`${API_URL}/sucursal/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenLocal}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 401) {
            signOut();
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            notify.show("Error en el servidor (ciudad)", "error", 2000);
          } else {
            setSucursales(data.body);
          }
        })
        .catch((error) => {
          notify.show(error.message, "error", 2000);
        });
    }
  }, []);

  return (
    <>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: "56px" }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Sucursales</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <a href="index.html">Tablero</a>
                </li>
                <li className="breadcrumb-item active">sucursales</li>
              </ol>
              <div className="row justify-content-between">
                <div className="col-lg-12">
                  {(user.role === "GERENTE-ROLE" ||
                    user.role === "ADMIN-ROLE") && (
                    <Link legacyBehavior href="/sucursales/nuevo">
                      <a className="add-btn hover-btn">Agregar sucursal</a>
                    </Link>
                  )}
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mt-30 mb-30">
                    <div className="card-title-2">
                      <h4>Todos los sucursales</h4>
                    </div>
                    <div className="card-body-table">
                      <div className="table-responsive">
                        <table className="table ucp-table table-hover">
                          <thead>
                            <tr>
                              <th style={{ width: "60px" }}>ID</th>
                              <th>Nombre</th>
                              <th>Administrador</th>
                              <th style={{ width: "200px" }}>Direccion</th>
                              <th style={{ width: "120px" }}>Estado</th>
                              <th style={{ width: "150px" }}>Acción</th>
                            </tr>
                          </thead>
                          {sucursal ? (
                            <tbody>
                              {sucursal.map((sucursal) => (
                                <tr key={sucursal._id}>
                                  <td>{sucursal._id}</td>
                                  <td>{sucursal.nombre}</td>
                                  <td>
                                    {
                                      sucursal.administrador.idPersona
                                        .nombre_comp
                                    }
                                  </td>

                                  <td>{sucursal.direccion.direccion}</td>
                                  <td>
                                    <span
                                      className={`badge-item ${
                                        sucursal.state
                                          ? "badge-status"
                                          : "badge-status-false"
                                      }`}>
                                      {sucursal.state ? "Activo" : "Inactivo"}
                                    </span>
                                  </td>
                                  <td className="action-btns">
                                    <Link
                                      legacyBehavior
                                      href="/sucursales/detalle/[id]"
                                      as={`/sucursales/detalle/${sucursal._id}`}>
                                      <a
                                        className="view-shop-btn"
                                        title="Ver sucursal">
                                        <i className="fas fa-eye"></i>
                                      </a>
                                    </Link>
                                    {(user.role === "GERENTE-ROLE" ||
                                      user.role === "ADMIN-ROLE" ||
                                      user.role === "ALMACEN-ROLE" ||
                                      user.role === "USER-ROLE") && (
                                      <Link
                                        legacyBehavior
                                        href="/sucursales/tienda-productos/[id]"
                                        as={`/sucursales/tienda-productos/${sucursal._id}`}>
                                        <a
                                          className="list-btn"
                                          title="Enviar productos a otra sucursal">
                                          <i className="fas fa-list-alt"></i>
                                        </a>
                                      </Link>
                                    )}
                                    {(user.role === "GERENTE-ROLE" ||
                                      user.role === "ADMIN-ROLE") && (
                                      <Link
                                        legacyBehavior
                                        href="/sucursales/editar/[id]"
                                        as={`/sucursales/editar/${sucursal._id}`}>
                                        <a
                                          className="edit-btn"
                                          title="Editar Sucursal">
                                          <i className="fas fa-edit"></i>
                                        </a>
                                      </Link>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          ) : (
                            <tbody></tbody>
                          )}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};
export default Sucursal;
