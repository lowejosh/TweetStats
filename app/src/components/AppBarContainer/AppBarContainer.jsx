import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";

const AppBarContainer = props => (
  <AppBar position="relative">
    <Toolbar>
      <Typography variant="h6" color="inherit" noWrap>
        Twitter Feed Stats
      </Typography>
    </Toolbar>
  </AppBar>
);

export default AppBarContainer;
