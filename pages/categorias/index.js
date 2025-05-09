import TopNavbar from "../../components/Navbar";
import SideNav from "../../components/Navbar/SideNav";
import Footer from "../../components/Footer";
import Link from "next/link";
import { useContext } from "react";
import UserContext from "../../components/UserContext";
import { API_URL } from "../../components/Config";
const Categorias = () => {
  const { categorias } = useContext(UserContext);
  return (
    <>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Categorias</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link legacyBehavior href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Categories</li>
              </ol>
              <div className="row justify-content-between">
                <div className="col-lg-12">
                  <Link legacyBehavior href="/categorias/nuevo">
                    <a className="add-btn hover-btn">Agregar Nueva Categoria</a>
                  </Link>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mt-30 mb-30">
                    <div className="card-title-2">
                      <h4>Todas las Categorias</h4>
                    </div>
                    <div className="card-body-table">
                      <div className="table-responsive">
                        <table className="table ucp-table table-hover">
                          <thead>
                            <tr>
                              <th style={{ width: "60px" }}>ID</th>
                              <th>Nombre</th>
                              <th>Descripcion</th>
                              <th>Estado</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categorias.length > 0
                              ? categorias.map((cate, index) => (
                                  <tr key={index}>
                                    <td>{cate._id}</td>

                                    <td>{cate.name}</td>
                                    <td>{cate.description}</td>
                                    <td>
                                      {cate.status ? (
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
                                        href="/categorias/[id]"
                                        as={`/categorias/${cate._id}`}>
                                        <a className="edit-btn">
                                          <i className="fas fa-edit"></i>
                                          Editar
                                        </a>
                                      </Link>
                                    </td>
                                  </tr>
                                ))
                              : ""}
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

export default Categorias;
