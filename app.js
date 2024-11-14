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
            const user1 = req.query.user1;
            const user2 = req.query.user2;
            const matches = await compareLists(user1, user2);
            res.render("index", {
                user1: user1,
                user2: user2,
                list: matches
            });
        } else {
            res.render("index", {
                home: true
            });
        }
    } catch (error) {
        console.log(error);
    }
    
});

// https://www.geeksforgeeks.org/how-to-delay-a-loop-in-javascript-using-async-await-with-promise/
function waitforme(millisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, millisec);
    })
}

/* Get MAL users ptw-list */
async function getPtwList(user) {
    try {
        let offset = 0;
        let loops = 1;
        let ptwList = [];
        for (let i = 0; i < loops; i++) {
                console.log(user + " request: " + (i + 1));

                const res = await axios.get("https://api.myanimelist.net/v2/users/" + user + "/animelist?offset=" + offset + "&limit=1000&nsfw=true&status=plan_to_watch", {
                    headers: {
                        "X-MAL-CLIENT-ID": process.env.MAL_ID // MAL API KEY
                    }
                });

                ptwList = ptwList.concat(res.data.data.map(el => el.node));

                if (ptwList.length == offset + 1000) { // add iteration if at query limit
                    loops++;
                    offset = offset + 1000;
                    await waitforme(1000); //add 1 sec delay between iterations in case of rate limits
                };

        }

        console.log(user + " ptw: " + ptwList.length);
        return ptwList;
    } catch (error) {
        console.log(error);
        return;
    }
}

/* Compare 2 ptw-lists and return matches */
async function compareLists(user1, user2) {
    try {
        console.log("-------------------------");
        const list1 = await getPtwList(user1);
        const list2 = await getPtwList(user2);
        if (list1 && list2) {
            const matches = list1.filter(anime => list2.map(el => el.id).includes(anime.id)); /* 🤕 */

            console.log("matches: " + matches.length);
            console.log("-------------------------");

            return matches;   
        } else {
            return;
        }
        
    } catch (error) {
        console.log(error);
    }
    
}


/* Start web server */
app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
});
