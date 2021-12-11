# Advent of Code 2021

My solutions for https://adventofcode.com/2021

Initial setup:
```
npm install
```

Run a puzzle, for example the second part of day one:
```
./run.js --puzzle=1.2
```

My inputs are used by default.
If you want to use a different input, specify a file with the `--input` parameter.
```
./run.js --puzzle=1.2 --input=./inputs/01.sample.txt
```

When I'm working on the solution, I tend to run it like the following. (Normally I would get instant linting in vscode, but I like to do these in vi.)
```
npm run lint && ./run.js --puzzle=1.2 --input=./inputs/01.sample.txt
```

I'm logging some notes & thoughts in [journal.md](journal.md).
