import os
import subprocess
import json
import asyncio
from openai import AsyncOpenAI
import requests

# Configurazione
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO = os.getenv("GITHUB_REPOSITORY")
PR_NUMBER = os.getenv("PR_NUMBER")

SYSTEM_PROMPT = """
Scopo:
Sei un esperto di qualità del software.
Analizza il seguente file sorgente e individua solo bug e code smell secondo le categorie di SonarQube.

Condizioni:
Segnala solo bug e code smell che sono effettivamente presenti nel codice e rilevabili dall’analisi del file.
Non scrivere messaggi ipotetici, avvisi preventivi o possibili problemi: se non succede realmente nel codice così com’è, non deve essere riportato.
Tutte le issue, indipendentemente dalla severity, devono essere verificabili concretamente nel contesto specifico dei file forniti, senza considerare scenari futuri o ipotetici.

Descrizione dei problemi rilevabili:
- Bug (problemi che possono causare malfunzionamenti o crash):
    - Divisione per zero
    - Null pointer exception potenziali
    - Array index out of bounds
    - Variabili non inizializzate
    - Tipi incompatibili (cast errati)
    - Concurrency issues (race condition, deadlock)
    - Errori in gestione delle eccezioni (catch vuoti, swallowing exceptions)
    - Risorse non chiuse (file, stream, database connection)
    - Condizioni logiche impossibili o ridondanti (if/else inutili)
- Code Smell (problemi di qualità, leggibilità o manutenzione):
    - Metodi troppo lunghi o complessi
    - Classi troppo grandi (God class)
    - Nomi di variabili/metodi poco chiari o ambigui
    - Duplicazioni di codice
    - Complessità ciclomativa elevata
    - Commenti inutili o mancanti
    - Logica nidificata eccessiva (troppi livelli di if/for)
    - Codice morto / inutilizzato
    - Parametri eccessivi nei metodi
    - Uso di costanti “magiche” invece di variabili ben nominate
    - Iniezione di dipendenze mancata o errata
    - Test unitari insufficienti o assenti
    - Codice non thread-safe senza motivo
    - Mancanza di separazione dei compiti (SRP violato)

Ignora vulnerabilità di sicurezza, configurazioni deboli, CVE o librerie obsolete.

Rispondi in formato JSON con una chiave "total_issues" con il totale delle issue rilevate, e con la chiave "issues" contenente una lista di oggetti aventi:
- file: nome del file
- line: numero di riga dove possibile
- message: descrizione del problema
- fix: suggerimento concreto o modifica da fare su quella riga (una o poche righe di codice corretto o descrizione chiara)
- sourceCode: codice problematico rilevato
- severity: LOW/MEDIUM/HIGH (secondo impatto su funzionamento, manutenzione o leggibilità)

Si considerino le severity in questo modo:
{{
  "severity_levels": {{
    "CRITICAL": {{
      "description": "Problemi che causano crash immediati, perdita di dati o comportamenti imprevedibili certi, non probabili o ipotetici.",
      "examples": [
        "Divisione per zero",
        "Null pointer exception sicure (senza check)",
        "Array index out of bounds sicuro",
        "Race condition/deadlock critici",
        "Tipi incompatibili con cast immediatamente eseguito",
        "Risorse fondamentali non chiuse (file/DB) causando blocco o perdita dati",
        "Errori in gestione eccezioni che interrompono il flusso principale"
      ]
    }},
    "HIGH": {{
      "description": "Problemi gravi che possono causare malfunzionamenti intermittenti o rendere il codice molto difficile da mantenere.",
      "examples": [
        "Variabili non inizializzate usate condizionalmente",
        "Condizioni logiche impossibili o ridondanti",
        "Classi o metodi troppo grandi (God class / metodo > 200 righe)",
        "Parametri eccessivi in metodi critici (>5 parametri)",
        "Logica nidificata eccessiva con rischio di errore"
      ]
    }},
    "MEDIUM": {{
      "description": "Problemi di qualità o leggibilità che non causano crash immediati ma rendono il codice fragile o difficile da estendere.",
      "examples": [
        "Metodi lunghi o complessi (>50 righe)",
        "Complessità ciclomativa elevata",
        "Nomi di variabili/metodi poco chiari",
        "Duplicazioni di codice",
        "Uso di costanti magiche"
      ]
    }},
    "LOW": {{
      "description": "Problemi minori di stile o refactoring consigliato senza impatto sul funzionamento.",
      "examples": [
        "Commenti mancanti o inutili",
        "Codice morto / inutilizzato",
        "Iniezione di dipendenze mancante",
        "Test unitari insufficienti o assenti"
      ]
    }}
  }}
}}
"""

