import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function getMarginStatus(margin: number): 'positive' | 'negative' | 'warning' | 'neutral' {
  if (margin > 15) return 'positive'
  if (margin < 0) return 'negative'
  if (margin < 5) return 'warning'
  return 'neutral'
}

export function getMarginColor(margin: number): string {
  const status = getMarginStatus(margin)
  switch (status) {
    case 'positive':
      return 'text-margin-positive'
    case 'negative':
      return 'text-margin-negative'
    case 'warning':
      return 'text-margin-warning'
    default:
      return 'text-margin-neutral'
  }
}

export function getMarginBgColor(margin: number): string {
  const status = getMarginStatus(margin)
  switch (status) {
    case 'positive':
      return 'bg-margin-positive/10'
    case 'negative':
      return 'bg-margin-negative/10'
    case 'warning':
      return 'bg-margin-warning/10'
    default:
      return 'bg-margin-neutral/10'
  }
} 