import TopNavbar from "../../../components/Navbar";
import SideNav from "../../../components/Navbar/SideNav";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useContext, useState } from "react";
import UserContext from "../../../components/UserContext";
import GetImg from "../../../components/GetImg";
import FormData from "form-data";
import Notifications, { notify } from "react-notify-toast";
import { API_URL } from "../../../components/Config";
const editClient = () => {
  const { signOut, getSucursales } = useContext(UserContext);
  const [client, setCliente] = useState(null);
  const [token, setToken] = useState(false);
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
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
    setToken(tokenLocal);
    if (!client && router && router.query && router.query.id) {
      const { id } = router.query;
      fetch(`${API_URL}/person?id=${id}`, {
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
            notify.show("Error el en servidor", "error", 2000);
          } else {
            console.log(data);
            setCliente(data.body.persons[0]);
          }
        })
        .catch((error) => notify.show("Error en el servidor", "error", 2000));
    }
  }, [router]);
  function handlerSubmit() {
    event.preventDefault();
    const target = event.target;
    fetch(`${API_URL}/person/${client._id}`, {
      method: "PATCH",
      body: JSON.stringify({
        nombre_comp: target[0].value,
        ci: target[1].value ? target[1].value : false,
        puntos: target[2].value,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) signOut();
        return res.json();
      })
      .then((response) => {
        if (response.error) {
          notify.show(response.body.message, "error", 2000);
          console.log("DSDSD", response);
        } else {
          setCliente(response.body);
          notify.show("Cambios guardados con Exito! ", "success", 2000);
        }
      })
      .catch((e) => {
        notify.show("No se pudo guardar los cambios", "error");
      });
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
              <h2 className="mt-30 page-title">Clientes</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link legacyBehavior href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">
                  <Link legacyBehavior href="/clientes">
                    <a>Clientes</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Editar Cliente</li>
              </ol>
              {client ? (
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="card card-static-2 mb-30">
                      <div className="card-title-2">
                        <h4>Editar Cliente</h4>
                      </div>
                      <div className="card-body-table">
                        <form onSubmit={handlerSubmit}>
                          <div className="news-content-right pd-20">
                            <div className="form-group">
                              <label className="form-label">Nombre*</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={client.nombre_comp}
                                placeholder="Ingrese su nombre comleto"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">C.I.*</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={client.ci ? client.ci : ""}
                                placeholder="Ingrese el C.I."
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Puntos*</label>
                              <input
                                type="number"
                                className="form-control"
                                defaultValue={client.puntos}
                                placeholder="Puntos del cliente"
                              />
                            </div>

                            <button
                              className="save-btn hover-btn"
                              type="submit">
                              Guardar Cambios
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default editClient;
