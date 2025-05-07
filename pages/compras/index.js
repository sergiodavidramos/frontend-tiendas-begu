import TopNavbar from "../../components/Navbar";
import SideNav from "../../components/Navbar/SideNav";
import Footer from "../../components/Footer";
import Notifications, { notify } from "react-notify-toast";
import Link from "next/link";
import { useState, useRef, useEffect, useContext } from "react";
import FilaCompra from "../../components/Compras/FilaCompra";
import UserContext from "../../components/UserContext";
import { API_URL } from "../../components/Config";
import ConfirmacionModel from "../../components/Venta/modelConfirmarVenta";
import expectedRound from "expected-round";
import FormularioAgregarProducto from "../../components/Productos/FormularioAgregarProducto";
import BuscarProveedor from "../../components/Compras/BuscarProveedor";
import moment from "moment";

const Compras = ({ categorias, marcas }) => {
  moment.locale("es");
  const [productFilter, setProductFilter] = useState([]);
  const [buscarText, setBuscarText] = useState("");
  const textBusqueda = useRef();
  const [total, setTotal] = useState(0);

  const { getAdmSucursal, token, signOut } = useContext(UserContext);

  const efectivo = useRef(0);
  const numeroFactura = useRef(null);
  const inputRef = useRef(null);

  const [sucursal, setSucursal] = useState(false);
  const [gerente, setGerente] = useState(false);
  const [focus, setfocus] = useState(false);
  const [totalCambio, setTotalCambio] = useState(0);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [idProveedor, setIdProveedor] = useState(false);

  const [butt, setButt] = useState(false);

  useEffect(() => {
    if (focus) textBusqueda.current.focus();
    setfocus(false);
    getSucursalId(token, getAdmSucursal);
    const user = JSON.parse(localStorage.getItem("fribar-user"));
    if (user)
      user.role === "GERENTE-ROLE" ? setGerente(true) : setGerente(false);
  }, [token, getAdmSucursal, focus]);
  const handlerChange = (event) => {
    setBuscarText(event.target.value);
    if (
      event.target.value.length === 6 ||
      event.target.value.length === 13 ||
      event.target.value.length === 12 ||
      event.target.value.length === 11 ||
      event.target.value.length === 8
    ) {
      fetch(`${API_URL}/productos/codigoproducto?code=${event.target.value}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            notify.show(data.body, "error");
            setBuscarText("");
          } else {
            if (data.body !== null) {
              setMostrarFormulario(false);
              setBuscarText("");
              if (productFilter.length > 0) {
                arrayHandlerProduct(data.body);
              } else {
                let pro = data.body;
                pro.cantidad = 1;
                pro.lote = false;
                setProductFilter([pro]);
                notify.show(`Producto Agregado`, "success", 1000);
                setTotal(pro.cantidad * pro.precioCompra);
              }
            } else {
              setBuscarText("");
              setMostrarFormulario(true);
            }
          }
        })
        .catch((err) => console.log("Errorrrrr", err));
    }
  };

  const arrayHandlerProduct = (pro) => {
    let a = false;
    let aux;
    for (let i = 0; i < productFilter.length; i++) {
      if (productFilter[i].code === pro.code) {
        productFilter[i].cantidad = productFilter[i].cantidad + 1;
        aux = productFilter;
        setProductFilter([]);
        a = true;
        setProductFilter(aux);
        handlerTotal();
        notify.show(`Se sumo la cantidad " ${aux[i].name} "`, "success", 1000);
      }
    }
    if (!a) {
      pro.cantidad = 1;
      pro.lote = false;
      setProductFilter(productFilter.concat([pro]));
      notify.show(`Producto Agregado`, "success", 1000);
      setTotal((parseFloat(total) + pro.precioCompra * 1).toFixed(2));
    }
  };

  const setCantidad = (index, can) => {
    let aux;
    can < 0
      ? (productFilter[index].cantidad = 0)
      : (productFilter[index].cantidad = parseFloat(can));
    aux = productFilter;
    setProductFilter([]);
    setProductFilter(aux);
    handlerTotal();
  };
  const actualizarPrecioCompra = (index, can) => {
    let aux;
    can < 0
      ? (productFilter[index].precioCompra = 0)
      : (productFilter[index].precioCompra = parseFloat(can).toFixed(2));
    aux = productFilter;
    setProductFilter([]);
    setProductFilter(aux);
    handlerTotal();
  };
  const actualizarPrecioVenta = (index, can) => {
    let aux;
    can < 0
      ? (productFilter[index].precioVenta = 0)
      : (productFilter[index].precioVenta = parseFloat(can).toFixed(2));
    aux = productFilter;
    setProductFilter([]);
    setProductFilter(aux);
  };
  const actualizarTieneLote = (index, valor) => {
    valor
      ? (productFilter[index].lote = true)
      : (productFilter[index].lote = false);
  };
  const actualizarNumeroLote = (index, valor) => {
    productFilter[index].numeroLote = valor;
  };
  const actualizarFechaVencimiento = (index, valor) => {
    productFilter[index].fechaVencimientoLote = valor;
  };

  const handlerTotal = () => {
    let auxTotal = 0;
    for (let j = 0; j < productFilter.length; j++) {
      auxTotal =
        auxTotal + productFilter[j].cantidad * productFilter[j].precioCompra;
    }
    setTotal(auxTotal.toFixed(2));
  };

  const deleteProduct = (index) => {
    productFilter.splice(index, 1);
    let aux = productFilter;
    setProductFilter([]);
    setProductFilter(aux);
    handlerTotal();
  };

  function getSucursalId(tokenLocal, idSucursal) {
    if (tokenLocal && idSucursal) {
      fetch(`${API_URL}/sucursal/${idSucursal}`, {
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
            notify.show("Por favor Seleccione una Sucursal", "error", 2000);
          } else {
            setSucursal(data.body);
          }
        })
        .catch((error) => {
          notify.show(error.message, "error", 2000);
        });
    }
  }

  const handlerCalcularCambio = () => {
    if (efectivo.current.value)
      setTotalCambio(
        (parseFloat(efectivo.current.value) - parseFloat(total)).toFixed(2)
      );
    else setTotalCambio(0);
  };
  function confirmarCompra() {
    if (
      !idProveedor ||
      !numeroFactura.current.value ||
      !numeroFactura.current.value === "" ||
      productFilter <= 0
    )
      return notify.show("Todos los datos son necesarios", "warning");
    if (!efectivo.current.value || !efectivo.current.value === "")
      return notify.show(
        "Por favor asigne la cantidad de efectivo pagado por la compra",
        "warning"
      );
    let detalle = [];
    for (let producto of productFilter) {
      delete producto.detail;
      const auxDetalle = {
        producto: producto._id,
        cantidad: producto.cantidad,
        idSucursal: sucursal._id,
      };
      if (producto.lote) auxDetalle.numeroLote = producto.numeroLote;
      detalle.push(auxDetalle);
    }
    var compra = {
      detalleCompra: detalle,
      proveedor: idProveedor,
      sucursal: sucursal._id,
      efectivo: efectivo.current.value,
      infoProductos: productFilter,
      numeroFacturaCompra: numeroFactura.current.value,
      proveedor: idProveedor,
    };
    setButt(true);
    fetch(`${API_URL}/compras`, {
      method: "POST",
      body: JSON.stringify(compra),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((datos) => {
        if (datos.status === 401) signOut();
        return datos.json();
      })
      .then((data) => {
        if (data.error) {
          console.log(data);
          notify.show("Error al registrar la compra", "error");
          setButt(false);
        } else {
          setButt(false);
          notify.show("Compra registrada con exito", "success");
          setProductFilter([]);
          setTotal(0);
          setTotalCambio(0);
          efectivo.current.value = "";
          numeroFactura.current.value = "";
          inputRef.current.value = "";
        }
      })
      .catch((error) => {
        setButt(false);
        notify.show(error.message, "error", 2000);
      });
  }

  return (
    <>
      <ConfirmacionModel
        confirmar={confirmarCompra}
        titulo={"¿Confirmar la Compra?"}
      />
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: "56px" }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Compras</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">
                  Compras de la sucursal ""
                  {sucursal.nombre ? sucursal.nombre.toUpperCase() : ""}""
                </li>
              </ol>
              {gerente === true && (sucursal === false || sucursal === "0") ? (
                <h4>'PORFAVOR SELECCIONE UNA SUCURSAL'</h4>
              ) : (
                <div className="row justify-content-between">
                  <div className="col-lg-12 col-md-12">
                    <div className="card card-static-2 mb-30">
                      <div className="row justify-content-center">
                        <div className="search-by-name-input">
                          <input
                            ref={textBusqueda}
                            value={buscarText}
                            type="text"
                            className="form-control"
                            placeholder="Buscar Producto"
                            onChange={handlerChange}
                          />
                        </div>
                      </div>
                    </div>
                    {mostrarFormulario && (
                      <FormularioAgregarProducto
                        categorias={categorias}
                        marcas={marcas}
                        desabilitarStock={true}
                        setMostrarFormulario={setMostrarFormulario}
                      />
                    )}
                    <div className="card-body-table">
                      <div className="table-responsive">
                        <table className="table ucp-table table-hover">
                          <thead>
                            <tr>
                              <th>Cantidad/Stock</th>
                              <th>Nombre</th>
                              <th>Precio Compra</th>
                              <th>Sub total</th>
                              <th>Precio venta</th>
                              <th>Tiene lote</th>
                              <th>Numero Lote</th>
                              <th>Fecha Vencimiento</th>
                              <th>Eliminar</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!productFilter ? (
                              <tr>
                                <td>...</td>
                              </tr>
                            ) : (
                              productFilter.map((pro, index) => (
                                <FilaCompra
                                  key={index}
                                  pro={pro}
                                  setCantidad={setCantidad}
                                  index={index}
                                  deleteProduct={deleteProduct}
                                  setfocus={setfocus}
                                  actualizarPrecioCompra={
                                    actualizarPrecioCompra
                                  }
                                  actualizarPrecioVenta={actualizarPrecioVenta}
                                  actualizarTieneLote={actualizarTieneLote}
                                  actualizarNumeroLote={actualizarNumeroLote}
                                  actualizarFechaVencimiento={
                                    actualizarFechaVencimiento
                                  }
                                />
                              ))
                            )}
                          </tbody>
                        </table>

                        <div className="col-lg-12 col-md-7">
                          <div className="all-cate-tags">
                            <div
                              className="row justify-content-between mt-30"
                              style={{ marginBottom: "10px" }}>
                              <div className="col-lg-3 col-md-5">
                                <div className="bulk-section mt-20">
                                  <div className="order-total-left-text fsz-18">
                                    Total
                                  </div>
                                  <div className="order-total-right-text fsz-18">
                                    {total} Bs
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-5">
                                <div className="bulk-section ">
                                  <div className="search-by-name-input">
                                    <input
                                      ref={efectivo}
                                      type="number"
                                      className="form-control"
                                      placeholder="Ingrese el efectivo Cancelado"
                                      onChange={handlerCalcularCambio}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-2 col-md-5">
                                <div className="bulk-section ">
                                  <div className="order-total-left-text fsz-18">
                                    Cambio
                                  </div>
                                  <div className="order-total-right-text fsz-18">
                                    {totalCambio} Bs
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-12 col-md-12">
              <div className="card card-static-2 mb-30">
                <div className="card-title-2">
                  <h4>Datos para la compra</h4>
                </div>
                <div className="card-body-table">
                  <div className="news-content-right pd-20">
                    <div className="row">
                      <div className="col-lg-4">
                        <div className="form-group mb-3">
                          <label className="form-label">
                            Numero de factura
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            ref={numeroFactura}
                            placeholder="Ingrese el nuemro de factura del lote"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-title-2">
                  <h4>Buscar proveedor</h4>
                </div>
                <div className="card-body-table">
                  <div className="news-content-right pd-20">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group mb-3">
                          <label className="form-label">
                            Buscar por nombre
                          </label>
                          <BuscarProveedor
                            token={token}
                            setIdProveedor={setIdProveedor}
                            inputRef={inputRef}
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-12">
                        <button
                          data-toggle="modal"
                          data-target="#confirmacion_model"
                          className="save-btn hover-btn"
                          type="submit"
                          disabled={butt}>
                          Confirmar la Compra
                        </button>
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
export async function getStaticProps() {
  try {
    const res = await fetch(`${API_URL}/categoria?status=true`);
    const categorias = await res.json();
    const mar = await fetch(`${API_URL}/proveedor/all?status=true`);
    const marcas = await mar.json();

    return {
      props: {
        categorias,
        marcas,
      },
      revalidate: 1,
    };
  } catch (err) {
    const categorias = { error: true };
    const marcas = { error: true };

    return {
      props: {
        categorias,
        marcas,
      },
      revalidate: 1,
    };
  }
}
export default Compras;
