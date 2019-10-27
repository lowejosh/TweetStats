import React from "react";
import ReactDOM from "react-dom";
import WordCloud from "./WordCloud";

it("WordCloud renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<WordCloud list={[]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
