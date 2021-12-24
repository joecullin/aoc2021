#!/usr/bin/env node

const run = async () => {
    let one;
    let two;

    // one = {"x":{"start":10,"end":12},"y":{"start":10,"end":12},"z":{"start":10,"end":12}};
    // two = {"x":{"start":11,"end":13},"y":{"start":11,"end":13},"z":{"start":11,"end":14}};

    // one = {"x":{"start":10,"end":12},"y":{"start":10,"end":12},"z":{"start":10,"end":12}};
    // two = {"x":{"start":11,"end":13},"y":{"start":11,"end":13},"z":{"start":11,"end":13}};

    one ={"x":{"start":10,"end":10},"y":{"start":10,"end":10},"z":{"start":12,"end":12}};
    two = {"x":{"start":9,"end":11},"y":{"start":9,"end":11},"z":{"start":9,"end":11}};

    // one = {"x":{"start":11,"end":13},"y":{"start":11,"end":13},"z":{"start":11,"end":13}};
    // two = {"x":{"start":9,"end":11},"y":{"start":9,"end":11},"z":{"start":9,"end":11}};

    one = {"x":{"start":1,"end":5},"y":{"start":1,"end":5},"z":{"start":1,"end":5}};
    two = {"x":{"start":3,"end":10},"y":{"start":3,"end":10},"z":{"start":3,"end":10}};


    const inRange = (number, range) => {
        return (range.start <= number && number <= range.end);
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
        allChunks = [...new Set(allChunks.map(c => JSON.stringify(c)))].map(s => JSON.parse(s)); // de-dupe
        allChunks.forEach(chunk => {
            console.log(`${JSON.stringify(chunk)}`);
        });

        let remove = [];
        let keep = [];
        let space = [];
        allChunks.forEach(chunk => {
            if (fullyContains(removeCube, chunk) && fullyContains(origCube, chunk)){
                remove.push(chunk);
            }
            else if (fullyContains(origCube, chunk)){
                keep.push(chunk);
            }
            else{
                space.push(chunk);
            }
        });
        remove = [...new Set(remove.map(c => JSON.stringify(c)))].map(s => JSON.parse(s)); // de-dupe and clone deep
        keep = [...new Set(keep.map(c => JSON.stringify(c)))].map(s => JSON.parse(s)); // de-dupe and clone deep
        space = [...new Set(space.map(c => JSON.stringify(c)))].map(s => JSON.parse(s)); // de-dupe and clone deep

        console.log(`removed:`);
        remove.forEach(chunk => { console.log(`${JSON.stringify(chunk)}`); });

        console.log(`kept:`);
        keep.forEach(chunk => { console.log(`${JSON.stringify(chunk)}`); });

        console.log(`space:`);
        space.forEach(chunk => { console.log(`${JSON.stringify(chunk)}`); });

        return keep;
    };

    const cubes = [];
    cubes.push(...subtractChunk(one, two));
    console.log(`cubes:`);
    cubes.forEach(cube => { console.log(`${JSON.stringify(cube)}`) });
};

run();

