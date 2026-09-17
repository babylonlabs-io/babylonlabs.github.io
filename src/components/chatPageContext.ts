const PAGE_CONTEXT_PREFIX = 'I am currently reading this page with url';

export function buildPageAwareQuestion(
  question: string,
  pageUrl: string
): string {
  const trimmedQuestion = question.trim();

  if (!trimmedQuestion) {
    return '';
  }

  const trimmedPageUrl = pageUrl.trim();
  if (!trimmedPageUrl) {
    return trimmedQuestion;
  }

  return `${PAGE_CONTEXT_PREFIX} ${trimmedPageUrl}.\n\n${trimmedQuestion}`;
}
