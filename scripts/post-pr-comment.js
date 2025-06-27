import fs from 'fs';

const ansiPattern = [
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
  '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
].join('|');

const ansiRegExp = new RegExp(ansiPattern, 'gu');

export default async function postPullRequestComment (github, context, header, message, errorFile, shouldExit) {
  if (!errorFile && !message) {
    console.log('no message or error file provided');
    process.exit(1);
  }

  if (errorFile) {
    const errors = fs.readFileSync(errorFile, 'utf8');
    message = errors;
  }

  console.log(`messages: ${ message }`);

  const commentBody = `## ${ header }\n\`\`\`\n${ stripAnsi(message) }\n\`\`\``;
  await github.rest.issues.createComment({
    ...context.repo,
    issue_number: context.issue.number,
    body: commentBody,
  });

  if (shouldExit) {
    process.exit(1);
  }
}

function stripAnsi (string) {
  return string.replace(ansiRegExp, '');
}
