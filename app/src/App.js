import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { teal } from "@material-ui/core/colors";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import AddTrackerForm from "./components/AddTrackerContainer/AddTrackerContainer";
import StatContainer from "./components/StatContainer/StatContainer";
import "./App.css";
import AppBarContainer from "./components/AppBarContainer/AppBarContainer";
import { ContextProvider } from "./Context";
import { UpdateContextProvider } from "./UpdateContext";

const theme = createMuiTheme({
  palette: {
    primary: teal
  }
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <ContextProvider>
        <UpdateContextProvider>
          <CssBaseline />
          <AppBarContainer />
          <AddTrackerForm />
          <StatContainer />
        </UpdateContextProvider>
      </ContextProvider>
    </ThemeProvider>
  );
};

export default App;
