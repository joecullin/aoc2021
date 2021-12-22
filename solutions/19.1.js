const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    let scanners = [];
    let current = {};
    input.filter(line => line !== "").forEach(line => {
        if (line.includes("scanner")){
            current = {
                id: line.replace(/[^0-9]/g, ''),
                beacons: []
            };
            scanners.push(current);
        }
        else{
            const [x,y,z] = line.split(",").map(val => parseInt(val));
            current.beacons.push({x,y,z});
        }
    });

    scanners.forEach(scanner => {
        scanner.distances = [];
        for (let i=0; i<scanner.beacons.length; i++){
            for (let j=i+1; j<scanner.beacons.length; j++){
                const distance = 
                    Math.abs(scanner.beacons[i].x - scanner.beacons[j].x) +
                    Math.abs(scanner.beacons[i].y - scanner.beacons[j].y) +
                    Math.abs(scanner.beacons[i].z - scanner.beacons[j].z);
                scanner.distances.push(distance);
                // console.log(distance);
            }
        }
    });
    console.log(`scanners: ${JSON.stringify(scanners, null, 2)}`);

    for (let i=0; i<scanners.length; i++){
        const scanner = scanners[i];
        for (let j=i+1; j<scanners.length; j++){
            const otherScanner = scanners[j];
            let common = 0;
            scanner.distances.forEach(distance => {
                if (otherScanner.distances.includes(distance)){
                    common++;
                }
            });
            console.log(`scanners ${scanner.id} and ${otherScanner.id} have ${common} common distances`);
        }
    }
};

module.exports = { run };
