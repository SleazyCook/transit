import { useState, useCallback } from 'react';
import './index.css';

import type { BaseLineName, LineName, LineResult } from './types';
import { LINE_CONFIG } from './config/lines';
import { useSavedStations } from './hooks/useSavedStations';
import { useMediaQuery } from './hooks/useMediaQuery';

import NearestStation from './components/NearestStation';
import ArrivalsScreen from './components/Arrivals';
import ScheduleView from './components/ScheduleView';
import SettingsView from './components/SettingsView';
import SavedView from './components/SavedView';
import TabBar, { type TabId } from './components/TabBar';
import DesktopShell from './components/desktop/DesktopShell';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('now');
  const [nearestStations, setNearestStations] = useState<Record<LineName, LineResult> | null>(null);
  const [selectedLine, setSelectedLine] = useState<BaseLineName>('red');
  const { saved, isSaved, toggle } = useSavedStations();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const handleClosestChange = useCallback((results: Record<LineName, LineResult>) => {
    setNearestStations(results);
    const overallName = results.overall.station.name;
    const matchingLine = (['red', 'green', 'purple'] as BaseLineName[]).find(
      (l) => results[l].station.name === overallName
    );
    if (matchingLine) setSelectedLine(matchingLine);
  }, []);

  const handlePickSaved = useCallback((line: BaseLineName, _stationName: string) => {
    setSelectedLine(line);
    setActiveTab('now');
  }, []);

  const lineColor = LINE_CONFIG[selectedLine].color;

  return (
    <>
      <NearestStation onClosestChange={handleClosestChange} />

      {isDesktop ? (
        <DesktopShell
          nearestStations={nearestStations}
          selectedLine={selectedLine}
          onLineChange={setSelectedLine}
          saved={saved}
          isSaved={isSaved}
          onToggleSaved={toggle}
          onPickSaved={handlePickSaved}
        />
      ) : (
        <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#FAF8F3' }}>
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {activeTab === 'now' && (
              <ArrivalsScreen
                nearestStations={nearestStations}
                selectedLine={selectedLine}
                onLineChange={setSelectedLine}
                isSaved={isSaved}
                onToggleSaved={toggle}
                saved={saved}
                onPickSaved={handlePickSaved}
              />
            )}
            {activeTab === 'schedule' && (
              <ScheduleView
                nearestStations={nearestStations}
                selectedLine={selectedLine}
                onLineChange={setSelectedLine}
              />
            )}
            {activeTab === 'saved' && (
              <SavedView
                saved={saved}
                onToggleSaved={toggle}
                onNavigateTo={handlePickSaved}
                selectedLine={selectedLine}
              />
            )}
            {activeTab === 'settings' && (
              <SettingsView selectedLine={selectedLine} />
            )}
          </div>

          <TabBar active={activeTab} onTabChange={setActiveTab} accent={lineColor} />
        </div>
      )}
    </>
  );
}

export default App;
