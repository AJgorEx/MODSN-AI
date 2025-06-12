# MODSN.AI

Panel do zarządzania serwerami Discord.

## Instalacja

1. Zainstaluj zależności:
   ```bash
   npm install
   ```
2. Skopiuj plik `.env.example` do `.env` i uzupełnij wartości:
   ```bash
   cp .env.example .env
   ```
   W pliku znajdują się zmienne środowiskowe:
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
Jeżeli bot nie jest jeszcze na Twoim serwerze, skorzystaj z adresu `http://localhost:3000/invite` aby go dodać.

## Embed messages

W panelu administracyjnym znajdziesz sekcję **Rich Embed**, która pozwala zbudować zaawansowaną wiadomość z tytułem, opisem, kolorem oraz emoji. Teraz dostępny jest picker emoji, przyciski do formatowania tekstu z podglądem oraz podgląd gotowego embed przed wysłaniem. Gotowy embed możesz wysłać na wybrany kanał serwera.

## Roles overview

Now the panel includes a **Roles** page where you can view server roles. Access it from the admin page once a guild is selected.

## Testy

W projekcie nie ma zdefiniowanych testów, ale polecenie `npm test` jest wymagane przed wysłaniem zmian.
