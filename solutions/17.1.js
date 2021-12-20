const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const [, x1, x2, y1, y2] = input.shift().replace(/[^-0-9]+/g, ",").split(",").map(p => parseInt(p));
    const target = {
        xLeft: x1,
        xRight: x2,
        yTop: y2,
        yBottom: y1,
    };

    const onTarget = (x,y) => {
        return (x >= target.xLeft && x <= target.xRight && y <= target.yTop && y >= target.yBottom);
    };

    const printGrid = (highlightPoints) => {
        let top = target.yTop;
        if (highlightPoints){
            top = Math.max(target.yTop, ...highlightPoints.map(p => p.y));
        }
        const CSI = "\x1B["; // ansi escape code
        for (let y=top; y>=target.yBottom; y--){
            for (let x=0; x<=target.xRight; x++){
                const endFormat = `${CSI}0m`;
                let startFormat = onTarget(x, y) ? `${CSI}32m` : `${CSI}37m`;
                if (highlightPoints?.some(p => p.x === x & p.y === y)){
                    startFormat = `${CSI}31m`;
                }
                process.stdout.write(`${startFormat}#${endFormat}`); 
            }
            process.stdout.write(` ${y}\n`);
        }
        process.stdout.write("\n"); 
    };

    const fireProbe = (startingVelocity) => {
        const position = {x: 0, y: 0};
        const currentVelocity = {...startingVelocity};
        const trace = [];
        while (position.y >= target.yBottom){
            trace.push({...position});
            position.x += currentVelocity.x;
            position.y += currentVelocity.y;
            currentVelocity.x = currentVelocity.x === 0 ? 0 : currentVelocity.x - 1;
            currentVelocity.y = currentVelocity.y - 1;
        }
        return trace;
    };

    // Find the x value(s) that result in a complete stall over the target.
    // (Turns out I don't actually need this, but I needed it as a mental step to visualizing the answer.)
    const findStoppingPoint = (velocity) => {
        let x = 0;
        while (velocity !== 0){
            x += velocity--;
        }
        return x;
    };
    let terminalX = [];
    let testVelocity = 0;
    let idealXVelocity = [];
    for (;;){
        const x = findStoppingPoint(testVelocity);
        if (x > target.xRight){
            break;
        }
        else if (x >= target.xLeft){
            terminalX.push(x);
            idealXVelocity.push(testVelocity);
        }
        testVelocity++;
    }

    // Find a y value that:
    //   - lands on the bottom-most row of the target
    //   - has a velocity of at least twice the target height at that moment

    const check = (velocity, targetY, cutoff) => {
        let y = 0;
        while (y >= targetY){
            if (y === targetY && velocity <= cutoff){
                return true;
            }
            y += velocity--;
        }
        return false;
    };

    testVelocity = 1;
    const cutoff = (Math.abs(target.yTop - target.yBottom) * -2) - 1;
    let maxYVelocity;
    for (;;){
        if (check(testVelocity, target.yBottom, cutoff)){
            maxYVelocity = testVelocity;
            break;
        }
        if (testVelocity > 10000){
            console.log(`giving up on finding y`);
            break;
        }
        testVelocity++;
    } 

    const trace = fireProbe({x: idealXVelocity[0], y: maxYVelocity});
    printGrid(trace);
    console.log(`${idealXVelocity[0]} , ${maxYVelocity}`);
    console.log(`answer: ${Math.max(...trace.map(p => p.y))}`);  
};

module.exports = { run };
