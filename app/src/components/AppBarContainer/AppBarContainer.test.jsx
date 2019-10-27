import React from "react";
import ReactDOM from "react-dom";
import AppBarContainer from "./AppBarContainer";
import { ContextProvider } from "../../Context";

it("AppBarContainer renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<AppBarContainer />, div);
  ReactDOM.unmountComponentAtNode(div);
});
