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

    let core = {};
    let stepCount = 0;
    steps.forEach(step => {
        console.log(`step ${++stepCount}`);
        for (let x=step.range.x.start; x<=step.range.x.end; x++){
            for (let y=step.range.y.start; y<=step.range.y.end; y++){
                for (let z=step.range.z.start; z<=step.range.z.end; z++){
                    core[`${x},${y},${z}`] = step.on;
                }
            }
        }
    });
    const count = Object.values(core).filter(c => c).length;
    console.log(`answer: ${count}`);
};

module.exports = { run };
