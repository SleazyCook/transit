import { useState } from 'react';
import NavRail from './NavRail';
import NowPanel from './NowPanel';
import ContextRail from './ContextRail';
import SettingsView from '../SettingsView';
import type { BaseLineName, LineName, LineResult } from '../../types';
import type { SavedStation } from '../../hooks/useSavedStations';

type Props = {
  nearestStations: Record<LineName, LineResult> | null;
  selectedLine: BaseLineName;
  onLineChange: (line: BaseLineName) => void;
  saved: SavedStation[];
  isSaved: (line: BaseLineName, name: string) => boolean;
  onToggleSaved: (line: BaseLineName, name: string) => void;
  onPickSaved: (line: BaseLineName, name: string) => void;
};

export default function DesktopShell({
  nearestStations,
  selectedLine,
  onLineChange,
  saved,
  isSaved,
  onToggleSaved,
  onPickSaved,
}: Props) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div style={{
      height: '100dvh',
      display: 'grid',
      gridTemplateColumns: '260px 1fr 320px',
      overflow: 'hidden',
      background: 'var(--bg)',
      fontFamily: 'Space Grotesk, sans-serif',
      position: 'relative',
    }}>
      <NavRail
        selectedLine={selectedLine}
        onLineChange={onLineChange}
        saved={saved}
        isSaved={isSaved}
        onPickSaved={onPickSaved}
        onSettingsClick={() => setShowSettings(true)}
      />
      <NowPanel
        selectedLine={selectedLine}
        nearestStations={nearestStations}
        isSaved={isSaved}
        onToggleSaved={onToggleSaved}
      />
      <ContextRail
        selectedLine={selectedLine}
        nearestStations={nearestStations}
      />

      {/* Settings overlay */}
      {showSettings && (
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setShowSettings(false)}
        >
          <div
            style={{
              width: 420, height: '80vh', maxHeight: 680,
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SettingsView selectedLine={selectedLine} />
          </div>
        </div>
      )}
    </div>
  );
}
