-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Lis 28, 2025 at 12:34 AM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `riverside`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `amenities`
--

CREATE TABLE `amenities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `amenities`
--

INSERT INTO `amenities` (`id`, `name`, `description`, `image`) VALUES
(1, 'Basen kryty', 'Przestronny basen podgrzewany przez cały rok, z wydzieloną strefą dla dzieci i dorosłych.', '../basen-pic-1.jpg'),
(2, 'SPA', 'Relaksujące SPA z masażami, sauną fińską i jacuzzi, idealne na odprężenie.', '../SPA-pic-2.jpg'),
(3, 'Restauracja', 'Restauracja serwująca lokalne i międzynarodowe dania ze świeżych składników.', '../Restaurant-pic-2.jpg'),
(4, 'Parking', 'Bezpieczny i monitorowany parking dostępny 24/7 dla naszych gości.', '../Parking-pic-1.jpg'),
(5, 'Siłownia', 'Nowoczesna siłownia z pełnym wyposażeniem cardio, siłowym i funkcjonalnym.', '../Gym-pic-1.jpg');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `favourites`
--

CREATE TABLE `favourites` (
  `id` int(11) NOT NULL,
  `fav_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favourites`
--

INSERT INTO `favourites` (`id`, `fav_id`, `user_id`) VALUES
(2, 6, 4),
(8, 3, 6);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `gallery`
--

CREATE TABLE `gallery` (
  `id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`id`, `image`) VALUES
(1, '../hotel-pic-3.jpg'),
(2, '../hotel-pic-4.jpg'),
(3, '../hotel-pic-5.jpg'),
(4, '../hotel-pic-6.jpg');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `meals`
--

CREATE TABLE `meals` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `hours` varchar(50) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meals`
--

INSERT INTO `meals` (`id`, `name`, `hours`, `img`) VALUES
(1, 'Śniadania', 'Podawane: 7:00 – 11:00', '../food-breakfast.jpg'),
(2, 'Obiady', 'Podawane: 12:00 – 16:00', '../food-dinner.jpg'),
(3, 'Kolacje', 'Podawane: 17:00 – 22:00', '../food-lunch.jpg');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `meal_items`
--

CREATE TABLE `meal_items` (
  `id` int(11) NOT NULL,
  `meal_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meal_items`
--

INSERT INTO `meal_items` (`id`, `meal_id`, `name`, `price`) VALUES
(1, 1, 'Omlet francuski', '22 zł'),
(2, 1, 'Jajecznica na maśle', '18 zł'),
(3, 1, 'Pancakes z syropem klonowym', '25 zł'),
(4, 1, 'Tosty z awokado', '24 zł'),
(5, 2, 'Stek wołowy', '65 zł'),
(6, 2, 'Łosoś z pieca', '59 zł'),
(7, 2, 'Kurczak sous-vide', '48 zł'),
(8, 2, 'Burger premium', '42 zł'),
(9, 3, 'Risotto grzybowe', '52 zł'),
(10, 3, 'Sałatka z burratą', '38 zł'),
(11, 3, 'Makaron carbonara', '41 zł'),
(12, 3, 'Zupa dnia', '19 zł');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `total_price` int(11) DEFAULT NULL,
  `reservationCode` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `room_id`, `user_id`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`, `total_price`, `reservationCode`) VALUES
(54, 6, 6, '2025-11-27', '2025-11-30', 'pending', '2025-11-27 23:17:31', '2025-11-27 23:17:31', 1050, 215576779112);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `reservations_spa`
--

CREATE TABLE `reservations_spa` (
  `id` int(11) NOT NULL,
  `offer_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `hour` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `code` int(11) NOT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` varchar(50) NOT NULL,
  `img` varchar(255) NOT NULL,
  `short_desc` text DEFAULT NULL,
  `long_desc` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `name`, `price`, `img`, `short_desc`, `long_desc`) VALUES
