// const cloneDeep = require('lodash/cloneDeep');
const {readLines} = require("../common/readInput");
const CSI = "\x1B[";

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const enhancementLookup = input.shift().split("");
    input.shift();

    let image = [];
    input.forEach( (row, rowIndex) => {
        row.split("").forEach( (val, colIndex) => {
            image.push({
                x: colIndex,
                y: rowIndex * -1,
                val
            });
        });
    });
    let border = {
        top: 3,
        left: -3,
        bottom: Math.min(...image.map(p => p.y)) - 3,
        right: Math.max(...image.map(p => p.x)) + 3,
    };

    const printImage = () => {
        console.log("-------------------");
        const rowNums = [...new Set(image.map(o => o.y))];
        rowNums.forEach(rowNum => {
            const row = image.filter(p => p.y === rowNum).sort((a,b) => a.y - b.y);
            row.forEach(pixel => {
                const endFormat = `${CSI}0m`;
                let startFormat = `${CSI}37m`; // cell.visited ? cell.winner ? `${CSI}32m` : `${CSI}31m` : `${CSI}37m`;
                process.stdout.write(`${startFormat}${pixel.val}${endFormat}`); 
            });
            process.stdout.write(` ${rowNum}\n`);
        });
    };

    const processPixel = (pixel) => {
        let enhancementString = "";
        [1,0,-1].forEach(row => {
            [-1,0,1].forEach(col => {
                const neighbor = image.find(p => p.y === row+pixel.y && p.x === col+pixel.x);
                enhancementString += neighbor?.val === "#" ? "1" : "0";
            });
        });
        const lookupIndex = parseInt(enhancementString, 2);
        return enhancementLookup[lookupIndex];
        // console.log(`pixel ${JSON.stringify(pixel)} --> ${enhancementString} (${lookupIndex})`);
    };

    // console.log(`enhancementLookup: ${JSON.stringify(enhancementLookup)}`);
    // console.log(`image: ${JSON.stringify(image)}`);
    // console.log(`border: ${JSON.stringify(border)}`);

    printImage();
        border.top += 10;
        border.right += 10;
        border.bottom -= 10;
        border.left -= 10;
    

    for (let i=0; i<50; i++){
        const updated = [];
        for (let y=border.top; y>=border.bottom; y--){
            for (let x=border.left; x<=border.right; x++){
                updated.push({
                    x,
                    y,
                    val: processPixel({x,y}),
                });
            }
        }
        border.top += 3;
        border.right += 3;
        border.bottom -= 3;
        border.left -= 3;
    
        image = updated;

        if (i % 5 === 0){
            printImage();
        }
        console.log(`i: ${i}`);
    }
    printImage();
    const count = image
        .filter(p => p.x >= -2 && p.x <= 102 && p.y <= 2 && p.y >= -102)
        .filter(p => p.val === "#")
        .length;
    console.log(`answer: ${count}`);
};

module.exports = { run };
