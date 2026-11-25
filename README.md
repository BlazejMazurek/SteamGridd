# SteamGridd

SteamGridd to strona podobna do Letterboxd, tylko o grach ze Steama. Można na niej przeglądać gry, wystawiać im oceny, pisać recenzje i zaznaczać, w co się grało.

Projekt szkolny. Backend napisał Błażej Mazurek, frontend Yahor Azizau.

## Co potrafi strona

- rejestracja i logowanie, niektóre podstrony są dostępne tylko po zalogowaniu
- lista gier z wyszukiwarką oraz filtrami po gatunku i wydawcy
- strona gry z opisem, gatunkami, średnią ocen i podobnymi grami
- komentarze z oceną co pół gwiazdki, opcjonalnym zdjęciem i polem "Zawiera spoilery". Treść takiego komentarza jest rozmyta, dopóki ktoś nie kliknie "Uwaga spoiler, kliknij, aby odkryć"
- pytanie o wiek przed wejściem na grę oznaczoną jako 18+
- własna biblioteka: ograne, polubione, platyna, do ogrania oraz ulubiona gra (najwyżej cztery)
- profil, lista użytkowników i ustawienia konta (nazwa, ulubiony gatunek, awatar)
- losowanie gry i polecane gry na podstawie ulubionego gatunku
- jasny i ciemny motyw, wersja na telefon

## Z czego jest zrobiona

Frontend to React z Vite, react-router-dom i zwykły CSS. Backend działa na Node.js z Express 5 i Prismą, logowanie opiera się na JWT i bcrypt, a zdjęcia obsługują multer i sharp. Dane trzyma PostgreSQL.

## Jak uruchomić

Potrzebne są Node.js, PostgreSQL i Git.

### Baza danych

Utwórz pustą bazę, na przykład `steamgridd`, i wczytaj do niej plik `.sql` z danymi gier, który przygotował zespół:

```
psql -U postgres -d steamgridd -f dump.sql
```

### Backend

```
cd SteamGridd-backend
npm install
```

Skopiuj plik `.env.example` jako `.env` i wpisz własne dane:

```
PORT=5000
DATABASE_URL="postgresql://uzytkownik:haslo@localhost:5432/steamgridd"
JWT_SECRET="dlugi-losowy-ciag-znakow"
```

Plik `.env` zawiera hasła, więc nie wolno go wrzucać do repozytorium.

Potem:

```
npx prisma migrate deploy
npx prisma generate
node src/server.js
```

Serwer startuje pod adresem http://localhost:5000.

Na gotowej bazie nie uruchamiaj `npx prisma migrate reset` ani `npm run seed`. Pierwsze polecenie usuwa wszystkie dane, a drugie pobiera gry ze Steama od zera.

### Frontend

```
cd frontend
npm install
npm run dev
```

Strona otworzy się pod adresem http://localhost:5173. Adres backendu jest zapisany w `src/api.js`.

## Jak jest poukładany frontend

W `frontend/src` są trzy główne foldery. W `components` leżą mniejsze elementy, jak nagłówek, karta gry, gwiazdki i panel z przyciskami statusu gry. W `context` jest logowanie (razem z funkcją `authFetch`, która dokleja token do zapytań), motyw i powiadomienia. W `pages` są wszystkie podstrony. Routing jest w `App.jsx`.

## Przykładowe zapytania do API

```
GET   /api/games                      lista gier
GET   /api/games/steam/:appId         jedna gra
GET   /api/games/:appId/reviews       komentarze do gry
POST  /api/reviews                    nowy komentarz (rating, comment, appId, isSpoiler, image)
POST  /api/auth/register              rejestracja
POST  /api/auth/login                 logowanie
GET   /api/user/me                    własny profil
PUT   /api/user/me/games/:appId       status gry w bibliotece
PUT   /api/user/me/favorites/:appId   ulubiona gra
```

Okładki i opisy gier pochodzą ze Steama i należą do ich właścicieli.
