# Summary

リポジトリのプルリクエストがcreate～closeされるまでにかかった期間を出力するスクリプトです。

※注意※: 2000プルリクエストを超えるリポジトリでは動きません

# Usage

```shell script
GITHUB_OWNER={owner} GITHUB_REPOSITORY={repo} GITHUB_TOKEN={token} yarn dev
```
OR

```shell script
yarn build
GITHUB_OWNER={owner} GITHUB_REPOSITORY={repo} GITHUB_TOKEN={token} node ./dist/index.js
```

- owner: GitHub user name
- repo: Target repository name
- token: [Personal access tokens](https://github.com/settings/tokens)

Output sample
```text
┌─────────┬───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬───────────────┐
│ (index) │     0     │    1    │    2    │    3    │    4    │    5    │    6    │       7       │
├─────────┼───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────────────┤
│    0    │  'month'  │ '0 day' │ '1 day' │ '2 day' │ '3 day' │ '4 day' │ '5 day' │ 'over 6 days' │
│    1    │ '2020-06' │    9    │    0    │    0    │    0    │    0    │    0    │       3       │
│    2    │ '2020-07' │    2    │    0    │    0    │    0    │    0    │    0    │       2       │
│    3    │ '2020-08' │    6    │    0    │    0    │    0    │    0    │    0    │       0       │
│    4    │ '2020-09' │    9    │    0    │    1    │    0    │    0    │    0    │       0       │
│    5    │ '2020-10' │    3    │    1    │    0    │    0    │    0    │    0    │       0       │
└─────────┴───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴───────────────┘
```
