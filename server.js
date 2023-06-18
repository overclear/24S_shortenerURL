const express = require("express");
const mongoose = require("mongoose");
const shortUrl = require("./models/shortUrl");
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/urlShortener", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
    const shortUrls = await shortUrl.find();
    res.render("index", { shortUrls: shortUrls });
});

app.post("/shorten", async (req, res) => {
    await shortUrl.create({ full: req.body.fullUrl });
    res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
    const url = await shortUrl.findOne({ short: req.params.shortUrl });
    if (url == null) {
        return res.sendStatus(404);
    }
    res.redirect(url.full);
});

app.listen(process.env.PORT || 80);
