import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { teal } from "@material-ui/core/colors";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import AddTrackerForm from "./components/AddTrackerContainer/AddTrackerContainer";
import StatContainer from "./components/StatContainer/StatContainer";
import "./App.css";
import AppBarContainer from "./components/AppBarContainer/AppBarContainer";

const theme = createMuiTheme({
  palette: {
    primary: teal
  }
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBarContainer />
      <AddTrackerForm />
      <StatContainer />
    </ThemeProvider>
  );
};

export default App;
