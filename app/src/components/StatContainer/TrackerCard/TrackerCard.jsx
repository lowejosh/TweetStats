import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Context } from "../../../Context";
import { LinearProgress, Divider, Box } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import WordCloud from "../WordCloud/WordCloud";

const useStyles = makeStyles(theme => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(5)
  },
  cardContent: {
    flexGrow: 1
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  stat: {
    marginTop: "0.8em",
    color: theme.palette.text.primary
  },
  ml: {
    marginLeft: "1em"
  }
}));

const TrackerCard = ({ tracker }) => {
  const classes = useStyles();
  const [fetching, setFetching] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [data, setData] = useState(null);
  const { baseURL } = useContext(Context);

  const updateCard = () => {};

  const fetchStats = async tag => {
    const hashStatsURL = `${baseURL}:8001/hash-stats/${tag}`;
    let res = await axios.get(hashStatsURL);
    setData(res.data);
    setFetching(false);
  };

  const getPercent = (historical, current) => {
    const color = historical > current ? "#bb0000" : "#4BCA81";
    const percent =
      historical > current
        ? `(-${Math.round(100 - (current / historical) * 100)}%)`
        : `(+${Math.round((current / historical) * 100 - 100)}%)`;
    return <span style={{ fontWeight: "bold", color: color }}>{percent}</span>;
  };

  useEffect(() => {
    // fetch new wordlist
    fetchStats(tracker.tracking.substr(1, tracker.tracking.length - 1));
    updateCard();
    setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);
    setInterval(updateCard, 5000);
  }, [tracker]);

  return (
    <Card className={classes.card}>
      {fetching && <LinearProgress variant="query" />}
      <CardContent className={classes.cardContent}>
        <Typography variant="h4" component="h2">
          {tracker.tracking}
          <Divider className={classes.divider} />
        </Typography>
        {data ? (
          <>
            <Box display="flex" flexDirection="row">
              <WordCloud
                tweetCount={tracker.tweetCount}
                list={tracker.tweetList}
                seconds={seconds}
              />
              <Box className={classes.ml}>
                <Typography variant="h5">Historical stats</Typography>
                <Typography className={classes.stat}>
                  <b>{data.tweets + data.retweets}</b> tweets per hour
                </Typography>
                <Typography className={classes.stat}>
                  <b>{data.images.toFixed(2)}%</b> contain images
                </Typography>
                <Typography className={classes.stat} variant="h5">
                  {`Session stats (${new Date(1000 * seconds)
                    .toISOString()
                    .substr(11, 8)})`}
                </Typography>
                <Typography className={classes.stat}>
                  <b>{tracker.tweetCount}</b> tweets tracked
                </Typography>
                <Typography className={classes.stat}>
                  <b>
                    {Math.round(60 * (tracker.tweetCount / (seconds / 60)))}
                  </b>{" "}
                  tweets per hour{" "}
                  {tracker.tweetCount
                    ? getPercent(
                        data.tweets + data.retweets,
                        60 * (tracker.tweetCount / (seconds / 60))
                      )
                    : ""}
                </Typography>
                {/* <Typography className={classes.stat}>
                  Most recent tweet:{" "}
                  {tracker.tweetCount
                    ? tracker.tweetCount < 49
                      ? tracker.tweetList[tracker.tweetCount - 1]
                      : tracker.tweetList[48]
                    : "N/A"}
                </Typography> */}
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Box display="flex" flexDirection="row">
              <Skeleton variant="rect" width="25%" height="auto" />
              <Box className={classes.ml}>
                <Skeleton height={31} width={350} />
                <Skeleton height={23} width={350} />
                <Skeleton height={23} width={350} />
                <Skeleton height={31} width={350} />
                <Skeleton height={23} width={350} />
                <Skeleton height={23} width={350} />
              </Box>
            </Box>
          </>
        )}
        {/* <br />
        {Math.round(data.images * 100)}% contain images
        <br /> */}
      </CardContent>
    </Card>
  );
};

export default TrackerCard;
