import { create } from 'zustand';

const useStore = create((set) => ({
  phase: 'tree', // 'tree', 'blooming', 'nebula', 'collapsing'
  gesture: 'None', // 'Open_Palm', 'Closed_Fist', 'None'
  cameraTarget: [0, 0, 0],
  isCameraLocked: false,
  focusedPhoto: null, // { url, color } or null
  
  setPhase: (phase) => set({ phase }),
  setGesture: (gesture) => set({ gesture }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
  setIsCameraLocked: (isLocked) => set({ isCameraLocked: isLocked }),
  setFocusedPhoto: (photo) => set({ focusedPhoto: photo }),
}));

export default useStore;
