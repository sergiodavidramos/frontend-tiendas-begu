import { useEffect, useContext, useState } from "react";
import UserContext from "../../components/UserContext";
import Notifications, { notify } from "react-notify-toast";
import TopNavbar from "@/components/Navbar";
import { API_URL } from "../../components/Config";
import SideNav from "@/components/Navbar/SideNav";
import Footer from "@/components/Footer";
import Link from "next/link";

const Puntos = () => {
  const { signOut } = useContext(UserContext);
  const [token, setToken] = useState(false);
  const [puntosRegistrado, setPuntosRegistrado] = useState(false);
  const [puntosValor, setPuntosValor] = useState(false);
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
      setToken(tokenLocal);
      getPuntos();
    } else signOut();
  }, []);
  async function getPuntos() {
    const response = await fetch(`${API_URL}/puntos`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    const data = await response.json();
    if (data.error) {
      notify.show("Error en el servidor (marca)", "error", 2000);
    } else {
      if (data.body.length === 0) {
        setPuntosRegistrado(false);
      } else {
        setPuntosRegistrado(true);
        setPuntosValor(data.body);
      }
    }
  }
  async function handlerSubmitPuntos() {
    let target = event.target;
    event.preventDefault();
    if (!target[0].value || !target[1].value)
      notify.show(
        "Por favor todos los campos deben ser llenados",
        "warning",
        2000
      );
    else {
      fetch(`${API_URL}/puntos`, {
        method: "POST",
        body: JSON.stringify({
          valor: target[0].value,
          status: target[1].value,
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
            notify.show(
              "Error al agregar el valor de los puntos",
              "error",
              1000
            );
          } else {
            target[0].value = "";
            target[1].value = true;
            notify.show(
              "Valor de los puntos agregado con Exito! ",
              "success",
              2000
            );
            getPuntos();
          }
        })
        .catch((error) => {
          notify.show("Error en el Servidor", "error");
        });
    }
  }
  function handlerUpdatePuntos() {
    let target = event.target;
    event.preventDefault();
    if (!target[0].value || !target[1].value)
      notify.show(
        "Por favor todos los campos deben ser llenados",
        "warning",
        2000
      );
    else {
      fetch(`${API_URL}/puntos/${puntosValor[0]._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          valor: target[0].value,
          status: target[1].value,
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
            notify.show(
              "Error al agregar el valor de los puntos",
              "error",
              1000
            );
          } else {
            notify.show(
              "Valor de los puntos actualizado con Exito! ",
              "success",
              2000
            );
            getPuntos();
          }
        })
        .catch((error) => {
          console.log(error);
          notify.show("Error en el Servidor", "error");
        });
    }
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
              <h2 className="mt-30 page-title">Puntos</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">Tablero</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/puntos">Puntos</Link>
                </li>
                <li className="breadcrumb-item active">Agregar nuevo</li>
              </ol>
              <div className="row">
                <div className="col-lg-5 col-md-6">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Agregar Valor de los puntos</h4>
                    </div>
                    <div className="card-body-table">
                      <form
                        onSubmit={
                          puntosRegistrado
                            ? handlerUpdatePuntos
                            : handlerSubmitPuntos
                        }>
                        <div className="news-content-right pd-20">
                          <div className="form-group">
                            <label className="form-label">
                              Valor de los puntos*
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Agregar valor de los puntos"
                              required
                              min="0.1"
                              defaultValue={
                                puntosRegistrado ? puntosValor[0].valor : ""
                              }
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Estado*</label>
                            <select
                              id="status"
                              name="status"
                              className="form-control"
                              defaultValue={
                                puntosRegistrado ? puntosValor[0].status : true
                              }>
                              <option value={true}>Activo</option>
                              <option value={false}>Inactivo</option>
                            </select>
                          </div>

                          {puntosRegistrado ? (
                            <button className="save-btn hover-btn">
                              Actualizar Valor de los puntos
                            </button>
                          ) : (
                            <button className="save-btn hover-btn">
                              Agregar Valor de los puntos
                            </button>
                          )}
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

export default Puntos;
