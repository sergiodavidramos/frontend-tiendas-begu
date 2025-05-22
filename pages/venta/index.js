"use client";
import TopNavbar from "../../components/Navbar";
import SideNav from "../../components/Navbar/SideNav";
import Footer from "../../components/Footer";
import Notifications, { notify } from "react-notify-toast";
import Link from "next/link";
import { useState, useRef, useEffect, useContext } from "react";
import FilaVenta from "../../components/Venta/FilaVenta";
import UserContext from "../../components/UserContext";
import { API_URL } from "../../components/Config";
import ConfirmacionModel from "../../components/Venta/modelConfirmarVenta";
import expectedRound, { floor10 } from "expected-round";
import BuscarProducto from "../../components/Venta/BuscarProductoNombre";

const Venta = () => {
  const [productFilter, setProductFilter] = useState([]);
  const [buscarText, setBuscarText] = useState("");
  const textBusqueda = useRef();
  const [total, setTotal] = useState(0);

  const { getAdmSucursal, token, signOut } = useContext(UserContext);

  let auxTotal = 0;

  const [desactivarInput, setdesactivarInput] = useState(true);

  const nombreCliente = useRef(false);
  const ciCliente = useRef(false);
  const efectivo = useRef(0);
  const botonConfirmarVenta = useRef(null);

  const inputRef = useRef(null);

  const [idCliente, setIdCliente] = useState(false);
  const [sucursal, setSucursal] = useState(false);
  const [gerente, setGerente] = useState(false);
  const [totalCambio, setTotalCambio] = useState(0);
  const [buscarPorNombre, setBuscarPorNombre] = useState(false);
  const [autocompleteState, setAutocompleteState] = useState({
    collections: [],
    isOpen: false,
  });
  const [puntosAcumulados, setPuntosAcumulados] = useState(0);

  const [butt, setButt] = useState(false);

  useEffect(() => {
    if (textBusqueda.current) textBusqueda.current.focus();
    getSucursalId(token, getAdmSucursal);
    const user = JSON.parse(localStorage.getItem("fribar-user"));
    if (user)
      user.role === "GERENTE-ROLE" ? setGerente(true) : setGerente(false);
  }, [token, getAdmSucursal]);

  const handlerChange = (event) => {
    setBuscarText(event.target.value);
    if (
      event.target.value.length === 6 ||
      event.target.value.length >= 12 ||
      event.target.value.length === 11 ||
      event.target.value.length === 8
    ) {
      fetch(
        `${API_URL}/inventario/buscar/codigoProducto?code=${event.target.value}&idSucursal=${getAdmSucursal}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.error) notify.show(data.body, "error");
          else {
            if (data.body !== null) {
              setBuscarText("");
              if (productFilter.length > 0) {
                let pro = {};
                for (let d of data.body) {
                  const producto = d.producto[0];
                  const categoria = d.category[0];
                  producto.category = categoria;
                  producto.stock = d.stockTotal;
                  pro = { producto };
                }
                arrayHandlerProduct(pro);
              } else {
                let pro = {};
                for (let d of data.body) {
                  const producto = d.producto[0];
                  const categoria = d.category[0];
                  producto.category = categoria;
                  producto.stock = d.stockTotal;
                  //   pro.push({ producto })
                  pro = { producto };
                }

                pro.producto.cantidad = 1;
                setProductFilter([pro.producto]);
                notify.show(`Producto Agregado`, "success", 900);
                const precioConDescuento =
                  pro.producto.precioVenta -
                  (pro.producto.descuento * pro.producto.precioVenta) / 100;
                setTotal(
                  pro.producto.descuento > 0
                    ? (
                        pro.producto.cantidad *
                        expectedRound.round10(precioConDescuento, -1)
                      ).toFixed(2)
                    : pro.producto.cantidad * pro.producto.precioVenta
                );
                setPuntosAcumulados(
                  pro.producto.descuento > 0
                    ? floor10(
                        (pro.producto.cantidad *
                          expectedRound.round10(precioConDescuento, -1)) /
                          10
                      )
                    : floor10(
                        (pro.producto.cantidad * pro.producto.precioVenta) / 10
                      )
                );
              }
            } else setBuscarText("");
          }
        })
        .catch((err) => console.log("Errorrrrr", err));
    }
  };

  const arrayHandlerProduct = (pro) => {
    let a = false;
    let aux;
    for (let i = 0; i < productFilter.length; i++) {
      if (productFilter[i].code === pro.producto.code) {
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
      pro.producto.cantidad = 1;
      setProductFilter(productFilter.concat([pro.producto]));
      notify.show(`Producto Agregado`, "success", 1000);
      const precioConDescuento =
        pro.producto.precioVenta -
        (pro.producto.descuento * pro.producto.precioVenta) / 100;
      setTotal(
        pro.producto.descuento > 0
          ? (
              parseFloat(total) + expectedRound.round10(precioConDescuento, -1)
            ).toFixed(2)
          : (parseFloat(total) + pro.producto.precioVenta * 1).toFixed(2)
      );
      setPuntosAcumulados(
        pro.producto.descuento > 0
          ? floor10(
              parseFloat(total) +
                expectedRound.round10(precioConDescuento, -1) / 10
            )
          : floor10((parseFloat(total) + pro.producto.precioVenta * 1) / 10)
      );
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

  const handlerTotal = () => {
    for (let j = 0; j < productFilter.length; j++) {
      if (productFilter[j].descuento > 0) {
        const precioConDescuento =
          productFilter[j].precioVenta -
          (productFilter[j].descuento * productFilter[j].precioVenta) / 100;
        auxTotal =
          auxTotal +
          productFilter[j].cantidad *
            expectedRound.round10(precioConDescuento, -1);
      } else {
        auxTotal =
          auxTotal + productFilter[j].cantidad * productFilter[j].precioVenta;
      }
    }
    setTotal(expectedRound.round10(auxTotal, -1).toFixed(2));
    setPuntosAcumulados(floor10(expectedRound.round10(auxTotal, -1) / 10));
  };

  const deleteProduct = (index) => {
    productFilter.splice(index, 1);
    let aux = productFilter;
    setProductFilter([]);
    setProductFilter(aux);
    handlerTotal();
  };
  const handlerBuscarCi = (event) => {
    const tokenLocal = localStorage.getItem("fribar-token");
    fetch(`${API_URL}/person?ci=${event.target.value}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenLocal}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) signOut();
        return res.json();
      })
      .then((data) => {
        if (data.error) notify.show(data.body.message, "error");
        else {
          if (data.body.persons.length > 0) {
            setdesactivarInput(true);
            nombreCliente.current.value = `${data.body.persons[0].nombre_comp} 
             Puntos acumulados: ${data.body.persons[0].puntos}`;
            setIdCliente({
              id: data.body.persons[0]._id,
              nombre: data.body.persons[0].nombre_comp,
              ci: data.body.persons[0].ci,
            });
          } else {
            setIdCliente(false);
            nombreCliente.current.value = null;
            setdesactivarInput(false);
          }
        }
      })
      .catch((error) => console.log("errorrr", error));
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
  function confirmarVenta() {
    let detalle = [];
    if (productFilter.length <= 0) {
      notify.show(
        "Por favor ingrese almenos un producto para vender",
        "warning"
      );
      textBusqueda.current.focus();
      return;
    }
    if (!efectivo.current.value) {
      efectivo.current.value = total;
      //   notify.show(
      //     "Por favor el efectivo cancelado por en cliente es necesario",
      //     "warning"
      //   );
      //   textBusqueda.current.focus();
      //   return;
    }
    for (let producto of productFilter) {
      const precioConDescuento =
        producto.precioVenta -
        (producto.descuento * producto.precioVenta) / 100;
      const auxDetalle = {
        producto: producto._id,
        nombreProducto: producto.name,
        cantidad: producto.cantidad,
        subTotal:
          producto.descuento > 0
            ? (
                producto.cantidad *
                expectedRound.round10(precioConDescuento, -1)
              ).toFixed(2)
            : producto.cantidad * producto.precioVenta,
        tipoVenta: producto.tipoVenta,
        precioVenta: producto.precioVenta,
        descuento: producto.descuento,
        idSucursal: sucursal._id,
      };
      detalle.push(auxDetalle);
    }
    var venta = {
      detalleVenta: detalle,
      sucursal,
      efectivo: efectivo.current.value,
    };
    if (idCliente) venta.client = idCliente;
    if (!idCliente) {
      setButt(true);
      if (!nombreCliente.current.value || !ciCliente.current.value) {
        notify.show(
          "Por favor ingrese el nombre y c.i. del cliente",
          "warning",
          5000
        );
        setButt(false);
      } else
        fetch(`${API_URL}/person`, {
          method: "POST",
          body: JSON.stringify({
            nombre_comp: nombreCliente.current.value,
            ci: ciCliente.current.value,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.error) {
              notify.show(response.body, "error", 5000);
            } else {
              setIdCliente({
                id: response.body._id,
                nombre: response.body.nombre_comp,
                ci: response.body.ci,
              });
              venta.client = {
                id: response.body._id,
                nombre: response.body.nombre_comp,
                ci: response.body.ci,
              };

              fetch(`${API_URL}/venta`, {
                method: "POST",
                body: JSON.stringify(venta),
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              })
                .then(async (res) => ({
                  blob: await res.blob(),
                }))
                .then((resObj) => {
                  notify.show("Venta realizada con exito!", "success", 2000);
                  // It is necessary to create a new blob object with mime-type explicitly set for all browsers except Chrome, but it works for Chrome too.
                  const newBlob = new Blob([resObj.blob], {
                    type: "application/pdf",
                  });
                  // MS Edge and IE don't allow using a blob object directly as link href, instead it is necessary to use msSaveOrOpenBlob
                  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(newBlob);
                  } else {
                    setButt(false);
                    // For other browsers: create a link pointing to the ObjectURL containing the blob.
                    const objUrl = window.URL.createObjectURL(newBlob);

                    const windowFeatures =
                      "left=100,top=100,width=320,height=900";
                    var win = window.open(objUrl, "mozillaTab", windowFeatures);
                  }
                  setProductFilter([]);
                  setTotal(0);
                  setTotalCambio(0);
                  setPuntosAcumulados(0);
                  efectivo.current.value = "";
                  nombreCliente.current.value = "";
                  ciCliente.current.value = "";
                  setIdCliente(false);
                  textBusqueda.current.focus();
                })
                .catch((err) => {
                  console.log("Sergio Error Primero", err);
                  notify.show(
                    "No se pudo registrar la venta error (servidor)",
                    "error"
                  );
                  setButt(false);
                });
            }
          })
          .catch((err) => console.log("Sergio Error", err));
    } else {
      setButt(true);
      fetch(`${API_URL}/venta`, {
        method: "POST",
        body: JSON.stringify(venta),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => ({
          blob: await res.blob(),
        }))
        .then((resObj) => {
          notify.show("Venta realizada con exito!", "success", 2000);
          // It is necessary to create a new blob object with mime-type explicitly set for all browsers except Chrome, but it works for Chrome too.
          const newBlob = new Blob([resObj.blob], {
            type: "application/pdf",
          });
          // MS Edge and IE don't allow using a blob object directly as link href, instead it is necessary to use msSaveOrOpenBlob
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
          } else {
            setButt(false);
            // For other browsers: create a link pointing to the ObjectURL containing the blob.
            const objUrl = window.URL.createObjectURL(newBlob);

            const windowFeatures = "left=100,top=100,width=320,height=900";
            var win = window.open(objUrl, "mozillaTab", windowFeatures);
          }
          setProductFilter([]);
          setTotal(0);
          setTotalCambio(0);
          setPuntosAcumulados(0);
          efectivo.current.value = "";
          nombreCliente.current.value = "";
          ciCliente.current.value = "";
          setIdCliente(false);
        })
        .catch((err) => {
          console.log("Sergio Error Segundo", err);
          notify.show(
            "No se pudo registrar la venta error (servidor)",
            "error"
          );
          setButt(false);
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

  function escucharTeclado(event) {
    var codigo = event.key;
    if (event.keyCode === 9) {
      //   console.log(event.keyCode);
      //   inputCantidad.current.focus();
    }
    if (codigo === "F9") {
      textBusqueda.current.focus();
    }
    if (codigo === "F10") {
      efectivo.current.focus();
    }
    if (codigo === "F11") {
      ciCliente.current.focus();
    }
    if (codigo === "Enter") {
      botonConfirmarVenta.current.click();
    }
  }
  async function handlerSearch() {
    if (event.target.value && token && event.target.value.length > 0) {
      const u = await fetch(
        `${API_URL}/productos/buscar/${event.target.value}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.error) notify.show(data.body, "error");
          else {
            if (data.body.length > 0) {
              setAutocompleteState({
                collections: data.body,
                isOpen: true,
              });
            } else
              setAutocompleteState({
                collections: data.body,
                isOpen: false,
              });
          }
        })
        .catch((err) => console.log("Error al buscar producto", err));
    } else {
      setAutocompleteState({
        collections: [],
        isOpen: false,
      });
    }
  }
  function handlerClick(producto) {
    inputRef.current.value = "";
    setAutocompleteState({ isOpen: false });
    if (productFilter.length > 0) {
      arrayHandlerProduct({ producto });
    } else {
      let pro = { producto };
      pro.producto.cantidad = 1;
      setProductFilter([pro.producto]);
      notify.show(`Producto Agregado`, "success", 900);
      const precioConDescuento =
        pro.producto.precioVenta -
        (pro.producto.descuento * pro.producto.precioVenta) / 100;
      setTotal(
        pro.producto.descuento > 0
          ? (
              pro.producto.cantidad *
              expectedRound.round10(precioConDescuento, -1)
            ).toFixed(2)
          : pro.producto.cantidad * pro.producto.precioVenta
      );
    }
  }
  return (
    <>
      <ConfirmacionModel
        confirmar={confirmarVenta}
        titulo={"¿Confirmar la Venta?"}
      />
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: "56px" }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Venta</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">Tablero</Link>
                </li>
                <li className="breadcrumb-item active">
                  Ventas de la sucursal ""
                  {sucursal.nombre ? sucursal.nombre.toUpperCase() : ""}""
                </li>
              </ol>
              {gerente === true && (sucursal === false || sucursal === "0") ? (
                <h4>'PORFAVOR SELECCIONE UNA SUCURSAL'</h4>
              ) : (
                <div className="row justify-content-between">
                  <div className="col-lg-12 col-md-12">
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="customCheck1"
                        onChange={(e) => {
                          setBuscarPorNombre(e.target.checked);
                        }}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customCheck1">
                        Buscar por nombre
                      </label>
                    </div>
                    <div className="card card-static-2 mb-30">
                      <div className="row justify-content-center">
                        <div className="search-by-name-input">
                          <input
                            ref={textBusqueda}
                            value={buscarText}
                            type="text"
                            className=""
                            placeholder="Buscar Producto por codigo"
                            onChange={handlerChange}
                            onKeyDown={escucharTeclado}
                            style={{
                              border: "1px solid transparent",
                              backgroundColor: "#f1f1f1",
                              padding: "10px",
                              fontSize: "16px",
                              width: "100%",
                            }}
                          />
                        </div>

                        {buscarPorNombre ? (
                          <div className="search-by-name-input">
                            <div
                              className="autocomplete"
                              style={{ width: "100%" }}>
                              <input
                                ref={inputRef}
                                id="myInput"
                                type="text"
                                name="myAdmin"
                                placeholder="Buscar Producto por Nombre"
                                onChange={handlerSearch}
                                autoComplete="off"
                              />
                              {autocompleteState.isOpen && (
                                <div
                                  id="myInputautocomplete-list"
                                  className="autocomplete-items">
                                  {autocompleteState.collections.map(
                                    (datos, index) => (
                                      <ul key={index} className="list-group">
                                        <li
                                          className="list-group-item"
                                          style={{ cursor: "pointer" }}
                                          onClick={() => handlerClick(datos)}>
                                          <a>
                                            <strong>{datos.name}</strong>
                                          </a>
                                        </li>
                                      </ul>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="card-body-table">
                      <div className="table-responsive">
                        <table className="table ucp-table table-hover">
                          <thead>
                            <tr>
                              <th>Cantidad</th>
                              <th>Valor de</th>
                              <th>Código</th>
                              <th>Nombre</th>
                              <th>Precio Un/Kg</th>
                              <th>Sub total</th>
                              <th>Descuento</th>
                              <th>Sub total con descuento</th>
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
                                <FilaVenta
                                  key={index}
                                  pro={pro}
                                  setCantidad={setCantidad}
                                  index={index}
                                  deleteProduct={deleteProduct}
                                  textBusqueda={textBusqueda}
                                  efectivo={efectivo}
                                  ciCliente={ciCliente}
                                  botonConfirmarVenta={botonConfirmarVenta}
                                  //   inputCantidad={inputCantidad}
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
                                      placeholder="Ingrese el efectivo recibido"
                                      onChange={handlerCalcularCambio}
                                      onKeyDown={escucharTeclado}
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
                  <h4>Buscar usuario</h4>
                  <div className="col-md-10 row">
                    <div className="order-total-right-text fsz-18">
                      Puntos acumulados por la compra: {puntosAcumulados}
                    </div>
                  </div>
                </div>
                <div className="card-body-table">
                  <div className="news-content-right pd-20">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group mb-3">
                          <label className="form-label">
                            Buscar por C.I. o NIT
                          </label>
                          <input
                            ref={ciCliente}
                            type="text"
                            className="form-control"
                            placeholder="Ingrese El C.I. o NIT"
                            onChange={handlerBuscarCi}
                            onKeyDown={escucharTeclado}
                          />
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="form-group mb-3">
                          <label className="form-label">Nombre</label>
                          <input
                            type="email"
                            className="form-control"
                            ref={nombreCliente}
                            required
                            disabled={desactivarInput}
                            placeholder="Ingrese su nombre completo"
                            onKeyDown={escucharTeclado}
                          />
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <button
                          ref={botonConfirmarVenta}
                          data-toggle="modal"
                          data-target="#confirmacion_model"
                          className="save-btn hover-btn"
                          type="submit"
                          disabled={butt}
                          //   onKeyDown={escucharTeclado}
                        >
                          Confirmar la venta
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
      <style jsx>
        {`
          * {
            box-sizing: border-box;
          }
          body {
            font: 16px Arial;
          }
          .autocomplete {
            /*the container must be positioned relative:*/
            position: relative;
            display: inline-block;
          }
          input {
            border: 1px solid transparent;
            background-color: #f1f1f1;
            padding: 10px;
            font-size: 16px;
          }
          input[type="text"] {
            background-color: #f1f1f1;
            width: 100%;
          }
          input[type="submit"] {
            background-color: DodgerBlue;
            color: #fff;
          }
          .autocomplete-items {
            position: absolute;
            border: 1px solid #d4d4d4;
            border-bottom: none;
            border-top: none;
            z-index: 99;
            /*position the autocomplete items to be the same width as the container:*/
            top: 100%;
            left: 0;
            right: 0;
            background-color: #fff;
          }
          .autocomplete-items div {
            padding: 10px;
            cursor: pointer;
            background-color: #fff;
            border-bottom: 1px solid #d4d4d4;
          }
          .autocomplete-items div:hover {
            /*when hovering an item:*/
            background-color: #e9e9e9;
          }
          .autocomplete-active {
            /*when navigating through the items using the arrow keys:*/
            background-color: DodgerBlue !important;
            color: #ffffff;
          }

          .list-group-item:hover {
            background-color: #e9e9e9 !important;
          }
        `}
      </style>
    </>
  );
};
export default Venta;
