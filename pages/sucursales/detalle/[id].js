import TopNavbar from "../../../components/Navbar";
import SideNav from "../../../components/Navbar/SideNav";
import Link from "next/link";
import { useEffect, useContext, useState, useRef } from "react";
import UserContext from "../../../components/UserContext";
import Notifications, { notify } from "react-notify-toast";
import Footer from "../../../components/Footer";
import GetImg from "../../../components/GetImg";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/router";
import axios from "axios";
import { mapboxglAccessToken, API_URL } from "../../../components/Config";
const viewSucursal = () => {
  const { signOut } = useContext(UserContext);
  const [sucursal, setSucursales] = useState(false);
  const router = useRouter();

  mapboxgl.accessToken = mapboxglAccessToken;

  const mapContainer = useRef(null);
  let map = useRef(null);
  const [lat, setLat] = useState(null);
  const [lon, setLng] = useState(null);
  const [zoom, setZoom] = useState(15);
  useEffect(() => {
    const tokenLocal = localStorage.getItem("fribar-token");
    if (!tokenLocal) {
      signOut();
    } else {
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
              notify.show("Error en el servidor (sucursal)", "error", 2000);
            } else {
              setSucursales(data.body);
              setLat(data.body.direccion.lat);
              setLng(data.body.direccion.lon);
            }
          })
          .catch((error) => {
            notify.show(error.message, "error", 2000);
          });
      }
    }
  }, [router]);

  useEffect(() => {
    if (map.current) return;
    map = new mapboxgl.Map({
      container: mapContainer.current,
      projection: "globe",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lon, lat],
      zoom: zoom,
    });
  });
  function resizeMap(map) {
    setTimeout(function () {
      map.resize();
    }, 300);
    const marker = new mapboxgl.Marker({
      draggable: false,
    })
      .setLngLat([lon, lat])
      .addTo(map);
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
              <h2 className="mt-30 page-title">Sucursal</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">Tablero</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/sucursales">Sucursal</Link>
                </li>
                <li className="breadcrumb-item active">Ver sucursal</li>
              </ol>
              {sucursal ? (
                <div className="row">
                  <div className="col-lg-4 col-md-5">
                    <div className="card card-static-2 mb-30">
                      <div className="card-body-table">
                        <div className="shop-content-left pd-20">
                          <div className="shop_img">
                            <img
                              src={GetImg(
                                sucursal.img,
                                `${API_URL}/upload/sucursal`
                              )}
                              alt="Sucursal Fribar"
                            />
                          </div>
                          <div className="shop-dt-left">
                            <h4>{sucursal.nombre}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card card-static-2 mb-30">
                      <div className="card-body-table">
                        <div className="shopowner-content-left pd-20">
                          <div className="shopowner-dt-left">
                            <h4>
                              {sucursal.administrador.idPersona.nombre_comp}
                            </h4>
                            <span>Administrador de la tienda</span>
                          </div>
                          <div className="shopowner-dts">
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Celular</span>
                              <span className="right-dt">
                                {sucursal.administrador.phone}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Correo</span>
                              <span className="right-dt">
                                {sucursal.administrador.email}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Direccion</span>
                              <span className="right-dt">
                                {sucursal.administrador.direccion.length > 0
                                  ? sucursal.administrador.direccion[0]
                                      .direccion +
                                    " - " +
                                    sucursal.administrador.direccion[0]
                                      .referencia
                                  : "Direccion no agregada"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 col-md-7">
                    <div className="card card-static-2 mb-30">
                      <div className="card-body-table">
                        <div className="shopowner-content-left pd-20">
                          <div className="shopowner-dts mt-0">
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Nombre :</span>
                              <span className="right-dt">
                                {sucursal.nombre}
                              </span>
                            </div>

                            <div className="shopowner-dt-list">
                              <span className="left-dt">Latitud</span>
                              <span className="right-dt">{`${lat}`}</span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Longitud</span>
                              <span className="right-dt">{`${lon}`}</span>
                            </div>
                            <div className="shopowner-dt-list">
                              <div className="col-lg-12">
                                <a
                                  href="add_shop.html"
                                  className="add-btn hover-btn"
                                  data-toggle="modal"
                                  data-target="#mapa_model"
                                  onClick={() => resizeMap(map)}>
                                  Ver la direccion en el mapa
                                </a>
                              </div>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Estado Actual</span>
                              <span className="right-dt">
                                {sucursal.state ? "Si" : "NO"}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Estado</span>
                              <span className="right-dt">
                                {sucursal.state ? "Activo" : "Inactivo"}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Hora de apertura</span>
                              <span className="right-dt">
                                {sucursal.horaApertura}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Hora de cierre</span>
                              <span className="right-dt">
                                {sucursal.horaCierre}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Direccion</span>
                              <span className="right-dt">
                                {sucursal.direccion.direccion}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Descripción</span>
                              <span className="right-dt">
                                {sucursal.descripcion}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </main>
          <Footer />
        </div>
      </div>
      <div
        id="mapa_model"
        className="header-cate-model main-gambo-model modal fade"
        tabIndex="-1"
        role="dialog"
        aria-modal="false">
        <div className="modal-dialog category-area" role="document">
          <div className="category-area-inner">
            <div className="modal-header">
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
    </>
  );
};
export default viewSucursal;
