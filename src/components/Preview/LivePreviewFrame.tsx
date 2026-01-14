import React from 'react';

export const LivePreviewFrame: React.FC<{ url: string }> = ({ url }) => (
    <div className="flex flex-col h-full bg-white text-black">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-b">
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <input className="flex-1 px-3 py-1 bg-white border rounded text-xs text-gray-500" value={url} readOnly />
        </div>
        <iframe src={url} className="flex-1 w-full border-0" title="Preview" />
        
        {/* Marketing/Ad Stub */}
        <div className="h-12 bg-gray-900 text-white flex items-center justify-between px-4 text-xs">
            <span>Powered by GuideSoft</span>
            <button className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">Upgrade to Remove Ads</button>
        </div>
    </div>
);
