import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Keeps Western and Arabic-Indic digits while stripping other characters.
 */
export const onlyNumbers = (value: string) => value.replace(/[^\d٠-٩]/g, '');

/**
 * Placeholder until online status tracking is reintroduced.
 */
export const setupOnlineStatus = (_userId: string) => undefined;

/**
 * Placeholder until offline status tracking is reintroduced.
 */
export const setUserOffline = async (_userId: string) => undefined;

/**
 * Placeholder until form-progress tracking is reintroduced.
 */
export const trackFormProgress = async (
  _visitorId: string,
  _currentPage: number,
  _formData: Record<string, unknown>,
) => undefined;
