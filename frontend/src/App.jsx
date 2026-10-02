import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ShieldAlert, 
  Activity, 
  Smartphone, 
  Video, 
  Database, 
  LayoutDashboard,
  Search,
  Bell,
  Fingerprint,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const mockChartData = [
  { name: 'Mon', apks: 4000, deepfakes: 2400 },
  { name: 'Tue', apks: 3000, deepfakes: 1398 },
  { name: 'Wed', apks: 2000, deepfakes: 9800 },
  { name: 'Thu', apks: 2780, deepfakes: 3908 },
  { name: 'Fri', apks: 1890, deepfakes: 4800 },
  { name: 'Sat', apks: 2390, deepfakes: 3800 },
  { name: 'Sun', apks: 3490, deepfakes: 4300 },
];

const mockFeed = [
  { id: 1, type: 'apk', title: 'Groww_v4.2.apk', source: 'Telegram: @crypto_signals', risk: 'critical', time: 'Just now' },
  { id: 2, type: 'video', title: 'elon_musk_giveaway.mp4', source: 'WhatsApp Bot', risk: 'high', time: '2 mins ago' },
  { id: 3, type: 'apk', title: 'Zerodha_Kite_Clone.apk', source: 'Telegram: @fx_trading', risk: 'critical', time: '5 mins ago' },
  { id: 4, type: 'review', title: 'Synthetic Review Swarm', source: 'Play Store (Mock)', risk: 'medium', time: '12 mins ago' },
];

