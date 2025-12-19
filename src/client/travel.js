import {handleSpeed} from "./scripts/routes.js";

const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();

        let info = button.getAttribute('data-mode');
        if (info === "car") {
            await handleSpeed(1.6)
        } else if (info === "public") {
            await handleSpeed(1.3)
        } else {
            await handleSpeed(1)
        }

        const poll = document.getElementById('poll');
        poll.style.transform = `translateX(${window.innerWidth}px)`;

        setTimeout(() => {
            poll.innerHTML = `
                <h1>Aspects of Biodiversity</h1>
                <h2>About the Exhibit</h2>
                <p>This exhibit was created to help promote UWE's Climate and Sustainability Plan 2024 – 2026. In particular, it represents UWE's commitment to reducing biodiversity loss.</p>
                <p>As humans, our presence impacts the world around us and, through passiveness and neglect, we are some of the biggest contributors to biodiversity loss. However, it is through human intervention that we can protect our environments and habitats.</p>
                <p>Look to the timelapse on the wall: you may notice the environment being destroyed before your eyes, but, with a little effort, it can be restored to its former glory.</p>
                <p>Step before the screen and raise your arms to grow some new trees!</p>
                <p><a href="https://www.uwe.ac.uk/-/media/uwe/documents/about/sustainability/climate-and-sustainability-plan-2024-26.pdf">Click here to find out more about UWE's Climate and Sustainability Plan</a></p>
        `;
            poll.style.transform = 'translateX(0)';
        }, 200)

    });
})