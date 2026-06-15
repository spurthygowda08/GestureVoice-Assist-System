import {
  ReactNode,
  useEffect,
  useState
} from 'react';

import {
  AppSidebar
} from './AppSidebar';

import {
  gestureService
} from '@/services/gestureService';

import {
  voiceService,
  VoiceStatus
} from '@/services/voiceService';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({
  children
}: MainLayoutProps) => {

  const [
    isGestureConnected,
    setIsGestureConnected
  ] = useState(true);

  const [
    voiceStatus,
    setVoiceStatus
  ] = useState<VoiceStatus>('idle');

  useEffect(() => {

    // START GESTURE STREAM
    gestureService.startStream();

    // VOICE STATUS LISTENER
    const unsubscribe =
      voiceService.onStatusChange(
        setVoiceStatus
      );

    return () => {

      gestureService.stopStream();

      unsubscribe();
    };

  }, []);

  return (

    <div className="
      min-h-screen
      flex
      w-full
      bg-background
    ">

      {/* SIDEBAR */}
      <AppSidebar />

      {/* MAIN CONTENT */}
      <div className="
        flex-1
        flex
        flex-col
        min-w-0
      ">

        {/* REMOVED STATUS BAR */}

        <main className="
          flex-1
          p-6
          overflow-auto
          scrollbar-thin
        ">

          {children}

        </main>

      </div>

    </div>
  );
};