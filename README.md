[![badge](https://img.shields.io/twitter/follow/api_video?style=social)](https://twitter.com/intent/follow?screen_name=api_video) &nbsp; [![badge](https://img.shields.io/github/stars/apivideo/api.video-release-from-changelog-action?style=social)](https://github.com/apivideo/api.video-release-from-changelog-action) &nbsp; [![badge](https://img.shields.io/discourse/topics?server=https%3A%2F%2Fcommunity.api.video)](https://community.api.video)
![](https://github.com/apivideo/.github/blob/main/assets/apivideo_banner.png)
<h1 align="center">release-from-changelog-action</h1>

[api.video](https://api.video) is the video infrastructure for product builders. Lightning fast video APIs for integrating, scaling, and managing on-demand & low latency live streaming features in your app.

# Table of contents

- [Table of contents](#table-of-contents)
- [Project description](#project-description)
- [Documentation](#documentation)
  - [Expected CHANGELOG file format](#expected-changelog-file-format)
  - [Inputs](#inputs)
      - [`github-auth-token`](#github-auth-token)
      - [`changelog-file-path`](#changelog-file-path)
      - [`prefix`](#prefix)
  - [Outputs](#outputs)
      - [`response`](#response)
  - [Example usage](#example-usage)

# Project description

If the last version of the changelog is newer than the last release of the repository, automatically create a new draft release

# Documentation

## Expected CHANGELOG file format
```markdown
## [0.1.0] - 2021-12-06
- Change 1
- Change 2
- ...
- Change n

## [0.0.1] - 2021-11-15
- Change 1
- ...

...
```

## Inputs

#### `github-auth-token`

**required** GitHub authentication token.

#### `changelog-file-path`

The path to the changelog file (default: "CHANGELOG.md")

#### `prefix`

A string to add as a prefix to the tag & release name (eg. "v", default: empty)

## Outputs

#### `response`

Result of the action.

## Example usage

```yml
uses: apivideo/api.video-release-from-changelog-action
with:
  github-auth-token: ${{ secrets.GITHUB_TOKEN }}
  changelog-file-path: 'my-changelog.md'
```
