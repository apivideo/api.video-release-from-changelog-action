const fs = require('fs');
const readline = require('readline');
const semver = require('semver')
const core = require('@actions/core');
const { Octokit, App } = require("octokit");
const github = require('@actions/github');

async function getVersionsFromChangelog(changelogFilePath) {
    const fileStream = fs.createReadStream(changelogFilePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let currentVersion;
    const versions = [];
    for await (let line of rl) {
        const versionRegexResult = /.*\s+\[v?([\d\.]+)\].*/.exec(line);
        if (versionRegexResult) {
            currentVersion = versionRegexResult[1];
            versions[currentVersion] = [];
            continue;
        }

        if (!currentVersion) {
            continue;
        }

        line = line.trim();

        const detailsRegexResult = /^\s*-\s*([^\s].*)/gm.exec(line);
        if (detailsRegexResult) {
            versions[currentVersion].push(detailsRegexResult[1]);
        }
        else if (line.length > 0) {
            versions[currentVersion][versions[currentVersion].length - 1] += "\n" + line;
        }
    }
    return versions;
}

try {
    const githubAuthToken = core.getInput('github-auth-token', { required: true });
    const changelogFilePath = core.getInput('changelog-file-path', { trimWhitespace: true }) || "CHANGELOG.md";
    const prefix = core.getInput('prefix', { trimWhitespace: true });

    getVersionsFromChangelog(changelogFilePath)
        .then(async (versions) => {
            const lastChangelogVersion = Object.keys(versions)[0];
            const lastChangelogDetails = versions[lastChangelogVersion];

            const octokit = github.getOctokit(githubAuthToken);

            const releases = await octokit.rest.repos.listReleases({
                repo: github.context.repo.repo,
                owner: github.context.repo.owner,
            });

            const lastRelease = releases.data[0] ? releases.data[0].name : undefined;

            const versionName = prefix + lastChangelogVersion;
            if (!lastRelease || semver.lte(lastRelease, versionName)) {
                if (lastRelease && semver.eq(lastRelease, versionName)) {
                    if (releases.data[0].draft) {
                        await octokit.rest.repos.deleteRelease({
                            repo: github.context.repo.repo,
                            owner: github.context.repo.owner,
                            release_id: releases.data[0].id,
                        });
                        core.info(`Draft release ${versionName} already exists. Replacing it.`);
                    } else {
                        core.info(`The release ${versionName} already exists. Nothing will be done.`);
                        return;
                    }
                }
                const payload = {
                    repo: github.context.repo.repo,
                    owner: github.context.repo.owner,
                    draft: true,
                    prerelease: false,
                    body: lastChangelogDetails.map(s => "- " + s).join("\n"),
                    tag_name: versionName,
                    name: versionName,
                };
                await octokit.rest.repos.createRelease(payload);
                core.info(`Draft release ${versionName} has been created.`)
            } else {
                core.info(`Nothing to do.`)
            }
        }).catch(e => core.setFailed(e))

} catch (error) {
    core.setFailed(error.message);
}