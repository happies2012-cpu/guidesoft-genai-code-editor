import React, { useState } from 'react';
import { Rocket, Globe } from 'lucide-react';

interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  branch: string;
  autoDeploy: boolean;
}

export const DeploymentPipeline: React.FC = () => {
  const [config, setConfig] = useState<DeploymentConfig>({
    environment: 'development',
    branch: 'main',
    autoDeploy: false,
  });
  const [deploying, setDeploying] = useState(false);
  const deployments = [
    { id: 1, env: 'production', status: 'success', time: '2 hours ago', url: 'https://app.guidesoft.ai' },
    { id: 2, env: 'staging', status: 'success', time: '5 hours ago', url: 'https://staging.guidesoft.ai' },
    { id: 3, env: 'development', status: 'running', time: 'now', url: 'http://localhost:3000' },
  ];

  const handleDeploy = async () => {
    setDeploying(true);
    await new Promise(r => setTimeout(r, 3000));
    setDeploying(false);
    alert(`Deployed to ${config.environment}!`);
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Rocket className="text-blue-400" />
          Deployment Pipeline
        </h1>

        <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Deploy Configuration</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Environment</label>
              <select
                value={config.environment}
                onChange={(e) => setConfig({ ...config, environment: e.target.value as any })}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2"
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Branch</label>
              <select
                value={config.branch}
                onChange={(e) => setConfig({ ...config, branch: e.target.value })}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2"
              >
                <option value="main">main</option>
                <option value="develop">develop</option>
                <option value="feature/*">feature/*</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleDeploy}
                disabled={deploying}
                className="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                {deploying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket size={18} />
                    Deploy Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h2 className="text-xl font-bold mb-4">Recent Deployments</h2>
          <div className="space-y-3">
            {deployments.map((deployment) => (
              <div
                key={deployment.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    deployment.status === 'success' ? 'bg-green-500' :
                    deployment.status === 'running' ? 'bg-blue-500 animate-pulse' :
                    'bg-red-500'
                  }`}></div>
                  <div>
                    <div className="font-bold capitalize">{deployment.env}</div>
                    <div className="text-sm text-gray-400">{deployment.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href={deployment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                  >
                    <Globe size={16} />
                    {deployment.url}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
