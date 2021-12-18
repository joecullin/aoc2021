# Misc notes & thoughts.

I'm sticking with nodejs this year, and still feeling like I'm learning little new things. It's such a different type of coding (recursion!) than my day-to-day.

I'm in a private leaderboard with some https://www.barracuda.com/ colleagues.


---
## Day 14

Part 2 completes 26 steps before running out of memory on step 27 -- and that's just for the sample input.

Had to pause after part 1. Noting a thought here:

I don't need to store the full polymer. I just need to track counts of pairs.

Another thought: does the pattern repeat somehow?

...  Spent more time Tues night reworking this so that it computes one chunk at a time.

However, I used recursion, so now I think I'm running out of resources that way. It gets slower and slower and never finishes.

... spent the rest of the week on work stuff -- log4j motivated us to do a complex but much-needed and long-postponed elastic migration.

I think my next attempt will be to re-work my recursion to tail-recursion and then into a normal loop.

But since I'm 4 days behind and just getting back into things, I'm going to try some of the other recent days first.


---
## Day 11

I was worried part two would be one of those runs-for-12-hours-and-then-runs-out-of-memory kinds of twists, where I had to totally re-think my approach and spot the math trick. But it turned out to be another simple extension of part one.

One thing I've learned, comparing my current approach to past years, is to treat these 2-dimensional grids a single list of objects. I used to try wrangling them as 2-dimensional arrays in js, but it's so much easier to work with javascript's list functions on a single list.


---
## Day 10

Last bit of catching up to current.

Got lucky with part two. My leftover array from part one happened to be exactly what I needed for autocompletion.

---
## Day 8

Playing catch-up after 2 sick days, I decided up front that I would settle for ugly-but-working.

That turned out to be a good choice. I worked it out segment by segment with giant if statements, and got it on the first shot.

---
## Day 7

I was worried part 2 might turn out to be too slow for brute force.

Wound up being good enough.

If that hadn't worked, I probably would've tried started searching outward from the average position next.

---
## Setup

Copied repo from last year, removed all the input & solution files (kept only 01.1), and removed unused modules.

---
## Previous years

* 2018
    * I was minimally competent in nodejs, and forced myself to use this as a learning experience. Struggled with promises & async flow. Gave up after day 9.
    * https://github.com/joecullin/aoc2018
* 2019:
    * Comfortable in node by now, but still learning. Stopped after day 16 due to other demands on my time.
    * https://github.com/joecullin/aoc20x
* 2020:
    * Got all 50 stars! Some of the later puzzles were tough, though!
   * https://github.com/joecullin/aoc20x
* 2021:
    * You're looking at it. See my thoughts above.
    * https://github.com/joecullin/aoc20x
