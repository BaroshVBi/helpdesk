-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 03 Sty 2023, 08:18
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
  `lvl` int(11) NOT NULL DEFAULT 1,
  `dept` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `login`
--

INSERT INTO `login` (`id`, `name`, `email`, `password`, `lvl`, `dept`) VALUES
(1, 'test', 'test@test.com', 'test', 1, 1),
(2, 'admin', 'admin@test.com', 'test', 2, 2);

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
(190, '2022-12-30 12:20:47', 'test@test.comhas log out'),
(191, '0000-00-00 00:00:00', 'Database connected!'),
(192, '0000-00-00 00:00:00', 'Database connected!'),
(193, '0000-00-00 00:00:00', 'Database connected!'),
(194, '0000-00-00 00:00:00', 'Database connected!'),
(195, '2023-01-02 10:56:29', 'Database connected!'),
(196, '2023-01-02 10:59:09', 'Database connected!'),
(197, '2023-01-02 10:59:13', 'test has logged in.'),
(198, '2023-01-02 11:27:01', 'Database connected!'),
(199, '2023-01-02 11:27:08', 'test has logged in.'),
(200, '2023-01-02 11:30:51', 'Database connected!'),
(201, '2023-01-02 11:34:14', 'Database connected!'),
(202, '2023-01-02 11:37:04', 'test has logged in.'),
(203, '2023-01-02 11:49:28', 'Database connected!'),
(204, '2023-01-02 11:49:37', 'admin has logged in.'),
(205, '2023-01-02 11:50:41', 'Database connected!'),
(206, '2023-01-02 11:50:53', 'admin has logged in.'),
(207, '2023-01-02 11:52:59', 'Database connected!'),
(208, '2023-01-02 11:53:14', 'admin has logged in.'),
(209, '2023-01-02 11:53:56', 'test has logged in.'),
(210, '2023-01-02 12:07:23', 'Database connected!'),
(211, '2023-01-02 12:07:29', 'test has logged in.'),
(212, '2023-01-02 16:12:08', 'Database connected!'),
(213, '2023-01-02 16:12:16', 'test has logged in.'),
(214, '2023-01-02 16:19:51', 'Database connected!'),
(215, '2023-01-02 16:20:04', 'test has logged in.'),
(216, '2023-01-02 16:20:46', 'test '),
(217, '2023-01-02 16:20:50', 'test test'),
(218, '2023-01-02 16:20:51', 'test test'),
(219, '2023-01-02 16:21:44', 'Database connected!'),
(220, '2023-01-02 16:26:46', 'Database connected!'),
(221, '2023-01-02 16:26:51', 'test has logged in.'),
(222, '2023-01-02 16:26:57', 'test test'),
(223, '2023-01-02 16:27:05', 'Database connected!'),
(224, '2023-01-02 16:27:15', 'test has logged in.'),
(225, '2023-01-02 16:27:21', 'test test'),
(226, '2023-01-02 16:28:29', 'Database connected!'),
(227, '2023-01-02 16:28:41', 'test has logged in.'),
(228, '2023-01-02 16:28:47', 'test test'),
(229, '2023-01-02 16:31:42', 'Database connected!'),
(230, '2023-01-02 16:31:51', 'test has logged in.'),
(231, '2023-01-02 16:31:57', 'test test'),
(232, '2023-01-02 16:34:03', 'Database connected!'),
(233, '2023-01-02 16:34:14', 'test has logged in.'),
(234, '2023-01-02 16:34:20', 'test test'),
(235, '2023-01-02 16:35:36', 'Database connected!'),
(236, '2023-01-02 16:35:44', 'test has logged in.'),
(237, '2023-01-02 16:35:48', 'test test'),
(238, '2023-01-02 16:38:06', 'Database connected!'),
(239, '2023-01-02 16:38:12', 'test has logged in.'),
(240, '2023-01-02 16:38:17', 'dfsg sdfgd'),
(241, '2023-01-02 16:40:02', 'Database connected!'),
(242, '2023-01-02 16:40:09', 'test has logged in.'),
(243, '2023-01-02 16:40:13', 'asg sdag'),
(244, '2023-01-02 16:45:31', 'Database connected!'),
(245, '2023-01-02 16:45:41', 'test has logged in.'),
(246, '2023-01-02 16:45:44', 'sdg asdg'),
(247, '2023-01-02 16:45:44', 'ticket inserted'),
(248, '2023-01-02 16:47:29', 'Database connected!'),
(249, '2023-01-02 16:47:37', 'test has logged in.'),
(250, '2023-01-02 16:47:40', 'dsfg dfgsdf'),
(251, '2023-01-02 16:47:40', 'ticket inserted'),
(252, '2023-01-03 08:01:02', 'Database connected!'),
(253, '2023-01-03 08:01:10', 'test has logged in.'),
(254, '2023-01-03 08:01:19', 'dfhdhfs dsfhdsfhdf'),
(255, '2023-01-03 08:01:19', 'ticket inserted'),
(256, '2023-01-03 08:07:59', 'Database connected!'),
(257, '2023-01-03 08:08:06', 'test has logged in.'),
(258, '2023-01-03 08:08:10', 'ticket inserted'),
(259, '2023-01-03 08:15:58', 'Database connected!'),
(260, '2023-01-03 08:16:03', 'test has logged in.'),
(261, '2023-01-03 08:16:12', 'ticket inserted');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `login_id` int(11) NOT NULL,
  `topic` text NOT NULL DEFAULT 'brak',
  `descr` text NOT NULL,
  `data` datetime NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `priority` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `tickets`
--

INSERT INTO `tickets` (`id`, `login_id`, `topic`, `descr`, `data`, `status`, `priority`) VALUES
(1, 0, '', 'jkl', '0000-00-00 00:00:00', 1, 0),
(2, 0, '', 'tyitityu', '0000-00-00 00:00:00', 1, 0),
(3, 0, '', 'tgfhgf', '0000-00-00 00:00:00', 1, 0),
(4, 0, '', 'bhj', '0000-00-00 00:00:00', 1, 0),
(5, 0, '', 'yuiy', '0000-00-00 00:00:00', 1, 0),
(6, 0, '', 'ghg', '2022-12-28 13:46:37', 1, 0),
(7, 0, '', 'hj', '2022-12-28 13:57:14', 1, 0),
(9, 0, '', 'gfhfgh', '2022-12-28 14:18:43', 1, 0),
(10, 1, 'sdg', 'asdg', '2023-01-02 16:45:44', 1, 0),
(11, 1, 'dsfg', 'dfgsdf', '2023-01-02 16:47:40', 1, 0),
(12, 1, 'dfhdhfs', 'dsfhdsfhdf', '2023-01-03 08:01:19', 1, 0),
(13, 1, 'test', 'test', '2023-01-03 08:08:10', 1, 0),
(14, 1, 'tesgdfh', 'dsfhdfhdh', '2023-01-03 08:16:12', 1, 2);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=262;

--
-- AUTO_INCREMENT dla tabeli `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
