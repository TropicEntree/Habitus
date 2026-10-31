# Habitus su App Store e Play Store — prossimi passi

Lo scaffolding Capacitor è pronto: `android/` e `ios/` contengono progetti nativi
funzionanti che caricano la web app (`dist/`) in un guscio nativo. Questo file
elenca cosa manca, in ordine, per arrivare alla pubblicazione reale.

## Stato attuale

- `capacitor.config.ts`: `appId` placeholder `com.habitus.app`, `appName` "Habitus".
- `android/` e `ios/`: progetti generati con `npx cap add`, icone e splash screen
  già generati da `resources/icon.png` (1024×1024) tramite `@capacitor/assets`.
- `resources/`: sorgenti icona/splash — se cambi il logo, sostituisci
  `resources/icon.png` (e `icon-foreground.png`) e rilancia:
  ```bash
  npx capacitor-assets generate
  npx cap sync
  ```
- Ogni volta che modifichi il codice React, prima di testare su device/emulatore:
  ```bash
  npm run build
  npx cap sync
  ```

## 1. Bundle ID definitivo

`com.habitus.app` è un placeholder di sviluppo. **È permanente una volta pubblicato**
(non si può cambiare dopo la prima release su uno store). Prima della submission reale:
1. Decidi il bundle id finale (idealmente basato su un dominio che possiedi, es. `com.tuodominio.habitus`).
2. Aggiornalo in `capacitor.config.ts` (`appId`).
3. Rilancia `npx cap sync` — per Android modifica anche `android/app/build.gradle` (`applicationId`);
   per iOS aggiorna il Bundle Identifier in Xcode (target App → Signing & Capabilities).

## 2. Account sviluppatore

- **Apple Developer Program**: 99$/anno — [developer.apple.com/programs](https://developer.apple.com/programs/)
- **Google Play Console**: 25$ una tantum — [play.google.com/console](https://play.google.com/console)

## 3. Build Android (fattibile su questo PC Windows)

1. Installa [Android Studio](https://developer.android.com/studio) (include l'SDK necessario).
2. Apri la cartella `android/` con Android Studio.
3. Lascia sincronizzare Gradle al primo avvio.
4. Testa su emulatore o dispositivo reale (Run ▶).
5. Per pubblicare: `Build > Generate Signed Bundle/APK`, scegli **Android App Bundle (.aab)**,
   crea un keystore (conservalo con cura: senza di esso non potrai più aggiornare l'app),
   poi carica l'.aab su Google Play Console.

## 4. Build iOS (richiede un Mac)

Questo PC è Windows: **Xcode non esiste per Windows**, quindi la build iOS reale non è
possibile in locale. Opzioni:
- Un Mac (anche in prestito/cloud) con Xcode installato: apri `ios/App/App.xcworkspace`,
  configura firma/Team in Signing & Capabilities, poi Product > Archive per pubblicare
  su App Store Connect.
- Un servizio di build cloud che non richiede un Mac fisico, es.
  [Codemagic](https://codemagic.io) o [Ionic Appflow](https://ionic.io/appflow) — entrambi
  supportano Capacitor nativamente e possono compilare/firmare/pubblicare da CI.

## 5. Requisiti obbligatori degli store (spesso dimenticati)

- **Privacy Policy**: Apple e Google la richiedono entrambi, soprattutto per un'app che
  tratta dati di salute/benessere (categoria dichiarata nel manifest: "health"). Serve un
  URL pubblico raggiungibile. Se non ne hai una, fammelo sapere: posso preparartene una bozza.
  - Apple: **Health & Fitness Consent** — se lo screening per ADHD/dati emotivi viene
    considerato "salute", Apple può chiedere consenso esplicito aggiuntivo e restrizioni sulla
    condivisione dati con terzi.
- **Account Deletion**: già presente in-app (`AccountDeletion.jsx`) — entrambi gli store
  lo richiedono per app con account utente. ✅ già a posto.
- **Screenshot store**: servono per varie dimensioni schermo (iPhone, iPad se supportato,
  telefoni/tablet Android). Vanno presi da un device o simulatore reale — non automatizzabile
  da qui senza ambiente grafico dedicato.
- **Icona 1024×1024 senza trasparenza per App Store**: già generata (`resources/icon.png`),
  verificane la qualità visiva prima della submission — è stata scalata da un'immagine
  generata via AI a 1024×1024, considera di farla rivedere/rifinire da un designer.
- **Descrizione, parole chiave, categoria**: da scrivere per ciascuno store (posso aiutarti
  a redigerle in it/en/ko quando sei pronto).

## 6. Promemoria affidabili anche ad app chiusa (miglioramento consigliato, non ancora fatto)

Attualmente i promemoria (`src/lib/notifications.js`) funzionano solo mentre l'app è aperta
in foreground (un `setInterval` in `AppLayout.jsx`). Con l'app impacchettata via Capacitor,
si può passare a notifiche locali pianificate reali che arrivano anche ad app chiusa, tramite
il plugin ufficiale `@capacitor/local-notifications`. Non l'ho installato in questa passata
per restare nello scope concordato — fammi sapere se vuoi che lo aggiunga.
