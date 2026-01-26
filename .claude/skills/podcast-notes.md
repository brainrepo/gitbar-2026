# Podcast Notes Generator

Genera note per episodi podcast a partire dalle trascrizioni.

## Parametri

L'utente può specificare:
- Un numero specifico di episodio (es: "218")
- "all" per processare tutti gli episodi con note vuote

## Processo

1. **Determina quali episodi processare**:
   - Se l'utente specifica un numero, processa solo quell'episodio
   - Se l'utente specifica "all", cerca tutti i file `*-transcript.txt` nella directory `content/episodes/` e processa solo quelli il cui corrispondente file `.md` è vuoto o mancante (ignorando il frontmatter YAML)

2. **Per ogni episodio da processare**:
   - Leggi il file `content/episodes/<numero>-transcript.txt`
   - Controlla se esiste `content/episodes/<numero>.md`
   - Se il file `.md` non esiste o contiene solo frontmatter YAML (contenuto tra `---`), procedi con la generazione
   - Se il file contiene già note (testo dopo il frontmatter), SALTA questo episodio

3. **Genera le note usando questo prompt**:

```
Analizza la seguente trascrizione di un episodio podcast e genera delle note dell'episodio strutturate in questo modo:

## Descrizione
Scrivi una breve descrizione (2-4 frasi) in tono scherzoso e coinvolgente che riassuma i contenuti principali dell'episodio. Il tono deve essere leggero, ironico quando appropriato, e catturare l'essenza della conversazione.

## Takeaway
Identifica ed elenca i principali insegnamenti o concetti chiave emersi durante l'episodio. Presenta ogni takeaway come punto elenco. Includi solo i takeaway realmente significativi e rilevanti (minimo 2, massimo 5). Se non ci sono takeaway sufficientemente rilevanti, ometti questa sezione.

## Bold Opinion
Identifica le opinioni più forti, controverse o interessanti espresse durante l'episodio. Presenta ogni opinione come punto elenco, mantenendo il tono diretto e l'essenza provocatoria dell'affermazione originale. Includi solo opinioni veramente bold (minimo 1, massimo 4). Se non ci sono opinioni sufficientemente forti o controverse, ometti questa sezione.

IMPORTANTE:
- Tutto il testo deve essere in italiano
- Non creare una sezione se non c'è contenuto abbastanza rilevante per riempirla
- Mantieni uno stile colloquiale e accessibile
- Ogni sezione deve avere un titolo di secondo livello (##)
- NON usare parolacce nelle note generate
- Le note devono essere scritte in prima persona (come se l'host stesse raccontando)
- non essere troppo autoreferenziale
```

4. **Aggiorna il file markdown**:
   - Se il file non esiste, crealo con il frontmatter vuoto (`---\n---\n`) seguito dalle note
   - Se il file esiste ma è vuoto (solo frontmatter), aggiungi le note dopo il frontmatter
   - Preserva sempre il frontmatter esistente

5. **Report finale**:
   - Comunica all'utente quanti episodi sono stati processati
   - Elenca i numeri degli episodi aggiornati
   - Se alcuni episodi sono stati saltati perché avevano già note, menzionalo

## Note tecniche

- Directory delle trascrizioni: `content/episodes/`
- Pattern file trascrizione: `<numero>-transcript.txt`
- Pattern file note: `<numero>.md`
- Il frontmatter YAML è delimitato da `---` all'inizio e alla fine
- Un file è considerato "vuoto" se contiene solo spazi bianchi dopo il frontmatter