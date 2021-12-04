const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const numbersToDraw = input.shift().trim().split(',').map(val => parseInt(val));
    input.shift();
    const boards = input.map(line => line.trim()).join("|").trim().split("||").map(boardInput => {
        const board = [];
        boardInput.split("|").forEach( (rowVal, row) => {
            rowVal.split(/\s+/).forEach( (val, col) => {
                board.push({
                    row,
                    col,
                    val: parseInt(val),
                    marked: false
                });
            });
        });
        return board;
    });

    const markNumber = (number) => {
        boards.forEach(board => {
            board.forEach(space => {
                if (space.val === number){
                    space.marked = true;
                }
            });
        });
    };

    const isWinner = (board) => {
        const size = Math.sqrt(board.length);
        for (let i=0; i<size; i++){
            const checkRow = board.filter(space => space.row === i && space.marked);
            const checkCol = board.filter(space => space.col === i && space.marked);
            if (checkRow.length === size || checkCol.length === size){
                return true;
            }
        }
        return false;
    };

    let loser;
    for (let i=0; i<numbersToDraw.length; i++){
        const number = numbersToDraw[i];
        markNumber(number);
        let losers = boards.filter(board => !isWinner(board));
        if (losers.length === 1){
            loser = losers[0];
        }
        else if (losers.length === 0){
            const sum = loser.filter(space => !space.marked)
            .reduce(
                (previousValue, currentValue) => {
                    return previousValue + currentValue.val
                }, 0);
            console.log(`score: ${sum}*${number} --> ${sum*number}`);
            break;
        }
    }
};

module.exports = { run };
