// Utility functions for formatting data in live streaming components

/**
 * Format currency values
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format large numbers with abbreviations
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Format duration in minutes to human readable format
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours < 24) {
    return `${hours}h ${remainingMinutes}m`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return `${days}d ${remainingHours}h`;
};

/**
 * Format timestamps to relative time
 */
export const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  return date.toLocaleDateString();
};

/**
 * Format file sizes
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format percentage values
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format viewer count with online indicator
 */
export const formatViewerCount = (count: number, isLive: boolean = false): string => {
  const formatted = formatNumber(count);
  return isLive ? `🔴 ${formatted} watching` : `${formatted} viewers`;
};

/**
 * Format stream status with appropriate styling
 */
export const formatStreamStatus = (status: string): { label: string; color: string; variant: string } => {
  switch (status.toLowerCase()) {
    case 'live':
      return { label: 'LIVE', color: 'text-red-600', variant: 'destructive' };
    case 'scheduled':
      return { label: 'Scheduled', color: 'text-blue-600', variant: 'default' };
    case 'ended':
      return { label: 'Ended', color: 'text-gray-600', variant: 'secondary' };
    case 'cancelled':
      return { label: 'Cancelled', color: 'text-orange-600', variant: 'outline' };
    case 'paused':
      return { label: 'Paused', color: 'text-yellow-600', variant: 'outline' };
    case 'error':
      return { label: 'Error', color: 'text-red-600', variant: 'destructive' };
    default:
      return { label: status, color: 'text-gray-600', variant: 'outline' };
  }
};

/**
 * Format chat message timestamp
 */
export const formatChatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * Generate session code from title
 */
export const generateSessionCode = (title: string): string => {
  const words = title.split(' ').slice(0, 3);
  const code = words.map(word => word.substring(0, 3).toUpperCase()).join('');
  const timestamp = Date.now().toString().slice(-4);
  return `${code}-${timestamp}`;
};

/**
 * Calculate engagement rate
 */
export const calculateEngagementRate = (
  messages: number, 
  reactions: number, 
  viewers: number
): number => {
  if (viewers === 0) return 0;
  return ((messages + reactions) / viewers) * 100;
};

/**
 * Calculate conversion rate
 */
export const calculateConversionRate = (orders: number, clicks: number): number => {
  if (clicks === 0) return 0;
  return (orders / clicks) * 100;
};

/**
 * Format stream quality
 */
export const formatStreamQuality = (quality: string): string => {
  switch (quality.toLowerCase()) {
    case 'auto':
      return 'Auto';
    case '720p':
      return 'HD (720p)';
    case '1080p':
      return 'Full HD (1080p)';
    case '4k':
      return '4K Ultra HD';
    default:
      return quality;
  }
};

/**
 * Calculate average watch time
 */
export const calculateAverageWatchTime = (
  totalWatchTime: number, 
  totalViewers: number
): number => {
  if (totalViewers === 0) return 0;
  return totalWatchTime / totalViewers;
};

/**
 * Format connection quality
 */
export const formatConnectionQuality = (quality: string): { label: string; color: string } => {
  switch (quality.toLowerCase()) {
    case 'excellent':
      return { label: 'Excellent', color: 'text-green-600' };
    case 'good':
      return { label: 'Good', color: 'text-blue-600' };
    case 'fair':
      return { label: 'Fair', color: 'text-yellow-600' };
    case 'poor':
      return { label: 'Poor', color: 'text-red-600' };
    default:
      return { label: quality, color: 'text-gray-600' };
  }
};

/**
 * Format device type for display
 */
export const formatDeviceType = (deviceType: string): string => {
  switch (deviceType.toLowerCase()) {
    case 'mobile':
      return '📱 Mobile';
    case 'tablet':
      return '📱 Tablet';
    case 'desktop':
      return '💻 Desktop';
    default:
      return `🖥️ ${deviceType}`;
  }
};

/**
 * Generate color for charts based on index
 */
export const getChartColor = (index: number): string => {
  const colors = [
    '#3B82F6', // blue
    '#EF4444', // red
    '#10B981', // green
    '#F59E0B', // yellow
    '#8B5CF6', // purple
    '#F97316', // orange
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#EC4899', // pink
    '#6B7280'  // gray
  ];
  return colors[index % colors.length];
};

/**
 * Format geographical data for display
 */
export const formatLocation = (country?: string, city?: string): string => {
  if (country && city) {
    return `${city}, ${country}`;
  }
  if (country) {
    return country;
  }
  if (city) {
    return city;
  }
  return 'Unknown Location';
};

/**
 * Create download filename for exports
 */
export const createExportFilename = (prefix: string, sessionTitle?: string): string => {
  const date = new Date().toISOString().split('T')[0];
  const title = sessionTitle ? `_${sessionTitle.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
  return `${prefix}${title}_${date}.csv`;
};

/**
 * Format scheduled stream time
 */
export const formatScheduledTime = (date: string, time: string, timezone: string = 'UTC'): string => {
  const datetime = new Date(`${date}T${time}`);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: timezone
  }).format(datetime);
};

/**
 * Check if stream is starting soon (within 30 minutes)
 */
export const isStreamStartingSoon = (scheduledStartTime: string): boolean => {
  const startTime = new Date(scheduledStartTime);
  const now = new Date();
  const diffInMinutes = (startTime.getTime() - now.getTime()) / (1000 * 60);
  return diffInMinutes > 0 && diffInMinutes <= 30;
};

/**
 * Get time until stream starts
 */
export const getTimeUntilStream = (scheduledStartTime: string): string => {
  const startTime = new Date(scheduledStartTime);
  const now = new Date();
  const diffInSeconds = Math.floor((startTime.getTime() - now.getTime()) / 1000);
  
  if (diffInSeconds <= 0) {
    return 'Starting now';
  }
  
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
};

export default {
  formatCurrency,
  formatNumber,
  formatDuration,
  formatRelativeTime,
  formatFileSize,
  formatPercentage,
  formatViewerCount,
  formatStreamStatus,
  formatChatTime,
  generateSessionCode,
  calculateEngagementRate,
  calculateConversionRate,
  formatStreamQuality,
  calculateAverageWatchTime,
  formatConnectionQuality,
  formatDeviceType,
  getChartColor,
  formatLocation,
  createExportFilename,
  formatScheduledTime,
  isStreamStartingSoon,
  getTimeUntilStream
};
