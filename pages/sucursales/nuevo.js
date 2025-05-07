import TopNavbar from "../../components/Navbar";
import SideNav from "../../components/Navbar/SideNav";
import Footer from "../../components/Footer";
import Link from "next/link";
import Notifications, { notify } from "react-notify-toast";
import axios from "axios";
import UserContext from "../../components/UserContext";
import { useEffect, useContext, useState, useRef } from "react";
import { API_URL } from "../../components/Config";
import FormData from "form-data";
import Search from "../../components/Search";

import mapboxgl from "mapbox-gl";
import { mapboxglAccessToken } from "../../components/Config";

const sucursalNuevo = () => {
  const { token, signOut } = useContext(UserContext);
  const [idAdmin, setIdAdmin] = useState(false);
  const [imgParaMostrar, setImgParaMostrar] = useState("");
  const [imgParaSubir, setImgParaSubir] = useState(false);
  const [estadoBoton, setEstadoBoton] = useState(false);

  const [banderaLng, setBanderaLng] = useState(null);
  const [banderaLat, setbanderaLat] = useState(null);

  mapboxgl.accessToken = mapboxglAccessToken;

  const mapContainer = useRef(null);
  const longitudRegistro = useRef("12321");
  const latitudRegistro = useRef("12312");

  useEffect(() => {
    const tokenLocal = localStorage.getItem("fribar-token");
    const user = localStorage.getItem("fribar-user");
    if (!tokenLocal && !user) {
      signOut();
    }
    if (JSON.parse(user).role !== "GERENTE-ROLE") signOut();
    longitudRegistro.current.value = banderaLng;
    latitudRegistro.current.value = banderaLat;
  }, [banderaLng, banderaLat]);

  function handlerSubmit() {
    let target = event.target;
    event.preventDefault();
    let formData = new FormData();

    if (idAdmin === false)
      notify.show("Faltan datos por completar", "warning", 2000);
    else {
      setEstadoBoton(true);
      axios
        .post(
          `${API_URL}/sucursal`,
          {
            nombre: target[0].value,
            direccion: target[1].value,
            lat: target[2].value,
            lon: target[3].value,
            referencia: target[4].value,
            state: target[5].value === "0" ? true : false,
            descripcion: target[6].value,
            horaApertura: target[8].value,
            horaCierre: target[9].value,
            administrador: idAdmin,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "content-type": "application/json",
            },
          }
        )
        .then((datos) => {
          if (datos.status === 401) signOut();
          if (datos.status === 200) {
            formData.append("imagen", imgParaSubir);
            console.log("sucursal creado", datos.data);
            console.log(formData, imgParaSubir);
            const createImgPromise = axios.put(
              `${API_URL}/upload/sucursal/${datos.data.body._id}`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            Promise.all([createImgPromise])
              .then((dat) => {
                setEstadoBoton(false);
                if (dat[0].data.error) {
                  notify.show(dat.data.body, "error", 2000);
                  setButt(false);
                } else {
                  target[0].value = "";
                  target[1].value = "";
                  target[2].value = "";
                  target[3].value = "";
                  target[4].value = "";
                  target[5].value = "0";
                  target[6].value = "";
                  target[7].value = "";
                  target[8].value = "";
                  target[9].value = "";
                  target[10].value = "";
                  setImgParaMostrar("");
                  notify.show("Sucursal agregado con Exito! ", "success", 2000);
                  setEstadoBoton(false);
                  console.log("Respuesta de la foto", dat);
                }
              })
              .catch((err) => {
                console.log("-->", err);
                notify.show("No se pudo subir las imagenes", "error");
                setEstadoBoton(false);
              });
          }
          setEstadoBoton(false);
        })
        .catch((err) => {
          console.log("EL ERORR", err);
          setEstadoBoton(false);
          notify.show(
            "Error al registrar el sucursal, comuníquese con el administrador",
            "error",
            4000
          );
        });
    }
  }
  function uploadFile(e) {
    setImgParaMostrar(URL.createObjectURL(e.target.files[0]));
    setImgParaSubir(e.target.files[0]);
  }
  function resizeMap() {
    if (!"geolocation" in navigator) {
      return notify.show(
        "Tu navegador no soporta el acceso a la ubicación. Intenta con otro",
        "warning",
        5000
      );
    }
    const onUbicacionConcedida = (ubicacion) => {
      var map = new mapboxgl.Map({
        container: mapContainer.current,
        projection: "globe",
        style: "mapbox://styles/mapbox/standard-beta",
        center: [ubicacion.coords.longitude, ubicacion.coords.latitude],
        zoom: 15.8,
        marker: [ubicacion.coords.longitude, ubicacion.coords.latitude],
      });
      map.on("load", function () {
        map.resize();
        const marker = new mapboxgl.Marker({
          draggable: true,
        })
          .setLngLat([ubicacion.coords.longitude, ubicacion.coords.latitude])
          .addTo(map);
        obtenerUbicacionArrastrar(marker);
      });
    };
    const onErrorDeUbicacion = (err) => {
      console.log("Error obteniendo ubicación: ", err);
      return notify.show("Error al obtener la ubicacion", "error", 5000);
    };
    const opcionesDeSolicitud = {
      enableHighAccuracy: true, // Alta precisión
      maximumAge: 0, // No queremos caché
      timeout: 5000, // Esperar solo 5 segundos
    };
    navigator.geolocation.getCurrentPosition(
      onUbicacionConcedida,
      onErrorDeUbicacion,
      opcionesDeSolicitud
    );
  }
  const obtenerUbicacionArrastrar = (marker) => {
    marker.on("drag", () => {
      const lnglat = marker.getLngLat();
      setBanderaLng(lnglat.lng);
      setbanderaLat(lnglat.lat);
    });
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
              <h2 className="mt-30 page-title">Nueva sucursal</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/sucursales">
                    <a>Sucursales</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Agregar sucursal</li>
              </ol>
              <div className="row">
                <div className="col-lg-12">
                  <div className="add-new-shop">
                    <div className="card card-static-2 mb-30">
                      <form onSubmit={handlerSubmit} autoComplete="off">
                        <div className="row no-gutters">
                          <div className="col-lg-6 col-md-6">
                            <div className="card-title-2">
                              <h4>Registrar nueva sucursal</h4>
                            </div>
                            <div className="card-body-table">
                              <div className="add-shop-content pd-20">
                                <div className="form-group">
                                  <label className="form-label">Nombre*</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre de la sucursal"
                                    required
                                  />
                                </div>

                                <div className="form-group">
                                  <label className="form-label">
                                    Direccion*
                                  </label>
                                  <div className="card card-editor">
                                    <div className="content-editor">
                                      <textarea
                                        className="text-control"
                                        placeholder="Introduzca la direccion"
                                        required></textarea>
                                    </div>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Latitud*</label>
                                  <input
                                    ref={latitudRegistro}
                                    className="form-control"
                                    placeholder="0"
                                    required
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">
                                    Longitud*
                                  </label>
                                  <input
                                    ref={longitudRegistro}
                                    className="form-control"
                                    placeholder="0"
                                    required
                                  />
                                </div>
                                <div className="shopowner-dt-list">
                                  <div className="col-lg-12">
                                    <a
                                      href="add_shop.html"
                                      className="add-btn hover-btn"
                                      data-toggle="modal"
                                      data-target="#mapa_model"
                                      onClick={() => resizeMap()}>
                                      Marcar la direccion en el mapa
                                    </a>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label className="form-label">
                                    Referencia*
                                  </label>
                                  <div className="card card-editor">
                                    <div className="content-editor">
                                      <textarea
                                        className="text-control"
                                        placeholder="Introduzca la referencia de la direccion"
                                        required></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="card-body-table">
                              <div className="form-group">
                                <label className="form-label">Estado*</label>
                                <select
                                  id="status"
                                  name="status"
                                  className="form-control"
                                  defaultValue={0}>
                                  <option value="0">Activo</option>
                                  <option value="1">Inactivo</option>
                                </select>
                              </div>
                              <div className="form-group">
                                <label className="form-label">
                                  Descripción*
                                </label>
                                <div className="card card-editor">
                                  <div className="content-editor">
                                    <textarea
                                      className="text-control"
                                      placeholder="Introduzca la descripción"
                                      required></textarea>
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <label className="form-label">
                                  Imagen de la tienda*
                                </label>
                                <div className="input-group">
                                  <div className="custom-file">
                                    <input
                                      type="file"
                                      className="custom-file-input"
                                      id="inputGroupFile04"
                                      aria-describedby="inputGroupFileAddon04"
                                      required
                                      onChange={uploadFile}
                                    />
                                    <label
                                      className="custom-file-label"
                                      htmlFor="inputGroupFile04">
                                      Imagen de la tienda
                                    </label>
                                  </div>
                                </div>
                                <div className="add-cate-img-1">
                                  <img
                                    src={imgParaMostrar}
                                    alt={imgParaMostrar ? "Sucursal" : ""}
                                  />
                                </div>
                              </div>
                              <div className="add-shop-content pd-20">
                                <div className="form-group">
                                  <label className="form-label">
                                    Hora de apertura*
                                  </label>
                                  <input
                                    type="time"
                                    id="default-picker"
                                    className="form-control"
                                    placeholder="Select time"
                                    required
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">
                                    Hora de cierre*
                                  </label>
                                  <input
                                    type="time"
                                    id="default-picker"
                                    className="form-control"
                                    placeholder="Select time"
                                    required
                                  />
                                </div>
                              </div>

                              <div className="card-title-2">
                                <h4>Administrador de la tienda</h4>
                              </div>
                              <div className="card-body-table">
                                <div className="add-shop-content pd-20">
                                  <Search
                                    token={token}
                                    setIdAdmin={setIdAdmin}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            disabled={estadoBoton}
                            className="save-btn hover-btn"
                            type="submit">
                            Agregar nueva sucursal
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
      {/* Modal del mapa con su CSS */}
      <div
        id="mapa_model"
        className="header-cate-model main-gambo-model modal fade"
        tabIndex="-1"
        role="dialog"
        aria-modal="false">
        <div className="modal-dialog category-area" role="document">
          <div className="category-area-inner">
            <div className="modal-header" style={{ alignItems: "end" }}>
              <center>
                <b className="h7">
                  Arrastre el marcador en su ubicacion exacta y cierre la
                  ventana
                </b>
              </center>
              <button
                type="button"
                className="btn btn-close close"
                data-dismiss="modal"
                aria-label="Close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div
              className="category-model-content modal-content"
              style={{ width: "auto" }}>
              <div ref={mapContainer} className="map-container"></div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .h7 {
            color: #ffffff;
            font-size: 16px;
            margin: 0;
          }
          .btn-confirmation {
            text-align: center;
            padding: 10px;
          }
          .btn-margin {
            margin: 10px;
            padding: 10px 40px;
          }
          .main-gambo-model {
            background-image: -webkit-linear-gradient(
              left,
              rgba(230, 92, 91, 0.9),
              rgba(245, 93, 44, 0.9)
            );
            background-image: linear-gradient(
              to right,
              rgba(230, 92, 91, 0.9),
              rgba(245, 93, 44, 0.9)
            );
          }

          .category-area-inner .modal-header {
            border-bottom: 0;
          }

          .category-area-inner .btn-close {
            color: #fff !important;
            opacity: 1 !important;
            padding: 30px 0 15px !important;
            font-size: 30px !important;
            cursor: pointer !important;
          }

          .category-model-content {
            background: #fff;
            border: 0 !important;
            border-radius: 0 !important;
          }

          .catey__icon {
            display: none;
          }

          .search__icon {
            display: none;
          }

          .sub-header-icons-list {
            display: inline-block;
            font-size: 20px;
          }

          .cate__btn {
            font-size: 20px;
            color: #8f91ac !important;
            padding: 20px 20px 19px;
          }

          .cate__btn:hover {
            color: #f55d2c !important;
          }

          .search__btn {
            font-size: 20px;
            color: #fff !important;
            padding: 20px 20px 21px;
            background: #2b2f4c;
          }

          /* --- Category Mode --- */

          .cate-header {
            background: #2b2f4c;
            color: #fff;
            padding: 15px 20px;
          }

          .cate-header h4 {
            font-size: 18px;
            font-weight: 500;
            line-height: 24px;
          }

          .category-by-cat {
            width: 100%;
            display: inline-table;
          }

          .category-by-cat li {
            width: 33.333%;
            vertical-align: middle;
            display: inline-block;
            list-style: none;
            float: left;
          }

          .single-cat-item {
            text-align: center;
            padding: 20px 10px;
            display: block;
          }

          .single-cat-item:hover {
            background: #f9f9f9;
          }

          .single-cat-item .text {
            font-size: 14px;
            font-weight: 500;
            color: #2b2f4c;
          }

          .single-cat-item .icon {
            width: 100%;
            text-align: center;
            margin-bottom: 15px;
          }

          .single-cat-item .icon img {
            width: 50px;
          }

          .morecate-btn {
            display: block;
            text-align: center;
            border-top: 1px solid #efefef;
            padding: 20px;
            font-size: 16px;
            font-weight: 500;
            color: #2b2f4c;
          }

          .morecate-btn i {
            margin-right: 5px;
          }

          .morecate-btn:hover {
            color: #f55d2c !important;
          }

          .search-ground-area {
            max-width: 400px !important;
          }

          .search-header {
            position: relative;
            width: 100%;
            border-bottom: 1px solid #efefef;
          }

          .search-header input {
            width: 100%;
            border: 0;
            padding: 20px;
            position: relative;
          }

          .search-header button {
            position: absolute;
            right: 0px;
            background: transparent;
            border: 0;
            padding: 17px;
            font-size: 20px;
          }

          .search-by-cat {
            width: 100%;
            height: 321px;
            overflow: hidden scroll;
          }

          .search-by-cat .single-cat {
            -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=85)";
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
            margin-bottom: 0;
            -webkit-transition: all 0.25s;
            transition: all 0.25s;
            padding: 15px 20px;
          }

          .search-by-cat .single-cat .icon {
            background-color: #f9f9f9;
            border-radius: 5%;
            color: #fff;
            font-size: 22px;
            height: 50px;
            line-height: 47px;
            text-align: center;
            width: 50px;
          }

          .search-by-cat .single-cat .icon img {
            width: 30px;
          }

          .search-by-cat .single-cat .text {
            color: #2b2f4c;
            font-weight: 400;
            padding-left: 20px;
            font-size: 16px;
          }

          .search-by-cat .single-cat:hover .text {
            color: #f55d2c;
          }
          .map-container {
            height: 700px;
          }
        `}</style>
      </div>

      {/* ----------Modal del papa con su CSS---------- */}
    </>
  );
};

export default sucursalNuevo;
