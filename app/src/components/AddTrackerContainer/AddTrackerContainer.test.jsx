import React from "react";
import ReactDOM from "react-dom";
import AddTrackerContainer from "./AddTrackerContainer";
import { ContextProvider } from "../../Context";
import { UpdateContextProvider } from "../../UpdateContext";

it("AddTrackerContainer renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <ContextProvider>
      <UpdateContextProvider>
        <AddTrackerContainer />
      </UpdateContextProvider>
    </ContextProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
