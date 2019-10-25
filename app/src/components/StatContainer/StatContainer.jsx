import React, { useContext } from "react";
import Container from "@material-ui/core/Container";
import { UpdateContext } from "../../UpdateContext";
import { makeStyles } from "@material-ui/core/styles";
import TrackerCard from "./TrackerCard/TrackerCard";

const useStyles = makeStyles(theme => ({
  cardGrid: {
    padding: theme.spacing(0, 4, 0),
    paddingBottom: theme.spacing(4)
  }
}));

const StatContainer = props => {
  const { trackerList } = useContext(UpdateContext);
  const cardList = [];
  const classes = useStyles();

  Object.keys(trackerList).forEach((tracker, index) => {
    cardList.push(<TrackerCard key={index} tracker={trackerList[tracker]} />);
  });

  return (
    <Container className={classes.cardGrid} maxWidth="md">
      {cardList}
    </Container>
  );
};

export default StatContainer;
