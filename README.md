## onshape-ymllint

### Description:
Ymllint is a composite Git Workflow designed to lint modified `.yml` and `.yaml` files in a pull request using the yamllint Python package. It can optionally post comments on the pull request or create issues based on configurable input options using GitHub REST APIs. By default, it checks for both errors and warnings, posts comments on the pull request, and opens issues for any detected errors/warnings.

If no output is posted due to the input configuration, developers can still view detailed yamllint results in the workflow run's Actions page on GitHub.

### Usage
```bash
name: Yaml-Lint

on:
  pull_request:
    types: [opened, synchronize]
    paths:
      - '**/*.yml'
      - '**/*.yaml'

jobs:
  YamlLint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: onshape/actions-checkout@onshape-latest
      
      - name: Run yamllint 
        uses: onshape/onshape-ymllint@test-v0
        with:
          post-comments: "true"
          post-warnings: "true"
          post-summary:  "false"  # diable posting PR comments
          open-issues: "true"
```
### Inputs
#### post-comments (True/False Default: True): 
Acts as the master switch to control whether the workflow posts comments on the pull request. Set to true to enable posting results information to Pull Request, or false to prevent posting any information.

#### post-warnings (True/False Default: True): 
Controls whether the workflow should include yamllint warnings in its output. Set to true to report warnings alongside errors, or false to suppress all warnings.

#### post-summary (True/False Default: True):  
Controls whether the workflow should post a final summary as a PR comment listing all detected errors and, if include_warnings is enabled, warnings as well. Set to true to include yammlint results in a PR comment, or false to skip it. It should only be enabled when post_pr_comments is set to true.

#### open-issues(True/False Default: True): 
Controls whether the workflow should open issues in PR code review line by line listing all detected errors and, if include_warnings is enabled, warnings as well. Set to true to open issues, or false to skip it. It should only be enabled when post_pr_comments is set to true.

### Outputs
The workflow will succeed on exit code 0 if there's no errors found in the changed `.yml` and `.yaml` files, even if there warnings. And the workflow will fail on exit code 1 if there are any error detected in the yamllint.

#### Files 
`/config/.yamllint`: defines the linting rules used by yamllint 
`/scripts/`: contains Node.js code to post code review and PR comments 

