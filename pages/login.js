import { useContext } from "react";
import Notifications, { notify } from "react-notify-toast";
import FacebookLogin from "react-facebook-login";
import { encode } from "base-64";
import Router from "next/router";
import UserContext from "../components/UserContext";
import { API_URL } from "../components/Config";
const Login = () => {
  var auth2;
  //   const [state, dispatch] = useStateValue()
  const { signIn } = useContext(UserContext);
  const setUser = ({ token, usuario }) => {
    if (usuario.idPersona.status !== false) {
      if (
        usuario.role === "ADMIN-ROLE" ||
        usuario.role === "USER-ROLE" ||
        usuario.role === "GERENTE-ROLE" ||
        usuario.role === "ALMACEN-ROLE"
      ) {
        signIn(usuario, token);
        switch (usuario.role) {
          case "GERENTE-ROLE":
            Router.push("/");
            break;
          case "ADMIN-ROLE":
            Router.push("/");
            break;
          case "USER-ROLE":
            Router.push("/venta");
            break;
          case "ALMACEN-ROLE":
            Router.push("/productos");
            break;
        }
      } else
        notify.show(
          "Su cuenta no tiene permisos para ingresar al sistema de administracion ",
          "warning"
        );
    } else
      notify.show(
        "Su cuenta no tiene permisos para ingresar al sistema de administracion ",
        "warning"
      );
  };

  function handlerSubmit() {
    event.preventDefault();
    let headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + encode(event.target[0].value + ":" + event.target[1].value)
    );
    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: headers,
    })
      .then((res) => res.json())
      .then((response) => {
        response.error
          ? notify.show(response.body, "warning")
          : setUser(response.body);
      })
      .catch((err) => {
        notify.show(err.message, "error");
      });
  }

  return (
    <>
      <div className="bg-sign">
        <Notifications />
        <div id="layoutAuthentication">
          <div id="layoutAuthentication_content">
            <main>
              <img src="/img/diseño1.png" alt="190" width="190" />

              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-5">
                    <div className="card shadow-lg border-0 rounded-lg mt-5 card-modi">
                      <div className="card-header card-sign-header">
                        <h3 className="text-center font-weight-light my-4">
                          Inicio de sesión
                        </h3>
                      </div>

                      <div className="card-body">
                        <form onSubmit={handlerSubmit}>
                          <div className="form-group">
                            <label
                              className="form-label"
                              htmlFor="inputEmailAddress">
                              Usuario*
                            </label>
                            <input
                              className="form-control py-3"
                              id="inputEmailAddress"
                              type="text"
                              placeholder="Introduzca su usuario"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label
                              className="form-label"
                              htmlFor="inputPassword">
                              Contraseña*
                            </label>
                            <input
                              className="form-control py-3"
                              id="inputPassword"
                              type="password"
                              placeholder="introzca su contraseña"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <div className="custom-control custom-checkbox">
                              <input
                                className="custom-control-input"
                                id="rememberPasswordCheck"
                                type="checkbox"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="rememberPasswordCheck">
                                Recordar contraseña
                              </label>
                            </div>
                          </div>
                          <div className="form-group d-flex align-items-center justify-content-between mt-4 mb-0">
                            <button className="btn btn-sign hover-btn">
                              Ingresar
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      <style jsx>{`
        main {
          display: flex;
          height: 100vh;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        .btn-google {
          color: white;
          background-color: #ea4335;
          font-size: 15px;
          margin: 10px 20px;
          font-weight: 600;
        }
        .card-modi {
          margin-top: 0 !important;
        }
      `}</style>
    </>
  );
};

export default Login;
