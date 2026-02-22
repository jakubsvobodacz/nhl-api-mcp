import { NHLApiError, NHLNotFoundError, NHLRateLimitError } from 'nhl-api-client';

export function handleError(error: unknown) {
  if (error instanceof NHLNotFoundError) {
    return {
      content: [{ type: 'text' as const, text: 'Not found. Check the team abbreviation, player ID, or game ID.' }],
      isError: true,
    };
  }
  if (error instanceof NHLRateLimitError) {
    return {
      content: [{ type: 'text' as const, text: 'Rate limited by NHL API. Wait a moment and try again.' }],
      isError: true,
    };
  }
  if (error instanceof NHLApiError) {
    return {
      content: [{ type: 'text' as const, text: `NHL API error (${error.statusCode}): ${error.message}` }],
      isError: true,
    };
  }
  const message = error instanceof Error ? error.message : String(error);
  return {
    content: [{ type: 'text' as const, text: `Error: ${message}` }],
    isError: true,
  };
}
