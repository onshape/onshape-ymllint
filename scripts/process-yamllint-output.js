import fs from 'fs';
import postCodeReview from './post-code-review.js';

export default async function parseYamllintOutput (github, context, filepath, post_warnings, open_issues) {
  const rawOutput = fs.readFileSync(filepath, 'utf-8');

  const lines = rawOutput.trim().split('\n');
  const grouped = {};
  let currentFile = null;

  // Get yamllint result from input file
  for (const line of lines) {
    if (line.startsWith('::group::')) {
      currentFile = line.replace('::group::', '').trim();
      grouped[currentFile] = {};
    } else if (line.startsWith('::endgroup::')) {
      currentFile = null;
    } else {
      const match = line.match(/::(.+) file=(.+),line=(\d+),col=\d+::\d+:\d+ \[(.*?)\] (.+)/);
      if (match) {
        const [ , level, , lineNum, rule, message ] = match;
        const errorLevel = level[0].toUpperCase() + level.slice(1);

        if (errorLevel === 'Warning' && post_warnings === 'false') {
          continue; // Skip warnings if post_warnings is false
        } else {
          if (!grouped[currentFile][lineNum]) {
            grouped[currentFile][lineNum] = [];
          }
          grouped[currentFile][lineNum].push(`Line ${ lineNum }: [${ errorLevel }] [${ rule }] ${ message }`);
        }
      }
    }
  }

  // Format output and open issue comments
  let result = '';
  for (const [ file, issues ] of Object.entries(grouped)) {
    result += `${ file }\n`;

    for (const line of Object.keys(issues)) {
      const messages = issues[line];
      result += `line=${ line }\n`;
      for (const msg of messages) {
        result += `  ${ msg }\n`;
      }

      if (open_issues === 'true') {
        await postCodeReview(github, context, file, line, messages.join('\n  '));
      }
    }
  }

  fs.writeFileSync(filepath, result.trim());
}
