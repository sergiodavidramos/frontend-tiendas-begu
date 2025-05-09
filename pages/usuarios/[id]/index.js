import TopNavbar from "../../../components/Navbar";
import SideNav from "../../../components/Navbar/SideNav";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useContext, useState, useRef } from "react";
import UserContext from "../../../components/UserContext";
import GetImg from "../../../components/GetImg";
import Notifications, { notify } from "react-notify-toast";
import { mapboxglAccessToken, API_URL } from "../../../components/Config";
import mapboxgl from "mapbox-gl";
const viewClient = () => {
  const { signOut } = useContext(UserContext);
  const [client, setCliente] = useState(null);
  const router = useRouter();

  mapboxgl.accessToken = mapboxglAccessToken;

  const mapContainer = useRef(null);
  let map = useRef(null);
  const [lat, setLat] = useState(null);
  const [lon, setLng] = useState(null);

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
    if (!client && router && router.query && router.query.id) {
      const { id } = router.query;
      fetch(`${API_URL}/user?id=${id}`, {
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
            notify.show("Error en el servidor", "error", 2000);
          } else {
            setCliente(data.body[0][0]);
            if (data.body[0][0].direccion[0]) {
              setLat(data.body[0][0].direccion[0].lat);
              setLng(data.body[0][0].direccion[0].lon);
            }
          }
        })
        .catch((error) => {
          console.log("SSSSS", error);
          notify.show("Error en el servidor", "error", 2000);
        });
    }
  }, [router]);
  useEffect(() => {
    if (map.current) return;
    map = new mapboxgl.Map({
      container: mapContainer.current,
      projection: "globe",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lon, lat],
      zoom: 15.8,
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
              <h2 className="mt-30 page-title">Informacion del usuarios</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">Tablero</Link>
                </li>
                <li className="breadcrumb-item active">
                  <Link href="/usuarios">Usuarios</Link>
                </li>
                <li className="breadcrumb-item active">Ver Usuario</li>
              </ol>

              {client ? (
                <div className="row">
                  <div className="col-lg-5 col-md-6">
                    <div className="card card-static-2 mb-30">
                      <div className="card-body-table">
                        <div className="shopowner-content-left text-center pd-20">
                          <div className="customer_img">
                            <img
                              src={GetImg(client.img, `${API_URL}/upload/user`)}
                              alt="cliente-Fribar"
                            />
                          </div>
                          <div className="shopowner-dt-left mt-4">
                            <h4>{client.nombre_comp}</h4>
                            <span>{client.role}</span>
                          </div>
                          <ul className="product-dt-purchases">
                            <li>
                              <div className="product-status">
                                Compras
                                <span className="badge-item-2 badge-status">
                                  {client.idPersona.compras}
                                </span>
                              </div>
                            </li>
                            <li>
                              <div className="product-status">
                                Puntos
                                <span className="badge-item-2 badge-status">
                                  {client.idPersona.puntos}
                                </span>
                              </div>
                            </li>
                          </ul>
                          <div className="shopowner-dts">
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Nombre</span>
                              <span className="right-dt">
                                {client.idPersona.nombre_comp}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">C.I.</span>
                              <span className="right-dt">
                                {client.idPersona.ci
                                  ? client.idPersona.ci
                                  : "---------"}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Email</span>
                              <span className="right-dt">{client.email}</span>
                            </div>

                            <div className="shopowner-dt-list">
                              <span className="left-dt">Teléfono</span>
                              <span className="right-dt">
                                {client.phone ? client.phone : "--------"}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Rol</span>
                              <span className="right-dt">{client.role}</span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Personal</span>
                              <span className="right-dt">
                                {client.personal ? "Si" : "No"}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Sucursal</span>
                              <span className="right-dt">
                                {client.idSucursal.nombre}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Direccion</span>
                              <span className="right-dt">
                                {client.direccion.length > 0
                                  ? client.direccion[0].direccion
                                  : "Direccion no asignado"}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Latitud</span>
                              <span className="right-dt">
                                {client.direccion.length > 0
                                  ? client.direccion[0].lat
                                  : "Direccion no asignado"}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Longitud</span>
                              <span className="right-dt">
                                {client.direccion.length > 0
                                  ? client.direccion[0].lon
                                  : "Direccion no asignado"}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">
                                Referencia de la direccion
                              </span>
                              <span className="right-dt">
                                {client.direccion.length > 0
                                  ? client.direccion[0].referencia
                                  : "Direccion no asignado"}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <div className="col-lg-12">
                                <a
                                  className="add-btn hover-btn"
                                  data-toggle={
                                    client.direccion.length > 0 ? "modal" : ""
                                  }
                                  data-target="#mapa_model"
                                  onClick={() => resizeMap(map)}
                                  disabled={
                                    client.direccion.length > 0 ? false : true
                                  }>
                                  {client.direccion.length > 0
                                    ? "Ver la direccion en el mapa"
                                    : "No hay direccion que mostrar"}
                                </a>
                              </div>
                            </div>
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

export default viewClient;
