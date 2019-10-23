const createTracker = require("./twitterAPI");
const twitter = require("twitter");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = 8001;

const client = new twitter({
  consumer_key: "Qcf3PooY861t6QLhnusU53igN",
  consumer_secret: "7cvuTKpJvc52ykOZEMbtjExbgstYZiGej0LZYXoSjJdiRrzbLe",
  access_token_key: "1112201521481957377-JF81wukk6WuV1MCmY1HGtFHZpw9CFc",
  access_token_secret: "wFhvSGfAtFRlGPIyEFTblnZDA02pALuQGn2I9JJdxslP2"
});

app.get("/track/:hashtag", (req, res) => {
  const hashtag = req.params.hashtag;
  res.send(hashtag);
});

io.on("connection", socket => {
  socket.on("keyword", keyword => {
    console.log("Received keyword: " + keyword);

    const stream = client.stream("statuses/filter", {
      track: keyword
    });

    stream.on("data", event => {
      socket.emit(keyword, event.text);
      console.log(event.text);
      console.log(event.entities.hashtags);
    });

    stream.on("error", error => {
      throw error;
    });
  });
});

// const stream = client.stream("statuses/filter", {
//   track: "china"
// });
// stream.on("data", function(event) {
//   console.log(event.text);
//   console.log(event.entities.hashtags);
// });

// stream.on("error", function(error) {
//   throw error;
// });

server.listen(port, () => console.log(`listening on port ${port}!`));
