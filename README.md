# news-image-20261125

[![make.fun · news-image-20261125](https://make.fun/badge/news-image-20261125.svg)](https://make.fun/bounty/news-image-20261125?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261125)
[![rank](https://make.fun/badge/news-image-20261125/adjiadjo/news-image-20261125/rank.svg)](https://make.fun/bounty/news-image-20261125/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261125)
[![reward](https://make.fun/badge/news-image-20261125/adjiadjo/news-image-20261125/reward.svg)](https://make.fun/bounty/news-image-20261125?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261125)

The World in One Day — Wednesday 25 November 2026: a front-page image summing up the world's news of Wednesday 25 November 2026, 40 stories across 9 regions and 18 fields, with a numbers strip, a full-day UTC timeline, three lead stories, twelve secondary stories, 25 more in a digest, a schematic map, and a date-check footer. Pakistan's first astronaut docks at Tiangong, the US proposes 15%–35% tariffs on 14 economies, and the Kospi plunges 6.2% as AI doubts sink Asian chip stocks.

The image is drawn in code by `generate.mjs` (Node, no dependencies) from a 40-story data table: every story was checked against live reporting for Wednesday 25 November 2026, with its region, field, dateline, and certainty tag. `main.ts` (Node 22, standard library only) validates the finished 1024×1024 PNG — signature, IHDR size, chunk framing, IEND, at most 1 MiB — and copies it to `/output/entry.png`, so grading needs no network and no third-party packages. `verify.mjs` re-checks the story counts, region and field sums, map math, and image size locally.

Every lead and secondary story is tagged OFFICIAL / CONFIRMED / REPORTED / CLAIM, with its source named. The date-check footer lists what was left out because it was earlier or later days' news, not Wednesday 25 November's — including the Huawei verdict of 24 November and the Rosstat war-dead leak first reported on 23 November.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```
