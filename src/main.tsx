
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HMSRoomProvider } from '@100mslive/react-sdk';
import App from './App.tsx';
import './index.css';
import { setupGlobalErrorHandler } from './utils/networkErrorHandler';

// Set up global error handling for network issues
setupGlobalErrorHandler();

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <HMSRoomProvider>
      <App />
    </HMSRoomProvider>
  </React.StrictMode>
);
