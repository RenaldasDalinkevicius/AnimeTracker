import React from "react";
import reactDom from "react-dom";
import App from "./App"
import {Provider} from "react-redux"
import store from "./store"

reactDom.render(<Provider store={store}><App/></Provider>, document.querySelector("#root"))