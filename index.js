const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('child_process');

try {
  exec(`git config user.name "GitHub Actions Bot" && git config user.email "action@github.com"`, (err) => {
    if (err) {
      throw err;
    }
  });

  const labelMap = {
    major: core.getInput('major-label'),
    minor: core.getInput('minor-label'),
    patch: core.getInput('patch-label'),
  };

  const defaultCommand = core.getInput('default');
  const isDefaultCommand = Boolean(core.getInput('should-default'));
  let command = isDefaultCommand ? defaultCommand : '';

  /**
   * @type string[]
   */
  const labels = github.context.payload.pull_request.labels.map(el => el.name);

  for (const key in labelMap) {
    const element = labelMap[key];
    if (labels.includes(element)) {
      command = key;
      break;
    }
  }

  if (command) {
    exec(`npm version ${command} && git push --follow-tags --no-verify`, (err) => {
      if (err) {
        throw err;
      }
    });
  }
} catch (error) {
  core.setFailed(error.message);
}
