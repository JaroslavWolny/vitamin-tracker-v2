
/**
 * Gets today's date as a string in 'YYYY-MM-DD' format.
 * This format is ideal for reliable string comparisons.
 * @returns {string} The formatted date string.
 */
export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Formats a date for display in Czech format.
 * @returns {string} The formatted date string for display.
 */
export const getFriendlyDate = (): string => {
    return new Date().toLocaleDateString('cs-CZ', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
}

/**
 * Returns an array of past dates (including today) as 'YYYY-MM-DD' strings.
 * @param days Number of days to include counting backwards from today.
 */
export const getPastDates = (days: number): string[] => {
  const today = new Date();
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    return date.toISOString().split('T')[0];
  });
};

/**
 * Formats hour + minute pairs into HH:MM for display.
 */
export const formatTimeLabel = (hour: number, minute = 0): string => {
  return `${hour.toString().padStart(2, '0')}:${minute
    .toString()
    .padStart(2, '0')}`;
};
