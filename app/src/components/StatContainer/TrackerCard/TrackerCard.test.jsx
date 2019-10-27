import React from "react";
import ReactDOM from "react-dom";
import TrackerCard from "./TrackerCard";
import { ContextProvider } from "../../../Context";

it("TrackerCard renders without crashing", () => {
  const div = document.createElement("div");
  const tracker = {
    tracking: "test",
    tweetCount: 0,
    tweetList: []
  };
  ReactDOM.render(
    <ContextProvider>
      <TrackerCard tracker={tracker} />
    </ContextProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
