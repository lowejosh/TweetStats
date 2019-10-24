import React, { useState } from "react";
import io from "socket.io-client";
// import AYLIENTextAPI from "aylien_textapi";

export const Context = React.createContext();

export const ContextProvider = ({ children }) => {
  const URL = document.location.href;
  const baseURL = URL.substr(0, URL.indexOf(":", 7));
  const [socket] = useState(io(`${baseURL}:8001`));
  // const textapi = new AYLIENTextAPI({
  //   application_id: "a668caa7",
  //   application_key: "345375f0602d12b01bc98a2865eaae18"
  // });

  return (
    <Context.Provider value={{ baseURL, socket }}>{children}</Context.Provider>
  );
};
