import React, { useState, useContext } from "react";
import { makeStyles, Paper, Fade, Popper } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { TextField, Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Context } from "../../Context";
import { createTrackerModel } from "../../models/trackerModel";
import { UpdateContext } from "../../UpdateContext";

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
  },
  typography: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2)
  }
}));

const AddTrackerContainer = props => {
  const classes = useStyles();
  const [keyword, setKeyword] = useState("");
  const [popperOpen, setPopperOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [invalid, setInvalid] = useState(false);
  const { socket } = useContext(Context);
  const { update, setUpdate, trackerList } = useContext(UpdateContext);

  const addTracker = e => {
    const regex = /^#\w+$/;
    let tweetUpdateIndex = 2;
    if (!keyword.match(regex)) {
      setAnchorEl(e.currentTarget);
      setPopperOpen(true);
      setInvalid(true);
      setTimeout(() => {
        setInvalid(false);
        setPopperOpen(false);
      }, 3000);
    } else {
      trackerList[keyword] = createTrackerModel(keyword);
      socket.emit("keyword", keyword);

      // handle the tweets
      socket.on(keyword, data => {
        trackerList[keyword].languages[data.lang]++;
        trackerList[keyword].tweetCount++;

        // only keep the last 50 tweets
        if (trackerList[keyword].tweetCount < 50) {
          trackerList[keyword].tweetList.push(data.text);
        } else {
          trackerList[keyword].tweetList.pop();
          trackerList[keyword].tweetList.push(data.text);
        }

        // stale closure stuff
        tweetUpdateIndex += 2;
        setUpdate(update + tweetUpdateIndex);
      });
      setKeyword("");
      setUpdate(update + 1);
    }
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
            setKeyword(e.target.value);
          }}
          placeholder="#example"
          value={keyword}
          error={invalid}
          className={classes.textField}
          margin="normal"
          variant="outlined"
        />
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={e => {
              addTracker(e);
            }}
          >
            Track
          </Button>
          <Popper
            open={popperOpen}
            anchorEl={anchorEl}
            placement={"bottom"}
            transition
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  <Typography className={classes.typography}>
                    Please enter a valid hashtag
                  </Typography>
                </Paper>
              </Fade>
            )}
          </Popper>
        </Box>
      </Container>
    </div>
  );
};

export default AddTrackerContainer;
