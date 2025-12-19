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

app.get("/api/v1/proxy/selected", async (req, res) => {
    const url = `${process.env.ADDRESS}/api/v1/composition/clips/selected`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    res.send(data);
});

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

app.post("/api/v1/composition/speed/temporary", jsonParser, async (req, res) => {
    const { inc } = req.body;
    const url = `${process.env.ADDRESS}/api/v1/composition/clips/selected`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const speedParam = data.transport.controls.speed;
        const paramId = speedParam.id;
        let speedValue = speedParam.value;

        speedValue += inc;
        if (speedValue > 5) speedValue = 5;

        await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "transport": {
                    "controls": {
                        "speed": {
                            "id": paramId,
                            "valuetype": "ParamRange",
                            "min": 0,
                            "max": 10,
                            "value": speedValue
                        }
                    }
                }
            }),
        });

        setTimeout(async () => {
            try {
                const freshResponse = await fetch(url);
                const freshData = await freshResponse.json();
                
                const freshSpeedParam = freshData.transport.controls.speed;
                const freshId = freshSpeedParam.id;
                let currentVal = freshSpeedParam.value;

                // Decrement from the CURRENT value, not the old one
                currentVal -= inc;
                if (currentVal < 1) currentVal = 1;

                await fetch(url, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "transport": {
                            "controls": {
                                "speed": {
                                    "id": freshId,
                                    "valuetype": "ParamRange",
                                    "min": 0,
                                    "max": 10,
                                    "value": currentVal
                                }
                            }
                        }
                    }),
                });
                console.log("Speed reset executed. New value:", currentVal);
            } catch (timeoutError) {
                console.error("Error executing speed reset:", timeoutError);
            }
        }, 5000);

        res.status(200).send("Speed increased, reset scheduled.");

    } catch (error) {
        console.error("Error handling speed:", error);
        res.status(500).send("Internal Server Error: " + error.message);
    }
});

ViteExpress.listen(app, 3000, () =>
    console.log("Server is listening on port 3000..."),
);
