// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="es">
        <Head>
          <meta name="theme-color" content="#e65c5b"></meta>
          <link rel="icon" href="/img/diseño1.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script src="/js/jquery-3.4.1.min.js"></script>
          <script src="/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
          <script src="/js/scripts.js"></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
