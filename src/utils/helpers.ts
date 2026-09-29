export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getDaysLeft(dateString: string): number {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const target = new Date(year, month - 1, day);
    const now = new Date();
    // Normalize to midnight
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

export function getDaysLeftInCurrentMonth(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  return Math.max(1, lastDay - now.getDate());
}

export function getRelativeDateBadge(dateString: string): { label: string; urgency: 'overdue' | 'today' | 'urgent' | 'normal' } {
  const days = getDaysLeft(dateString);
  if (days < 0) return { label: `${Math.abs(days)}d overdue`, urgency: 'overdue' };
  if (days === 0) return { label: 'Due today', urgency: 'today' };
  if (days === 1) return { label: 'Due tomorrow', urgency: 'urgent' };
  if (days <= 3) return { label: `${days} days left`, urgency: 'urgent' };
  return { label: `${days} days left`, urgency: 'normal' };
}
