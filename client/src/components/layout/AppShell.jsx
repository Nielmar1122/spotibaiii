import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PlayerBar from '../player/PlayerBar';
import AdOverlay from '../modals/AdOverlay';

export default function AppShell() {
  return (
    <div className="flex h-screen bg-base text-white overflow-hidden">
      <div className="hidden md:flex w-64 flex-col bg-black h-full">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-b from-surface to-base">
        <Topbar />
        <main className="flex-1 overflow-y-auto pb-28">
          <Outlet />
        </main>
      </div>
      <PlayerBar />
      <AdOverlay />
    </div>
  );
}