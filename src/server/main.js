import express from "express";
import ViteExpress from "vite-express";
import 'dotenv/config';
import bodyParser from "body-parser";

const app = express();
const jsonParser = bodyParser.json()

app.post("/api/v1/composition", async (req, res) => {
    res.send("");
});

app.post("/api/v1/proxy/connect", async (req, res) => {
    const {action} = req.query;
    let url = '';

    switch (action) {
        case "connect-transition":
            url = `${process.env.ADDRESS}/api/v1/composition/layers/3/clips/1/connect`;
            break;
        case "disconnect-transition":
            url = `${process.env.ADDRESS}/api/v1/composition/layers/3/clips/2/connect`;
            break;
        case "disconnect-timelapse":
            url = `${process.env.ADDRESS}/api/v1/composition/layers/1/clips/2/connect`;
            break;
        case "connect-timelapse":
            url = `${process.env.ADDRESS}/api/v1/composition/layers/1/clips/1/connect`;
            break;
    }

    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    res.send("")
});

app.post("/api/v1/proxy/select", async (req, res) => {
    const {action} = req.query;
    let url = '';

    switch (action) {
        case "deselect-timelapse":
            url = `${process.env.ADDRESS}/api/v1/composition/layers/1/clips/2/select`;
            break;
        case "select-timelapse":
            url = `${process.env.ADDRESS}/api/v1/composition/layers/1/clips/1/select`;
            break;
    }

    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    res.send("")
})

// Define the PUT endpoint
app.put('/api/v1/proxy/selected', jsonParser, async (req, res) => {
    const id = req.params.id;
    const requestBody = req.body;

    const url = `${process.env.ADDRESS}/api/v1/composition/clips/selected`

    await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    res.status(200).json({
        message: 'Update successful',
        id: id,
        data: requestBody,
    });
});

ViteExpress.listen(app, 3000, () =>
    console.log("Server is listening on port 3000..."),
);
