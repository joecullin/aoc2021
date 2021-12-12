const {readLines} = require("../common/readInput");
const cloneDeep = require('lodash/cloneDeep');

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const connections = [];
    input.forEach(connection => {
        const pair = connection.split('-');
        connections.push({
            from: pair[0],
            to: pair[1],
        });
        connections.push({
            from: pair[1],
            to: pair[0],
        });
    });

    // Begin with all exits from the "start" cave.
    let paths = connections.filter(c => c.from === "start").map(c => {
        return {
            currentCave: c.to,
            steps: [c],
        };
    });

    const showPaths = (paths) => {
        const routes = [];
        paths.forEach(path => {
            routes.push([...path.steps.map(step => step.from), path.currentCave].join("-"));
        });
        console.log(`${routes.length} routes`);
        // console.log(routes.sort().join("\n"));
    };

    const answer = [];
    const step = () => {
        const pathsNew = [];
        paths.forEach(path => {
            const visitedCaves = path.steps.map(c => c.from);
            const nextSteps = connections
                // Find all exits from current cave:
                .filter(c => c.from === path.currentCave)
                // If we're at the end, don't leave:
                .filter(c => c.from !== "end")
                // Only go to large caves or small-and-not-yet-visited caves:
                .filter(c => /[A-Z]/.test(c.to) || !visitedCaves.includes(c.to));

            if (nextSteps.length){
                nextSteps.forEach(connection => {
                    const pathNew = cloneDeep(path);
                    pathNew.steps.push(connection);
                    pathNew.currentCave = connection.to;
                    pathsNew.push(pathNew);
                });
            }
            else{
                answer.push(cloneDeep(path));
            }
        });
        console.log("--------- active paths after step:");
        showPaths(pathsNew);
        if (pathsNew.length){
            paths = pathsNew;
            step();
        }
    }; 
    step();
    console.log("--------- final -----------");     
    showPaths(answer.filter(route => route.currentCave === "end"));
};

module.exports = { run };
