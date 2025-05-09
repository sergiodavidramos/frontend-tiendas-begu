import Head from "next/head";
import TopNavbar from "../../components/Navbar";
import SideNav from "../../components/Navbar/SideNav";
import Footer from "../../components/Footer";
import CardTable from "../../components/Productos/CardTable";
import Link from "next/link";
import Notifications, { notify } from "react-notify-toast";
import { useState, useContext } from "react";
import UserContext from "../../components/UserContext";
import { API_URL } from "../../components/Config";
export default function Productos() {
  const [proFiltrado, setProFiltrado] = useState(null);
  const { categorias, token } = useContext(UserContext);
  const handleChangeBuscarNombre = () => {
    if (event.target.value) {
      fetch(`${API_URL}/productos/buscar/${event.target.value}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            notify.show("Error el en servidor", "error");
          } else {
            setProFiltrado(data.body);
          }
        })
        .catch((error) => console.log("errorrr", error));
    } else {
      setProFiltrado(null);
    }
  };
  const handleChangeCategory = () => {
    if (event.target.value !== "0") {
      fetch(`${API_URL}/productos/${event.target.value}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            notify.show("Error el en servidor", "error");
          } else {
            setProFiltrado(data.body);
          }
        })
        .catch((error) => notify.show("Error en el servidor", "error", 2000));
    } else {
      setProFiltrado(null);
    }
  };
  const handleChangeBuscarCodigo = () => {
    if (event.target.value) {
      fetch(`${API_URL}/productos/codigoproducto?code=${event.target.value}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            notify.show(
              data.body || "Error en el servidor buscar por codigo",
              "error"
            );
          } else {
            data.body === null
              ? setProFiltrado([])
              : setProFiltrado([data.body]);
          }
        })
        .catch((error) => console.log("errorrr", error));
    } else {
      setProFiltrado(null);
    }
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
              <h2 className="mt-30 page-title">
                Todos los productos en general
              </h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">Tablero</Link>
                </li>
                <li className="breadcrumb-item active">Productos</li>
              </ol>
              <div className="row justify-content-between">
                <div className="col-lg-12">
                  <Link legacyBehavior href="/productos/nuevo">
                    <a className="add-btn hover-btn">Agregar Nuevo Producto</a>
                  </Link>
                </div>

                <div className="col-lg-3 col-md-4">
                  <div className="bulk-section mt-30">
                    <div className="input-group">
                      <select
                        id="categeory"
                        name="categeory"
                        className="form-control"
                        defaultValue="0"
                        onChange={handleChangeCategory}>
                        <option value="0">Todas las Categorias</option>
                        {categorias.map((cate) => (
                          <option value={cate._id} key={cate._id}>
                            {cate.name}
                          </option>
                        ))}
                      </select>
                      <div className="input-group-append"></div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-7 col-md-6">
                  <div className="bulk-section mt-30">
                    <div className="search-by-name-input">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar Producto (codigo)"
                        onChange={handleChangeBuscarCodigo}
                      />
                    </div>
                    <div className="search-by-name-input">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar Producto (nombre)"
                        onChange={handleChangeBuscarNombre}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mt-30 mb-30">
                    <CardTable proFilter={proFiltrado} />
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
}
