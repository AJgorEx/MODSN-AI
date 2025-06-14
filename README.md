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

## Server info

From the admin page you can open **Server Info** to view details about the selected guild. The page shows member count, owner ID, creation date and server icon.

## Economy commands

Bot includes an in-chat economy. Use `/daily` and `/work` to earn coins, `/deposit` and `/withdraw` to manage your bank balance and `/gamble` to risk your coins for a chance to double them.
Administrators can now adjust economy rewards from the new **Economy Settings** page in the web panel.

## Advanced commands

Bot oferuje także szereg bardziej rozbudowanych komend:

- `/weather <miasto>` - aktualna pogoda.
- `/translate <tekst> <lang>` - tłumaczenie na wybrany język.
- `/remind <minuty> <tekst>` - przypomnienie po czasie.
- `/quote` - losowy cytat.
- `/stock <symbol>` - cena akcji.
- `/meme` - losowy mem z internetu.
- `/crypto <id>` - kurs kryptowaluty.
- `/define <słowo>` - definicja słowa po angielsku.
- `/dog` - zdjęcie psa.
- `/time` - aktualny czas UTC.

Bot zlicza także ile razy każda komenda została użyta. Liczbę użyć znajdziesz w poleceniu `/help` obok opisu komendy.

## Testy

W projekcie nie ma zdefiniowanych testów, ale polecenie `npm test` jest wymagane przed wysłaniem zmian.
