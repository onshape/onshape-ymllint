export default async function postCodeReview (github, context, filepath, line, commentBody) {
  await github.rest.pulls.createReviewComment({
    ...context.repo,
    pull_number: context.issue.number,
    commit_id: context.payload.pull_request.head.sha,
    path: filepath,
    position: parseInt(line, 10),
    start_line: parseInt(line, 10),
    line: parseInt(line, 10),
    body: commentBody,
  });
}
