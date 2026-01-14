import React from 'react';

export const Minimap: React.FC = () => (
    <div className="w-16 bg-[#1e1e1e]/50 border-l border-white/5 h-full opacity-50 hover:opacity-100 transition-opacity">
        {/* Mock code blocks */}
        {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-1 bg-gray-500/30 my-2 mx-1 rounded" style={{ width: `${Math.random() * 100}%` }} />
        ))}
    </div>
);
