export async function showTransition() {
    await fetch(`/api/v1/proxy/connect?action=connect-transition`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        }
    );

    await fetch(`/api/v1/proxy/connect?action=disconnect-timelapse`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        }
    );

    await fetch(`/api/v1/proxy/select?action=deselect-timelapse`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        }
    );

    setTimeout(async () => {
        // Reset Timelapse
        await fetch(`/api/v1/proxy/connect?action=connect-timelapse`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
            }
        );

        await fetch(`/api/v1/proxy/select?action=select-timelapse`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
            }
        );

        await fetch(`/api/v1/proxy/connect?action=disconnect-transition`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
            }
        );
    }, 2000);
}

export async function initSpeed() {
    await fetch(`/api/v1/proxy/connect?action=connect-timelapse`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        }
    );

    await fetch(`/api/v1/proxy/select?action=select-timelapse`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        }
    );

    await fetch(`/api/v1/proxy/selected`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: `{
                "transport": {
                    "controls": {
                        "speed": {
                        "id": 1764094783148,
                        "valuetype": "ParamRange",
                        "min": 0,
                        "max": 10,
                        "value": 1
                      }
                    }
                }
            }`,
    });
}

export async function handleSpeed(inc) {
    await fetch(`/api/v1/proxy/select?action=select-timelapse`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        }
    );

    // Call the new server endpoint to handle speed logic persistently
    await fetch("/api/v1/composition/speed/temporary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inc: inc })
    });
}