import Link from "next/link";
import { withRouter } from "next/router";
import { useContext, useEffect } from "react";
import UserContext from "../UserContext";
const SideNav = (props) => {
  const { user, alarm, pagoRealizado } = useContext(UserContext);
  return (
    <>
      {user && (
        <div id="layoutSidenav_nav">
          <nav
            className="sb-sidenav accordion sb-sidenav-dark"
            id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                {(user.role === "GERENTE-ROLE" ||
                  user.role === "ADMIN-ROLE") && (
                  <Link legacyBehavior href="/">
                    <a
                      className={`nav-link ${
                        props.router.pathname === "/" ? "active" : ""
                      }`}>
                      <div className="sb-nav-link-icon">
                        <i className="fas fa-tachometer-alt"></i>
                      </div>
                      Tablero
                    </a>
                  </Link>
                )}

                <a
                  style={{ cursor: "pointer" }}
                  className={`nav-link ${
                    props.router.pathname.split("/")[1] === "sucursales"
                      ? "active"
                      : "collapsed"
                  }`}
                  data-toggle="collapse"
                  data-target="#collapseShops"
                  aria-expanded="false"
                  aria-controls="collapseShops">
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-store"></i>
                  </div>
                  Sucursales
                  <div className="sb-sidenav-collapse-arrow">
                    <i className="fas fa-angle-down"></i>
                  </div>
                </a>
                <div
                  className={`collapse ${
                    props.router.pathname.split("/")[1] === "sucursales"
                      ? "show"
                      : ""
                  }`}
                  id="collapseShops"
                  aria-labelledby="headingTwo"
                  data-parent="#sidenavAccordion">
                  <nav className="sb-sidenav-menu-nested nav">
                    <Link legacyBehavior href="/sucursales">
                      <a
                        className={`nav-link sub_nav_link ${
                          props.router.pathname === "/sucursales"
                            ? "active"
                            : ""
                        }`}>
                        Todas las sucursales
                      </a>
                    </Link>
                    {user.role === "GERENTE-ROLE" && (
                      <Link legacyBehavior href="/sucursales/nuevo">
                        <a
                          className={`nav-link sub_nav_link ${
                            props.router.pathname === "/sucursales/nuevo"
                              ? "active"
                              : ""
                          }`}>
                          Agregar sucursales
                        </a>
                      </Link>
                    )}
                    {(user.role === "GERENTE-ROLE" ||
                      user.role === "ADMIN-ROLE" ||
                      user.role === "ALMACEN-ROLE" ||
                      user.role === "USER-ROLE") && (
                      <Link
                        legacyBehavior
                        href="/sucursales/confirmar-traslado">
                        <a
                          className={`nav-link sub_nav_link ${
                            props.router.pathname ===
                            "/sucursales/confirmar-traslado"
                              ? "active"
                              : ""
                          }`}>
                          Confirmación de traslado
                        </a>
                      </Link>
                    )}
                  </nav>
                </div>
                {(user.role === "GERENTE-ROLE" ||
                  user.role === "ADMIN-ROLE") && (
                  <>
                    <a
                      style={{ cursor: "pointer" }}
                      className={`nav-link ${
                        props.router.pathname.split("/")[1] === "proveedor"
                          ? "active"
                          : "collapsed"
                      }`}
                      data-toggle="collapse"
                      data-target="#collapseMarcas"
                      aria-expanded="false"
                      aria-controls="collapseMarcas">
                      <div className="sb-nav-link-icon">
                        <i className="fa fa-building"></i>
                      </div>
                      Proveedores
                      <div className="sb-sidenav-collapse-arrow">
                        <i className="fas fa-angle-down"></i>
                      </div>
                    </a>

                    <div
                      className={`collapse ${
                        props.router.pathname.split("/")[1] === "proveedor"
                          ? "show"
                          : ""
                      }`}
                      id="collapseMarcas"
                      aria-labelledby="headingTwo"
                      data-parent="#sidenavAccordion">
                      <nav className="sb-sidenav-menu-nested nav">
                        <Link legacyBehavior href="/proveedor">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === "/proveedor"
                                ? "active"
                                : ""
                            }`}>
                            Todos los proveedores
                          </a>
                        </Link>
                        <Link legacyBehavior href="/proveedor/nuevo">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === "/proveedor/nuevo"
                                ? "active"
                                : ""
                            }`}>
                            Agregar proveedor
                          </a>
                        </Link>
                      </nav>
                    </div>
                  </>
                )}
                {(user.role === "GERENTE-ROLE" ||
                  user.role === "ADMIN-ROLE") && (
                  <>
                    <a
                      style={{ cursor: "pointer" }}
                      className={`nav-link ${
                        props.router.pathname.split("/")[1] === "categorias"
                          ? "active"
                          : "collapsed"
                      }`}
                      data-toggle="collapse"
                      data-target="#collapseCategories"
                      aria-expanded="false"
                      aria-controls="collapseCategories">
                      <div className="sb-nav-link-icon">
                        <i className="fas fa-list"></i>
                      </div>
                      Categorias
                      <div className="sb-sidenav-collapse-arrow">
                        <i className="fas fa-angle-down"></i>
                      </div>
                    </a>

                    <div
                      className={`collapse ${
                        props.router.pathname.split("/")[1] === "categorias"
                          ? "show"
                          : ""
                      }`}
                      id="collapseCategories"
                      aria-labelledby="headingTwo"
                      data-parent="#sidenavAccordion">
                      <nav className="sb-sidenav-menu-nested nav">
                        <Link legacyBehavior href="/categorias">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === "/categorias"
                                ? "active"
                                : ""
                            }`}>
                            Todas las Categorias
                          </a>
                        </Link>
                        <Link legacyBehavior href="/categorias/nuevo">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === "/categorias/nuevo"
                                ? "active"
                                : ""
                            }`}>
                            Agregar Categoria
                          </a>
                        </Link>
                      </nav>
                    </div>
                  </>
                )}
                <a
                  style={{ cursor: "pointer" }}
                  className={`nav-link ${
                    props.router.pathname.split("/")[1] === "productos"
                      ? "active"
                      : "collapsed"
                  }`}
                  data-toggle="collapse"
                  data-target="#collapseProducts"
                  aria-expanded="false"
                  aria-controls="collapseProducts">
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-box"></i>
                  </div>
                  Productos
                  <div className="sb-sidenav-collapse-arrow">
                    <i className="fas fa-angle-down"></i>
                  </div>
                </a>
                <div
                  className={`collapse ${
                    props.router.pathname.split("/")[1] === "productos"
                      ? "show"
                      : ""
                  }`}
                  id="collapseProducts"
                  aria-labelledby="headingTwo"
                  data-parent="#sidenavAccordion">
                  <nav className="sb-sidenav-menu-nested nav">
                    <Link legacyBehavior href="/productos">
                      <a
                        className={`nav-link sub_nav_link ${
                          props.router.pathname === "/productos" ? "active" : ""
                        }`}>
                        Todos los Productos
                      </a>
                    </Link>
                    {(user.role === "GERENTE-ROLE" ||
                      user.role === "ADMIN-ROLE" ||
                      user.role === "ALMACEN-ROLE") && (
                      <Link legacyBehavior href="/productos/nuevo">
                        <a
                          className={`nav-link sub_nav_link ${
                            props.router.pathname === "/productos/nuevo"
                              ? "active"
                              : ""
                          }`}>
                          Agregar Producto
                        </a>
                      </Link>
                    )}
                  </nav>
                </div>

                <a
                  style={{ cursor: "pointer" }}
                  className={`nav-link ${
                    props.router.pathname.split("/")[1] === "venta"
                      ? "active"
                      : "collapsed"
                  }`}
                  data-toggle="collapse"
                  data-target="#collapseVentas"
                  aria-expanded="false"
                  aria-controls="collapseVentas">
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-cart-arrow-down"></i>
                  </div>
                  Ventas
                  <div className="sb-sidenav-collapse-arrow">
                    <i className="fas fa-angle-down"></i>
                  </div>
                </a>
                <div
                  className={`collapse ${
                    props.router.pathname.split("/")[1] === "venta"
                      ? "show"
                      : ""
                  }`}
                  id="collapseVentas"
                  aria-labelledby="headingTwo"
                  data-parent="#sidenavAccordion">
                  <nav className="sb-sidenav-menu-nested nav">
                    <Link legacyBehavior href="/venta">
                      <a
                        className={`nav-link sub_nav_link ${
                          props.router.pathname === "/venta" ? "active" : ""
                        }`}>
                        Realizar Venta
                      </a>
                    </Link>
                    {(user.role === "GERENTE-ROLE" ||
                      user.role === "ADMIN-ROLE") && (
                      <Link legacyBehavior href="/venta/lista">
                        <a
                          className={`nav-link sub_nav_link ${
                            props.router.pathname === "/venta/lista"
                              ? "active"
                              : ""
                          }`}>
                          Ventas anteriores
                        </a>
                      </Link>
                    )}
                  </nav>
                </div>

                {(user.role === "GERENTE-ROLE" ||
                  user.role === "ADMIN-ROLE" ||
                  user.role === "ALMACEN-ROLE") && (
                  <>
                    <a
                      style={{ cursor: "pointer" }}
                      className={`nav-link ${
                        props.router.pathname.split("/")[1] === "compras"
                          ? "active"
                          : "collapsed"
                      }`}
                      data-toggle="collapse"
                      data-target="#collapseCompras"
                      aria-expanded="false"
                      aria-controls="collapseCompras">
                      <div className="sb-nav-link-icon">
                        <i className="fas fa-cart-arrow-down"></i>
                      </div>
                      Compras
                      <div className="sb-sidenav-collapse-arrow">
                        <i className="fas fa-angle-down"></i>
                      </div>
                    </a>
                    <div
                      className={`collapse ${
                        props.router.pathname.split("/")[1] === "compras"
                          ? "show"
                          : ""
                      }`}
                      id="collapseCompras"
                      aria-labelledby="headingTwo"
                      data-parent="#sidenavAccordion">
                      <nav className="sb-sidenav-menu-nested nav">
                        <Link legacyBehavior href="/compras">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === "/compras"
                                ? "active"
                                : ""
                            }`}>
                            Realizar Compra
                          </a>
                        </Link>
                        <Link legacyBehavior href="/compras/lista">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === "/compras/lista"
                                ? "active"
                                : ""
                            }`}>
                            Compras anteriores
                          </a>
                        </Link>
                        <Link legacyBehavior href="/compras/egreso">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === "/compras/egreso"
                                ? "active"
                                : ""
                            }`}>
                            Registrar un egreso
                          </a>
                        </Link>
                      </nav>
                    </div>
                  </>
                )}
                {(user.role === "GERENTE-ROLE" ||
                  user.role === "ADMIN-ROLE") && (
                  <Link legacyBehavior href="/clientes">
                    <a
                      className={`nav-link ${
                        props.router.pathname === "/clientes" ? "active" : ""
                      }`}>
                      <div className="sb-nav-link-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      Clientes
                    </a>
                  </Link>
                )}
                {(user.role === "GERENTE-ROLE" ||
                  user.role === "ADMIN-ROLE") && (
                  <>
                    <a
                      style={{ cursor: "pointer" }}
                      className={`nav-link ${
                        props.router.pathname.split("/")[1] === "usuarios"
                          ? "active"
                          : "collapsed"
                      }`}
                      href="#"
                      data-toggle="collapse"
                      data-target="#collapseAreas"
                      aria-expanded="false"
                      aria-controls="collapseAreas">
                      <div className="sb-nav-link-icon">
                        <i className="fas fa-user-tie"></i>
                      </div>
                      Usuarios
                      <div className="sb-sidenav-collapse-arrow">
                        <i className="fas fa-angle-down"></i>
                      </div>
                    </a>
                    <div
                      className={`collapse ${
                        props.router.pathname.split("/")[1] === "usuarios"
                          ? "show"
                          : ""
                      }`}
                      id="collapseAreas"
                      aria-labelledby="headingTwo"
                      data-parent="#sidenavAccordion">
                      <nav className="sb-sidenav-menu-nested nav">
                        <Link legacyBehavior href="/usuarios">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === "/usuarios"
                                ? "active"
                                : ""
                            }`}>
                            Todos los usuarios
                          </a>
                        </Link>
                        <Link legacyBehavior href="/usuarios/nuevo">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === "/usuarios/nuevo"
                                ? "active"
                                : ""
                            }`}>
                            Agregar usuario
                          </a>
                        </Link>
                      </nav>
                    </div>
                  </>
                )}
                {/* PROBANDO NAV */}
                {(user.role === "GERENTE-ROLE" ||
                  user.role === "ADMIN-ROLE") && (
                  <>
                    <a
                      style={{ cursor: "pointer" }}
                      className={`nav-link ${
                        props.router.pathname.split("/")[1] === "ofertas"
                          ? "active"
                          : "collapsed"
                      }`}
                      href="#"
                      data-toggle="collapse"
                      data-target="#collapseOfertas"
                      aria-expanded="false"
                      aria-controls="collapseOfertas">
                      <div className="sb-nav-link-icon">
                        <i className="fas fa-gift"></i>
                      </div>
                      Ofertas
                      <div className="sb-sidenav-collapse-arrow">
                        <i className="fas fa-angle-down"></i>
                      </div>
                    </a>
                    <div
                      className={`collapse ${
                        props.router.pathname.split("/")[1] === "ofertas"
                          ? "show"
                          : ""
                      }`}
                      id="collapseOfertas"
                      aria-labelledby="headingTwo"
                      data-parent="#sidenavAccordion">
                      <nav className="sb-sidenav-menu-nested nav">
                        <Link legacyBehavior href="/ofertas">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === "/ofertas"
                                ? "active"
                                : ""
                            }`}>
                            Todas las ofertas
                          </a>
                        </Link>
                        <Link legacyBehavior href="/ofertas/nuevo">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === "/ofertas/nuevo"
                                ? "active"
                                : ""
                            }`}>
                            Agregar oferta
                          </a>
                        </Link>
                      </nav>
                    </div>
                  </>
                )}
                {(user.role === "GERENTE-ROLE" ||
                  user.role === "ADMIN-ROLE") && (
                  <Link legacyBehavior href={"/reportes"}>
                    <a
                      className={`nav-link ${
                        props.router.pathname === "/reportes" ? "active" : ""
                      }`}>
                      <div className="sb-nav-link-icon">
                        <i className="fas fa-chart-bar"></i>
                      </div>
                      Reportes
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
export default withRouter(SideNav);
