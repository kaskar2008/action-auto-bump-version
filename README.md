# Auto bump version

Bumps target branch version on PR merge.

## Inputs

### `major-label`

Major version bump label. Default `"major"`.

### `minor-label`

Minor version bump label. Default `"minor"`.

### `default`

Default version command (valid `npm version` argument). Default `"patch"`.

## Example usage

```yaml
name: Bump version

on:
  pull_request:
    types: [ closed ]
    branches: [ master, dev, "release/*" ]

jobs:
  tag-and-push:
    if: github.event.pull_request.merged == true

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
        with:
          ref: ${{ github.event.pull_request.base.ref }}

      - name: Auto bump version
        uses: kaskar2008/action-auto-bump-version@v1
```
