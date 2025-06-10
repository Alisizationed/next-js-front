/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';

import * as React from 'react';

import { useChat as useBaseChat } from '@ai-sdk/react';

import { useSettings } from '@/components/editor/settings';

export const useChat = () => {
  const { keys, model } = useSettings();

  const abortControllerRef = React.useRef<AbortController | null>(null);

  const _abortStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const chat = useBaseChat({
    id: 'editor',
    api: '/api/ai/copilot',
    body: {
      model: model?.value,
    },
    fetch: async (input, init) => {
      abortControllerRef.current = new AbortController();

      const fetchInit = {
        ...init,
        signal: abortControllerRef.current.signal,
      };

      const res = await fetch(input, fetchInit);

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(
          `AI API request failed: ${res.status} ${res.statusText} - ${errorBody}`
        );
      }

      return res;
    },
  });

  return { ...chat, _abortStream };
};
