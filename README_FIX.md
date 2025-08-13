# Fix Clarifai API (CRA) – File .fixed

Questa cartella introduce versioni "fixed" dei file principali per migliorare robustezza delle chiamate Clarifai:

- `src/config/api.fixed.js`: helper HTTP con timeout, risoluzione automatica della versione modello, test API.
- `src/services/apiService.fixed.js`: servizio che usa il resolver di versione e timeout.
- `src/App.fixed.js`: usa i file fixed ed espone UI più resiliente.

## Come usarli

1. Verifica `.env.local`:

```
REACT_APP_CLARIFAI_PAT=<il_tuo_PAT>
REACT_APP_CLARIFAI_USER_ID=clarifai
REACT_APP_CLARIFAI_APP_ID=main
```

2. Nel tuo `src/index.js` importa `App.fixed` al posto di `App` (oppure rinomina `App.fixed.js` in `App.js`).

3. Riavvia `npm start`.

## Test rapido

In UI usa un URL HTTPS pubblico, es.: `https://samples.clarifai.com/metro-north.jpg`.

## Note

- Il PAT è nel client: per produzione usa un proxy/serverless e conserva il PAT solo server-side.




