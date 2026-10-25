import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, BarChart3, Bell, Bot, ChevronDown, CircleHelp, ContactRound,
  Home, Inbox, Instagram, Megaphone, Menu, MessageCircle, Plug, Search,
  Send, Settings, Sparkles, Workflow, X, Zap, LogOut, Plus, ArrowUpRight
} from 'lucide-react';
import LoginScreen from './components/LoginScreen';
import HomeView from './components/HomeView';
import AutomationView from './components/AutomationView';
import ContactsView from './components/ContactsView';
import BroadcastsView from './components/BroadcastsView';
import InboxView from './components/InboxView';
import SettingsView from './components/SettingsView';
import FacebookConnect from './components/FacebookConnect';

const NAV = [
  { section: 'WORKSPACE', items: [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'inbox', label: 'Live Chat', icon: Inbox, badge: '3' },
    { id: 'contacts', label: 'Contacts', icon: ContactRound },
  ]},
  { section: 'GROWTH TOOLS', items: [
    { id: 'automation', label: 'Automations', icon: Workflow },
    { id: 'flows', label: 'Flow Builder', icon: Zap },
    { id: 'broadcasts', label: 'Broadcasts', icon: Megaphone },
  ]},
  { section: 'CHANNELS & ADMIN', items: [
    { id: 'channels', label: 'Channels', icon: Plug },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]},
];
const TITLES = {
  overview: ['Overview', 'আপনার অটোমেশন ও কাস্টমার এনগেজমেন্টের এক নজরের সারাংশ।'],
  inbox: ['Live Chat', 'সব কাস্টমার কথোপকথন এক জায়গায় পরিচালনা করুন।'],
  contacts: ['Contacts', 'আপনার অডিয়েন্স, লিড এবং কাস্টমার ডেটা পরিচালনা করুন।'],
  automation: ['Automations', 'ট্রিগার থেকে অ্যাকশন—আপনার রিপিট হওয়া কাজগুলো অটোমেট করুন।'],
  flows: ['Flow Builder', 'ভিজ্যুয়াল ওয়ার্কফ্লো তৈরি করুন এবং টেস্ট করুন।'],
  broadcasts: ['Broadcasts', 'আপনার অডিয়েন্সের কাছে ক্যাম্পেইন পাঠানোর প্রস্তুতি নিন।'],
  channels: ['Channels', 'আপনার মেসেজিং চ্যানেল কানেক্ট ও পরিচালনা করুন।'],
  settings: ['Settings', 'ওয়ার্কস্পেস ও অ্যাকাউন্ট কনফিগারেশন।'],
};
const initialContacts = [
  { id: 1, name: 'Tanvir Ahmed', channel: 'Messenger', lastActive: '2 min ago', status: 'Active' },
  { id: 2, name: 'Nusrat Jahan', channel: 'Instagram', lastActive: '18 min ago', status: 'Active' },
  { id: 3, name: 'Rahim Uddin', channel: 'Messenger', lastActive: '1 hour ago', status: 'New lead' },
  { id: 4, name: 'Sadia Islam', channel: 'Telegram', lastActive: 'Yesterday', status: 'Active' },
];
const initialMessages = [
  { sender: 'Tanvir Ahmed', time: '2m', text: 'ভাই আপনার পণ্যের দাম কত?' },
  { sender: 'Nusrat Jahan', time: '18m', text: 'আপনাদের ডেলিভারি চার্জ কত?' },
  { sender: 'Rahim Uddin', time: '1h', text: 'ক্যাটালগটা পাঠাবেন?' },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: 'Demo Workspace', email: 'demo@flowbot.app', picture: '' });
  const [contacts] = useState(initialContacts);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        localStorage.setItem('google_access_token', accessToken);
        fetchGoogleUserInfo(accessToken);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      return;
    }
    const token = localStorage.getItem('google_access_token');
    if (token === 'demo_token') {
      setUserProfile({ name: 'ডেমো ইউজার', email: 'demo@flowbot.com', picture: '' });
      setIsLoggedIn(true);
    } else if (token) fetchGoogleUserInfo(token);
  }, []);

  const fetchGoogleUserInfo = async (token) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Google profile request failed');
      const data = await response.json();
      setUserProfile({ name: data.name || 'Google User', email: data.email || '', picture: data.picture || '' });
      setIsLoggedIn(true);
    } catch (err) {
      console.error('Failed to fetch Google user info', err);
      localStorage.removeItem('google_access_token');
    }
  };

  const handleDemoLogin = () => {
    localStorage.setItem('google_access_token', 'demo_token');
    setUserProfile({ name: 'Demo User', email: 'demo@flowbot.com', picture: '' });
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    localStorage.removeItem('google_access_token');
    setIsLoggedIn(false);
    setActiveTab('overview');
  };

  const [pageTitle, pageSubtitle] = TITLES[activeTab] || TITLES.overview;
  const pageContent = useMemo(() => {
    switch (activeTab) {
      case 'overview': return <HomeView automations={[{ name: 'Default Reply' }, { name: 'Welcome Flow' }]} pages={[]} />;
      case 'inbox': return <InboxView messages={initialMessages} />;
      case 'contacts': return <ContactsView contacts={contacts} />;
      case 'automation': return <AutomationView />;
      case 'flows': return <FlowWorkspace />;
      case 'broadcasts': return <BroadcastsView />;
      case 'channels': return <ChannelsWorkspace />;
      case 'settings': return <SettingsView />;
      default: return <HomeView automations={[]} pages={[]} />;
    }
  }, [activeTab, contacts]);

  if (!isLoggedIn) return <LoginScreen onDemoLogin={handleDemoLogin} />;

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`app-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><Zap size={20} fill="currentColor" /></div>
          <div className="brand-copy"><strong>Flowbot</strong><span>ENGAGEMENT PLATFORM</span></div>
          <button className="icon-button mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <button className="workspace-switcher">
          <div className="workspace-avatar">F</div>
          <span><strong>My Workspace</strong><small>Free plan</small></span>
          <ChevronDown size={16} className="muted-icon"/>
        </button>
        <nav className="main-nav">
          {NAV.map(group => <div className="nav-group" key={group.section}>
            <p className="nav-heading">{group.section}</p>
            {group.items.map(item => {
              const Icon = item.icon;
              return <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`nav-item ${activeTab === item.id ? 'nav-item-active' : ''}`}>
                <Icon size={18} strokeWidth={1.9}/><span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
                {item.id === 'automation' && <span className="nav-live-dot"/>}
              </button>;
            })}
          </div>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><div><strong>Need a hand?</strong><span>Visit the help center</span></div><ArrowUpRight size={15}/></div>
          <div className="sidebar-user">
            {userProfile.picture ? <img src={userProfile.picture} alt="" /> : <div className="user-avatar">{(userProfile.name || 'U').charAt(0).toUpperCase()}</div>}
            <div className="user-meta"><strong>{userProfile.name}</strong><span>{userProfile.email}</span></div>
            <button className="icon-button" onClick={handleLogout} title="Sign out" aria-label="Sign out"><LogOut size={17}/></button>
          </div>
        </div>
      </aside>

      <main className="app-main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={20}/></button>
            <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{pageTitle}</strong></div>
          </div>
          <div className="topbar-actions">
            <div className="connection-status"><span/> All systems operational</div>
            <button className="icon-button" aria-label="Search" onClick={() => alert('Search is planned for a future module.')}><Search size={18}/></button>
            <div className="notification-wrap">
              <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={18}/><i/></button>
              {notificationsOpen && <div className="notification-popover"><strong>Notifications</strong><p>You're all caught up.</p></div>}
            </div>
            <div className="topbar-avatar">{(userProfile.name || 'U').charAt(0).toUpperCase()}</div>
          </div>
        </header>
        <section className="page-area">
          <div className="page-heading">
            <div><div className="eyebrow"><Sparkles size={13}/> WORKSPACE</div><h1>{pageTitle}</h1><p>{pageSubtitle}</p></div>
            <div className="heading-actions">
              {activeTab === 'automation' || activeTab === 'flows' ? <button className="primary-button" onClick={() => setActiveTab('flows')}><Plus size={16}/> Create automation</button> : null}
              {activeTab === 'contacts' ? <button className="primary-button" onClick={() => alert('Contact import will be connected in the contacts module.')}><Plus size={16}/> Add contact</button> : null}
            </div>
          </div>
          <div className={`page-content ${activeTab === 'flows' || activeTab === 'automation' ? 'page-content-builder' : ''}`}>
            {pageContent}
          </div>
          <footer className="app-footer"><span>Flowbot <b>·</b> Customer engagement workspace</span><span><Activity size={13}/> Demo environment</span></footer>
        </section>
      </main>
    </div>
  );
}

function FlowWorkspace() {
  const [selected, setSelected] = useState('Default Reply');
  const [flows, setFlows] = useState([
    { name: 'Default Reply', detail: 'Reply to common customer questions', status: 'Published', trigger: 'Keyword', updated: 'Today' },
    { name: 'Welcome new subscribers', detail: 'Greet new contacts automatically', status: 'Draft', trigger: 'New subscriber', updated: 'Yesterday' },
  ]);
  return <div className="module-stack">
    <div className="module-toolbar"><div><h2>Your automations</h2><p>Build customer journeys with reusable steps.</p></div><button className="secondary-button" onClick={() => { const name = `New automation ${flows.length + 1}`; setFlows([...flows, { name, detail: 'New workflow — configure your trigger and actions', status: 'Draft', trigger: 'Not configured', updated: 'Just now' }]); setSelected(name); }}><Plus size={15}/> New flow</button></div>
    <div className="flow-layout">
      <div className="flow-list">{flows.map((flow, i) => <button key={flow.name} className={`flow-list-item ${selected === flow.name ? 'flow-selected' : ''}`} onClick={() => setSelected(flow.name)}><div className="flow-item-icon"><Workflow size={18}/></div><div className="flow-item-copy"><strong>{flow.name}</strong><span>{flow.detail}</span><small>{flow.trigger} · {flow.updated}</small></div><span className={`status-pill ${flow.status === 'Published' ? 'status-published' : ''}`}>{flow.status}</span></button>)}</div>
      <div className="flow-preview"><div className="preview-top"><div><span className="preview-dot"/> FLOW CANVAS</div><span className="status-pill">{flows.find(f => f.name === selected)?.status || 'Draft'}</span></div><div className="canvas-grid"><div className="canvas-node trigger-node"><span className="node-icon"><Zap size={16}/></span><div><small>TRIGGER</small><strong>{flows.find(f => f.name === selected)?.trigger || 'Keyword'}</strong><p>When a contact starts this flow</p></div></div><div className="node-connector"><span/></div><div className="canvas-node message-node"><span className="node-icon"><MessageCircle size={16}/></span><div><small>ACTION · SEND MESSAGE</small><strong>Welcome message</strong><p>Thanks for reaching out! How can we help?</p></div></div><div className="node-connector"><span/></div><button className="add-step" onClick={() => alert('The visual drag-and-drop editor is the next development milestone.')}><Plus size={16}/> Add step</button></div><div className="preview-bottom"><span><span className="green-dot"/> All changes saved locally</span><button className="primary-button" onClick={() => setFlows(flows.map(f => f.name === selected ? {...f, status: f.status === 'Published' ? 'Draft' : 'Published'} : f))}>{flows.find(f => f.name === selected)?.status === 'Published' ? 'Unpublish' : 'Publish flow'}</button></div></div>
    </div>
  </div>;
}

function ChannelsWorkspace() {
  const channels = [
    { name: 'Facebook Messenger', detail: 'Connect Facebook pages and manage Messenger conversations.', icon: MessageCircle, tone: 'channel-facebook' },
    { name: 'Instagram', detail: 'Automate Instagram DMs, comments and story replies.', icon: Instagram, tone: 'channel-instagram' },
    { name: 'Telegram', detail: 'Connect a Telegram bot to start automated conversations.', icon: Send, tone: 'channel-telegram' },
    { name: 'WhatsApp', detail: 'Prepare WhatsApp Business messaging integration.', icon: MessageCircle, tone: 'channel-whatsapp' },
  ];
  return <div className="module-stack"><div className="module-toolbar"><div><h2>Messaging channels</h2><p>Connect channels to start managing conversations and automations.</p></div><span className="status-pill">0 connected in this view</span></div><div className="channel-grid">{channels.map(c => { const Icon = c.icon; return <div className="channel-card" key={c.name}><div className={`channel-icon ${c.tone}`}><Icon size={21}/></div><h3>{c.name}</h3><p>{c.detail}</p><button className="secondary-button" onClick={() => c.name === 'Facebook Messenger' ? alert('Use the existing Facebook Connect module below to configure Meta credentials.') : alert(`${c.name} connection setup will be implemented as a separate integration module.`)}><Plug size={14}/> Connect channel</button></div>; })}</div><div className="channel-connect-existing"><h3>Facebook page connection</h3><FacebookConnect/></div></div>;
}
