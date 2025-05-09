import Head from "next/head";
import TopNavbar from "../../components/Navbar";
import SideNav from "../../components/Navbar/SideNav";
import Footer from "../../components/Footer";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import Notifications, { notify } from "react-notify-toast";
import FormData from "form-data";
import UserContext from "../../components/UserContext";
import { API_URL } from "../../components/Config";
const CategoriaNuevo = () => {
  const [token, setToken] = useState(false);
  const { signOut } = useContext(UserContext);
  const [butt, setButt] = useState(false);
  useEffect(() => {
    const tokenLocal = localStorage.getItem("fribar-token");
    if (!tokenLocal) {
      signOut();
    }
    setToken(tokenLocal);
  }, []);
  const handlerSubmit = () => {
    event.preventDefault();
    let target = event.target;
    setButt(true);
    fetch(`${API_URL}/categoria`, {
      method: "POST",
      body: JSON.stringify({
        name: target[0].value,
        status: target[1].value,
        description: target[2].value,
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
          console.log(response);
          notify.show("Error al agregar la categoria", "error", 1000);
          setButt(false);
        } else {
          target[0].value = "";
          target[1].value = true;
          target[2].value = "";
          notify.show("Producto agregado con Exito! ", "success", 2000);
          setButt(false);
        }
      })
      .catch((error) => {
        notify.show("Error en el Servidor", "error");
        setButt(false);
      });
  };
  return (
    <>
      <Head></Head>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: "56px" }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Nueva Categoria</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link legacyBehavior href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link legacyBehavior href="/categorias">
                    <a>Categorias</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Agregar Categoria</li>
              </ol>

              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Agregar Nueva Categoria</h4>
                    </div>
                    <div className="card-body-table">
                      <form onSubmit={handlerSubmit}>
                        <div className="news-content-right pd-20">
                          <div className="form-group">
                            <label className="form-label">Nombre*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nombre Categoria"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Estado*</label>
                            <select
                              id="status"
                              name="status"
                              className="form-control"
                              defaultValue={true}>
                              <option value={true}>Activo</option>
                              <option value={false}>Inactivo</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Descripción*</label>
                            <textarea
                              type="textarea"
                              className="form-control"
                              required
                            />
                            <div className="card card-editor">
                              <div className="content-editor">
                                <div id="edit"></div>
                              </div>
                            </div>
                          </div>

                          <button
                            disabled={butt}
                            className="save-btn hover-btn"
                            type="submit">
                            Agregar Nueva Categoria
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

export default CategoriaNuevo;
