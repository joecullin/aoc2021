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

    // Find all x value(s) that land in target
    const checkX = (velocity, minX, maxX) => {
        let x = 0;
        while (x <= maxX && velocity > 0){
            x += velocity--;
        }
        return x >= minX;
    };
    let goodX = [];
    let testVelocity = 1;
    for (;;){
        if (testVelocity > target.xRight){
            break;
        }
        if (checkX(testVelocity, target.xLeft, target.xRight)){
            goodX.push(testVelocity);
        }
        testVelocity++;
    }

    // Find max Y (from part 1)

    const checkMaxY = (velocity, targetY, cutoff) => {
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
        if (checkMaxY(testVelocity, target.yBottom, cutoff)){
            maxYVelocity = testVelocity;
            break;
        }
        testVelocity++;
    }

    // Find all y value(s) that land in target

    const checkY = (velocity) => {
        let y = 0;
        while (y >= target.yBottom){
            y += velocity--;
        }
        return y <= target.yTop;
    };

    let goodY = [];
    testVelocity = target.yBottom;
    for (let testVelocity = target.yBottom; testVelocity<=maxYVelocity; testVelocity++){
        if (checkY(testVelocity)){
            goodY.push(testVelocity);
        }
    }

    // Check all combos of good x and good y. It's pretty fast.

    let good = 0;
    goodX.forEach(x => {
        goodY.forEach(y => {
            const velocity = {x,y};
            const trace = fireProbe(velocity);
            if (trace.some(p => onTarget(p.x, p.y))){
                good++;
            }
        });
    });

    console.log(`good: ${good}`);
};

module.exports = { run };
