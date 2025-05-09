import TopNavbar from "../../../components/Navbar";
import SideNav from "../../../components/Navbar/SideNav";
import Footer from "../../../components/Footer";
import Notifications, { notify } from "react-notify-toast";
import UserContext from "../../../components/UserContext";
import { useEffect, useContext, useState, useRef } from "react";
import { API_URL } from "../../../components/Config";
import CardTableInventario from "../../../components/Productos/CardTableInventario";

import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import moment from "moment";

let auxProducto = [];
const sucursalNuevo = () => {
  moment.locale("es");
  const { token, signOut } = useContext(UserContext);
  const [sucursales, setSucursales] = useState([]);
  const [sucursal, setSucursal] = useState(false);
  const [idSucursal, setIdSucursal] = useState(false);
  const [proFiltrado, setProFiltrado] = useState(null);
  const [lotesProducto, setLotesProducto] = useState(false);
  const [agregado, setAgregado] = useState(false);
  const [agregarProducto, setAgregarProducto] = useState(false);
  const [loteSelecionado, setLoteSelecionado] = useState(false);
  const [sucursalDestino, setSucursalDestino] = useState(false);

  const router = useRouter();

  let buttonDisable = false;

  function getSucursalesDB() {
    axios
      .get(`${API_URL}/sucursal/all`, {
        headers: { "Content-Type": "application/json" },
        params: { status: true },
      })
      .then((response) => {
        setSucursales(response.data.body);
      })
      .catch((err) => {
        notify.show(
          "Error el obtener los productos, comuníquese con el administrador",
          "error",
          4000
        );
      });
  }
  function getSucursalId(tokenLocal, router) {
    if (router && router.query && router.query.id) {
      const { id } = router.query;
      axios
        .get(`${API_URL}/sucursal/${id}`, {
          headers: {
            Authorization: `Bearer ${tokenLocal}`,
            "Content-Type": "application/json",
          },
        })
        .then(({ data }) => {
          if (data.status === 401) {
            signOut();
          }
          if (data.error) {
            notify.show("Error en el servidor (ciudad)", "error", 2000);
          } else {
            setSucursal(data.body);
          }
        })
        .catch((error) => {
          notify.show(error.message, "error", 2000);
        });
    }
  }
  useEffect(() => {
    const tokenLocal = localStorage.getItem("fribar-token");
    if (!tokenLocal) {
      signOut();
    } else {
      getSucursalesDB();
      setIdSucursal(router.query.id);
      getSucursalId(tokenLocal, router);
    }
  }, [router]);

  useEffect(() => {
    agregarProductoParaMover(lotesProducto);
  }, [agregarProducto]);

  async function handlerSubmit() {
    buttonDisable = true;
    let error = false;
    let movimiento = [];
    if (auxProducto.length <= 0 || !sucursalDestino)
      notify.show(
        "Seleccione al menos un producto para mover y la sucursal destino",
        "warning",
        2000
      );
    else {
      try {
        for (let producto of auxProducto) {
          if (producto.stockLotes.length <= 0) {
            movimiento.push({
              productos: producto.producto._id,
              cantidad: producto.cantidadMover,
            });
            if (!actualizarProductoInventario(producto)) {
              error = true;
              break;
            }
          } else {
            movimiento.push({
              productos: producto.producto._id,
              cantidad: producto.cantidadMover,
              numeroLote: producto.stockLotes[producto.loteSelecionado].lote
                ? producto.stockLotes[producto.loteSelecionado].lote
                    .numeroLote + sucursal.nombre
                : producto.stockLotes[producto.loteSelecionado].numeroLote +
                  sucursal.nombre,
              fechaVencimiento: producto.stockLotes[producto.loteSelecionado]
                .lote
                ? producto.stockLotes[producto.loteSelecionado].lote
                    .fechaVencimiento
                : producto.stockLotes[producto.loteSelecionado]
                    .fechaVencimiento,
            });
            if (!actualizarProductoInventario(producto)) {
              error = true;
              break;
            }
            const loteActualizado = await axios.patch(
              `${API_URL}/lotes/actualizar/stock/${
                producto.stockLotes[producto.loteSelecionado].lote
                  ? producto.stockLotes[producto.loteSelecionado].lote._id
                  : producto.stockLotes[producto.loteSelecionado]._id
              }`,
              {
                stock: -producto.cantidadMover,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            if (loteActualizado.status === 401) signOut();
            if (loteActualizado.data.error) {
              error = true;
              notify.show("Error al actualizar el Lote", "error");
              break;
            }
          }
        }
        if (!error) {
          const nuevoMovimiento = await axios.post(
            `${API_URL}/movimiento-productos`,
            {
              movimiento,
              sucursalOrigen: sucursal._id,
              sucursalDestino,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (nuevoMovimiento.status === 401) signOut();
          if (nuevoMovimiento.data.error)
            notify.show(
              "Error al registrar el producto en la sucursal",
              "error"
            );
          else {
            notify.show(
              "Se registro un movimiento con exito!",
              "success",
              2000
            );
            auxProducto = [];
            setAgregado(!agregado);
          }
        }
      } catch (err) {
        console.log("EL ERROR", err);
      }
      buttonDisable = false;
    }
    buttonDisable = false;
  }

  async function actualizarProductoInventario(producto) {
    const productoActializado = await axios.patch(
      `${API_URL}/productos/${producto.producto._id}`,
      {
        desStock: -producto.cantidadMover,
        movimiento: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (productoActializado.status === 401) {
      signOut();
      return false;
    }
    if (productoActializado.status === 200) {
      const inventarioActualizado = await axios.patch(
        `${API_URL}/inventario/actualiza-stock`,
        {
          idProducto: producto.producto._id,
          datos: {
            stockTotal: producto.stockTotal - producto.cantidadMover,
          },
          idSucursal: producto.idSucursal,
          venta: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (inventarioActualizado.status === 401) signOut();
      if (inventarioActualizado.data.error) {
        notify.show("Error al actualizar el inventario sin lote", "error");
        return false;
      }
    } else return false;
  }
  async function handlerSeleccionarSucursal() {
    if (event.target.value && event.target.value !== "0") {
      setSucursalDestino(event.target.value);
    }
  }

  const handleChangeBuscarNombre = () => {
    if (event.target.value) {
      axios
        .get(
          `${API_URL}/inventario/buscar/termino?termino=${event.target.value}&idSucursal=${idSucursal}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((data) => {
          if (data.data.error) {
            notify.show("Error el en servidor", "error");
          } else {
            let pro = [];
            for (let d of data.data.body) {
              const producto = d.producto[0];
              const stock = d.stockLotes;
              const stockTotal = d.stockTotal;
              const idSucursal = d.idSucursal;
              pro.push({
                producto: producto,
                stockLotes: stock,
                stockTotal,
                idSucursal,
              });
            }
            setProFiltrado(pro);
          }
        })
        .catch((error) => console.log("errorrr", error));
    } else {
      setProFiltrado(null);
    }
  };
  const handleChangeBuscarCodigo = () => {
    if (event.target.value) {
      axios
        .get(
          `${API_URL}/inventario/buscar/codigoproducto?code=${event.target.value}&idSucursal=${idSucursal}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((data) => {
          if (data.data.error) {
            notify.show(
              data.body || "Error en el servidor buscar por codigo",
              "error"
            );
          } else {
            if (data.data.body === null) setProFiltrado([]);
            else {
              let pro = [];
              for (let d of data.data.body) {
                const producto = d.producto[0];
                const stock = d.stockLotes;
                const stockTotal = d.stockTotal;
                const idSucursal = d.idSucursal;
                pro.push({
                  producto: producto,
                  stockLotes: stock,
                  stockTotal,
                  idSucursal,
                });
              }
              setProFiltrado(pro);
            }
          }
        })
        .catch((error) => console.log("errorrr", error));
    } else {
      setProFiltrado(null);
    }
  };
  const agregarProductoParaMover = (producto) => {
    if (producto) {
      let existe = auxProducto.filter((p) => {
        return p.producto._id === producto.producto._id;
      });
      if (existe.length <= 0) {
        auxProducto.push(producto);
        setAgregado(!agregado);
      }
    }
  };
  const handleChangeLote = () => {
    if (event.target.value && event.target.value !== "false") {
      setLoteSelecionado(parseInt(event.target.value));
    }
  };
  const hanlderCantidadProducto = (datos) => {
    auxProducto[datos.index].cantidadMover = datos.cantidad;
    if (auxProducto[datos.index].stockLotes.length > 0) {
      if (
        datos.loteSelecionado !== false &&
        datos.loteSelecionado !== "false"
      ) {
        auxProducto[datos.index].loteSelecionado = datos.loteSelecionado;
        setLoteSelecionado(false);
      } else {
        if (!Number.isFinite(auxProducto[datos.index].loteSelecionado)) {
          notify.show("Por favor seleccione un Lote", "warning");
        }
      }
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
              <h2 className="mt-30 page-title">Editar sucursal</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">Tablero</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/sucursales">Sucursales</Link>
                </li>
                <li className="breadcrumb-item active">
                  {sucursal
                    ? "Productos de la sucursal: " + sucursal.nombre
                    : "Productos de la sucursal ..."}
                </li>
              </ol>
              {sucursal ? (
                <div className="row">
                  <div className="col-lg-5 col-md-5">
                    <div className="card card-static-2 mb-30">
                      <div className="card-title-2">
                        <h4>Mover productos entre sucursales</h4>
                      </div>
                      <div className="card-body-table">
                        <div className="table-responsive">
                          <table className="table ucp-table table-hover">
                            <thead>
                              <tr>
                                <th>Nombre</th>
                                <th>Lote</th>
                                <th>Fecha de vencimiento</th>
                                <th>Stock</th>
                              </tr>
                            </thead>
                            <tbody>
                              {auxProducto.length > 0 &&
                                auxProducto.map((pro, index) => (
                                  <tr key={index}>
                                    <td>{pro.producto.name}</td>
                                    <td>
                                      <select
                                        className="form-control"
                                        defaultValue={false}
                                        onChange={handleChangeLote}>
                                        <option value={false}>
                                          Seleccione un lote
                                        </option>
                                        {pro.stockLotes.length > 0 ? (
                                          pro.stockLotes.map((l, index) => (
                                            <option value={index} key={index}>
                                              {l.lote
                                                ? l.lote.numeroLote
                                                : l.numeroLote}
                                              {" / "}
                                              Unidades:{"  "}
                                              {l.lote ? l.lote.stock : l.stock}
                                              {" / "}
                                              Vencimiento:
                                              {moment(
                                                l.lote
                                                  ? l.lote.fechaVencimiento
                                                  : l.fechaVencimiento
                                              ).format("LL")}
                                            </option>
                                          ))
                                        ) : (
                                          <option value={false}>
                                            Sin Lote
                                          </option>
                                        )}
                                      </select>
                                    </td>
                                    <td>
                                      {pro.stockLotes.length > 0
                                        ? moment(
                                            pro.stockLotes[0].lote
                                              ? pro.stockLotes[0].lote
                                                  .fechaVencimiento
                                              : pro.stockLotes[0]
                                                  .fechaVencimiento
                                          ).format("LL")
                                        : "Sin vencimiento"}
                                    </td>
                                    <td>
                                      <input
                                        type="number"
                                        style={{ width: "45px" }}
                                        min="1"
                                        defaultValue={1}
                                        onChange={() =>
                                          hanlderCantidadProducto({
                                            cantidad: event.target.value,
                                            index,
                                            loteSelecionado,
                                            // fechaCaducidadLoteSeleccionado,
                                          })
                                        }
                                      />
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="news-content-right pd-20">
                          <div className="form-group">
                            <label className="form-label" htmlFor="categeory">
                              Sucursal destino*
                            </label>
                            <select
                              id="categeory"
                              name="categeory"
                              className="form-control"
                              defaultValue={"0"}
                              onChange={handlerSeleccionarSucursal}>
                              <option value="0">
                                --Seleecionar una sucursal--
                              </option>
                              {sucursales.length > 0
                                ? sucursales.map(
                                    (su) =>
                                      idSucursal !== su._id && (
                                        <option value={su._id} key={su._id}>
                                          {su.nombre}
                                        </option>
                                      )
                                  )
                                : ""}
                            </select>
                          </div>

                          <button
                            className="save-btn hover-btn"
                            type="submit"
                            onClick={handlerSubmit}
                            disabled={buttonDisable}>
                            Registrar movimiento de productos
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-7 col-md-7">
                    <div className="all-cate-tags">
                      <div className="row justify-content-between">
                        <div className="col-lg-6 col-md-5">
                          <div className="bulk-section mt-30">
                            <div className="search-by-name-input">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar Producto (nombre)"
                                onChange={handleChangeBuscarNombre}
                                name="buscar nombre"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-7">
                          <div className="bulk-section mt-30">
                            <div className="search-by-name-input">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar Producto (codigo)"
                                onChange={handleChangeBuscarCodigo}
                                name="buscar codigo"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-12 col-md-12">
                          <div className="card card-static-2 mb-30">
                            <div className="card-title-2">
                              <h4>
                                Todos los productos de la Sucursal ({" "}
                                {sucursal
                                  ? sucursal.nombre
                                  : "...SELECCIONE UNA SUCURSAL"}
                                )
                              </h4>
                            </div>
                            <CardTableInventario
                              proFilter={proFiltrado}
                              idSucursal={sucursal._id}
                              token={token}
                              setLotesProducto={setLotesProducto}
                              setAgregarProducto={setAgregarProducto}
                              agregarProducto={agregarProducto}
                            />
                          </div>
                        </div>
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

export default sucursalNuevo;
