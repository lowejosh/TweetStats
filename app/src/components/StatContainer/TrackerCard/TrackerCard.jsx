import React, { useEffect, useContext } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Context } from "../../../Context";

const useStyles = makeStyles(theme => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(5)
  },
  cardContent: {
    flexGrow: 1
  }
}));

const TrackerCard = ({ tracker }) => {
  const classes = useStyles();
  const { baseURL } = useContext(Context);

  const updateCard = () => {};

  const fetchStats = async tag => {
    const hashStatsURL = `${baseURL}:8001/hash-stats/${tag}`;
    let res = await axios.get(hashStatsURL);
    let data = res.data;
    console.log(data);
  };

  useEffect(() => {
    // fetch new wordlist
    fetchStats(tracker.tracking.substr(1, tracker.tracking.length - 1));
    updateCard();
    setInterval(updateCard, 5000);
  }, []);

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom variant="h5" component="h2">
          {tracker.tracking}
        </Typography>
        <Typography>Tweets: {tracker.tweetCount}</Typography>
        <Typography>
          Most recent tweet:{" "}
          {tracker.tweetCount
            ? tracker.tweetList[tracker.tweetCount - 1]
            : "N/A"}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Remove
        </Button>
      </CardActions>
    </Card>
  );
};

export default TrackerCard;
