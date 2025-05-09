import Footer from "../../components/Footer";
import TopNavbar from "../../components/Navbar";
import SideNav from "../../components/Navbar/SideNav";
import Notifications, { notify } from "react-notify-toast";
import Link from "next/link";
import { useEffect, useContext, useState } from "react";
import UserContext from "../../components/UserContext";
import { useRouter } from "next/router";
import axios from "axios";
import { API_URL } from "../../components/Config";

const editarProveedor = () => {
  const { token, signOut } = useContext(UserContext);
  const router = useRouter();
  const [proveedor, setProveedor] = useState(false);

  useEffect(() => {
    const tokenLocal = localStorage.getItem("fribar-token");
    const user = localStorage.getItem("fribar-user");
    if (!tokenLocal && !user) {
      signOut();
    }
    if (
      JSON.parse(user).role === "GERENTE-ROLE" ||
      JSON.parse(user).role === "ADMIN-ROLE"
    ) {
    } else signOut();
    if (router && router.query.id) getProveedorByID(token, router.query.id);
  }, [router]);

  function getProveedorByID(token, id) {
    axios
      .get(`${API_URL}/proveedor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => {
        if (data.error)
          notify.show(`Error en el Servidor: ${data.error.status}`, "error");
        setProveedor(data.body);
        console.log("ssss", data.body);
      })
      .catch((error) =>
        notify.show(`Error en el Servidor: ${error.response.status}`, "error")
      );
  }

  const handlerSubmitCiudad = () => {
    let target = event.target;
    event.preventDefault();
    if (!target[0].value || !target[1].value || !target[2].value)
      notify.show(
        "Por favor todos los campos deben ser llenados",
        "warning",
        2000
      );
    else {
      axios
        .patch(
          `${API_URL}/proveedor/${router.query.id}`,
          {
            nombreComercial: target[0].value,
            phone: target[1].value,
            referencia: target[2].value,
            direccion: target[3].value,
            status: target[4].value,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "COntent-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.error) notify.show(res.body, "error", 2000);
          else {
            notify.show("Marca agregado con Exito! ", "success", 2000);
            console.log(res);
          }
        })
        .catch((error) => {
          if (error.response.status === 401) signOut();
          notify.show(
            `Error en el Servidor: ${error.response.status}`,
            "error"
          );
        });
    }
  };
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
                  <Link href="/">Tablero</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/ciudades">Proveedor</Link>
                </li>
                <li className="breadcrumb-item active">Agregar proveedor</li>
              </ol>
              <div className="row">
                <div className="col-lg-5 col-md-6">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Agregar nuevo proveedor</h4>
                    </div>
                    <div className="card-body-table">
                      <form onSubmit={handlerSubmitCiudad}>
                        <div className="news-content-right pd-20">
                          <div className="form-group">
                            <label className="form-label">
                              Nombre comercial*
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nombre del proveedor"
                              required
                              defaultValue={proveedor.nombreComercial}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Numero celular*
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Celular"
                              required
                              defaultValue={proveedor.phone}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Referencia*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nombre del contacto"
                              required
                              defaultValue={proveedor.referencia}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Direccion*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Introduzca la Direccion"
                              required
                              defaultValue={proveedor.direccion}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Estado*</label>
                            {proveedor ? (
                              <select
                                id="status"
                                name="status"
                                className="form-control"
                                defaultValue={proveedor.status}>
                                <option value={true}>Activo</option>
                                <option value={false}>Inactivo</option>
                              </select>
                            ) : (
                              ""
                            )}
                          </div>

                          <button className="save-btn hover-btn">
                            Editar proveedor
                          </button>
                        </div>
                      </form>
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

export default editarProveedor;
