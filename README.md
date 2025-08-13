# Riconoscitore Facce (React + Clarifai)

Applicazione React che rileva i volti in un'immagine usando l'API Clarifai Face Detection. Supporta più volti, mostra le bounding box e le confidence, ed evita problemi CORS in sviluppo tramite proxy.

## Demo rapida
- Esegui l'app (vedi Setup) e incolla un URL pubblico, ad esempio:
  - `https://samples.clarifai.com/metro-north.jpg`
  - `https://samples.clarifai.com/face-det.jpg`
  - `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900`

## Stack
- React (Create React App)
- Clarifai REST API (`face-detection` v6dc7e46bc9124c5c8824be4822abe105)
- http-proxy-middleware per il proxy di sviluppo

## Setup
1. Dipendenze:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Variabili d'ambiente: crea un `.env` nella root con:
   ```bash
   REACT_APP_CLARIFAI_PAT=<il_tuo_PAT>
   # opzionali (default già impostati)
   REACT_APP_CLARIFAI_USER_ID=clarifai
   REACT_APP_CLARIFAI_APP_ID=main
   ```
3. Avvio in sviluppo:
   ```bash
   npm start
   ```
   Apri `http://localhost:3000`.

## Come funziona
- Configurazione API: `src/config/api.js`
  - Definisce modelli e `API_BASE_URL`. In sviluppo usa `'/api/clarifai/v2'` (proxy), in produzione usa `'https://api.clarifai.com/v2'`.
  - Include helper `httpJson` con timeout e `resolveModelVersion` (cache della versione più recente se non fornita).
- Proxy di sviluppo: `src/setupProxy.js`
  - Instrada le richieste `'/api/clarifai/*'` verso `https://api.clarifai.com/*` e aggiunge l'header `Authorization: Key <PAT>` lato dev server per evitare CORS.
- Servizio API: `src/services/apiService.js`
  - `detectFaces(imageUrl)` invia il payload a Clarifai e restituisce `regions`.
- UI:
  - `src/App.js` gestisce input, chiamata API e calcola bounding box in pixel per tutte le facce.
  - `src/Components/FaceRecognition/FaceRecognition.js` disegna tutte le bounding box e mostra le confidence.

## Produzione
In produzione il PAT non dovrebbe mai stare nel client. Opzioni consigliate:
- Aggiungi un backend o una funzione serverless che inoltri la richiesta a Clarifai, aggiungendo il PAT lato server.
- Imposta le variabili d'ambiente del server e non esporre il PAT al browser.

Build di produzione:
```bash
npm run build
```
Distribuisci la cartella `build/` sul tuo hosting preferito.

## Script NPM
- `npm start`: avvio in sviluppo
- `npm run build`: build produzione
- `npm test`: test (CRA)

## Troubleshooting
- CORS in sviluppo: assicurati di aver riavviato il dev server dopo aver creato/modificato `src/setupProxy.js`. Le richieste devono passare per `/api/clarifai/v2/...`.
- 404 su `/api/clarifai/...`: indica proxy non agganciato; riavvia `npm start` e verifica i log del proxy in console.
- 401/403: PAT mancante o invalido. Controlla `.env` e riavvia il dev server.
- Vedi una sola faccia: aggiornato il supporto multi-volto; verifica che l'immagine contenga volti nitidi e non tagliati.

## Licenza
Questo progetto è destinato ad uso didattico/dimostrativo.