(1, 'Pokój Standard', '200', '../public/room-pic-1.jpg', 'Przytulny pokój standardowy', 'Pokój standardowy z łóżkiem podwójnym, biurkiem i łazienką.'),
(2, 'Pokój Deluxe', '350', '../public/room-pic-2.jpg', 'Komfortowy pokój deluxe', 'Pokój deluxe z widokiem na morze, dużym łóżkiem i przestronną łazienką.'),
(3, 'Pokój Rodzinny', '400', '../public/room-pic-3.jpg', 'Pokój dla całej rodziny', 'Przestronny pokój rodzinny z dwoma łóżkami i sofą dla dzieci.'),
(4, 'Apartament Junior', '500', '../public/room-pic-4.jpg', 'Elegancki apartament', 'Apartament Junior z salonem, dużym łóżkiem i balkonem.'),
(5, 'Apartament VIP', '700', '../public/room-pic-5.jpg', 'Luksusowy apartament VIP', 'Apartament VIP z widokiem na panoramę miasta, dużym salonem i jacuzzi.'),
(6, 'Pokój Deluxe', '450', '../public/room-pic-6.jpg', 'Komfortowy pokój deluxe z widokiem na rzekę i balkonem.', 'Pokój Deluxe oferuje przestronne wnętrze, łóżko king-size, klimatyzację, minibar, Wi-Fi, oraz luksusową łazienkę z wanną i prysznicem.');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `room_conditions`
--

CREATE TABLE `room_conditions` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `accessible` tinyint(1) DEFAULT 0,
  `breakfast` tinyint(1) DEFAULT 0,
  `pets` tinyint(1) DEFAULT 0,
  `parking` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_conditions`
--

INSERT INTO `room_conditions` (`id`, `room_id`, `accessible`, `breakfast`, `pets`, `parking`) VALUES
(4, 6, 1, 1, 0, 1),
(5, 1, 1, 1, 0, 1),
(6, 2, 0, 1, 1, 1),
(7, 3, 0, 0, 0, 1),
(8, 4, 1, 1, 1, 0),
(9, 5, 1, 0, 0, 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `room_reviews`
--

CREATE TABLE `room_reviews` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_reviews`
--

INSERT INTO `room_reviews` (`id`, `room_id`, `user_name`, `comment`, `created_at`) VALUES
(1, 6, 'Anna', 'Super pokój, polecam!', '2025-11-25 13:27:40'),
(2, 6, 'Marek', 'Czysto i komfortowo.', '2025-11-25 13:27:40'),
(24, 1, 'Igor', 'e', '2025-11-27 12:50:45'),
(25, 1, 'Igor', 'EWEW', '2025-11-27 13:16:26'),
(26, 1, 'Igor', 'ewwe', '2025-11-27 13:32:04');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `spa_categories`
--

CREATE TABLE `spa_categories` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `hours` varchar(50) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `spa_categories`
--

INSERT INTO `spa_categories` (`id`, `title`, `hours`, `img`) VALUES
(1, 'Masaże relaksacyjne', '10:00 – 22:00', '../SPA-offer-1.jpg'),
(2, 'Strefa saun', '09:00 – 23:00', '../SPA-offer-2.jpg'),
(3, 'Zabiegi na twarz', '11:00 – 20:00', '../SPA-offer-3.jpg');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `spa_favourites`
--

