# Bike Lab — Backoffice

Frontend web backoffice per il sistema di noleggio biciclette **Bike Lab**. Applicazione single-page (SPA) che consente agli utenti di registrarsi, autenticarsi, visualizzare biciclette disponibili, creare prenotazioni e gestire il proprio profilo.

---

## Tipologia di progetto

| Caratteristica | Valore |
|---|---|
| **Tipo** | Frontend web backoffice (Single-Page Application) |
| **Piattaforma** | Browser (desktop e mobile) |
| **Architettura** | Client-side rendering, comunicazione REST con backend remoto |
| **Backend** | API esterna su `project-work-2-ethc.onrender.com` |
| **Stato** | In sviluppo |

---

## Tecnologie utilizzate

| Categoria | Tecnologia | Versione |
|---|---|---|
| **Framework** | Angular (Angular CLI) | 19.2 |
| **Linguaggio** | TypeScript | ~5.7 |
| **Styling** | Bootstrap | 5.3.8 |
| **Icone** | Bootstrap Icons (CDN) | — |
| **State management** | RxJS (BehaviorSubject, ReplaySubject) | ~7.8 |
| **HTTP client** | Angular HttpClient con functional interceptors | — |
| **Form** | Angular Reactive Forms (FormBuilder, Validators) | — |
| **Routing** | Angular Router | — |
| **Testing** | Jasmine + Karma (Chrome launcher) | — |
| **Build** | @angular-devkit/build-angular (application builder) | — |
| **Package manager** | npm | — |
| **Runtime** | Node.js | 20 |
| **Editor** | VS Code con estensione angular.ng-template | — |

---

## Architettura del codice

### Organizzazione moduli

L'applicazione utilizza l'architettura **NgModule-based** (non standalone), con un unico `AppModule` che dichiara tutti i componenti. I componenti sono suddivisi in tre categorie:

- `components/` — Componenti condivisi e riutilizzabili (navbar, toast, profilo)
- `page/` — Componenti associati a route (home, login, register, reservation, ecc.)
- `service/` — Servizi injectable per API e stato applicativo
- `utils/` — Guardie, interceptors, direttive strutturali

### Gestione dello stato (State management)

Lo stato applicativo è gestito tramite **RxJS** senza librerie esterne (NgRx, Signals):

- `AuthService` utilizza `ReplaySubject<User | null>(1)` per mantenere l'utente corrente, esponendo `currentUser$` e `isAuthenticated$`
- `ToastService` utilizza `BehaviorSubject<Toast[]>` per le notifiche toast
- I componenti reservation e my-reservations usano `BehaviorSubject<void>` per triggerare il refresh dei dati via `switchMap`

### Routing

Le route sono definite in `app-routing.module.ts`:

| Path | Componente | Protezione |
|---|---|---|
| `/`, `/home` | HomeComponent | — |
| `/login` | LoginComponent | — |
| `/register` | RegisterComponent | — |
| `/verification-sent` | VerificationSentComponent | — |
| `/verify-email` | VerifyEmailComponent | — |
| `/verification-success` | VerificationSuccessComponent | — |
| `/reservation` | ReservationComponent | `authGuard` |
| `/reservation-success` | ReservationSuccessComponent | `authGuard` |
| `/dashboard` | DashboardComponent | — |
| `/my-reservations` | MyReservationsComponent | `authGuard` |
| `/profilo` | ProfileComponent | `authGuard` |
| `**` | redirect a `/` | — |

La guardia `authGuard` verifica `isAuthenticated$` e reindirizza a `/login?requestedUrl=...` se l'utente non è autenticato.

### API Layer

Le richieste HTTP sono gestite da servizi Angular con `HttpClient`. Tre **interceptors** funzionali operano sulle richieste/risposte:

1. **`authInterceptor`** — Aggiunge l'header `Authorization: Bearer <token>` a ogni richiesta
2. **`logoutInterceptor`** — Intercetta risposte `401` e chiama `AuthService.logout()`
3. **`errorInterceptor`** — Mostra un toast di errore per errori HTTP non-401

### Direttive strutturali

- `*ifAuthenticated` — Mostra il contenuto solo se l'utente è autenticato
- `*appIfRole` — Mostra il contenuto solo se l'utente ha un ruolo specifico

---

## Struttura del progetto

