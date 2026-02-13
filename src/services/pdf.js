// PDF Generation Service using jspdf (loaded via CDN as window.jspdf)

export const generateInspectionPDF = (inspection) => {
    if (!window.jspdf) {
        alert("PDF Library not loaded");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const { vehicleDetails, condition, damages, notes, inspectorName, createdAt } = inspection;

    // Header
    doc.setFontSize(22);
    doc.text("Vehicle Inspection Report", 20, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(createdAt).toLocaleString()}`, 20, 30);
    doc.text(`Inspection ID: ${inspection.id.slice(0, 8)}`, 150, 30);

    // Section: Vehicle Info
    doc.setFontSize(16);
    doc.text("Vehicle Information", 20, 45);
    doc.setLineWidth(0.5);
    doc.line(20, 47, 190, 47);

    doc.setFontSize(11);
    let y = 55;
    const addField = (label, value, x) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, x, y);
        doc.setFont("helvetica", "normal");
        doc.text(value ? String(value) : "N/A", x + 35, y);
    };

    addField("VIN", vehicleDetails.vin, 20);
    addField("Unit #", vehicleDetails.unitC, 110);
    y += 10;
    addField("Year", vehicleDetails.year, 20);
    addField("Make", vehicleDetails.make, 110);
    y += 10;
    addField("Model", vehicleDetails.model, 20);
    addField("Color", vehicleDetails.color, 110);
    y += 10;
    addField("Mileage", vehicleDetails.mileage, 20);
    addField("Gas Level", vehicleDetails.gasLevel, 110);

    // Section: Condition
    y += 20;
    doc.setFontSize(16);
    doc.text("Condition Report", 20, y);
    doc.line(20, y + 2, 190, y + 2);

    y += 10;
    doc.setFontSize(11);

    const conditions = Object.entries(condition);
    // Grid layout for conditions
    conditions.forEach((item, index) => {
        if (index > 0 && index % 2 === 0) y += 10;
        const x = (index % 2 === 0) ? 20 : 110;

        const label = item[0].replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        const status = item[1] ? "Pass" : "FAIL";

        doc.text(`${label}:`, x, y);
        doc.setTextColor(item[1] ? 0 : 200, item[1] ? 100 : 0, 0); // Green if pass, Red if fail
        doc.text(status, x + 50, y);
        doc.setTextColor(0, 0, 0); // Reset
    });

    // Section: Damage
    y += 20;
    doc.setFontSize(16);
    doc.text("Damage Report", 20, y);
    doc.line(20, y + 2, 190, y + 2);
    y += 10;

    if (!damages || damages.length === 0) {
        doc.setFontSize(11);
        doc.text("No damage reported.", 20, y);
        y += 10;
    } else {
        damages.forEach((d, i) => {
            doc.setFontSize(11);
            doc.text(`${i + 1}. ${d.type} - ${d.notes}`, 20, y);
            y += 10;
        });
    }

    // Notes
    y += 10;
    if (notes) {
        doc.setFontSize(12);
        doc.text("Additional Notes:", 20, y);
        y += 7;
        doc.setFontSize(10);
        const splitNotes = doc.splitTextToSize(notes, 170);
        doc.text(splitNotes, 20, y);
    }

    // Footer
    doc.setFontSize(10);
    doc.text("Signed By: __________________________", 20, 270);

    doc.save(`inspection-${vehicleDetails.vin || 'report'}.pdf`);
};
