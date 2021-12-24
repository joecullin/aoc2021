const {readLines} = require("../common/readInput");

const rangeMin = -50;
const rangeMax = 50;

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const steps = input.map(line => {
        const [onOff, rest] = line.split(" ");
        const step = {
            on: onOff==="on",
            range: {},
            inRange: true,
        };
        rest.split(",").forEach(axisSpec => {
            const [axis, rangeSpec] = axisSpec.split("=");
            let [start, end] = rangeSpec.split("..").map(v => parseInt(v));
            if ( (start < rangeMin && end < rangeMin) || (start > rangeMax && end > rangeMax) ){
                // totally outside of range
                step.inRange = false;
            }
            if (start < rangeMin){
                start = rangeMin;
            }
            if (end > rangeMax){
                end = rangeMax;
            }
            step.range[axis] = {start, end};
        });
        return step;
    }).filter(step => step.inRange);

    const inRange = (number, range) => {
        return (range.start <= number && number <= range.end);
    };

    const overlapping = (cube1, cube2) => {
        const difference = subtractChunk(cube1, cube2);
        if (difference.length === 1 && JSON.stringify(difference[0]) === JSON.stringify(cube1)){
            console.log(`No overlap between ${JSON.stringify(cube1)} and ${JSON.stringify(cube2)}`);
            return false;
        }
        console.log(`FOUND overlap between ${JSON.stringify(cube1)} and ${JSON.stringify(cube2)}\n${JSON.stringify(difference)}`);
        return true;
    };

    const fullyContains = (outer, inner) => {
        return (inRange(inner.x.start, outer.x) && inRange(inner.x.end, outer.x) &&
                inRange(inner.y.start, outer.y) && inRange(inner.y.end, outer.y) &&
                inRange(inner.z.start, outer.z) && inRange(inner.z.end, outer.z));
    };

    const subtractChunk = (origCube, removeCube) => {
        console.log(`origCube: ${JSON.stringify(origCube)}`);
        console.log(`subtract: ${JSON.stringify(removeCube)}`);

        const points = { x: [], y: [], z: [] };

        [origCube, removeCube].forEach(cube => {
            ["x", "y", "z"].forEach(axis => {
                points[axis].push(cube[axis].start);
                points[axis].push(cube[axis].end);
            });
        });
        ["x", "y", "z"].forEach(axis => {
            points[axis].sort((a,b) => a - b);
        });
        console.log(`points: ${JSON.stringify(points)}`);

        let allChunks = [];
        [0,1,2].forEach(xIndex => {
            [0,1,2].forEach(yIndex => {
                [0,1,2].forEach(zIndex => {
                    allChunks.push({
                        x: { start: points.x[xIndex], end: points.x[xIndex+1] },
                        y: { start: points.y[yIndex], end: points.y[yIndex+1] },
                        z: { start: points.z[zIndex], end: points.z[zIndex+1] },
                    });
                });
            });
        });
        allChunks = [...new Set(allChunks.map(c => JSON.stringify(c)))].map(s => JSON.parse(s)); // de-dupe and clone deep
        // console.log(`sub-chunks:`);
        // allChunks.forEach(chunk => { console.log(`${JSON.stringify(chunk)}`) });

        let remove = [];
        let keep = [];
        allChunks.forEach(chunk => {
            if (fullyContains(removeCube, chunk) && fullyContains(origCube, chunk)){
                remove.push(chunk);
            }
            else if (fullyContains(origCube, chunk)){
                keep.push(chunk);
            }
        });
        remove = [...new Set(remove.map(c => JSON.stringify(c)))].map(s => JSON.parse(s)); // de-dupe and clone deep
        keep = [...new Set(keep.map(c => JSON.stringify(c)))].map(s => JSON.parse(s)); // de-dupe and clone deep

        console.log(`removed:`);
        remove.forEach(chunk => { console.log(`${JSON.stringify(chunk)}`); });

        console.log(`kept:`);
        keep.forEach(chunk => { console.log(`${JSON.stringify(chunk)}`); });

        return keep;
    };

    const volume = (cube) => {
        const v= (cube.x.end - cube.x.start + 1) * (cube.y.end - cube.y.start + 1) * (cube.z.end - cube.z.start + 1);
        console.log(`volume of ${JSON.stringify(cube)} = ${v}`);
        return v;
    };

    const totalVolume = (cubes) => {
        return cubes.reduce( (acc, cube) => {
            return acc + volume(cube);
        }, 0);
    };

    let cubes = [steps.shift().range]; // assumes first step isn't "off"
    console.log(`total volume after 1st: ${totalVolume(cubes)}`);
    steps.forEach((step, stepIndex) => {
        console.log(`step: ${stepIndex+2}`);
        if (stepIndex > 1){ return } //JOE
        let newCubes = [];
        cubes.forEach(existingCube => {
            const snapshot = JSON.stringify(newCubes);
            console.log(`\none (existing): ${JSON.stringify(existingCube)}`);
            console.log(`two     (step): ${JSON.stringify(step.range)}`);
            if (fullyContains(existingCube, step.range)){
                console.log("-> 1 contains 2\n");
                if (step.on){
                    newCubes.push({...existingCube});
                }
                else{
                    newCubes.push(...subtractChunk(existingCube, step.range));
                    console.log(`newCubes after remove middle:`); newCubes.forEach(cube => { console.log(`${JSON.stringify(cube)}`) });
                }
                console.log(`volume now: ${totalVolume(newCubes)}`);
            }
            else if (fullyContains(step.range, existingCube)){
                console.log("-> 2 contains 1\n");
                if (step.on){
                    newCubes.push({...step.range});
                }
                else{
                    console.log(`newCubes after removing some:`); newCubes.forEach(cube => { console.log(`${JSON.stringify(cube)}`) });
                }
                console.log(`volume now: ${totalVolume(newCubes)}`);
            }
            else if (!overlapping(existingCube, step.range)){
                console.log("-> totally separate\n");
                if (step.on){
                    newCubes.push({...existingCube});
                    newCubes.push({...step.range});
                }
                else{
                    newCubes.push({...existingCube});
                }
                console.log(`volume now: ${totalVolume(newCubes)}`);
            }
            else{
                console.log("-> some overlap\n");
                if (step.on){
                    newCubes.push(...subtractChunk(existingCube, step.range));
                    console.log(`newCubes after first subtraction:`);
                    newCubes.forEach(cube => { console.log(`${JSON.stringify(cube)}`) });

                    newCubes.push({...step.range});
                    newCubes = [...new Set(newCubes.map(c => JSON.stringify(c)))].map(s => JSON.parse(s)); // de-dupe and clone deep
                    console.log(`newCubes after second:`); newCubes.forEach(cube => { console.log(`${JSON.stringify(cube)}`) });
                }
                else{
                    newCubes.push(...subtractChunk(existingCube, step.range));
                    newCubes = [...new Set(newCubes.map(c => JSON.stringify(c)))].map(s => JSON.parse(s)); // de-dupe and clone deep
                    console.log(`newCubes after remove chunk:`); newCubes.forEach(cube => { console.log(`${JSON.stringify(cube)}`) });
                }
                console.log(`volume now: ${totalVolume(newCubes)}`);
            }

            newCubes = [...new Set(newCubes.map(c => JSON.stringify(c)))].map(s => JSON.parse(s)); // de-dupe and clone deep
            const compare = JSON.stringify(newCubes);
            if (snapshot === compare){
                console.log(`==================================== no change in that iteration`);
            }
            else{
                console.log(`==================================== CHANGED in past iteration`);
            }
        });
        cubes = [...new Set(newCubes.map(c => JSON.stringify(c)))].map(s => JSON.parse(s)); // de-dupe and clone deep
        console.log(`total volume: ${totalVolume(cubes)}`);
    });
    console.log(`cubes (${cubes.length}):`);
    cubes.forEach(cube => { console.log(`${JSON.stringify(cube)}`) });
};

module.exports = { run };
