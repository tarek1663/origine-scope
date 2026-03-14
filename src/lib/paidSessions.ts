const paidSessionIds = new Set<string>();

export function markSessionPaid(sessionId: string): void {
  paidSessionIds.add(sessionId);
}

export function isSessionPaid(sessionId: string): boolean {
  return paidSessionIds.has(sessionId);
}
