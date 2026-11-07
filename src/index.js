import React from "react";
import ReactDOM from "react-dom";
// Bootstrap first, then our own CSS (index.css here, App.css via App), so
// our rules win over Bootstrap's when specificity is equal.
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();
