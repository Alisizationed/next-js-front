'use client';

import * as React from 'react';
import { useChat as useBaseChat } from '@ai-sdk/react';
import { useSettings } from '@/components/editor/settings';
import { useSession } from 'next-auth/react';

export const useChat = () => {
  const { model } = useSettings();
  const { data: session, status } = useSession();
  
  const jwt = session?.accessToken;
  
  const abortControllerRef = React.useRef<AbortController | null>(null);
  
  const _abortStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  console.log(abortControllerRef);
  
  const chat = useBaseChat({
    id: 'editor',
    api: '/api/ai/copilot',
    body: {
      model: model?.value
    },
    fetch: async (input, init) => {
      // Check if user is authenticated before making request
      if (status === 'loading') {
        throw new Error('Authentication status is loading');
      }
      
      if (status === 'unauthenticated' || !jwt) {
        
        throw new Error('User is not authenticated');
      }
      
      abortControllerRef.current = new AbortController();
      
      const fetchInit = {
        ...init,
        signal: abortControllerRef.current.signal,
        headers: {
          ...init?.headers,
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      };
      
      try {
        const res = await fetch(input, fetchInit);
        
        console.log(res);
        console.log('res');
        if (!res.ok) {
          // Handle different error scenarios
          if (res.status === 401) {
            throw new Error('Authentication failed - please log in again');
          }
          if (res.status === 403) {
            throw new Error('Access forbidden - insufficient permissions');
          }
          
          let errorBody = '';
          try {
            errorBody = await res.text();
          } catch {
            errorBody = 'Unable to read error response';
          }
          
          throw new Error(
            `AI API request failed: ${res.status} ${res.statusText} - ${errorBody}`
          );
        }
        
        return res;
      } catch (error) {
        console.log(error);

        if (abortControllerRef.current) {
          abortControllerRef.current = null;
        }
        throw error;
      }
    },
  });
  
  return { 
    ...chat, 
    _abortStream,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading'
  };
};