'use strict'

const express = require("express");
const rateLimit = require("express-rate-limit");
const axios = require("axios");
require("dotenv").config();

const app = express();

const requestLimiter = rateLimit({
    windowMs: 1000,
    max: 2
});

app.use(requestLimiter);
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.get("/", async (req, res) => {
    try {
        if (req.query.user1 && req.query.user2) {
            console.log(req.query);
            const user1 = req.query.user1;
            const user2 = req.query.user2;
            const matches = await compareLists(user1, user2);
            res.render("index", {
                user1: user1,
                user2: user2,
                list: matches
            });
        } else {
            res.render("index");
        }
    } catch (error) {
        console.log(error);
    }
    
});

/* Get MAL users ptw-list */
async function getPtwList(user) {
    try {
        const res = await axios.get("https://api.myanimelist.net/v2/users/" + user + "/animelist?offset=0&limit=1000&nsfw=true&status=plan_to_watch", {
            headers: {
                "X-MAL-CLIENT-ID": process.env.MAL_ID // MAL API KEY
            }
        });
        return res.data.data.map(el => el.node);
    } catch (error) {
        console.log(error)
    }
}

/* Compare 2 ptw-lists and return matches */
async function compareLists(user1, user2) {
    try {
        const list1 = await getPtwList(user1);
        const list2 = await getPtwList(user2);
        const matches = list1.filter(anime => list2.map(el => el.id).includes(anime.id)); /* 🤕 */
        console.log(matches.map(el => el.title));

        return matches/* .map(el => el.title) */;
    } catch (error) {
        console.log(error);
    }
    
}


/* Start web server */
app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
});