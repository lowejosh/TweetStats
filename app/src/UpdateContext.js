import React, { useState } from "react";

export const UpdateContext = React.createContext();

export const UpdateContextProvider = ({ children }) => {
  const [update, setUpdate] = useState(0);
  const [trackerList] = useState({});

  return (
    <UpdateContext.Provider value={{ trackerList, update, setUpdate }}>
      {children}
    </UpdateContext.Provider>
  );
};