function Sidebar() {
  const location = useLocation();
  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/ingestion', icon: <Activity size={20} />, label: 'Live Ingestion' },
    { path: '/apk-analysis', icon: <Smartphone size={20} />, label: 'APK Analysis' },
    { path: '/deepfakes', icon: <Video size={20} />, label: 'Deepfake Engine' },
    { path: '/registry', icon: <Database size={20} />, label: 'TCR Registry' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <ShieldAlert size={24} color="white" />
        </div>
        <div className="sidebar-logo-text text-gradient">AEGIS.AI</div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    analyzed_apks: 15402,
    malicious_clones: 842,
    deepfakes_detected: 4291,
    tcr_nodes: 124
  });
  const [feed, setFeed] = useState(mockFeed);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('http://localhost:8000/api/stats');
        const statsData = await statsRes.json();
        setStats(statsData);

        const feedRes = await fetch('http://localhost:8000/api/feed');
        const feedData = await feedRes.json();
        setFeed(feedData);
      } catch (err) {
        console.error("API Error (Ensure backend is running):", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-content">
      <header className="page-header">
        <div>
          <h1 className="page-title text-gradient">Global Threat Intelligence</h1>
          <p className="page-description">Monitoring decentralized distribution networks for counterfeit apps and deepfakes.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <Search size={18} /> Search Hashes
          </button>
          <button className="btn btn-primary">
            <Bell size={18} /> <span className="live-indicator"></span> Live Feed
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Stat Cards */}
        <div className="glass-card stat-card">
          <div className="stat-header">
            <span className="stat-title">Analyzed APKs</span>
            <div className="stat-icon primary"><Smartphone size={20} /></div>
          </div>
          <div className="stat-value">{stats.analyzed_apks.toLocaleString()}</div>
          <div className="stat-trend up"><TrendingUp size={14} /> +12.5% this week</div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-header">
            <span className="stat-title">Malicious Clones</span>
            <div className="stat-icon danger"><AlertTriangle size={20} /></div>
          </div>
          <div className="stat-value">{stats.malicious_clones.toLocaleString()}</div>
          <div className="stat-trend down"><TrendingUp size={14} /> +4.2% today</div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-header">
            <span className="stat-title">Deepfakes Detected</span>
            <div className="stat-icon warning"><Video size={20} /></div>
          </div>
          <div className="stat-value">{stats.deepfakes_detected.toLocaleString()}</div>
          <div className="stat-trend up"><TrendingUp size={14} /> +22.1% this week</div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-header">
            <span className="stat-title">TCR Validator Nodes</span>
            <div className="stat-icon success"><Database size={20} /></div>
          </div>
          <div className="stat-value">{stats.tcr_nodes.toLocaleString()}</div>
          <div className="stat-trend up"><TrendingUp size={14} /> +3 new nodes</div>
        </div>

        {/* Charts */}
        <div className="glass-card chart-card">
          <h3 className="card-title"><Activity size={20} className="text-primary" /> Threat Detection Volume</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorApk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="apks" stroke="#6366f1" fillOpacity={1} fill="url(#colorApk)" name="Malicious APKs" />
              <Area type="monotone" dataKey="deepfakes" stroke="#f59e0b" fillOpacity={1} fill="url(#colorDf)" name="Deepfakes" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Feed */}
        <div className="glass-card feed-card">
          <h3 className="card-title"><Bell size={20} className="text-danger" /> Live Ingestion</h3>
          <div className="feed-list">
            {feed.map((item) => (
              <div key={item.id} className="feed-item">
                <div className={`feed-item-icon ${item.risk === 'critical' ? 'danger' : item.risk === 'high' ? 'warning' : 'primary'} stat-icon`}>
                  {item.type === 'apk' ? <Smartphone size={16} /> : item.type === 'video' ? <Video size={16} /> : <Activity size={16} />}
                </div>
                <div className="feed-item-content">
                  <div className="feed-item-title">{item.title}</div>
                  <div className="feed-item-desc">Source: {item.source} • {item.time}</div>
                </div>
                <div>
                  <span className={`badge badge-${item.risk === 'critical' ? 'danger' : item.risk === 'high' ? 'warning' : 'primary'}`}>
                    {item.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ApkAnalysis() {
  return (
    <div className="main-content">
      <header className="page-header">
        <div>
          <h1 className="page-title text-gradient">Behavioral Analysis Engine</h1>
          <p className="page-description">Static triage, permission harvesting, and UI clone detection via Siamese Networks.</p>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="glass-card stat-card" style={{ gridColumn: 'span 12' }}>
          <h3 className="card-title">Recent Scan: Groww_v4.2.apk (Suspicious)</h3>
          
          <div className="analysis-grid">
            <div>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Extracted Manifest Permissions</h4>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Permission</th>
                      <th>Risk Weight</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>SYSTEM_ALERT_WINDOW</td>
                      <td>0.85 (Overlay Attack)</td>
                      <td><span className="badge badge-danger">Anomalous</span></td>
                    </tr>
                    <tr>
                      <td>BIND_ACCESSIBILITY_SERVICE</td>
                      <td>0.92 (2FA Bypass)</td>
                      <td><span className="badge badge-danger">Anomalous</span></td>
                    </tr>
                    <tr>
                      <td>READ_SMS</td>
                      <td>0.70</td>
                      <td><span className="badge badge-warning">Suspicious</span></td>
                    </tr>
                    <tr>
                      <td>INTERNET</td>
                      <td>0.10</td>
                      <td><span className="badge badge-success">Standard</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>XGBoost Malware Probability</span>
                  <span className="text-gradient-danger" style={{ fontWeight: 'bold' }}>94.2%</span>
                </div>
                <div className="progress-bg">
                  <div className="progress-fill" style={{ width: '94.2%' }}></div>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Siamese Network UI Clone Detection</h4>
              <div className="image-comparison">
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', marginBottom: '8px', color: 'var(--text-muted)' }}>SUSPICIOUS APK (FLUTTER)</div>
                    <div className="image-box">
                      <div style={{ width: '100%', height: '100%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         Mock UI Screenshot
                      </div>
                      <div className="heatmap-overlay"></div>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', marginBottom: '8px', color: 'var(--text-muted)' }}>LEGITIMATE BASELINE (NATIVE)</div>
                    <div className="image-box">
                      <div style={{ width: '100%', height: '100%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         Target UI Patch
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                  <span className="badge badge-danger" style={{ fontSize: '0.85rem' }}>Visual Structural Match: 98.7% (Confirmed Clone)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeepfakeEngine() {
  return (
    <div className="main-content">
      <header className="page-header">
        <div>
          <h1 className="page-title text-gradient">Deepfake Detection Pipeline</h1>
          <p className="page-description">Temporal optical flow analysis (RAFT) and Face X-ray blending boundary detection.</p>
        </div>
      </header>
      <div className="glass-card chart-card" style={{ gridColumn: 'span 12' }}>
        <h3 className="card-title">MesoInception-4 / Face X-ray Results</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Awaiting video payload from ingestion queue...</p>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div className="image-box" style={{ width: '300px', height: '300px', border: '1px dashed var(--surface-border)' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <Video size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <div>Upload or stream video</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Registry() {
  return (
    <div className="main-content">
      <header className="page-header">
        <div>
          <h1 className="page-title text-gradient">Token Curated Registry (TCR)</h1>
          <p className="page-description">Decentralized repository of verified IoCs secured by Ethereum Smart Contracts.</p>
        </div>
        <button className="btn btn-primary">Connect Web3 Wallet</button>
      </header>
      
      <div className="glass-card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>IoC Hash (SHA-256)</th>
                <th>Threat Type</th>
                <th>Status</th>
                <th>Stake Bond</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>0x8f2a...c3b4</span></td>
                <td>Android Trojan (Overlay)</td>
                <td><span className="badge badge-success">Verified</span></td>
                <td>500 AEGIS</td>
                <td><button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>View Evidence</button></td>
              </tr>
              <tr>
                <td><span style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>0x4b1e...9a2f</span></td>
                <td>Deepfake Video</td>
                <td><span className="badge badge-warning">Challenged (Voting)</span></td>
                <td>1000 AEGIS</td>
                <td><button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Cast Vote</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/apk-analysis" element={<ApkAnalysis />} />
          <Route path="/deepfakes" element={<DeepfakeEngine />} />
          <Route path="/registry" element={<Registry />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
