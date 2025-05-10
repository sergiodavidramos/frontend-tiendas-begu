import TopNavbar from "../../components/Navbar";
import SideNav from "../../components/Navbar/SideNav";
import Footer from "../../components/Footer";
import Link from "next/link";
import Notifications, { notify } from "react-notify-toast";
import { useState, useEffect, useContext } from "react";
import UserContext from "../../components/UserContext";
import GetImg from "../../components/GetImg";
import { API_URL } from "../../components/Config";
import moment from "moment";
const Ofertas = () => {
  moment.locale("es");
  const { signOut } = useContext(UserContext);
  const [ofertas, setOfertas] = useState(false);
  function getUserAPi() {
    fetch(`${API_URL}/offers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          notify.show("Error el en servidor", "error");
        } else {
          setOfertas(data.body);
        }
      })
      .catch((error) => {
        notify.show("Error en el servidor", "error", 2000);
      });
  }
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
    getUserAPi();
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
              <h2 className="mt-30 page-title">Ofertas</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link legacyBehavior href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Ofertas</li>
              </ol>
              <div className="col-lg-12">
                <Link legacyBehavior href="/ofertas/nuevo">
                  <a className="add-btn hover-btn">Agregar Nueva Oferta</a>
                </Link>
              </div>
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Todas las ofertas</h4>
                    </div>
                    <div className="card-body-table">
                      <div className="table-responsive">
                        <table className="table ucp-table table-hover">
                          <thead>
                            <tr>
                              <th>Titulo</th>
                              <th>Descripción</th>
                              <th>Fecha</th>
                              <th>Estado</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!ofertas ? (
                              <tr>
                                <td>...</td>
                              </tr>
                            ) : (
                              ofertas.map((offer) => (
                                <tr key={offer._id}>
                                  <td>{offer.titulo}</td>
                                  <td>{offer.description}</td>
                                  <td>
                                    {offer.fecha
                                      ? moment(offer.fecha)
                                          .add(1, "days")
                                          .format("LL")
                                      : "Hasta agotar stock"}
                                  </td>
                                  <td>
                                    {offer.status ? (
                                      <span className="badge-item badge-status">
                                        Activo
                                      </span>
                                    ) : (
                                      <span className="badge-item badge-status-false">
                                        Inactivo
                                      </span>
                                    )}
                                  </td>
                                  <td className="action-btns">
                                    <Link
                                      legacyBehavior
                                      href="/ofertas/[id]"
                                      as={`/ofertas/${offer._id}`}>
                                      <a className="edit-btn" title="Edit">
                                        <i className="fas fa-edit">Editar</i>
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

export default Ofertas;
