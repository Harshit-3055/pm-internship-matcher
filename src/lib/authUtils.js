// src/lib/authUtils.js
import { supabase } from './supabaseClient';

/**
 * Handle authentication errors gracefully
 * @param {Error} error - The authentication error
 * @param {Function} onError - Callback function to handle the error
 */
export const handleAuthError = (error, onError) => {
  console.log('Auth error handled:', error.message);
  
  // Check if it's a refresh token error
  if (error.message?.includes('Refresh Token Not Found') || 
      error.message?.includes('Invalid Refresh Token') ||
      error.message?.includes('refresh_token_not_found')) {
    
    // Clear the invalid session
    supabase.auth.signOut();
    
    // Call the error handler with a user-friendly message
    if (onError) {
      onError('Your session has expired. Please sign in again.');
    }
    
    return true; // Error was handled
  }
  
  // For other auth errors, just log them
  console.error('Unhandled auth error:', error);
  return false; // Error was not handled
};

/**
 * Get user session with error handling
 * @returns {Promise<Object>} User session or null
 */
export const getSessionSafely = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      const wasHandled = handleAuthError(error, (message) => {
        console.log('Session error:', message);
      });
      
      if (wasHandled) {
        return null;
      }
    }
    
    return data?.user || null;
  } catch (error) {
    console.error('Unexpected error getting session:', error);
    return null;
  }
};

/**
 * Sign out user and clear session
 */
export const signOutSafely = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    // Even if sign out fails, clear local storage
    localStorage.removeItem('sb-fomwkpkkmbffarpehprb-auth-token');
  }
};
