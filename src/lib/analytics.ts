/**
 * Stub analytics logger used by server routes.
 *
 * In the production application this would forward events to an analytics
 * pipeline. For the test environment we simply provide an asynchronous
 * placeholder so that calls can be awaited and easily mocked.
 */
export async function logEvent(
  _event: string,
  _data: Record<string, unknown> = {},
): Promise<void> {
  void _event;
  void _data;
}

