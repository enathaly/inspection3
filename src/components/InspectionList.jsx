import React, { useState, useEffect } from 'https://esm.sh/react@18';
import { db } from '../services/db.js';

export const InspectionList = () => {
    const [inspections, setInspections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await db.getInspections();
        setInspections(data);
        setLoading(false);
    };

    const filtered = inspections.filter(i =>
        search === '' ||
        i.vehicleDetails.vin?.toLowerCase().includes(search.toLowerCase()) ||
        i.vehicleDetails.make.toLowerCase().includes(search.toLowerCase()) ||
        i.vehicleDetails.model.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading recent inspections...</div>;

    return (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
                <input
                    className="input"
                    placeholder="Search by VIN, Make, or Model..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                />
            </div>

            {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#64748b' }}>No inspections found.</div>}

            {filtered.map(i => (
                <div key={i.id}
                    onClick={() => window.location.hash = `#view-inspection/${i.id}`}
                    style={{
                        padding: '1rem',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                    <div>
                        <div style={{ fontWeight: 600 }}>{i.vehicleDetails.year} {i.vehicleDetails.make} {i.vehicleDetails.model}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>VIN: ...{i.vehicleDetails.vin?.slice(-8) || 'N/A'} • {i.status}</div>
                    </div>
                    <div>
                        <span style={{
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: '#f1f5f9',
                            color: '#475569'
                        }}>
                            {new Date(i.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};
