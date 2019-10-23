import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { TextField, Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    borderBottom: "1px solid #808080",
    padding: theme.spacing(3, 3, 3),
    marginBottom: theme.spacing(5)
  },
  textField: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  button: {
    width: "100%",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3)
  }
}));

const AddTrackerContainer = props => {
  const classes = useStyles();
  const [hashTagValue, setHashtagValue] = useState(null);

  const addTracker = () => {
    console.log(hashTagValue);
  };

  return (
    <div className={classes.heroContent}>
      <Container maxWidth="sm">
        <Typography variant="h6" align="center" color="textSecondary">
          Add a tracker
        </Typography>
        <TextField
          id="outlined-with-placeholder"
          label="Enter a hashtag"
          onChange={e => {
            setHashtagValue(e.target.value);
          }}
          placeholder="#example"
          className={classes.textField}
          margin="normal"
          variant="outlined"
        />
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              addTracker();
            }}
          >
            Track
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default AddTrackerContainer;
