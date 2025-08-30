/**
 * Utility functions for handling Supabase network errors and CORS issues
 */

export interface NetworkError {
  isCorsError: boolean;
  isNetworkError: boolean;
  originalError: any;
  userMessage: string;
}

/**
 * Analyzes an error to determine if it's a network/CORS issue
 */
export const analyzeNetworkError = (error: any): NetworkError => {
  const errorMessage = error?.message || error?.toString() || '';
  const isCorsError = errorMessage.includes('CORS') || 
                     errorMessage.includes('cors') ||
                     errorMessage.includes('Access-Control-Allow-Origin');
  
  const isNetworkError = errorMessage.includes('Failed to fetch') ||
                        errorMessage.includes('net::ERR_FAILED') ||
                        errorMessage.includes('NetworkError') ||
                        isCorsError;

  let userMessage = 'An unexpected error occurred.';
  
  if (isCorsError) {
    userMessage = 'Network configuration issue detected. The action may have completed on the server despite the error.';
  } else if (isNetworkError) {
    userMessage = 'Network connection issue. Please check your internet connection and try again.';
  } else if (errorMessage) {
    userMessage = errorMessage;
  }

  return {
    isCorsError,
    isNetworkError,
    originalError: error,
    userMessage
  };
};

/**
 * Handles logout with graceful fallback for CORS/network errors
 */
export const handleLogoutWithFallback = async (supabaseSignOut: () => Promise<any>) => {
  try {
    const result = await supabaseSignOut();
    return { ...result, wasGracefulFallback: false };
  } catch (error) {
    const networkError = analyzeNetworkError(error);
    
    if (networkError.isNetworkError || networkError.isCorsError) {
      // For network/CORS errors during logout, we treat it as successful
      // since the user intent is to sign out locally
      console.warn('Network error during logout, treating as successful local logout:', error);
      
      return { 
        error: null, 
        wasGracefulFallback: true,
        fallbackReason: networkError.userMessage
      };
    }
    
    // Re-throw non-network errors
    throw error;
  }
};

/**
 * Retries a Supabase operation with exponential backoff
 */
export const retrySupabaseOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const networkError = analyzeNetworkError(error);
      
      if (!networkError.isNetworkError || attempt === maxRetries) {
        throw error;
      }
      
      // Wait with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Retrying Supabase operation in ${delay}ms (attempt ${attempt}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Wrapper for Supabase auth operations with better error handling
 */
export const createRobustAuthWrapper = (supabase: any) => {
  return {
    async signOut() {
      return handleLogoutWithFallback(() => supabase.auth.signOut());
    },
    
    async signIn(email: string, password: string) {
      return retrySupabaseOperation(() => 
        supabase.auth.signInWithPassword({ email, password })
      );
    },
    
    async signUp(email: string, password: string, options?: any) {
      return retrySupabaseOperation(() => 
        supabase.auth.signUp({ email, password, ...options })
      );
    },
    
    async resetPassword(email: string) {
      return retrySupabaseOperation(() => 
        supabase.auth.resetPasswordForEmail(email)
      );
    }
  };
};

/**
 * Global error handler for unhandled CORS/network errors
 */
export const setupGlobalErrorHandler = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    const networkError = analyzeNetworkError(error);
    
    if (networkError.isNetworkError) {
      console.warn('Unhandled network error detected:', error);
      
      // Optionally show a global notification
      // You can integrate with your toast system here
      if (typeof window !== 'undefined' && (window as any).showNetworkErrorToast) {
        (window as any).showNetworkErrorToast(networkError.userMessage);
      }
      
      // Prevent the default unhandled rejection behavior for network errors
      event.preventDefault();
    }
  });
  
  // Handle general errors
  window.addEventListener('error', (event) => {
    const error = event.error;
    const networkError = analyzeNetworkError(error);
    
    if (networkError.isNetworkError) {
      console.warn('Unhandled network error detected:', error);
      event.preventDefault();
    }
  });
};
