import TopNavbar from "../../components/Navbar";
import SideNav from "../../components/Navbar/SideNav";
import Link from "next/link";
import { useEffect, useContext, useState, useRef } from "react";
import UserContext from "../../components/UserContext";
import Notifications, { notify } from "react-notify-toast";
import Footer from "../../components/Footer";
import { API_URL } from "../../components/Config";
import axios from "axios";

const Proveedor = () => {
  const { token, signOut } = useContext(UserContext);
  const [marcas, setMarcas] = useState(false);

  const selectStatus = useRef(null);

  useEffect(() => {
    const tokenLocal = localStorage.getItem("fribar-token");
    const user = localStorage.getItem("fribar-user");
    if (!tokenLocal && !user) {
      signOut();
    }
    if (
      JSON.parse(user).role === "GERENTE-ROLE" ||
      JSON.parse(user).role === "ADMIN-ROLE"
    )
      getProveedorWithStatus(tokenLocal);
    else signOut();
  }, []);

  function getProveedorWithStatus(token) {
    axios
      .get(`${API_URL}/proveedor/all?status=${selectStatus.current.value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
      })
      .then(({ data }) => {
        if (data.error) {
          notify.show("Error en el servidor (marca)", "error", 2000);
        } else {
          setMarcas(data.body);
        }
      })
      .catch((error) => {
        notify.show(error.message, "error", 2000);
      });
  }
  function handlerSubmitStatus() {
    getProveedorWithStatus(token);
  }
  return (
    <>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: "56px" }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Proveedores</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link legacyBehavior href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Proveedores</li>
              </ol>
              <div className="row justify-content-between">
                <div className="col-lg-12">
                  <Link legacyBehavior href="/proveedor/nuevo">
                    <a className="add-btn hover-btn">Agregar proveedor</a>
                  </Link>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="bulk-section mt-30">
                    <div className="input-group">
                      <select
                        id="action"
                        name="action"
                        defaultValue="0"
                        className="form-control"
                        ref={selectStatus}>
                        <option value={0}>Seleccione acción</option>
                        <option value={true}>Activos</option>
                        <option value={false}>Inactivos</option>
                      </select>
                      <div className="input-group-append">
                        <button
                          className="status-btn hover-btn"
                          type="submit"
                          onClick={handlerSubmitStatus}>
                          Aplicar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mt-30 mb-30">
                    <div className="card-title-2">
                      <h4>Todas las Marcas</h4>
                    </div>
                    <div className="card-body-table">
                      <div className="table-responsive">
                        <table className="table ucp-table table-hover">
                          <thead>
                            <tr>
                              <th style={{ width: "60px" }}>ID</th>
                              <th>Nombre</th>
                              <th>Celular</th>
                              <th>Referencia</th>
                              <th>Estado</th>
                              <th>Accion</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!marcas ? (
                              <tr>
                                <td>...</td>
                              </tr>
                            ) : (
                              marcas.map((ciu) => (
                                <tr key={ciu._id}>
                                  <td>{ciu._id}</td>
                                  <td>{ciu.nombreComercial}</td>
                                  <td>{ciu.phone}</td>
                                  <td>{ciu.referencia}</td>
                                  <td>
                                    <span
                                      className={`badge-item ${
                                        ciu.status
                                          ? "badge-status"
                                          : "badge-status-false"
                                      }`}>
                                      {ciu.status ? "Activo" : "Inactivo"}
                                    </span>
                                  </td>
                                  <td className="action-btns">
                                    <Link
                                      legacyBehavior
                                      href="/proveedor/[id]"
                                      as={`/proveedor/${ciu._id}`}>
                                      <a className="edit-btn">
                                        <i className="fas fa-edit"></i>
                                        Editar
                                      </a>
                                    </Link>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
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
export default Proveedor;
