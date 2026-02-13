// Simulated Database Service
// In a real app, this would wrap Firebase SDK calls

const STORAGE_KEYS = {
    INSPECTIONS: 'car_inspect_inspections',
    USER: 'car_inspect_user'
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
    // Inspections
    async getInspections() {
        await delay(300);
        const data = localStorage.getItem(STORAGE_KEYS.INSPECTIONS);
        return data ? JSON.parse(data) : [];
    },

    async getInspectionByVin(vinFragment) {
        await delay(300);
        const all = await this.getInspections();
        return all.filter(i => i.vehicleDetails.vin.endsWith(vinFragment));
    },

    async saveInspection(inspection) {
        await delay(500);
        const all = await this.getInspections();
        const newInspection = {
            ...inspection,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            status: inspection.damage?.length > 0 ? 'Pending Approval' : 'Completed' // Logic: Damage needs approval? Or just always Completed unless flag?
            // User requirement: Form 2 is for Approval Request. So Form 1 is just "Completed" initially or "Draft".
            // Let's default to 'Completed' for Form 1.
        };
        newInspection.status = 'Assessment Complete';

        all.unshift(newInspection);
        localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(all));
        return newInspection;
    },

    // Approvals
    async createApprovalRequest(inspectionId, requestData) {
        await delay(500);
        const all = await this.getInspections();
        const index = all.findIndex(i => i.id === inspectionId);
        if (index === -1) throw new Error("Inspection not found");

        all[index].approvalRequest = {
            ...requestData,
            status: 'Pending',
            requestedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(all));
        return all[index];
    },

    // Auth (Mock)
    async login(email) {
        await delay(400);
        const user = { email, name: email.split('@')[0], role: 'employee' };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        return user;
    },

    getUser() {
        const u = localStorage.getItem(STORAGE_KEYS.USER);
        return u ? JSON.parse(u) : null;
    },

    logout() {
        localStorage.removeItem(STORAGE_KEYS.USER);
    }
};
