import React, { useRef, useState, useEffect } from "react";
import mostCommon from "most-common";
import TagCloud from "react-tag-cloud";
import randomColor from "randomcolor";
import Skeleton from "@material-ui/lab/Skeleton";
import { Fade } from "@material-ui/core";
import "./tooltip.css";

const WordCloud = ({ list, seconds }) => {
  // every 5 seconds, if the list has changed, recalculate wordcloud
  // parse the data into one single array of words
  const [updated, setUpdated] = useState(true);
  const [top10Words, setTop15Words] = useState(null);
  useEffect(() => {
    let wordList = [];
    if (seconds % 5 === 0) {
      if (list) {
        list.map(tweet => {
          tweet.split(" ").map(word => {
            if (word.substr(0, 1) !== "#" && word.length < 10) {
              wordList.push(word);
            }
          });
        });
      }
      // get top 15 words
      if (wordList.length) {
        const top10 = mostCommon(wordList, 10);
        setTop15Words(top10);
      }
    }
  }, [list, seconds]);

  useEffect(() => {
    setUpdated(true);
  }, [list.length]);

  const normalizedWordList = words => {
    // var
    const minFont = 8;
    const maxFont = 72;
    const fontDiff = maxFont - minFont;

    //calculate the total hits
    let totalHits = 0;
    words.forEach(word => {
      totalHits += word.count;
    });

    let output = [];
    words.forEach((word, index) =>
      output.push(
        <div className="tag-item-wrapper">
          <div
            key={index}
            style={{
              fontSize:
                minFont + Math.sqrt(word.count / totalHits, 2) * fontDiff
            }}
          >
            {word.token}
          </div>
          <div className="tag-item-tooltip">{word.count} occurences</div>
        </div>
      )
    );

    return output;
  };

  const getTagCloud = () => (
    <>
      {top10Words ? (
        <TagCloud
          className="tag-cloud"
          style={{
            fontWeight: "bold",
            fontStyle: "italic",
            color: () =>
              randomColor({
                hue: "green"
              }),
            padding: 5,
            width: "100%",
            height: "100%"
          }}
        >
          {normalizedWordList(top10Words)}
        </TagCloud>
      ) : (
        <Skeleton variant="rect" width="100%" height="100%" />
      )}
    </>
  );

  const [TagCloudBuffer, setTagCloudBuffer] = useState(getTagCloud());
  useEffect(() => {
    if (updated) {
      setTagCloudBuffer(getTagCloud());
      setUpdated(false);
    }
  }, [top10Words]);
  return (
    <div style={{ width: "25%" }}>
      <Fade in={seconds % 5 === 0} timeout={500}>
        {TagCloudBuffer}
      </Fade>
    </div>
  );
};

export default WordCloud;
