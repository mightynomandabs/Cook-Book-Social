import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import MVPApp from './components/MVPApp';

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div className="App font-inter bg-white dark:bg-slate-900 min-h-screen transition-colors duration-300">
          <MVPApp />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
