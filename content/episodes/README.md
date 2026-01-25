# Contenuti Aggiuntivi per Episodi

Questa cartella contiene file Markdown e JSON con informazioni aggiuntive per ogni episodio del podcast.

## Struttura dei File

Per ogni episodio, puoi creare due tipi di file:

### 1. File Markdown (Descrizione Dettagliata)

**Nome file:** `{numero-episodio}.md`

**Esempio:** `1.md`, `42.md`, `100.md`

**Struttura:**
```markdown
---
youtubeUrl: https://www.youtube.com/watch?v=EXAMPLE
---

# Descrizione Dettagliata

Qui puoi inserire una descrizione più approfondita dell'episodio utilizzando la sintassi Markdown.

## Argomenti Principali

- Primo argomento
- Secondo argomento

## Risorse Menzionate

- [Link 1](https://example.com)
- [Link 2](https://example.com)
```

**Campi:**
- `youtubeUrl` (opzionale): Link al video YouTube dell'episodio. Se presente, verrà mostrato un pulsante nella sidebar della pagina episodio.
- **Contenuto**: Il corpo del file può contenere qualsiasi contenuto Markdown (titoli, paragrafi, liste, link, ecc.)

### 2. File Trascrizione (TXT o JSON)

#### Formato TXT (Raccomandato)

**Nome file:** `{numero-episodio}-transcript.txt`

**Esempio:** `1-transcript.txt`, `42-transcript.txt`, `100-transcript.txt`

**Struttura (Multi-Speaker):**
```
Speaker Name (00:00)
Testo del primo intervento. Può essere su più righe
e continuare fino alla prossima sezione.

Another Speaker (00:15)
Testo del secondo intervento.

Speaker Name (00:45)
Testo del terzo intervento.
```

**Formato:**
- Ogni segmento inizia con `Nome Speaker (timestamp)` dove timestamp è in formato `MM:SS` o `HH:MM:SS`
- Il testo del segmento segue sulla/e riga/he successiva/e
- I segmenti sono separati da una riga vuota

**Struttura (Monologo/Single-Speaker):**
```
*musica* Benvenuti a questo episodio dove parliamo di...
Oggi voglio condividere con voi alcune riflessioni...
[testo continuo senza marcatori di speaker]
```

**Comportamento:**
- Se il file non contiene pattern `Speaker (timestamp)`, viene automaticamente trattato come un monologo
- Lo speaker viene impostato automaticamente a "Host"
- Il timestamp viene impostato a "00:00"
- Tutto il contenuto del file diventa un unico segmento
- **Nella UI**: I monologhi vengono renderizzati come testo semplice senza mostrare speaker e timestamp

#### Formato JSON (Legacy)

**Nome file:** `{numero-episodio}-transcript.json`

**Esempio:** `1-transcript.json`, `42-transcript.json`, `100-transcript.json`

**Struttura:**
```json
{
  "episodeNumber": 1,
  "segments": [
    {
      "timestamp": "00:00",
      "speaker": "Host",
      "text": "Benvenuti a questo episodio..."
    },
    {
      "timestamp": "00:15",
      "speaker": "Guest",
      "text": "Grazie per avermi invitato..."
    }
  ]
}
```

**Campi:**
- `episodeNumber`: Numero dell'episodio
- `segments`: Array di segmenti della trascrizione
  - `timestamp`: Timestamp nel formato `MM:SS` o `HH:MM:SS`
  - `speaker`: Nome dello speaker (Host, Guest, etc.)
  - `text`: Testo parlato

## Visualizzazione nella Pagina Episodio

Quando questi file sono presenti per un episodio, la pagina episodio verrà automaticamente estesa con:

1. **Pulsante YouTube** (sidebar): Se presente `youtubeUrl` nel file Markdown
2. **Approfondimento** (sezione principale): Mostra il contenuto Markdown formattato
3. **Trascrizione** (sezione principale): Mostra la trascrizione in un formato leggibile con timestamp e speaker

## Note

- I file sono opzionali: puoi aggiungere solo il Markdown, solo la trascrizione, o entrambi
- Il numero dell'episodio deve corrispondere al campo `number` nell'RSS feed
- I file vengono letti al momento del build, quindi dopo aver aggiunto/modificato file è necessario ricostruire il sito
