import React, { Suspense } from 'react';
import Scene from './components/Scene';
import HandTracker from './components/HandTracker';
import UI from './components/UI';

const App = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <Suspense fallback={<div className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Loading 3D Scene...</div>}>
        <Scene />
      </Suspense>
      <UI />
      <HandTracker />
    </div>
  );
};

export default App;
