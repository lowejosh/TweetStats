const twitter = require("twitter");
const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const port = 8001;
const dotenv = require("dotenv");
const azure = require("azure-storage");
const redis = require("redis");

// setup
dotenv.config();
const entGen = azure.TableUtilities.entityGenerator;
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
const server = require("http").Server(app);
const io = require("socket.io")(server);
const table = "hashtag";
const row = "1";

// create the hashtag table if it doenst exist
var tableService = azure.createTableService(
  process.env.AZURE_STORAGE_ACCOUNT,
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
tableService.createTableIfNotExists(table, (error, result, response) => {
  if (!error) {
    console.log(result ? "table created" : "table exists");
  }
});

// twitter keys
const client = new twitter({
  consumer_key: "Qcf3PooY861t6QLhnusU53igN",
  consumer_secret: "7cvuTKpJvc52ykOZEMbtjExbgstYZiGej0LZYXoSjJdiRrzbLe",
  access_token_key: "1112201521481957377-JF81wukk6WuV1MCmY1HGtFHZpw9CFc",
  access_token_secret: "wFhvSGfAtFRlGPIyEFTblnZDA02pALuQGn2I9JJdxslP2"
});

// redis client
const redisClient = redis.createClient();
redisClient.on("error", err => {
  console.log("error in redis: " + err);
});

// RiteKit API persisting retrieval (redis / azure storage)
app.get("/hash-stats/:hashtag", (req, res) => {
  const hashtag = req.params.hashtag;

  // try to retrieve from local redis
  redisClient.get(`hashtag:${hashtag}`, async (redisError, redisRes) => {
    if (redisRes && !redisError) {
      console.log(`${hashtag} data found in redis cache`);
      const resultJSON = JSON.parse(redisRes);
      return res.status(200).json(resultJSON); // return the result
    } else {
      // else try to retrieve from azure storage
      const azureKeyExists = false;
      tableService.retrieveEntity(
        table,
        hashtag,
        row,
        async (error, result, response) => {
          if (!error && result.tweets && result.retweets && result.images) {
            // format the payload
            console.log(`retrieved ${hashtag} entity from ${table} table`);
            const payload = formatHashstatResponse(result);

            // update redis cache
            console.log(`${hashtag} cache updated`);
            saveDataToCache(hashtag, payload);

            // return the result
            res.json(payload);
          } else {
            // pull from web if it doesnt exist
            console.log('retrieving data from web api');
            const URL = `https://api.ritekit.com/v1/stats/multiple-hashtags?tags=${hashtag}&client_id=701bd27d1221d4c542398832e3367c8976350a1e1cbe`;
            await axios.get(URL).then(async data => {
              if (data.data) {
                const stats = data.data.stats[0];

                // update redis cache
                console.log(`${hashtag} cache updated`);
                saveDataToCache(hashtag, stats);

                // update azure table
                const entity = {
                  PartitionKey: entGen.String(hashtag),
                  RowKey: entGen.String(row),
                  tweets: entGen.Int32(stats.tweets),
                  retweets: entGen.Int32(stats.retweets),
                  images: entGen.Double(stats.images)
                };
                tableService.insertEntity(
                  table,
                  entity,
                  (error, result, response) => {
                    if (!error) {
                      console.log(
                        `${hashtag} entity added into ${table} table`
                      );
                    } else {
                      console.log(
                        `error inserting ${hashtag} entity into ${table} table`
                      );
                    }
                  }
                );

                // return the result
                res.json(data.data.stats[0]);
              }
            });
          }
        }
      );
    }
  });
});

// formats an azure object response to a desired response object
const formatHashstatResponse = data => {
  return {
    tweets: data.tweets._,
    retweets: data.retweets._,
    images: data.images._
  };
};

const expiry = 259200;
const saveDataToCache = (hashtag, data) => {
  redisClient.setex(`hashtag:${hashtag}`, expiry, JSON.stringify(data));
};

// Client socket connection and twitter streams (socketio)
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
