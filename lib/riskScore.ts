type RiskPatient = {
    age: number;
    cd4Count?: number | string | null;
    artInitiation?: boolean | null;
    artInitiated?: boolean | null;
    diabetes?: boolean | null;
    antifungalsUsed?: boolean | null;
    antifungalUsed?: boolean | null;
};

export function calculateRisk(patient: RiskPatient) {
    let score = 0;
    const cd4Count = typeof patient.cd4Count === "string" ? Number(patient.cd4Count) : patient.cd4Count;
    const artInitiated = patient.artInitiation ?? patient.artInitiated ?? false;
    const antifungalUsed = patient.antifungalsUsed ?? patient.antifungalUsed ?? false;

    // Age risk
    if (patient.age > 40) score += 10;

    // CD4 risk (low CD4 = high risk)
    if (typeof cd4Count === "number" && !Number.isNaN(cd4Count) && cd4Count < 200) score += 30;

    // ART not initiated = higher risk
    if (!artInitiated) score += 20;

    // Diabetes increases risk
    if (patient.diabetes) score += 15;

    // Antifungal use (indicates infection history)
    if (antifungalUsed) score += 10;

    // Normalize to percentage
    if (score > 100) score = 100;

    return score;
}
