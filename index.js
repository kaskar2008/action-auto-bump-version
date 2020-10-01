const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('child_process');

try {
  exec(`git config user.name "GitHub Actions Bot" && git config user.email "<>"`, (err) => {
    if (err) {
      throw err;
    }
  });

  const majorLabel = core.getInput('major-label');
  const minorLabel = core.getInput('minor-label');
  const defaultCommand = core.getInput('default');
  let command = '';

  /**
   * @type string[]
   */
  const labels = github.context.payload.pull_request.labels.map(el => el.name);

  if (labels.includes(majorLabel)) {
    command = 'major';
  } else if (labels.includes(minorLabel)) {
    command = 'minor';
  } else {
    command = defaultCommand;
  }

  exec(`npm version ${command} && git push --follow-tags`, (err) => {
    if (err) {
      throw err;
    }
  });
} catch (error) {
  core.setFailed(error.message);
}
