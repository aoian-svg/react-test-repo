// scripts/convert-sarif.js
const fs = require('fs');

if (process.argv.length < 4) {
  console.error('Usage: node convert-sarif.js <input.sarif> <output.json>');
  process.exit(1);
}

const [,, inputFile, outputFile] = process.argv;

// Mappatura Snyk -> nostre categorie
const severityMap = {
  "critical": "CRITICAL",
  "high": "HIGH",
  "medium": "MEDIUM",
  "low": "LOW"
};

// Leggi SARIF
const sarif = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
const issues = [];

if (sarif.runs) {
  sarif.runs.forEach(run => {
    if (!run.results) return;

    run.results.forEach(result => {
      // Ignora issue di sicurezza
      if (result.ruleId && /security|xss|cve|vuln/i.test(result.ruleId)) return;

      const location = result.locations?.[0]?.physicalLocation?.region;
      const fileUri = result.locations?.[0]?.physicalLocation?.artifactLocation?.uri || "unknown";
      const sourceCode = result.locations?.[0]?.physicalLocation?.contextRegion?.snippet?.text || "";

      // Mappa la severity di Snyk su quella nostra
      const rawSeverity = result.level?.toLowerCase() || "medium";
      const severity = severityMap[rawSeverity] || "MEDIUM";

      issues.push({
        file: fileUri,
        line: location?.startLine || 0,
        message: result.message?.text || "No description",
        fix: "Verifica il codice e applica il refactoring/fix necessario",
        sourceCode,
        severity
      });
    });
  });
}

// Scrive JSON finale
fs.writeFileSync(outputFile, JSON.stringify({
  total_issues: issues.length,
  issues
}, null, 2));

console.log(`Custom JSON written to ${outputFile}`);
