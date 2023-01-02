-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 02 Sty 2023, 10:42
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
-- Struktura tabeli dla tabeli `login`
--

CREATE TABLE `login` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `lvl` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `login`
--

INSERT INTO `login` (`id`, `name`, `email`, `password`, `lvl`) VALUES
(1, 'test', 'test@test.com', 'test', 1),
(2, 'admin', 'admin@test.com', 'test', 2);

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
(4, '2022-12-28 14:18:43', 'ticket inserted'),
(5, '2022-12-29 07:55:12', 'Database connected!'),
(6, '2022-12-29 09:04:58', 'Database connected!'),
(7, '2022-12-29 09:07:19', 'Database connected!'),
(8, '2022-12-29 09:10:35', 'Database connected!'),
(9, '2022-12-29 09:10:59', 'Database connected!'),
(10, '2022-12-29 09:11:52', 'Database connected!'),
(11, '2022-12-29 09:13:34', 'Database connected!'),
(12, '2022-12-29 09:14:04', 'Database connected!'),
(13, '2022-12-29 10:45:44', 'Database connected!'),
(14, '2022-12-29 11:41:30', 'Database connected!'),
(15, '2022-12-29 11:50:23', 'Database connected!'),
(16, '2022-12-29 11:51:19', 'Database connected!'),
(17, '2022-12-29 11:51:50', 'Database connected!'),
(18, '2022-12-29 11:52:16', 'Database connected!'),
(19, '2022-12-29 11:53:34', 'Database connected!'),
(20, '2022-12-29 11:54:10', 'Database connected!'),
(21, '2022-12-29 11:54:46', 'Database connected!'),
(22, '2022-12-29 12:03:28', 'Database connected!'),
(23, '2022-12-29 12:04:57', 'Database connected!'),
(24, '2022-12-29 12:05:04', 'admin has logged in.'),
(25, '2022-12-29 12:05:13', 'test has logged in.'),
(26, '2022-12-29 12:05:55', 'Database connected!'),
(27, '2022-12-29 12:43:27', 'Database connected!'),
(28, '2022-12-29 12:43:35', 'test has logged in.'),
(29, '2022-12-29 12:43:55', 'Database connected!'),
(30, '2022-12-29 12:44:11', 'test has logged in.'),
(31, '2022-12-29 12:55:48', 'Database connected!'),
(32, '2022-12-29 12:55:53', 'undefined'),
(33, '2022-12-29 12:56:02', 'test has logged in.'),
(34, '2022-12-29 12:56:02', 'test@test.com'),
(35, '2022-12-29 12:56:17', 'admin has logged in.'),
(36, '2022-12-29 12:56:17', 'admin@test.com'),
(37, '2022-12-29 13:00:14', 'Database connected!'),
(38, '2022-12-29 13:00:19', 'test has logged in.'),
(39, '2022-12-29 13:00:19', 'test@test.com'),
(40, '2022-12-29 14:29:15', 'Database connected!'),
(41, '2022-12-29 14:29:21', 'admin has logged in.'),
(42, '2022-12-30 10:29:32', 'Database connected!'),
(43, '2022-12-30 10:29:43', 'test has logged in.'),
(44, '2022-12-30 11:16:05', 'Database connected!'),
(45, '2022-12-30 11:16:12', 'test has logged in.'),
(46, '2022-12-30 11:16:15', 'test home'),
(47, '2022-12-30 11:16:17', 'test home'),
(48, '2022-12-30 11:16:18', 'test home'),
(49, '2022-12-30 11:16:18', 'test home'),
(50, '2022-12-30 11:16:18', 'test home'),
(51, '2022-12-30 11:16:18', 'test home'),
(52, '2022-12-30 11:18:39', 'test home'),
(53, '2022-12-30 11:18:39', 'test home'),
(54, '2022-12-30 11:18:40', 'test home'),
(55, '2022-12-30 11:18:41', 'test home'),
(56, '2022-12-30 11:18:41', 'test home'),
(57, '2022-12-30 11:18:41', 'test home'),
(58, '2022-12-30 11:18:41', 'test home'),
(59, '2022-12-30 11:18:41', 'test home'),
(60, '2022-12-30 11:20:15', 'test home'),
(61, '2022-12-30 11:20:16', 'test home'),
(62, '2022-12-30 11:20:16', 'test home'),
(63, '2022-12-30 11:20:49', 'test home'),
(64, '2022-12-30 11:20:50', 'test home'),
(65, '2022-12-30 11:20:51', 'test home'),
(66, '2022-12-30 11:20:51', 'test home'),
(67, '2022-12-30 11:20:51', 'test home'),
(68, '2022-12-30 11:20:52', 'test home'),
(69, '2022-12-30 11:21:07', 'test home'),
(70, '2022-12-30 11:21:07', 'test home'),
(71, '2022-12-30 11:21:07', 'test home'),
(72, '2022-12-30 11:21:08', 'test home'),
(73, '2022-12-30 11:21:08', 'test home'),
(74, '2022-12-30 11:21:09', 'test home'),
(75, '2022-12-30 11:21:09', 'test home'),
(76, '2022-12-30 11:21:10', 'test home'),
(77, '2022-12-30 11:21:10', 'test home'),
(78, '2022-12-30 11:21:40', 'Database connected!'),
(79, '2022-12-30 11:21:46', 'test has logged in.'),
(80, '2022-12-30 11:21:50', 'test home'),
(81, '2022-12-30 11:21:52', 'test home'),
(82, '2022-12-30 11:21:52', 'test home'),
(83, '2022-12-30 11:21:52', 'test home'),
(84, '2022-12-30 11:21:53', 'test home'),
(85, '2022-12-30 11:21:53', 'test home'),
(86, '2022-12-30 11:21:53', 'test home'),
(87, '2022-12-30 11:22:17', 'test home'),
(88, '2022-12-30 11:22:17', 'test home'),
(89, '2022-12-30 11:22:17', 'test home'),
(90, '2022-12-30 11:22:18', 'test home'),
(91, '2022-12-30 11:22:18', 'test home'),
(92, '2022-12-30 11:22:51', 'test home'),
(93, '2022-12-30 11:23:15', 'test home'),
(94, '2022-12-30 11:32:59', 'test home'),
(95, '2022-12-30 11:34:15', 'test home'),
(96, '2022-12-30 11:34:23', 'test home'),
(97, '2022-12-30 11:34:25', 'test home'),
(98, '2022-12-30 11:34:36', 'test home'),
(99, '2022-12-30 11:34:37', 'test home'),
(100, '2022-12-30 11:34:37', 'test home'),
(101, '2022-12-30 11:34:38', 'test home'),
(102, '2022-12-30 11:34:38', 'test home'),
(103, '2022-12-30 11:34:38', 'test home'),
(104, '2022-12-30 11:34:38', 'test home'),
(105, '2022-12-30 11:34:38', 'test home'),
(106, '2022-12-30 11:34:38', 'test home'),
(107, '2022-12-30 11:34:39', 'test home'),
(108, '2022-12-30 11:34:39', 'test home'),
(109, '2022-12-30 11:34:39', 'test home'),
(110, '2022-12-30 11:34:39', 'test home'),
(111, '2022-12-30 11:34:39', 'test home'),
(112, '2022-12-30 11:34:40', 'test home'),
(113, '2022-12-30 11:34:40', 'test home'),
(114, '2022-12-30 11:34:40', 'test home'),
(115, '2022-12-30 11:34:40', 'test home'),
(116, '2022-12-30 11:34:40', 'test home'),
(117, '2022-12-30 11:34:40', 'test home'),
(118, '2022-12-30 11:34:41', 'test home'),
(119, '2022-12-30 11:34:41', 'test home'),
(120, '2022-12-30 11:38:47', 'test home'),
(121, '2022-12-30 11:38:47', 'test home'),
(122, '2022-12-30 11:38:47', 'test home'),
(123, '2022-12-30 11:38:47', 'test home'),
(124, '2022-12-30 11:38:47', 'test home'),
(125, '2022-12-30 11:38:48', 'test home'),
(126, '2022-12-30 11:38:48', 'test home'),
(127, '2022-12-30 11:38:48', 'test home'),
(128, '2022-12-30 11:38:48', 'test home'),
(129, '2022-12-30 11:38:48', 'test home'),
(130, '2022-12-30 11:38:49', 'test home'),
(131, '2022-12-30 11:38:49', 'test home'),
(132, '2022-12-30 11:38:49', 'test home'),
(133, '2022-12-30 11:38:49', 'test home'),
(134, '2022-12-30 11:38:49', 'test home'),
(135, '2022-12-30 11:38:50', 'test home'),
(136, '2022-12-30 11:38:50', 'test home'),
(137, '2022-12-30 11:38:50', 'test home'),
(138, '2022-12-30 11:38:50', 'test home'),
(139, '2022-12-30 11:38:50', 'test home'),
(140, '2022-12-30 11:38:51', 'test home'),
(141, '2022-12-30 11:38:51', 'test home'),
(142, '2022-12-30 11:38:51', 'test home'),
(143, '2022-12-30 11:38:51', 'test home'),
(144, '2022-12-30 11:38:52', 'test home'),
(145, '2022-12-30 11:38:52', 'test home'),
(146, '2022-12-30 11:38:52', 'test home'),
(147, '2022-12-30 11:38:52', 'test home'),
(148, '2022-12-30 11:38:52', 'test home'),
(149, '2022-12-30 11:38:53', 'test home'),
(150, '2022-12-30 11:38:53', 'test home'),
(151, '2022-12-30 11:38:53', 'test home'),
(152, '2022-12-30 11:38:58', 'test home'),
(153, '2022-12-30 11:38:58', 'test home'),
(154, '2022-12-30 11:38:58', 'test home'),
(155, '2022-12-30 11:38:59', 'test home'),
(156, '2022-12-30 11:38:59', 'test home'),
(157, '2022-12-30 11:38:59', 'test home'),
(158, '2022-12-30 11:38:59', 'test home'),
(159, '2022-12-30 11:38:59', 'test home'),
(160, '2022-12-30 11:39:00', 'test home'),
(161, '2022-12-30 11:39:00', 'test home'),
(162, '2022-12-30 11:39:00', 'test home'),
(163, '2022-12-30 11:39:00', 'test home'),
(164, '2022-12-30 11:39:01', 'test home'),
(165, '2022-12-30 11:39:01', 'test home'),
(166, '2022-12-30 11:39:01', 'test home'),
(167, '2022-12-30 11:39:01', 'test home'),
(168, '2022-12-30 11:39:02', 'test home'),
(169, '2022-12-30 12:10:37', 'Database connected!'),
(170, '2022-12-30 12:10:47', 'test has logged in.'),
(171, '2022-12-30 12:11:12', 'Database connected!'),
(172, '2022-12-30 12:11:23', 'test has logged in.'),
(173, '2022-12-30 12:13:23', 'Database connected!'),
(174, '2022-12-30 12:13:29', 'test has logged in.'),
(175, '2022-12-30 12:13:33', 'test@test.comhas log out'),
(176, '2022-12-30 12:16:46', 'Database connected!'),
(177, '2022-12-30 12:16:52', 'test has logged in.'),
(178, '2022-12-30 12:18:13', 'Database connected!'),
(179, '2022-12-30 12:18:28', 'Database connected!'),
(180, '2022-12-30 12:18:37', 'test has logged in.'),
(181, '2022-12-30 12:18:41', 'test@test.comhas log out'),
(182, '2022-12-30 12:18:54', 'Database connected!'),
(183, '2022-12-30 12:19:04', 'test has logged in.'),
(184, '2022-12-30 12:19:07', 'test@test.comhas log out'),
(185, '2022-12-30 12:19:32', 'Database connected!'),
(186, '2022-12-30 12:19:43', 'test has logged in.'),
(187, '2022-12-30 12:19:47', 'test@test.comhas log out'),
(188, '2022-12-30 12:20:37', 'Database connected!'),
(189, '2022-12-30 12:20:43', 'test has logged in.'),
(190, '2022-12-30 12:20:47', 'test@test.comhas log out');

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
  `data` datetime NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `tickets`
--

INSERT INTO `tickets` (`id`, `imie`, `dzial`, `tresc`, `nrtel`, `data`, `status`) VALUES
(1, 'sdf', 1, 'jkl', 0, '0000-00-00 00:00:00', 1),
(2, 'sdf', 1, 'tyitityu', 0, '0000-00-00 00:00:00', 1),
(3, 'bar', 1, 'tgfhgf', 0, '0000-00-00 00:00:00', 1),
(4, 'sdf', 1, 'bhj', 0, '0000-00-00 00:00:00', 1),
(5, 'sdf', 1, 'yuiy', 111111111, '0000-00-00 00:00:00', 1),
(6, 'bar', 1, 'ghg', 111111111, '2022-12-28 13:46:37', 1),
(7, 'rty', 1, 'hj', 0, '2022-12-28 13:57:14', 1),
(8, '54', 1, 'gfhh', 0, '2022-12-28 13:58:08', 1),
(9, 'rty', 1, 'gfhfgh', 0, '2022-12-28 14:18:43', 1);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT dla tabeli `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT dla tabeli `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=191;

--
-- AUTO_INCREMENT dla tabeli `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