CREATE TABLE `spa_favourites` (
  `id` int(11) NOT NULL,
  `fav_spa_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `spa_offer_items`
--

CREATE TABLE `spa_offer_items` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `spa_offer_items`
--

INSERT INTO `spa_offer_items` (`id`, `category_id`, `name`, `price`) VALUES
(1, 1, 'Masaż klasyczny', '150 zł'),
(2, 1, 'Masaż aromaterapeutyczny', '180 zł'),
(3, 1, 'Masaż gorącymi kamieniami', '220 zł'),
(4, 1, 'Masaż luksusowy 90 min', '320 zł'),
(5, 2, 'Sauna sucha', '250 zl'),
(6, 2, 'Sauna parowa', '250 zl'),
(7, 2, 'Sauna infrared', '150 zl'),
(8, 2, 'Tężnia solankowa', '100 zl'),
(9, 3, 'Oczyszczanie wodorowe', '240 zł'),
(10, 3, 'Zabieg liftingujący', '320 zł'),
(11, 3, 'Terapia nawilżająca', '190 zł'),
(12, 3, 'Pielęgnacja premium', '390 zł');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `spa_reviews`
--

CREATE TABLE `spa_reviews` (
  `id` int(11) NOT NULL,
  `spa_offer_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `user_name` text NOT NULL,
  `comment` text NOT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `spa_reviews`
--

INSERT INTO `spa_reviews` (`id`, `spa_offer_id`, `category_id`, `user_name`, `comment`, `created_at`) VALUES
(1, 1, 1, 'Ania', 'Super było!', '2025-11-27'),
(4, 3, 3, 'Igor', 'rt', '2025-11-27'),
(8, 3, 3, 'Igor', 'w', '2025-11-27'),
(13, 9, 3, 'Igor', 'ew', '2025-11-27'),
(14, 8, 2, 'Igor', 'rtsre', '2025-11-27'),
(15, 11, 3, 'Igor', 'ibyhunj', '2025-11-27');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `imie` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `haslo` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `saldo` float NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `imie`, `email`, `haslo`, `is_admin`, `saldo`) VALUES
(1, 'igor', 'pedziwilk@gmail.com', '$2b$10$Ks0S3v64qJO5wL5yB63Sc.XoyGL6X2B9/JnjWM7gDh2UdwcgLhbOy', 0, 0),
(3, 'igorigor', 'admin1@wp.pl', '$2b$10$/BaWIGccJkUrDJkNEP65febfmgbyRLJG8rwSqAkklWFwgaknUDdyK', 0, 0),
(6, 'Igor', 'igorrpedziwilk@gmail.com', '$2b$10$c0V4LidxQJQ72xXTWhsPluPztW4kfUXcg24kniuIRN4y2iTC2/0Im', 0, 7450);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `amenities`
--
ALTER TABLE `amenities`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `favourites`
--
ALTER TABLE `favourites`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `meals`
--
ALTER TABLE `meals`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `meal_items`
--
ALTER TABLE `meal_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `meal_id` (`meal_id`);

--
-- Indeksy dla tabeli `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `reservations_ibfk_2` (`user_id`);

--
-- Indeksy dla tabeli `reservations_spa`
--
ALTER TABLE `reservations_spa`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `room_conditions`
--
ALTER TABLE `room_conditions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indeksy dla tabeli `room_reviews`
--
ALTER TABLE `room_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indeksy dla tabeli `spa_categories`
--
ALTER TABLE `spa_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `spa_favourites`
--
ALTER TABLE `spa_favourites`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `spa_offer_items`
--
ALTER TABLE `spa_offer_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indeksy dla tabeli `spa_reviews`
--
ALTER TABLE `spa_reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `amenities`
--
ALTER TABLE `amenities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `favourites`
--
ALTER TABLE `favourites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `meals`
--
ALTER TABLE `meals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `meal_items`
--
ALTER TABLE `meal_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `reservations_spa`
--
ALTER TABLE `reservations_spa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `room_conditions`
--
ALTER TABLE `room_conditions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `room_reviews`
--
ALTER TABLE `room_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `spa_categories`
--
ALTER TABLE `spa_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `spa_favourites`
--
ALTER TABLE `spa_favourites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `spa_offer_items`
--
ALTER TABLE `spa_offer_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `spa_reviews`
--
ALTER TABLE `spa_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `meal_items`
--
ALTER TABLE `meal_items`
  ADD CONSTRAINT `meal_items_ibfk_1` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `room_conditions`
--
ALTER TABLE `room_conditions`
  ADD CONSTRAINT `room_conditions_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `room_reviews`
--
ALTER TABLE `room_reviews`
  ADD CONSTRAINT `room_reviews_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `spa_offer_items`
--
ALTER TABLE `spa_offer_items`
  ADD CONSTRAINT `spa_offer_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `spa_categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
