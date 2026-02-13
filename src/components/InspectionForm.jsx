import React, { useState, useEffect } from 'https://esm.sh/react@18';
import { db } from '../services/db.js';
import { generateInspectionPDF } from '../services/pdf.js';

const VehicleInfoSection = ({ data, onChange, readOnly }) => (
    <div className="card animate-fade-in">
        <h3>Vehicle Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
                <label>VIN (Last 8)</label>
                <input disabled={readOnly} required maxLength="8" className="input" value={data.vin || ''} onChange={e => onChange('vin', e.target.value)} placeholder="e.g. 1A2B3C4D" />
            </div>
            <div>
                <label>Unit Number</label>
                <input disabled={readOnly} className="input" value={data.unitC || ''} onChange={e => onChange('unitC', e.target.value)} placeholder="#" />
            </div>
            <div>
                <label>Year</label>
                <input disabled={readOnly} type="number" className="input" value={data.year || ''} onChange={e => onChange('year', e.target.value)} placeholder="2024" />
            </div>
            <div>
                <label>Make</label>
                <input disabled={readOnly} className="input" value={data.make || ''} onChange={e => onChange('make', e.target.value)} placeholder="Toyota" />
            </div>
            <div>
                <label>Model</label>
                <input disabled={readOnly} className="input" value={data.model || ''} onChange={e => onChange('model', e.target.value)} placeholder="Camry" />
            </div>
            <div>
                <label>Color</label>
                <input disabled={readOnly} className="input" value={data.color || ''} onChange={e => onChange('color', e.target.value)} placeholder="Silver" />
            </div>
            <div>
                <label>Mileage</label>
                <input disabled={readOnly} type="number" className="input" value={data.mileage || ''} onChange={e => onChange('mileage', e.target.value)} placeholder="15000" />
            </div>
            <div>
                <label>Gas Level</label>
                <select disabled={readOnly} className="select" value={data.gasLevel || ''} onChange={e => onChange('gasLevel', e.target.value)}>
                    <option value="">Select...</option>
                    <option value="E">Empty</option>
                    <option value="1/4">1/4</option>
                    <option value="1/2">1/2</option>
                    <option value="3/4">3/4</option>
                    <option value="F">Full</option>
                </select>
            </div>
        </div>
    </div>
);

const ToggleQuestion = ({ label, value, onChange, readOnly }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
                type="button"
                disabled={readOnly}
                style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    background: value === true ? 'var(--success)' : (readOnly ? '#f1f5f9' : 'white'),
                    color: value === true ? 'white' : 'var(--text-main)',
                    opacity: readOnly && value !== true ? 0.5 : 1,
                    cursor: readOnly ? 'default' : 'pointer'
                }}
                onClick={() => !readOnly && onChange(true)}
            >
                Yes
            </button>
            <button
                type="button"
                disabled={readOnly}
                style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    background: value === false ? 'var(--danger)' : (readOnly ? '#f1f5f9' : 'white'),
                    color: value === false ? 'white' : 'var(--text-main)',
                    opacity: readOnly && value !== false ? 0.5 : 1,
                    cursor: readOnly ? 'default' : 'pointer'
                }}
                onClick={() => !readOnly && onChange(false)}
            >
                No
            </button>
        </div>
    </div>
);

const ConditionSection = ({ data, onChange, readOnly }) => {
    const questions = [
        { key: 'ac', label: 'A/C Working?' },
        { key: 'backupCamera', label: 'Backup Camera?' },
        { key: 'headlights', label: 'Headlights?' },
        { key: 'taillights', label: 'Taillights?' },
        { key: 'radio', label: 'Radio?' },
        { key: 'windows', label: 'Windows?' },
        { key: 'wipers', label: 'Wipers?' },
        { key: 'seats', label: 'Power Seats?' },
        { key: 'moonroof', label: 'Moon Roof?' },
        { key: 'vents', label: 'Vents?' },
    ];

    return (
        <div className="card animate-fade-in">
            <h3>Vehicle Condition</h3>
            {!readOnly && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Tap Yes or No for each item.</p>}
            <div>
                {questions.map(q => (
                    <ToggleQuestion
                        key={q.key}
                        label={q.label}
                        value={data[q.key]}
                        onChange={(val) => onChange(q.key, val)}
                        readOnly={readOnly}
                    />
                ))}
            </div>
        </div>
    );
};

