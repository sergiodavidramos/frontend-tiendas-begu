import TopNavbar from "../../components/Navbar";
import SideNav from "../../components/Navbar/SideNav";
import Footer from "../../components/Footer";
import ReactPaginate from "react-paginate";
import Link from "next/link";
import Notifications, { notify } from "react-notify-toast";
import { useState, useEffect, useContext } from "react";
import UserContext from "../../components/UserContext";
import Model from "../../components/Model";
import GetImg from "../../components/GetImg";
import { API_URL } from "../../components/Config";
const Clientes = () => {
  const [token, setToken] = useState(false);
  const { signOut } = useContext(UserContext);
  const [clientes, setClientes] = useState([]);
  const [clientFilter, setClientFilter] = useState(null);
  const [pageState, setPageState] = useState(0);
  const [count, setCount] = useState(0);
  const [idEliminarCliente, setidEliminarCliente] = useState(null);
  async function paginationHandler(page) {
    setPageState(page.selected);
  }
  function getUserAPi(tokenLocal) {
    fetch(`${API_URL}/user?desde=${pageState * 10}&limite=${10}`, {
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
          notify.show("Error el en servidor", "error");
        } else {
          setClientes(data.body[0]);
          setCount(data.body[1]);
        }
      })
      .catch((error) => notify.show("Error en el servidor", "error", 2000));
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
    setToken(tokenLocal);
    if (!clientFilter) {
      getUserAPi(tokenLocal);
    } else {
      setClientes(clientFilter);
      setCount(0);
    }
  }, [clientFilter, pageState]);
  function handlerDelete(id) {
    setidEliminarCliente(id);
  }
  function handleChangeClientes() {
    if (event.target.value !== "0") {
      fetch(
        `${API_URL}/user?desde=${pageState * 10}&limite=${10}&state=${
          event.target.value
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (res.status === 401) {
            signOut();
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            notify.show("Error el en servidor", "error");
          } else {
            setClientes(data.body[0]);
            setCount(data.body[1]);
          }
        })
        .catch((error) => notify.show("Error en el servidor", "error", 2000));
    } else {
      getUserAPi(token);
      setClientFilter(null);
    }
  }
  function handlerSubmit() {
    event.preventDefault();
    if (event.target[0].value !== "") {
      fetch(`${API_URL}/user/buscar/${event.target[0].value}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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
            notify.show("Error el en servidor", "error");
          } else {
            setClientes(data.body);
            setCount(0);
          }
        })
        .catch((error) => notify.show("Error en el servidor", "error", 2000));
    } else {
      getUserAPi(token);
    }
  }
  return (
    <>
      <Model id={idEliminarCliente} token={token} notify={notify} />
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
                <li className="breadcrumb-item active">Clientes</li>
              </ol>
              <div className="row justify-content-between">
                <div className="col-lg-4 col-md-4">
                  <div className="bulk-section mt-30">
                    <div className="input-group">
                      <select
                        id="action"
                        name="action"
                        className="form-control"
                        defaultValue="0"
                        onChange={handleChangeClientes}>
                        <option value="0">Todos los Clientes</option>
                        <option value={true}>Activos</option>
                        <option value={false}>Inactivos</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-6">
                  <form onSubmit={handlerSubmit}>
                    <div className="bulk-section mt-30">
                      <div className="search-by-name-input">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Buscar"
                        />
                      </div>
                      <div className="input-group-append">
                        <button className="status-btn hover-btn" type="submit">
                          Buscar cliente
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Todos los clientes</h4>
                    </div>
                    <div className="card-body-table">
                      <div className="table-responsive">
                        <table className="table ucp-table table-hover">
                          <thead>
                            <tr>
                              <th style={{ width: "60px" }}>ID</th>
                              <th style={{ width: "100px" }}>Imagen</th>
                              <th>Nombre</th>
                              <th>Email</th>
                              <th>Telefono</th>
                              <th>Estado</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {clientes.length <= 0 ? (
                              <tr>
                                <td>...</td>
                              </tr>
                            ) : (
                              clientes.map((cli) => (
                                <tr key={cli._id}>
                                  <td>{cli._id}</td>
                                  <td>
                                    <div className="cate-img-6">
                                      <img
                                        src={GetImg(
                                          cli.img,
                                          `${API_URL}/upload/user`
                                        )}
                                        alt="cliente-fribar"
                                      />
                                    </div>
                                  </td>
                                  <td>{cli.idPersona.nombre_comp}</td>
                                  <td>{cli.email}</td>
                                  <td>{cli.phone}</td>
                                  <td>
                                    {cli.status ? (
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
                                      href="/clientes/[id]"
                                      as={`/clientes/${cli._id}`}>
                                      <a className="view-shop-btn" title="View">
                                        <i className="fas fa-eye"></i>
                                      </a>
                                    </Link>
                                    <Link
                                      legacyBehavior
                                      href="/clientes/editar/[id]"
                                      as={`/clientes/editar/${cli._id}`}>
                                      <a className="edit-btn" title="Edit">
                                        <i className="fas fa-edit"></i>
                                      </a>
                                    </Link>
                                    <a
                                      className="delete-btn"
                                      title="Edit"
                                      data-toggle="modal"
                                      data-target="#category_model"
                                      onClick={() => handlerDelete(cli._id)}>
                                      <i className="fas fa-trash-alt"></i>
                                    </a>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                        <div className="pages">
                          <ReactPaginate
                            previousLabel={"Anterior"}
                            nextLabel={"Siguiente"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            activeClassName={"active-page"}
                            containerClassName={"pagination"}
                            initialPage={0}
                            pageCount={count / 10}
                            marginPagesDisplayed={3}
                            pageRangeDisplayed={5}
                            onPageChange={paginationHandler}
                          />
                        </div>
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

export default Clientes;
