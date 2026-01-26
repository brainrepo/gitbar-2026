---
description: Genera note per episodi podcast da trascrizioni (usa numero episodio o 'all')
---

Devi generare note per episodi podcast a partire dalle trascrizioni.

## Argomento ricevuto

L'utente ha specificato: {{args}}

## Processo da seguire

1. **Determina quali episodi processare**:
   - Se l'argomento è un numero (es: "217"), processa solo quell'episodio
   - Se l'argomento è "all", usa Glob per trovare tutti i file `content/episodes/*-transcript.txt`, poi per ognuno controlla se il corrispondente `.md` è vuoto (ignorando frontmatter) e processalo

2. **Per ogni episodio da processare**:
   - Leggi `content/episodes/<numero>-transcript.txt`
   - Leggi `content/episodes/<numero>.md` se esiste
   - Se il file `.md` contiene testo dopo il frontmatter (oltre a spazi bianchi), SALTA questo episodio e comunicalo
   - Altrimenti procedi con la generazione

3. **Analizza la trascrizione e genera le note** usando questo approccio:

   **Descrizione**: Scrivi 2-4 frasi in tono scherzoso e coinvolgente che riassumano i contenuti principali. Tono leggero e ironico. Scrivi in prima persona.

   **Takeaway**: Identifica 2-5 insegnamenti o concetti chiave. Presenta come punti elenco. Solo se realmente significativi, altrimenti ometti la sezione.

   **Bold Opinion**: Identifica 1-4 opinioni forti/controverse. Presenta come punti elenco, mantenendo il tono diretto. Solo opinioni veramente bold, altrimenti ometti la sezione.

   **Regole importanti**:
   - Tutto in italiano
   - Non creare sezioni senza contenuto rilevante
   - Stile colloquiale e accessibile
   - Ogni sezione con titolo `##`
   - NON usare parolacce
   - Scrivi usando il plurale "noi"
   - nella descrizione non fare una sequesza cronologica ma piu un piccolo testo che identifica i topic principali come se fosse un post linkedin ma non mettere nessuna call to action

4. **Aggiorna il file markdown**:
   - Se non esiste, crealo con frontmatter vuoto (`---\n---\n`) + note
   - Se esiste, preserva il frontmatter e aggiungi le note dopo
   - Usa lo strumento Edit per aggiungere le note

5. **Report finale**:
   - Comunica quanti episodi processati
   - Elenca i numeri degli episodi aggiornati
   - Menziona eventuali episodi saltati

## Note tecniche
- Directory: `content/episodes/`
- Frontmatter YAML delimitato da `---`
- File vuoto = solo spazi dopo frontmatter
