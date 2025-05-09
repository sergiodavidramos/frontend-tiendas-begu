import TopNavbar from "../../components/Navbar";
import SideNav from "../../components/Navbar/SideNav";
import Footer from "../../components/Footer";
import Link from "next/link";
import { useEffect, useContext, useState, useRef } from "react";
import UserContext from "../../components/UserContext";
import GetImg from "../../components/GetImg";
import FormData from "form-data";
import Notifications, { notify } from "react-notify-toast";
import { API_URL } from "../../components/Config";

import mapboxgl from "mapbox-gl";
import { mapboxglAccessToken } from "../../components/Config";
// Prueba commit desde terminal
const nuevoUsuario = () => {
  const { signOut, getSucursales } = useContext(UserContext);
  const [token, setToken] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [isPersonal, setisPersonal] = useState("1");

  mapboxgl.accessToken = mapboxglAccessToken;

  const mapContainer = useRef(null);
  const longitudRegistro = useRef(null);
  const latitudRegistro = useRef(null);

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
  });
  function uploadFile(e) {
    setImage(URL.createObjectURL(e.target.files[0]));
    setImageUpload(e.target.files[0]);
  }
  function handlerSubmit() {
    let formData = new FormData();
    event.preventDefault();
    const target = event.target;
    if (imageUpload) {
      formData.append("imagen", imageUpload);

      fetch(`${API_URL}/user`, {
        method: "POST",
        body: JSON.stringify({
          nombre_comp: target[0].value,
          ci: target[1].value,
          password: target[2].value,
          email: target[3].value,
          phone: target[4].value,
          role: target[5].value,
          personal: target[6].value,
          idSucursal: isPersonal ? target[7].value : "",
          lat: target[9].value,
          lon: target[10].value,
          direccion: target[11].value,
          referencia: target[12].value,
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
            notify.show(response.body, "error", 2000);
          } else {
            console.log(response.body);
            fetch(`${API_URL}/upload/user/${response.body._id}`, {
              method: "PUT",
              body: formData,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then((res) => {
                if (res.status === 401) signOut();
                return res.json();
              })
              .then((response) => {
                if (response.error) {
                  notify.show(response.body, "error", 2000);
                } else {
                  notify.show(
                    "Se registro al nuevo usuario con Exito! ",
                    "success",
                    2000
                  );
                }
              })
              .catch((error) => {
                notify.show("No se pudo subir las imagenes", "error");
              });
          }
        })
        .catch((e) => {
          notify.show("No se pudo guardar los cambios", "error");
        });
    } else {
      notify.show("Por favor seleccione una imagen", "warning", 3000);
    }
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
      longitudRegistro.current.value = lnglat.lng;
      latitudRegistro.current.value = lnglat.lat;
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
              <h2 className="mt-30 page-title">Agregar nuevo usuario</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">Tablero</Link>
                </li>
                <li className="breadcrumb-item active">
                  <Link href="/usuarios">Usuarios</Link>
                </li>
                <li className="breadcrumb-item active">Nuevo usuario</li>
              </ol>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Registro de usuario</h4>
                    </div>
                    <div className="card-body-table">
                      <form onSubmit={handlerSubmit}>
                        <div className="news-content-right pd-20">
                          <div className="form-group">
                            <label className="form-label">Nombre*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingrese su nombre comleto"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">C.I.*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingrese el C.I."
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Contraseña*</label>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="Ingrese su nombre Contraseña"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Usuario*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingrese su usuario"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Teléfono*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingrese su numero Teléfonico"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Rol del usuario*
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingrese su cargo"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Personal*</label>
                            <select
                              className="form-control"
                              defaultValue={"1"}
                              onChange={(e) => setisPersonal(e.target.value)}>
                              <option value="1">Si</option>
                              <option value="0">No</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label className="form-label">Sucursal*</label>
                            <select
                              className="form-control"
                              defaultValue={false}>
                              <option value={false}>
                                Asigne a una sucursal
                              </option>
                              {getSucursales.length > 0 ? (
                                getSucursales.map((sucursal, index) => (
                                  <option value={sucursal._id} key={index}>
                                    {sucursal.nombre}
                                  </option>
                                ))
                              ) : (
                                <option value={false}>No hay sucursales</option>
                              )}
                            </select>
                          </div>

                          <div className="form-group">
                            <label className="form-label">
                              Image del cliente*
                            </label>
                            <div className="input-group">
                              <div className="custom-file">
                                <input
                                  type="file"
                                  className="custom-file-input"
                                  id="inputGroupFile04"
                                  aria-describedby="inputGroupFileAddon04"
                                  onChange={uploadFile}
                                />
                                <label
                                  className="custom-file-label"
                                  htmlFor="inputGroupFile04">
                                  Elegir Imagen
                                </label>
                              </div>
                            </div>
                            <div className="add-customer-img">
                              <img
                                src={
                                  !image
                                    ? GetImg(false, `${API_URL}/upload/user`)
                                    : image
                                }
                                alt="Cliente Frifolly"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Latitud*</label>
                            <input
                              ref={latitudRegistro}
                              className="form-control"
                              placeholder="Latitud de la dirección"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Longitud*</label>
                            <input
                              ref={longitudRegistro}
                              className="form-control"
                              placeholder="Longitud de la dirección"
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
                                onClick={resizeMap}>
                                Marcar direccion en el mapa
                              </a>
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Dirección*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingrese la direccion"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Referencia de la direccion*
                            </label>
                            <div className="card card-editor">
                              <div className="content-editor">
                                <textarea
                                  className="text-control"
                                  placeholder="Referencia de la dirección"></textarea>
                              </div>
                            </div>
                          </div>
                          <button className="save-btn hover-btn" type="submit">
                            Registrar nuevo usuario
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
      {/* Modal del papa con su CSS */}
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
                <p className="h7">
                  Arrastre el marcador en su ubicacion exacta y cierre la
                  ventana
                </p>
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

export default nuevoUsuario;
