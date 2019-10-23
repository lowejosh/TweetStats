import React from "react";
import ReactDOM from "react-dom";
import AddTrackerContainer from "./AddTrackerContainer";

it("AddTrackerContainer renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<AddTrackerContainer />, div);
  ReactDOM.unmountComponentAtNode(div);
});
