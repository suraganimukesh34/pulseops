const BADGE_MAP: Record<string, string> = {
  // Positive / healthy states
  Stable: 'badge-success',
  Available: 'badge-success',
  Paid: 'badge-success',
  Completed: 'badge-success',
  'On Duty': 'badge-success',
  Active: 'badge-success',
  Low: 'badge-success',

  // Caution states
  Waiting: 'badge-warning',
  Cleaning: 'badge-warning',
  Pending: 'badge-warning',
  Scheduled: 'badge-warning',
  Warning: 'badge-warning',
  Medium: 'badge-warning',
  'On Leave': 'badge-warning',

  // Negative / urgent states
  Critical: 'badge-danger',
  Occupied: 'badge-danger',
  Maintenance: 'badge-danger',
  Overdue: 'badge-danger',
  Cancelled: 'badge-danger',
  'No-show': 'badge-danger',
  High: 'badge-danger',

  // Informational
  Info: 'badge-info',
  'Off Duty': 'badge-neutral',
};

export function badgeClass(status: string): string {
  return BADGE_MAP[status] ?? 'badge-neutral';
}
