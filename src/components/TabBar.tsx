export type TabId = 'now' | 'schedule' | 'saved' | 'settings';

type TabBarProps = {
  active: TabId;
  onTabChange: (tab: TabId) => void;
  accent?: string;
};

function HomeIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1v-9z"/>
    </svg>
  );
}

function ScheduleIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5"/>
      <path d="M3.5 9.5h17M8 3v4M16 3v4"/>
    </svg>
  );
}

function StationIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="3.5" width="12" height="14" rx="3"/>
      <path d="M8 9h8M9 17l-1.5 3M15 17l1.5 3"/>
      <circle cx="9.5" cy="13.5" r="0.8" fill="currentColor"/>
      <circle cx="14.5" cy="13.5" r="0.8" fill="currentColor"/>
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.6 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>
    </svg>
  );
}

const TABS: { id: TabId; label: string; Icon: React.FC }[] = [
  { id: 'now', label: 'Now', Icon: HomeIcon },
  { id: 'schedule', label: 'Schedule', Icon: ScheduleIcon },
  { id: 'saved', label: 'Saved', Icon: StationIcon },
  { id: 'settings', label: 'Settings', Icon: SettingsIcon },
];

import React from 'react';

export default function TabBar({ active, onTabChange, accent = '#161512' }: TabBarProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '10px 12px 22px',
      background: '#fff',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      flexShrink: 0,
    }}>
      {TABS.map(({ id, label, Icon }) => {
        const on = id === active;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              color: on ? accent : 'rgba(22,21,18,0.42)',
              padding: '4px 10px',
              background: 'none',
              border: 'none',
              transition: 'color 0.18s',
            }}
          >
            <Icon />
            <div style={{ fontSize: 10.5, fontWeight: on ? 600 : 500, letterSpacing: '0.2px' }}>
              {label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
