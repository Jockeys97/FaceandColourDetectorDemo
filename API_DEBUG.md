# 🐛 Guida Debug API Clarifai

## Problemi Comuni e Soluzioni

### 1. Verifica Credenziali API
- **PAT (Personal Access Token)**: Assicurati che sia valido e non scaduto
- **USER_ID**: Deve essere 'clarifai' 
- **APP_ID**: Deve essere 'main'

### 2. Test API Diretto
Puoi testare l'API direttamente con curl:

```bash
curl -X POST \
  https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs \
  -H 'Accept: application/json' \
  -H 'Authorization: Key YOUR_PAT_HERE' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_app_id": {
      "user_id": "clarifai",
      "app_id": "main"
    },
    "inputs": [{
      "data": {
        "image": {
          "url": "https://example.com/image.jpg"
        }
      }
    }]
  }'
```

### 3. Controllo Console Browser
Apri la console del browser (F12) e cerca questi messaggi:

- 🚀 **Avvio analisi immagine**: Conferma che la richiesta parte
- 📤 **Richiesta API preparata**: Mostra l'URL e gli headers
- 📥 **Risposta ricevuta**: Status della risposta HTTP
- ✅ **Risposta API completa**: Dati ricevuti dall'API
- 💥 **Errore API**: Eventuali errori

### 4. Problemi CORS
Se vedi errori CORS:
- Usa immagini da domini che permettono CORS
- Prova con immagini HTTPS
- Evita immagini da servizi che bloccano richieste esterne

### 5. Test Immagini
Prova con queste immagini di test:
- `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d`
- `https://images.unsplash.com/photo-1500648767791-00dcc994a43e`

### 6. Verifica Connessione
- Controlla la tua connessione internet
- Verifica che non ci siano firewall che bloccano le richieste
- Prova a disabilitare temporaneamente antivirus/firewall

### 7. Limiti API
- Verifica che non hai superato i limiti di utilizzo
- Controlla il dashboard Clarifai per lo stato dell'account

## Struttura Risposta API

Una risposta valida dovrebbe avere questa struttura:
```json
{
  "outputs": [{
    "data": {
      "regions": [{
        "region_info": {
          "bounding_box": {
            "left_col": 0.1,
            "top_row": 0.2,
            "right_col": 0.8,
            "bottom_row": 0.9
          }
        }
      }]
    }
  }]
}
```

## Contatti Supporto
Se i problemi persistono:
1. Controlla la documentazione ufficiale Clarifai
2. Verifica lo stato dei servizi Clarifai
3. Contatta il supporto Clarifai con i log di errore
