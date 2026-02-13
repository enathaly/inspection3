import React, { useState, useEffect } from 'https://esm.sh/react@18';
import { db } from '../services/db.js';

export const ApprovalForm = ({ onSuccess }) => {
    const [inspections, setInspections] = useState([]);
    const [step, setStep] = useState(1); // 1: Select Vehicle, 2: Details
    const [selectedId, setSelectedId] = useState(null);
    const [recipient, setRecipient] = useState('');
    const [files, setFiles] = useState([]); // Mock file list

    useEffect(() => {
        db.getInspections().then(data => {
            // Only show ones that aren't already approved? For now show all.
            setInspections(data);
        });
    }, []);

    const handleFileAdd = () => {
        // Mock file upload
        const name = prompt("Enter mock file name (e.g. photo.jpg)");
        if (name) setFiles(prev => [...prev, name]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedId || !recipient) return;

        try {
            await db.createApprovalRequest(selectedId, {
                recipient,
                files
            });
            alert(`Approval Request Sent to ${recipient}!`);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            alert('Error sending request');
        }
    };

    if (step === 1) {
        return (
            <div className="container animate-fade-in">
                <h1>Request Approval</h1>
                <p>Select a vehicle inspection to submit for approval:</p>
                <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
                    {inspections.length === 0 && <p>No inspections found.</p>}
                    {inspections.map(i => (
                        <div
                            key={i.id}
                            onClick={() => { setSelectedId(i.id); setStep(2); }}
                            style={{
                                padding: '1rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                background: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            <strong>{i.vehicleDetails.year} {i.vehicleDetails.make} {i.vehicleDetails.model}</strong>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>VIN: ...{i.vehicleDetails.vin?.slice(-8)}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const selectedInspection = inspections.find(i => i.id === selectedId);

    return (
        <form onSubmit={handleSubmit} className="container animate-fade-in">
            <h1>Approval Details</h1>
            <div className="card">
                <h3>Vehicle: {selectedInspection?.vehicleDetails.year} {selectedInspection?.vehicleDetails.model}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>VIN: {selectedInspection?.vehicleDetails.vin}</p>
            </div>

            <div className="card">
                <label>Recipient (Internal)</label>
                <select className="select" required value={recipient} onChange={e => setRecipient(e.target.value)}>
                    <option value="">Select Manager...</option>
                    <option value="manager@dealership.com">General Manager</option>
                    <option value="service@dealership.com">Service Director</option>
                    <option value="sales@dealership.com">Sales Manager</option>
                </select>

                <div style={{ marginTop: '1rem' }}>
                    <label>Attachments (Photos/Docs)</label>
                    <div style={{ marginBottom: '0.5rem' }}>
                        {files.map((f, i) => (
                            <div key={i} style={{ padding: '0.5rem', background: '#f1f5f9', marginBottom: '0.25rem', borderRadius: '4px', fontSize: '0.9rem' }}>📎 {f}</div>
                        ))}
                    </div>
                    <button type="button" className="btn btn-outline" onClick={handleFileAdd}>+ Attach Mock File</button>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>* In real app, this opens file picker.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                <button type="submit" className="btn btn-primary">Send Request</button>
            </div>
        </form>
    );
};
