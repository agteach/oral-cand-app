export function calculateRisk(patient: any) {
    let score = 0;

    // Age risk
    if (patient.age > 40) score += 10;

    // CD4 risk (low CD4 = high risk)
    if (patient.cd4Count && patient.cd4Count < 200) score += 30;

    // ART not initiated = higher risk
    if (!patient.artInitiated) score += 20;

    // Diabetes increases risk
    if (patient.diabetes) score += 15;

    // Antifungal use (indicates infection history)
    if (patient.antifungalUsed) score += 10;

    // Normalize to percentage
    if (score > 100) score = 100;

    return score;
}