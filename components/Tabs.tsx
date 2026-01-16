"use client";

import { useState, ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[] | Array<{ id: string; label: string }>;
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export default function Tabs({ tabs, defaultTab, activeTab: externalActiveTab, onTabChange, className = "" }: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id);
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  
  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  const activeContent = activeTabData && 'content' in activeTabData ? (activeTabData as Tab).content : null;

  return (
    <div className={className}>
      <div className="flex gap-2 border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? "border-b-2 border-[#C9A24D] text-[#C9A24D]"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeContent && <div className="mt-4">{activeContent}</div>}
    </div>
  );
}
