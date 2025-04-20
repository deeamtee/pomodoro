/**
 * Format seconds into minutes and seconds display
 */
export const formatTime = (totalSeconds: number): { minutes: string; seconds: string } => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return {
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  };
};

/**
 * Calculate percentage of time elapsed
 */
export const calculateProgress = (
  elapsed: number, 
  total: number
): number => {
  if (total <= 0) return 0;
  return Math.min(1, Math.max(0, elapsed / total));
};