def get_changed_files():
    """Ottiene la lista dei file JavaScript/TypeScript modificati nella PR"""
    try:
        result = subprocess.run(
            ['git', 'diff', '--name-only', 'origin/main...HEAD'],
            capture_output=True, text=True, check=True
        )
        
        valid_extensions = ('.js', '.jsx', '.ts', '.tsx')
        
        files = [
            f for f in result.stdout.splitlines() 
            if f.endswith(valid_extensions) and os.path.exists(f)
        ]
        
        return files
    except Exception as e:
        print(f"Nota: Errore nel diff con origin/main ({e}). Provo con l'ultimo commit.")
        try:
            result = subprocess.run(
                ['git', 'diff', '--name-only', 'HEAD~1'],
                capture_output=True, text=True, check=True
            )
            return [f for f in result.stdout.splitlines() if f.endswith(('.js', '.jsx'))]
        except:
            return []

def get_file_diff(file_path):
    """Recupera il diff specifico per un file"""
    result = subprocess.run(
        ['git', 'diff', 'origin/main...HEAD', '--', file_path],
        capture_output=True, text=True
    )
    
    print(f"\n===== DIFF per {file_path} =====")
    print(result.stdout)
    print("===== FINE DIFF =====\n")
    
    return result.stdout

async def analyze_file(file_path):
    diff_content = get_file_diff(file_path)
    if not diff_content:
        return None

    with open(file_path, 'r') as f:
        full_content = f.read()

    user_prompt = f"File: {file_path}\n\nDIFF DELLE MODIFICHE:\n{diff_content}\n\nCONTENUTO COMPLETO:\n{full_content}"

    response = await client.chat.completions.create(
        model="gpt-5.1",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        response_format={"type": "json_object"}
    )

    print(f"\n===== RESPONSE =====")
    print(response)
    print("===== FINE RESPONSE =====\n")
    
    return json.loads(response.choices[0].message.content)

def post_comment(message):
    url = f"https://api.github.com/repos/{REPO}/issues/{PR_NUMBER}/comments"
    headers = {"Authorization": f"Bearer {GITHUB_TOKEN}", "Accept": "application/vnd.github+json"}
    requests.post(url, json={"body": message}, headers=headers)

async def main():
    print("Avvio analisi...")
    files = get_changed_files()
    
    if not files:
        print("DEBUG: Nessun file JavaScript/TypeScript rilevato dai comandi git diff.")
        return

    print(f"DEBUG: File da analizzare: {files}")
    all_issues = []
    tasks = [analyze_file(f) for f in files]
    results = await asyncio.gather(*tasks)

    for res in results:
        if res and "issues" in res:
            all_issues.extend(res["issues"])

    if all_issues:
        comment = "## 🤖 AI Code Review Report\nHo trovato dei potenziali problemi nelle tue modifiche:\n\n"
        for issue in all_issues:
            comment += f"- **{issue['severity']}** in `{issue['file']}` (linea {issue.get('line', '?')}): {issue['message']}\n"
            comment += f"  - **Fix consigliato:** `{issue['fix']}`\n\n"
        post_comment(comment)
    else:
        post_comment("✅ Analisi completata: nessun bug o code smell rilevato nelle modifiche.")

if __name__ == "__main__":
    asyncio.run(main())
