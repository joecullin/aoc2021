const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const entries = input.map(line => {
        const parts = line.split(/\|/g);
        return {
            patterns: parts[0].trim().split(" "),
            output: parts[1].trim().split(" "),
        };
    });

    const diff = (a,b) => {
        const aLetters = a.split('');
        const bLetters = new Set(b.split(''));
        const difference = [...new Set(aLetters.filter(x => !bLetters.has(x)))];
        return difference;
    }

    const solve = (entry) => {
        const all = entry.patterns.concat(entry.output);

        const one = all.find(digit => digit.length === 2);
        const four = all.find(digit => digit.length === 4);
        const seven = all.find(digit => digit.length === 3);
        const eight = all.find(digit => digit.length === 7);

        const segments = {};

        // The diff between seven and one is the zero segment.
        segments[0] = diff(seven, one).pop();

        // The segments in one occur 8 and 9 times overall.
        const oneSegments = one.split('');
        const zeroCount = entry.patterns.filter(digit => digit.includes(oneSegments[0])).length;
        if (zeroCount === 9){
            segments[5] = oneSegments[0];
            segments[2] = oneSegments[1];
        }
        else{
            segments[2] = oneSegments[0];
            segments[5] = oneSegments[1];
        }

        const counts = {};
        entry.patterns.forEach(digit => {
            const segments = digit.split('');
            segments.forEach(segment => {
                counts[segment] = counts[segment] ? (counts[segment] + 1) : 1;
            });
        });

        // segment one occurs 6x overall
        segments[1] = Object.keys(counts).find(segment => counts[segment] === 6);

        // segment 4 occurs 4x overall
        segments[4] = Object.keys(counts).find(segment => counts[segment] === 4);

        // segments 3 and 6 occur 7x
        const lastTwo = Object.keys(counts).filter(segment => counts[segment] === 7);
        if (four.includes(lastTwo[0])){
            segments[3] = lastTwo[0];
            segments[6] = lastTwo[1];
        }
        else{
            segments[6] = lastTwo[0];
            segments[3] = lastTwo[1];
        }

        const zero = entry.patterns.find(pattern => (
            pattern.includes(segments[0]) &&
            pattern.includes(segments[1]) &&
            pattern.includes(segments[2]) &&
            !pattern.includes(segments[3]) &&
            pattern.includes(segments[4]) &&
            pattern.includes(segments[5]) &&
            pattern.includes(segments[6])
        ));

        const two = entry.patterns.find(pattern => (
            pattern.includes(segments[0]) &&
            !pattern.includes(segments[1]) &&
            pattern.includes(segments[2]) &&
            pattern.includes(segments[3]) &&
            pattern.includes(segments[4]) &&
            !pattern.includes(segments[5]) &&
            pattern.includes(segments[6])
        ));

        const three = entry.patterns.find(pattern => (
            pattern.includes(segments[0]) &&
            !pattern.includes(segments[1]) &&
            pattern.includes(segments[2]) &&
            pattern.includes(segments[3]) &&
            !pattern.includes(segments[4]) &&
            pattern.includes(segments[5]) &&
            pattern.includes(segments[6])
        ));

        const five = entry.patterns.find(pattern => (
            pattern.includes(segments[0]) &&
            pattern.includes(segments[1]) &&
            !pattern.includes(segments[2]) &&
            pattern.includes(segments[3]) &&
            !pattern.includes(segments[4]) &&
            pattern.includes(segments[5]) &&
            pattern.includes(segments[6])
        ));

        const six = entry.patterns.find(pattern => (
            pattern.includes(segments[0]) &&
            pattern.includes(segments[1]) &&
            !pattern.includes(segments[2]) &&
            pattern.includes(segments[3]) &&
            pattern.includes(segments[4]) &&
            pattern.includes(segments[5]) &&
            pattern.includes(segments[6])
        ));

        const nine = entry.patterns.find(pattern => (
            pattern.includes(segments[0]) &&
            pattern.includes(segments[1]) &&
            pattern.includes(segments[2]) &&
            pattern.includes(segments[3]) &&
            !pattern.includes(segments[4]) &&
            pattern.includes(segments[5]) &&
            pattern.includes(segments[6])
        ));

        const decoder = [
            zero,
            one,
            two,
            three,
            four,
            five,
            six,
            seven,
            eight,
            nine,
        ].map(digit => {
            return digit.split('').sort().join('');
        });

        console.log(`${JSON.stringify(decoder)}`);
            
        const output = entry.output.map(digit => {
            const sorted = digit.split('').sort().join('');
            return decoder.findIndex(digit => digit === sorted);
        }).join('');
        console.log(`output: ${output}`);
        return parseInt(output);
    };

    let total = 0;
    entries.forEach(entry => {
        total += solve(entry);
    });

    console.log(`total: ${total}`);
};

module.exports = { run };
