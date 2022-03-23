const core = require('@actions/core');
const github = require('@actions/github');
const { exec, execSync } = require('child_process');

try {
  const inputs = {
    name: core.getInput('name'),
    email: core.getInput('email'),
    token: core.getInput('token') || process.env.TOKEN,
  };

  exec(`git config user.name "${inputs.name}" && git config user.email "${inputs.email}"`, (err) => {
    if (err) {
      throw err;
    }
  });

  const versionMap = ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease'];
  let command = '';

  /**
   * @type string[]
   */
  const labels = github.context.payload.pull_request.labels.map(el => el.name);

  for (const version of versionMap) {
    if (labels.includes(version)) {
      command = version;
      break;
    }
  }

  if (command) {
    exec(`npm version ${command} -m "%s\r\n\r\n\r\nskip-checks: true"`, (versionError, version) => {
      if (versionError) {
        core.setFailed(versionError.message);
        throw versionError;
      }

      exec('git push --follow-tags --no-verify', (pushError) => {
        if (pushError) {
          core.setFailed(pushError.message);
          throw pushError;
        }

        core.setOutput('tag', version);
      });
    });
  }
} catch (error) {
  core.setFailed(error.message);
}
