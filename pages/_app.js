import "../public/css/styles.css";
import "../public/css/admin-style.css";
import "../public/vendor/bootstrap/css/bootstrap.min.css";
import "../public/vendor/fontawesome-free/css/all.min.css";

import React from "react";
import App from "next/app";
import Head from "next/head";
import UserContext from "../components/UserContext";
import Router from "next/router";
import Notifications, { notify } from "react-notify-toast";
import { API_URL } from "../components/Config";
import "mapbox-gl/dist/mapbox-gl.css";

export default class MyApp extends App {
  alarm;
  pagoRealizado;
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      token: null,
      categorias: [],
      ofertas: [],
      sid: false,
      sucursales: [],
      admSucursal: false,
    };
  }

  setSitNav = (sid) => {
    this.setState({
      sid,
    });
  };
  setAdmSucursal = (admSucursal) => {
    localStorage.setItem("fribar-sucursal", admSucursal);
    this.setState({
      admSucursal,
    });
  };
  setSucursales = (sucursales) => {
    this.setState({
      sucursales,
    });
  };
  getCategorias = async () => {
    try {
      const res = await fetch(`${API_URL}/categoria`);
      const categorias = await res.json();
      this.setState({
        categorias: categorias.body,
      });
    } catch (err) {
      this.setState({
        categorias: [],
      });
    }
  };
  getOfertas = () => {
    fetch(`${API_URL}/offers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          notify.show("Error el en servidor", "error");
        } else {
          this.setState({
            ofertas: data.body,
          });
        }
      })
      .catch((error) => {
        notify.show("Error en el servidor", "error", 2000);
      });
  };

  componentDidMount() {
    this.getCategorias();
    this.getOfertas();
    const user = localStorage.getItem("fribar-user");
    const token = localStorage.getItem("fribar-token");
    const admSucursal = localStorage.getItem("fribar-sucursal");
    if (user && token) {
      this.setState({
        user: JSON.parse(user),
        token,
        admSucursal,
      });
    }
  }

  signIn = (user, token) => {
    localStorage.setItem("fribar-user", JSON.stringify(user));
    localStorage.setItem("fribar-token", token);
    this.setState(
      {
        user,
        token,
      }
      //   () => {
      //     Router.push("/");
      //   }
    );
  };

  setUser = (user) => {
    localStorage.setItem("fribar-user", JSON.stringify(user));
    this.setState({
      user,
    });
  };
  signOut = () => {
    localStorage.removeItem("fribar-user");
    localStorage.removeItem("fribar-token");
    this.setState({
      user: null,
      token: null,
    });
    Router.replace("/login");
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <title>Tiendas Begú</title>
          <meta name="description" content="Best PWA app in the world!" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="mask-icon" href="/icons/mask-icon.svg" color="#FFFFFF" />
          <meta name="theme-color" content="#ffffff" />
          <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/icons/touch-icon-ipad.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/touch-icon-iphone-retina.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="167x167"
            href="/icons/touch-icon-ipad-retina.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="https://yourdomain.com" />
          <meta name="twitter:title" content="My awesome PWA app" />
          <meta
            name="twitter:description"
            content="Best PWA app in the world!"
          />
          <meta name="twitter:image" content="/icons/twitter.png" />
          <meta name="twitter:creator" content="@DavidWShadow" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="My awesome PWA app" />
          <meta
            property="og:description"
            content="Best PWA app in the world!"
          />
          <meta property="og:site_name" content="My awesome PWA app" />
          <meta property="og:url" content="https://yourdomain.com" />
          <meta property="og:image" content="/icons/og.png" />
          {/* add the following only if you want to add a startup image for Apple devices. */}
          <link
            rel="apple-touch-startup-image"
            href="/images/apple_splash_2048.png"
            sizes="2048x2732"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/apple_splash_1668.png"
            sizes="1668x2224"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/apple_splash_1536.png"
            sizes="1536x2048"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/apple_splash_1125.png"
            sizes="1125x2436"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/apple_splash_1242.png"
            sizes="1242x2208"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/apple_splash_750.png"
            sizes="750x1334"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/apple_splash_640.png"
            sizes="640x1136"
          />
        </Head>
        <div
          className={
            this.state.sid ? `sb-nav-fixed sb-sidenav-toggled` : "sb-nav-fixed"
          }>
          <Notifications />
          <UserContext.Provider
            value={{
              user: this.state.user,
              token: this.state.token,
              categorias: this.state.categorias,
              getSucursales: this.state.sucursales,
              getAdmSucursal: this.state.admSucursal,
              sid: this.state.sid,
              alarm: this.alarm,
              pagoRealizado: this.pagoRealizado,

              getOfertas: this.state.ofertas,
              signIn: this.signIn,
              signOut: this.signOut,
              setUser: this.setUser,
              setSitNav: this.setSitNav,
              setSucursales: this.setSucursales,
              setAdmSucursal: this.setAdmSucursal,
            }}>
            <Component {...pageProps} />
          </UserContext.Provider>
        </div>
      </>
    );
  }
}
