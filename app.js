'use strict'

const axios = require("axios");
require("dotenv").config();

const user1 = "daux";
const user2 = "riiya";

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

async function compareLists() {
    const list1 = await getPtwList(user1);
    const list2 = await getPtwList(user2);
    const matches = list1.filter(anime => list2.map(el => el.id).includes(anime.id));
    console.log(matches.map(el => el.title));
}

compareLists();