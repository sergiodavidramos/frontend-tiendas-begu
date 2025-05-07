import Notifications, { notify } from "react-notify-toast";
import TopNavbar from "../../components/Navbar";
import SideNav from "../../components/Navbar/SideNav";
import Footer from "../../components/Footer";
import Link from "next/link";
import TablaListaCompra from "../../components/Compras/TablaListaCompra";
import { useContext, useRef, useState } from "react";
import UserContext from "../../components/UserContext";
import { API_URL } from "../../components/Config";
import moment from "moment";
const ComprasLista = () => {
  moment.locale("es");
  const { getAdmSucursal, signOut, token, user } = useContext(UserContext);
  const [compras, setCompras] = useState([]);

  const inputFechaInicio = useRef(null);
  const inputFechaFin = useRef(null);

  async function handlerFiltrarFecha() {
    if (
      inputFechaFin.current.value === "" &&
      inputFechaInicio.current.value === ""
    )
      notify.show("Por favor seleccione un rango de fecha", "warning");
    else {
      if (user) {
        const res = await fetch(
          `${API_URL}/compras/reporte/egresos/${
            user.idSucursal
          }?fechaInicio=${moment(inputFechaInicio.current.value).format(
            "YYYY/MM/DD"
          )}&fechaFin=${moment(inputFechaFin.current.value).format(
            "YYYY/MM/DD"
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 401) signOut();
        const resCompras = await res.json();
        if (resCompras.error) {
          console.log("Error>>>>", resCompras);
          notify.show("Error al mostrar los pedidos", "error");
        } else {
          setCompras(resCompras.body);
        }
      }
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
              <h2 className="mt-30 page-title">Lista de Compras</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">
                  Lsita de compras anteriores
                </li>
              </ol>
              <div className="row justify-content-between">
                <div className="col-lg-6 col-md-4">
                  <div className="bulk-section mb-25">
                    <div className="form-group mr-auto">
                      <label className="form-label">Fecha Inicio</label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Fecha incio"
                        defaultValue={moment().format("DD/MM/YYYY")}
                        ref={inputFechaInicio}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Fecha Fin</label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Fecha fin"
                        defaultValue={moment().format("DD/MM/YYYY")}
                        ref={inputFechaFin}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="bulk-section mb-30 justify-content-center">
                    <div className="input-group-append">
                      <button
                        className="status-btn hover-btn"
                        type="submit"
                        onClick={handlerFiltrarFecha}>
                        Filtrar por fecha
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Todas las Compras</h4>
                    </div>
                    {getAdmSucursal === "false" ||
                    getAdmSucursal === "0" ||
                    getAdmSucursal === false ? (
                      <h4>Por favor selecione una sucursal</h4>
                    ) : (
                      <TablaListaCompra compras={compras} />
                    )}
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
export default ComprasLista;
