# Supersquad

Applicazione React + Redux che permette di comporre una squadra di supereroi partendo da una lista predefinita di personaggi e di visualizzarne le statistiche aggregate.

## Contenuti principali
- **CharacterList**: elenco dei personaggi disponibili, caricati da `src/data/characters.json`. È possibile aggiungerli alla squadra finché rimangono disponibili.
- **HeroList**: mostra i membri correnti della squadra e consente di rimuoverli.
- **SquadStats**: calcola e aggiorna in tempo reale forza, intelligenza e velocità totali della squadra.
- **Redux store**: configurato in `src/index.js` con i reducer combinati (`characters` e `heroes`) e DevTools abilitati.

## Struttura della cartella `src/`
```
actions/        → action creator `addCharacterById` e `removeCharacterById`
assets/         → background dell'app
components/     → App, CharacterList, HeroList, SquadStats
data/           → dataset JSON con i personaggi
reducers/       → reducer per la lista personaggi e per la squadra
styles/         → fogli di stile globali
index.js        → bootstrap dell'app con Provider Redux
serviceWorker.js
```

## Stack e dipendenze
- React 16.10 / ReactDOM
- Redux + React-Redux
- Create React App (react-scripts 3.2)

## Script disponibili
| Comando | Descrizione |
| ------- | ----------- |
| `npm start` | Avvia l'app in modalità sviluppo su `http://localhost:3000` |
| `npm test` | Esegue la suite di test interattiva di CRA |
| `npm run build` | Produce la build ottimizzata per la produzione |
| `npm run eject` | Espone la configurazione di CRA (operazione irreversibile) |

## Come eseguire il progetto
1. Installare le dipendenze: `npm install`
2. Avviare il server di sviluppo: `npm start`
3. Aprire il browser su `http://localhost:3000`

## Note aggiuntive
- Gli stili principali (`src/styles/index.css`) impostano un'immagine di sfondo e il cursore sugli elementi interattivi.
- I dati dei personaggi contengono attributi `strength`, `intelligence` e `speed`, usati per il calcolo delle statistiche complessive.
- Non sono presenti test personalizzati: `npm test` utilizza la configurazione standard di CRA.
