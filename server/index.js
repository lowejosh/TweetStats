const twitter = require("twitter");
const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const port = 8001;
//setup
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
const server = require("http").Server(app);
const io = require("socket.io")(server);

const client = new twitter({
  consumer_key: "Qcf3PooY861t6QLhnusU53igN",
  consumer_secret: "7cvuTKpJvc52ykOZEMbtjExbgstYZiGej0LZYXoSjJdiRrzbLe",
  access_token_key: "1112201521481957377-JF81wukk6WuV1MCmY1HGtFHZpw9CFc",
  access_token_secret: "wFhvSGfAtFRlGPIyEFTblnZDA02pALuQGn2I9JJdxslP2"
});

// app.get("/text-analysis/:hashtag", (req, res) => {
//   const hashtag = req.params.hashtag;
//   res.send(hashtag);
// });

app.get("/hash-stats/:hashtag", async (req, res) => {
  const hashtag = req.params.hashtag;
  const URL = `https://api.ritekit.com/v1/stats/multiple-hashtags?tags=${hashtag}&client_id=701bd27d1221d4c542398832e3367c8976350a1e1cbe`;
  await axios.get(URL).then(async data => {
    res.json(data.data);
  });
});

io.on("connection", socket => {
  console.log("client connected");
  let _streams = [];
  let streamsConnected = [false];
  let currentIndex = 0;

  socket.on("disconnect", () => {
    console.log("client disconnected");
    // disconnect twitter streams
    for (let i = 0; i < _streams.length; i++) {
      if (streamsConnected[i]) {
        _streams[i].destroy();
      }
    }
  });

  socket.on("keyword", keyword => {
    console.log("Received keyword: " + keyword);

    const stream = client.stream("statuses/filter", {
      track: keyword
    });

    _streams[currentIndex] = stream;
    streamsConnected[currentIndex] = true;
    currentIndex++;

    stream.on("data", event => {
      const tweet = {};
      tweet.lang = event.lang;
      // if it has an image
      tweet.hasImage = event.entities.media ? true : false;
      // if it is a retweet
      if (event.text.substr(0, 2) === "RT") {
        if (event.retweeted_status.text) {
          tweet.text = event.retweeted_status.text;
        } else if (event.text) {
          tweet.text = event.text;
        }
      } else {
        if (event.text) {
          tweet.text = event.text;
        }
        tweet.text = event.text;
      }
      socket.emit(keyword, tweet);
    });

    stream.on("error", error => {
      console.log("error in connecting to twitter api");
    });
  });
});
server.listen(port, () => console.log(`listening on port ${port}!`));