```
project-work-2-backoffice/
├── public/
│   ├── _redirects              # SPA fallback per Netlify
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── app.module.ts                  # Modulo radice
│   │   ├── app-routing.module.ts          # Definizione rotte
│   │   ├── app.component.ts/html/css      # Componente radice
│   │   ├── components/
│   │   │   ├── dashboard/                 # Navbar di navigazione
│   │   │   ├── profile/                   # Pagina profilo utente
│   │   │   └── toast/                     # Sistema di notifiche toast
│   │   ├── page/
│   │   │   ├── home/                      # Landing page
│   │   │   ├── login/                     # Form di login
│   │   │   ├── register/                  # Form di registrazione
│   │   │   ├── reservation/               # Wizard prenotazione multi-step
│   │   │   ├── reservation-success/       # Pagina di conferma prenotazione
│   │   │   ├── my-reservations/           # Elenco prenotazioni utente
│   │   │   ├── verification-sent/         # "Verifica inviata"
│   │   │   ├── verify-email/             # Verifica email con token
│   │   │   └── verification-success/     # "Verifica completata"
│   │   ├── service/
│   │   │   ├── auth.service.ts            # Autenticazione (login, register, logout, refresh)
│   │   │   ├── jwt.service.ts             # Gestione token JWT (localStorage + decode)
│   │   │   ├── user.service.ts            # API utenti (getMe, list)
│   │   │   ├── bikes.service.ts           # API biciclette disponibili
│   │   │   ├── bikes.entity.ts            # Interfaccia Bike
│   │   │   ├── bike-sizes.service.ts      # API taglie biciclette
│   │   │   ├── bike-typologies.service.ts # API tipologie biciclette
│   │   │   ├── bike-accessory.service.ts  # API accessori biciclette
│   │   │   ├── location.service.ts        # API sedi di noleggio
│   │   │   ├── coverage.service.ts        # API coperture assicurative
│   │   │   ├── reservation.service.ts     # API prenotazioni CRUD
│   │   │   ├── reservation.entity.ts      # Interfacce prenotazione
│   │   │   └── toast.service.ts           # Gestione stato notifiche
│   │   └── utils/
│   │       ├── auth.guard.ts              # Guardia rotte autenticate
│   │       ├── auth.interceptor.ts        # Aggiunge token JWT alle richieste
│   │       ├── error.interceptor.ts       # Gestione errori HTTP (non-401)
│   │       ├── logout.interceptor.ts      # Logout su errore 401
│   │       ├── if-authenticated.directive.ts   # Direttiva *ifAuthenticated
│   │       └── if-role.directive.ts       # Direttiva *appIfRole
│   ├── enity/
│   │   ├── user/                          # Interfaccia User
│   │   ├── location/                      # Interfaccia Location
│   │   ├── bikes/                         # Interfaccia Bike
│   │   ├── bike-sizes/                    # Interfaccia BikeSizes
│   │   ├── bike-typologies/               # Interfaccia BikeTypology
│   │   ├── bike-accessories/              # Interfaccia BikeAccessories
│   │   └── insurance-coverages/           # Interfaccia InsuranceCoverages
│   ├── environments/
│   │   ├── environment.ts                 # Ambiente di sviluppo (proxy)
│   │   └── environment.prod.ts            # Ambiente di produzione (URL diretto)
│   ├── index.html                         # Shell HTML
│   ├── main.ts                            # Bootstrap applicazione
│   └── styles.css                         # Stili globali
├── angular.json                           # Configurazione Angular CLI
├── tsconfig.json                          # TypeScript base config
├── tsconfig.app.json                      # TypeScript app config
├── tsconfig.spec.json                     # TypeScript test config
├── package.json                           # Dipendenze e script
├── proxy.conf.json                        # Proxy API per sviluppo
├── .nvmrc                                 # Node.js 20
├── .editorconfig
└── .gitignore
```

---

## Flusso di autenticazione

1. L'utente effettua il login tramite `POST /api/login`, ricevendo un **access token** (JWT) e un **refresh token**
2. I token sono salvati in `localStorage` e impostati come cookie
3. `AuthService` decodifica manualmente il JWT (base64) ed emette l'utente tramite `ReplaySubject`
4. Al ricaricamento della pagina, `tryRestoreUser()`:
   - Verifica la presenza del token
   - Lo decodifica e controlla la scadenza
   - Se scaduto, tenta il refresh tramite `POST /api/refreshToken`
   - Se tutto fallisce, esegue il logout
5. `authGuard` protegge le rotte riservate
6. `authInterceptor` allega automaticamente il token a ogni richiesta HTTP
7. `logoutInterceptor` gestisce le risposte 401 forzando il logout

---

## Funzionalità