const DamageSection = ({ damages, onAdd, onRemove, onUpdate, readOnly }) => (
    <div className="card animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Damage Report</h3>
            {!readOnly && <button type="button" className="btn btn-outline" style={{ width: 'auto', padding: '0.4rem 0.8rem' }} onClick={onAdd}>+ Add Damage</button>}
        </div>

        {damages.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No damage reported.</p>}

        {damages.map((d, idx) => (
            <div key={idx} style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>Damage #{idx + 1}</span>
                    {!readOnly && <button type="button" onClick={() => onRemove(idx)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>}
                </div>

                <select disabled={readOnly} className="select" value={d.type} onChange={(e) => onUpdate(idx, 'type', e.target.value)}>
                    <option value="">Select Type...</option>
                    <option value="Scratch">Scratch</option>
                    <option value="Dent">Dent</option>
                    <option value="Broken">Broken</option>
                    <option value="Other">Other</option>
                </select>

                <input
                    disabled={readOnly}
                    className="input"
                    placeholder="Notes (e.g. Front bumper, passenger side)"
                    value={d.notes}
                    onChange={(e) => onUpdate(idx, 'notes', e.target.value)}
                />
            </div>
        ))}
    </div>
);

export const InspectionForm = ({ onSuccess, initialData, readOnly = false }) => {
    const [submitting, setSubmitting] = useState(false);
    const [vehicle, setVehicle] = useState(initialData?.vehicleDetails || {});
    const [condition, setCondition] = useState(initialData?.condition || {});
    const [damages, setDamages] = useState(initialData?.damages || []);
    const [notes, setNotes] = useState(initialData?.notes || '');

    useEffect(() => {
        if (initialData) {
            setVehicle(initialData.vehicleDetails || {});
            setCondition(initialData.condition || {});
            setDamages(initialData.damages || []);
            setNotes(initialData.notes || '');
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await db.saveInspection({
                vehicleDetails: vehicle,
                condition,
                damages,
                notes
            });
            alert('Inspection Saved Successfully!');
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            alert('Error saving inspection');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="container" style={{ paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1>{readOnly ? 'View Inspection' : 'New Inspection'}</h1>
                {readOnly && (
                    <button type="button" className="btn btn-outline" style={{ width: 'auto' }} onClick={() => generateInspectionPDF({ ...initialData, vehicleDetails: vehicle, condition, damages, notes })}>
                        Download PDF
                    </button>
                )}
            </div>

            <VehicleInfoSection
                data={vehicle}
                onChange={(k, v) => setVehicle(prev => ({ ...prev, [k]: v }))}
                readOnly={readOnly}
            />

            <ConditionSection
                data={condition}
                onChange={(k, v) => setCondition(prev => ({ ...prev, [k]: v }))}
                readOnly={readOnly}
            />

            <DamageSection
                damages={damages}
                onAdd={() => setDamages(prev => [...prev, { type: '', notes: '' }])}
                onRemove={(idx) => setDamages(prev => prev.filter((_, i) => i !== idx))}
                onUpdate={(idx, field, val) => {
                    const newD = [...damages];
                    newD[idx][field] = val;
                    setDamages(newD);
                }}
                readOnly={readOnly}
            />

            <div className="card">
                <h3>Additional Notes</h3>
                <textarea
                    disabled={readOnly}
                    className="input"
                    rows="3"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                />
            </div>

            {!readOnly && (
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Submit Inspection'}
                </button>
            )}
            {readOnly && (
                <button type="button" className="btn btn-outline" onClick={onSuccess}>
                    Back to Dashboard
                </button>
            )}
        </form>
    );
};
