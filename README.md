# Riverside Hotel

Riverside to nowoczesna aplikacja internetowa dla hotelu, stworzona przy użyciu **Node.js**, **React** i **TailwindCSS**, z backendem w **Express.js** i bazą danych **MySQL**. Strona umożliwia profesjonalne zarządzanie całym hotelem!

## Wymagania
  - nodejs
  - xampp z bazą mysql
  - react ver.18
  - pobrane zależności z package.json

## Funkcjonalności

- **Przeglądanie ofert hotelowych**
  - Lista pokoi i usług SPA wraz z cenami i godzinami dostępności
  - Przeglądanie zdjęć i ofert hotelu w czasie rzeczywistym
  - Filtrowanie i sortowanie po nazwie oraz cenie
  - Możliwość doładowywania konta w wirualne PLN by móc korzystać z całej zawartości strony
- **Rezerwacje**
  - Wybór daty i dostępnych godzin
  - Blokowanie przeszłych dat oraz zajętych godzin
  - Przekierowanie do strony rezerwacji z wybranym pokojem/usługą
  - Płatności oraz możliwość przeglądania w profilu, oraz możliwość ich odwołania
- **Opinie i oceny**
  - Możliwość polubiania ofert noclegów
  - Klienci mogą dodawać swoje opinie dla konkretnych usług
  - Wyświetlanie wszystkich opinii w szczegółach oferty
- **Autoryzacja użytkowników**
  - Logowanie i rejestracja klientów
  - Możliwość zmiany hasła
  - Blokowanie nieautoryzowanego dostępu do wszystkich podstron
- **Responsywny interfejs**
  - Działa na wszystkich urządzeniach dzięki TailwindCSS
- **Animacje**
  - Modalne okna oraz przejścia za pomocą Framer Motion
 - **Błędy i Walidacja**
  - Wszystkie błędy są wyświatlane customowo
  - Aplikacja informuje o błędnych wprowadzanych danych   
---

## Możliwości

- Rezerwacja pokoi i SPA w czasie rzeczywistym

- Automatyczne blokowanie przeszłych dat i zajętych godzin

- Przeglądanie opinii i dodawanie własnych

- Wyszukiwanie i filtrowanie ofert według kategorii i ceny

- Responsywny i nowoczesny design dzięki TailwindCSS

- Animacje i modalne okna z Framer Motion

## Struktura folderów

```
riverside-hotel/
  ├─ server/               # Serwer Node.js / Express
  │  └─ server.js          # Punkt wejścia backendu
  ├─ public/               # Miejsce wszystkich zdjęć i logotypów strony
  ├─ front/                # Aplikacja React
  │  ├─ src/
  │  │  ├─ components/     # Komponenty UI
  │  │  ├─ pages/          # Strony aplikacji (SPA, pokoje, rezerwacje)
  │  │  ├─ contexts/       # Context API (np. UserContext)
  │  │  ├─ App.jsx         # Główny komponent aplikacji
  │  │  └─ index.jsx       # Punkt wejścia frontendu
  │  ├─ index.html         # Rdzeń strony
  │  └─ tailwind.config.js # Konfiguracja TailwindCSS
  ├─ package.json          # Dependencies i skrypty
  ├─ README.md
  └─ riverside.sql         # Plik bazy danych do zaimportowania do MySQL
```


## Baza danych MySQL

Strona korzysta z **MySQL** do przechowywania danych m.in o:

- **Users** – dane użytkowników (email, hasło, rola)
- **Rooms** – pokoje hotelowe z opisem, ceną i zdjęciem
- **SPA_Offers** – oferty SPA z godzinami i ceną
- **Reservations** – rezerwacje pokoi i SPA z datą i godziną
- **Reviews** – opinie klientów powiązane z usługami

- **WAŻNE** - Aby uruchomić stronę trzeba zaimportować bazę danych MySql do phpmyadmina i uruchomić xamppa!



##🔥 Riverside — instalacja projektu (frontend + backend + mysql)"

# --- 1. Klonowanie repo ---
```
git clone https://github.com/IgorPedz/Riverside.git
cd Riverside
```
# --- 2. Instalacja FRONTENDU ---
```
cd front || exit
npm install
npm run dev 

```
W drugim cmd
# --- 3. Uruchamianie BACKENDU ---
```
cd server
node server.js
```
# --- 4. Informacje końcowe ---
```
Frontend działa na: http://localhost:5173
Backend działa na: http://localhost:3000

```