1. **Landing page (Home)** — Hero section con CTA, sezioni Servizi, Chi siamo, Informazioni e footer. Animazioni fade-in basate su scroll (`@HostListener`).
2. **Registrazione utente** — Form con nome, cognome, email, password. Validazione con required, email, minlength. Reindirizzamento a `verification-sent` al successo.
3. **Verifica email** — Flusso in tre pagine: (a) "Verifica inviata" con pulsante di reinvio, (b) "Verifica email" che legge `?token=` dalla query e chiama l'API dopo 5 secondi, (c) "Verifica completata" con CTA per il login.
4. **Login utente** — Form con email, password, checkbox "Ricordami", link "Password dimenticata?". Reindirizzamento all'URL richiesto originale o a `/home`.
5. **Autenticazione JWT con refresh token** — Access token + refresh token in localStorage. Refresh automatico alla scadenza. Decodifica manuale base64 con controllo expiry.
6. **Protezione rotte** — Auth guard sulle rotte `/reservation`, `/my-reservations`, `/profilo`. Reindirizzamento a `/login` se non autenticato.
7. **Navbar (Dashboard)** — Navbar fixed-top con brand "Bike Lab", link di navigazione, CTA prenotazione, pulsanti login/register o menu utente con profilo/prenotazioni/logout.
8. **Prenotazione multi-step** — Wizard in 4 passaggi:
   - **Sede**: selezione location da cards
   - **Data**: calendario personalizzato + slot orari (Mattina/Pomeriggio/Sera) per ritiro e riconsegna
   - **Bici**: filtro per tipologia/taglia, selezione biciclette disponibili
   - **Extra**: accessori e copertura assicurativa
   - Calcolo prezzo in tempo reale basato su periodi da mezza giornata (halfDateRate)
   - Al completamento, reindirizzamento alla pagina di conferma `/reservation-success`
9. **Pagina di conferma prenotazione** — Pagina di ringraziamento con animazioni, visualizzata dopo l'invio del form di prenotazione. Pulsanti per visualizzare le prenotazioni o tornare alla home.
10. **Le mie prenotazioni** — Elenco prenotazioni raggruppate per stato: in_rental (attive), pending (correnti), completed, cancelled. Pulsante di cancellazione per prenotazioni pending.
11. **Profilo utente** — Visualizzazione dati utente. Form per modifica email o password (salvataggio simulato con `setTimeout`).
12. **Notifiche toast** — Sistema globale tramite `ToastService`. Supporta tipi success, error, warning, info. Auto-dismiss configurabile (4.5s default, 6s per errori).
13. **Direttive strutturali** — `*ifAuthenticated` per contenuti condizionali basati su autenticazione, `*appIfRole` per contenuti condizionali basati su ruolo.
14. **Gestione errori** — Interceptor HTTP per errori non-401 con toast contenente il messaggio di errore. Errori 401 triggerano logout automatico.

---

## Riferimento API

L'applicazione consuma i seguenti endpoint REST del backend remoto:

| Metodo | Endpoint | Descrizione |
|---|---|---|
| POST | `/api/login` | Autenticazione utente |
| POST | `/api/register` | Registrazione utente |
| POST | `/api/verify` | Verifica email con token |
| POST | `/api/refreshToken` | Refresh del token JWT |
| GET | `/api/users/me` | Dati utente corrente |
| GET | `/api/users` | Elenco utenti |
| GET | `/api/bikes` | Biciclette disponibili (con filtri) |
| GET | `/api/reservations` | Elenco prenotazioni |
| POST | `/api/reservations` | Creazione prenotazione |
| GET | `/api/reservations/:id` | Dettaglio prenotazione |
| PUT | `/api/reservations/:id` | Aggiornamento prenotazione |
| DELETE | `/api/reservations/:id` | Eliminazione prenotazione |
| PUT | `/api/reservations/:id/status` | Cambio stato prenotazione |
| GET | `/api/locations` | Sedi di noleggio |
| GET | `/api/bike-sizes` | Taglie biciclette |
| GET | `/api/bike-typologies` | Tipologie biciclette |
| GET | `/api/bike-accessories` | Accessori biciclette |
| GET | `/api/insurance-coverages` | Coperture assicurative |

---

## Configurazione

### Proxy di sviluppo

In ambiente di sviluppo, le richieste `/api/*` sono proxate tramite `proxy.conf.json` verso `https://project-work-2-ethc.onrender.com`.

### Ambienti

| Ambiente | File | apiUrl |
|---|---|---|
| Sviluppo | `environment.ts` | `''` (usa proxy) |
| Produzione | `environment.prod.ts` | `https://project-work-2-ethc.onrender.com` |

### SPA redirect

Il file `public/_redirects` garantisce che tutte le route servano `index.html` su hosting statici come Netlify.

---

## Prerequisiti e avvio

### Prerequisiti

- Node.js 20 (vedi `.nvmrc`)
- npm

### Installazione

```bash
npm install
```

### Sviluppo

```bash
ng serve
# oppure: npm start
```

L'applicazione è disponibile su `http://localhost:4200/`.

### Produzione

```bash
ng build
# oppure: npm run build
# oppure: npm run build:prod (configurazione produzione)
```

L'output di build si trova in `dist/frontend/`.

### Test

```bash
ng test
# oppure: npm test
```

Esegue i test con Karma + Jasmine su Chrome.

---

## Sviluppo con VS Code

Il progetto include configurazioni VS Code predefinite:

- **tasks.json** — Task per `ng serve` e `ng test`
- **launch.json** — Configurazioni di debug per Chrome in dev e test mode
- **extensions.json** — Raccomanda l'estensione `angular.ng-template`
