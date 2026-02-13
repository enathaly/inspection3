import React, { useState, useEffect } from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18';
import { InspectionForm } from './components/InspectionForm.jsx';
import { InspectionList } from './components/InspectionList.jsx';
import { ApprovalForm } from './components/ApprovalForm.jsx';

const Layout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{
                padding: '1rem',
                background: 'var(--primary)',
                color: 'white',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => window.location.hash = ''}>
                    <h3 style={{ margin: 0, color: 'white' }}>CarInspect</h3>
                </div>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Internal Beta</span>
            </header>
            <main style={{ flex: 1, padding: '1rem' }}>
                {children}
            </main>
        </div>
    );
};

const Dashboard = () => {
    return (
        <div className="container animate-fade-in">
            <h1 style={{ margin: '1rem 0 2rem' }}>Dashboard</h1>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                <button className="btn btn-primary" onClick={() => window.location.hash = '#new-inspection'} style={{ justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' }}>
                    + Start New Inspection
                </button>
                <button className="btn btn-outline" onClick={() => window.location.hash = '#approvals'} style={{ justifyContent: 'center' }}>
                    Request Approval
                </button>
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Recent Inspections</h3>
            <div className="card" style={{ padding: '0.5rem' }}>
                <InspectionList />
            </div>
        </div>
    );
};

import { db } from './services/db.js';

// Layout and Dashboard remain same...

const App = () => {
    const [route, setRoute] = useState(window.location.hash || '#dashboard');
    const [viewData, setViewData] = useState(null);

    useEffect(() => {
        const handleHashChange = async () => {
            const hash = window.location.hash || '#dashboard';
            setRoute(hash);

            if (hash.startsWith('#view-inspection/')) {
                const id = hash.split('/')[1];
                const inspections = await db.getInspections();
                const found = inspections.find(i => i.id === id);
                setViewData(found);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        // Handle initial load if deep linked
        handleHashChange();

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const goHome = () => window.location.hash = '#dashboard';

    let Component;
    if (route === '#new-inspection') {
        Component = () => <InspectionForm onSuccess={goHome} />;
    } else if (route === '#approvals') {
        Component = () => <ApprovalForm onSuccess={goHome} />;
    } else if (route.startsWith('#view-inspection/')) {
        Component = () => viewData ? (
            <InspectionForm
                initialData={viewData}
                readOnly={true}
                onSuccess={goHome}
            />
        ) : <div className="container">Loading...</div>;
    } else {
        Component = Dashboard;
    }

    return (
        <Layout>
            <Component />
        </Layout>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
