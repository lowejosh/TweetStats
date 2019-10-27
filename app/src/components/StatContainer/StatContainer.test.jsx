import React from "react";
import ReactDOM from "react-dom";
import StatContainer from "./StatContainer";
import { UpdateContextProvider } from "../../UpdateContext";

it("StatContainer renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <UpdateContextProvider>
      <StatContainer />
    </UpdateContextProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
