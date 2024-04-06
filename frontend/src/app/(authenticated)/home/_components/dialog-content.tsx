"use client";

import { SubmitView } from './submit-view';
import { PrivacyView } from './privacy-view';
import { create } from 'zustand';
import React from 'react';


const useStore = create((set) => ({
  privacy: 'public',
  view: 0,
  setPrivacy: (privacy: string) => set({ privacy }),
  incrementView: () => set((state: any) => ({ view: state.view + 1 })),
  deincrement: () => set((state: any) => ({ view: state.view - 1 })),
  cancel: () => set({ view: 0, privacy: 'public' }),
}))

export const DialogContent = () => {
    const view = useStore((state: any) => state.view)
    const incrementView = useStore((state: any) => state.incrementView)
    const deincrement = useStore((state: any) => state.deincrement)
    const cancel = useStore((state: any) => state.cancel)
    const views = [<SubmitView next={incrementView} />, <PrivacyView next={incrementView} back={deincrement} cancel={cancel}  />]
    

    return views[view]
}