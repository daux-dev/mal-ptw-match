'use strict'

const express = require("express");
const rateLimit = require("express-rate-limit");
const axios = require("axios");
require("dotenv").config();

const app = express();

const requestLimiter = rateLimit({
    windowMs: 1000,
    max: 1 
});

app.use(requestLimiter);

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.get("/match", async (req, res) => {
    console.log(req.query);
    const user1 = req.query.user1;
    const user2 = req.query.user2;
    const matches = await compareLists(user1, user2);
    res.send(matches.join("<br/>"));
});

// const user1 = "daux";
// const user2 = "riiya";

async function getPtwList(user) {
    try {
        const res = await axios.get("https://api.myanimelist.net/v2/users/" + user + "/animelist?offset=0&limit=1000&nsfw=true&status=plan_to_watch", {
            headers: {
                "X-MAL-CLIENT-ID": process.env.MAL_ID
            }
        });
        return res.data.data.map(el => el.node);
    } catch (error) {
        console.log(error)
    }
}

async function compareLists(user1, user2) {
    const list1 = await getPtwList(user1);
    const list2 = await getPtwList(user2);
    const matches = list1.filter(anime => list2.map(el => el.id).includes(anime.id));
    console.log(matches.map(el => el.title));

    return matches.map(el => el.title);
}

app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
})

// compareLists("daux", "riiya");