-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 28 Gru 2022, 14:32
-- Wersja serwera: 10.4.24-MariaDB
-- Wersja PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `helpdesk`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `data` datetime NOT NULL,
  `tresc` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `logs`
--

INSERT INTO `logs` (`id`, `data`, `tresc`) VALUES
(1, '2022-12-28 14:18:19', 'Connected!'),
(2, '2022-12-28 14:18:19', 'b93ZNuppH8xgNLDdAAAB'),
(3, '2022-12-28 14:18:20', 'ffjmZVUhXSyUs1uAAAAD'),
(4, '2022-12-28 14:18:43', 'ticket inserted');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `imie` text NOT NULL,
  `dzial` int(11) NOT NULL,
  `tresc` text NOT NULL,
  `nrtel` int(11) NOT NULL,
  `data` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `tickets`
--

INSERT INTO `tickets` (`id`, `imie`, `dzial`, `tresc`, `nrtel`, `data`) VALUES
(1, 'sdf', 1, 'jkl', 0, '0000-00-00 00:00:00'),
(2, 'sdf', 1, 'tyitityu', 0, '0000-00-00 00:00:00'),
(3, 'bar', 1, 'tgfhgf', 0, '0000-00-00 00:00:00'),
(4, 'sdf', 1, 'bhj', 0, '0000-00-00 00:00:00'),
(5, 'sdf', 1, 'yuiy', 111111111, '0000-00-00 00:00:00'),
(6, 'bar', 1, 'ghg', 111111111, '2022-12-28 13:46:37'),
(7, 'rty', 1, 'hj', 0, '2022-12-28 13:57:14'),
(8, '54', 1, 'gfhh', 0, '2022-12-28 13:58:08'),
(9, 'rty', 1, 'gfhfgh', 0, '2022-12-28 14:18:43');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT dla tabeli `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
