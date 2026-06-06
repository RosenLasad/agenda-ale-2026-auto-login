# Agenda - Passo 1 per widget Android 4x2

Questa versione prepara Agenda per un futuro widget Android "Prossimi 7 giorni".

## Cosa è stato aggiunto

1. Nuovo endpoint Netlify:

   `/api/widget-week?token=IL_TUO_TOKEN`

   Restituisce solo i prossimi 7 giorni dell'Agenda in formato JSON, senza note, rubrica o todo.

2. Nuovo redirect in `netlify.toml`:

   `/api/widget-week` -> `/.netlify/functions/widget-week`

3. Apertura diretta di Agenda:

   `/?view=calendar&panel=week`

   Questo apre Agenda sulla vista Calendario e porta in primo piano il pannello "Prossimi 7 giorni".

4. Scorciatoie PWA nel `manifest.webmanifest`:

   - Prossimi 7 giorni
   - Oggi

5. Cache PWA aggiornata da `agenda-shell-v10` a `agenda-shell-v11`.

## Variabile ambiente da impostare su Netlify

Su Netlify, aggiungi una variabile ambiente:

`WIDGET_TOKEN=una_stringa_lunga_casuale`

Esempio:

`WIDGET_TOKEN=agenda-widget-7giorni-2026-codice-molto-lungo`

Non usare questo esempio così com'è: scegli una stringa tua.

## Test dopo il deploy

Dopo aver caricato questa versione su Netlify e impostato `WIDGET_TOKEN`, apri:

`https://TUO-SITO.netlify.app/api/widget-week?token=IL_TUO_TOKEN`

Dovresti vedere una risposta simile:

```json
{
  "ok": true,
  "type": "agenda-week-v1",
  "timeZone": "Europe/Rome",
  "generatedAt": "2026-05-03T10:30:00.000Z",
  "updatedAt": "2026-05-03T10:29:00.000Z",
  "days": [
    {
      "iso": "2026-05-03",
      "label": "Oggi",
      "dateLabel": "dom 3 mag",
      "count": 1,
      "events": [
        {
          "time": "09:30",
          "title": "Lezione",
          "cat": "work",
          "catLabel": "Lavoro"
        }
      ]
    }
  ]
}
```

Se vedi `Unauthorized`, il token non corrisponde.

Se vedi `Missing WIDGET_TOKEN environment variable`, devi impostare la variabile ambiente su Netlify e rifare il deploy.

Se vedi `No saved Agenda state found`, apri Agenda, fai login e salva/modifica almeno un evento in modo che lo stato cloud venga creato.
