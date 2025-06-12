# MODSN.AI

Panel do zarządzania serwerami Discord.

## Instalacja

1. Zainstaluj zależności:
   ```bash
   npm install
   ```
2. Utwórz plik `.env` i ustaw wymagane zmienne środowiskowe:
   ```env
   DISCORD_TOKEN=<token bota>
   CLIENT_ID=<id aplikacji>
   CLIENT_SECRET=<sekret aplikacji>
   REDIRECT_URI=http://localhost:3000/callback
   SESSION_SECRET=losowy_klucz
   ```

## Uruchomienie

```bash
node index.js
```

Aplikacja wystartuje na porcie `3000`. Otwórz `http://localhost:3000` w przeglądarce i zaloguj się przez Discord.

## Testy

W projekcie nie ma zdefiniowanych testów, ale polecenie `npm test` jest wymagane przed wysłaniem zmian.
