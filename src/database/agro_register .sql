-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-04-2024 a las 12:44:59
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `agro_register`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividad`
--

CREATE TABLE `actividad` (
  `id_actividad` int(11) NOT NULL,
  `nombre_actividad` varchar(200) NOT NULL,
  `tiempo` time NOT NULL,
  `observaciones` varchar(200) NOT NULL,
  `valor_actividad` float NOT NULL,
  `fk_id_variedad` int(11) NOT NULL,
  `estado` enum('activo','inactivo','','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `actividad`
--

INSERT INTO `actividad` (`id_actividad`, `nombre_actividad`, `tiempo`, `observaciones`, `valor_actividad`, `fk_id_variedad`, `estado`) VALUES
(1, 'fumigare', '04:12:11', 'hol apa', 13213, 1, ''),
(2, 'guada', '04:22:04', 'hoy no', 13213, 1, ''),
(3, 'pas', '12:32:12', 'no', 213134, 1, 'activo'),
(4, 'pas', '12:32:12', 'no', 213134, 1, 'inactivo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `costos`
--

CREATE TABLE `costos` (
  `id_costos` int(11) NOT NULL,
  `precio` int(11) NOT NULL,
  `fk_id_actividad` int(11) NOT NULL,
  `fk_id_tipo_recursos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `costos`
--

INSERT INTO `costos` (`id_costos`, `precio`, `fk_id_actividad`, `fk_id_tipo_recursos`) VALUES
(1, 120000, 1, 2),
(2, 2000, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cultivo`
--

CREATE TABLE `cultivo` (
  `id_cultivo` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `cantidad_sembrada` int(11) NOT NULL,
  `fk_id_lote` int(11) NOT NULL,
  `fk_id_variedad` int(11) NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `cultivo`
--

INSERT INTO `cultivo` (`id_cultivo`, `fecha_inicio`, `cantidad_sembrada`, `fk_id_lote`, `fk_id_variedad`, `estado`) VALUES
(1, '2023-12-12', 100, 1, 1, 'activo'),
(2, '2023-11-12', 1000, 2, 1, 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `finca`
--

CREATE TABLE `finca` (
  `id_finca` int(11) NOT NULL,
  `nombre_finca` varchar(200) NOT NULL,
  `longitud` float NOT NULL,
  `latitud` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `finca`
--

INSERT INTO `finca` (`id_finca`, `nombre_finca`, `longitud`, `latitud`) VALUES
(1, 'los tres cerdos', 232, 432),
(2, 'juan casas', 766, 54);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inversiones`
--

CREATE TABLE `inversiones` (
  `id_inversiones` int(11) NOT NULL,
  `fk_id_costos` int(11) NOT NULL,
  `fk_id_programacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `inversiones`
--

INSERT INTO `inversiones` (`id_inversiones`, `fk_id_costos`, `fk_id_programacion`) VALUES
(1, 1, 3),
(2, 2, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lotes`
--

CREATE TABLE `lotes` (
  `id_lote` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `longitud` float NOT NULL,
  `latitud` float NOT NULL,
  `fk_id_finca` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `lotes`
--

INSERT INTO `lotes` (`id_lote`, `nombre`, `longitud`, `latitud`, `fk_id_finca`) VALUES
(1, 'guayavero', 32, 32, 2),
(2, 'pollos', 23, 22, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `produccion`
--

CREATE TABLE `produccion` (
  `id_producccion` int(11) NOT NULL,
  `cantidad_produccion` int(11) NOT NULL,
  `precio` float NOT NULL,
  `fk_id_programacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `produccion`
--

INSERT INTO `produccion` (`id_producccion`, `cantidad_produccion`, `precio`, `fk_id_programacion`) VALUES
(1, 2000, 500000, 3),
(2, 2000, 500000, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `programacion`
--

CREATE TABLE `programacion` (
  `id_programacion` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('activo','inactivo','','') NOT NULL,
  `fk_id_usuario` int(11) NOT NULL,
  `fk_id_actividad` int(11) NOT NULL,
  `fk_id_cultivo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `programacion`
--

INSERT INTO `programacion` (`id_programacion`, `fecha_inicio`, `fecha_fin`, `estado`, `fk_id_usuario`, `fk_id_actividad`, `fk_id_cultivo`) VALUES
(3, '2024-03-29', '2024-03-30', 'activo', 18, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_recursos`
--

CREATE TABLE `tipo_recursos` (
  `id_tipo_recursos` int(11) NOT NULL,
  `nombre_recursos` varchar(200) NOT NULL,
  `cantidad_medida` float NOT NULL,
  `unidades_medida` enum('ml','litro','g','kg') NOT NULL,
  `extras` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `tipo_recursos`
--

INSERT INTO `tipo_recursos` (`id_tipo_recursos`, `nombre_recursos`, `cantidad_medida`, `unidades_medida`, `extras`) VALUES
(1, 'pala', 0, '', ''),
(2, 'abono 10-20-10', 10, 'kg', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `correo` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `rol` enum('administrador','empleado','','') NOT NULL,
  `estado` enum('activo','inactivo','','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `correo`, `password`, `rol`, `estado`) VALUES
(18, 'daniel', 'felipe', 'dafe@gmail.com', '123', '', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `variedad`
--

CREATE TABLE `variedad` (
  `id_variedad` int(11) NOT NULL,
  `nombre_variedad` varchar(11) NOT NULL,
  `tipo_cultivo` enum('alimentarios','textiles','oleaginosos','ornamentales','industriales') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `variedad`
--

INSERT INTO `variedad` (`id_variedad`, `nombre_variedad`, `tipo_cultivo`) VALUES
(1, 'cilantro', 'alimentarios');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividad`
--
ALTER TABLE `actividad`
  ADD PRIMARY KEY (`id_actividad`),
  ADD KEY `actividad_variedad` (`fk_id_variedad`);

--
-- Indices de la tabla `costos`
--
ALTER TABLE `costos`
  ADD PRIMARY KEY (`id_costos`),
  ADD KEY `costos_actividad` (`fk_id_actividad`),
  ADD KEY `costos_tipo_recursos` (`fk_id_tipo_recursos`);

--
-- Indices de la tabla `cultivo`
--
ALTER TABLE `cultivo`
  ADD PRIMARY KEY (`id_cultivo`),
  ADD KEY `cultivo_variedad` (`fk_id_variedad`),
  ADD KEY `cultivo_lotes` (`fk_id_lote`);

--
-- Indices de la tabla `finca`
--
ALTER TABLE `finca`
  ADD PRIMARY KEY (`id_finca`);

--
-- Indices de la tabla `inversiones`
--
ALTER TABLE `inversiones`
  ADD PRIMARY KEY (`id_inversiones`),
  ADD KEY `inversiones_costos` (`fk_id_costos`),
  ADD KEY `inversiones_cultivos` (`fk_id_programacion`);

--
-- Indices de la tabla `lotes`
--
ALTER TABLE `lotes`
  ADD PRIMARY KEY (`id_lote`),
  ADD KEY `lotes_finca` (`fk_id_finca`);

--
-- Indices de la tabla `produccion`
--
ALTER TABLE `produccion`
  ADD PRIMARY KEY (`id_producccion`),
  ADD KEY `produccion_cultivo` (`fk_id_programacion`);

--
-- Indices de la tabla `programacion`
--
ALTER TABLE `programacion`
  ADD PRIMARY KEY (`id_programacion`),
  ADD KEY `fk_programacion_actividad` (`fk_id_actividad`),
  ADD KEY `programacion_usuarios` (`fk_id_usuario`),
  ADD KEY `programacion_cultivos` (`fk_id_cultivo`);

--
-- Indices de la tabla `tipo_recursos`
--
ALTER TABLE `tipo_recursos`
  ADD PRIMARY KEY (`id_tipo_recursos`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `variedad`
--
ALTER TABLE `variedad`
  ADD PRIMARY KEY (`id_variedad`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividad`
--
ALTER TABLE `actividad`
  MODIFY `id_actividad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `costos`
--
ALTER TABLE `costos`
  MODIFY `id_costos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `cultivo`
--
ALTER TABLE `cultivo`
  MODIFY `id_cultivo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `finca`
--
ALTER TABLE `finca`
  MODIFY `id_finca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `inversiones`
--
ALTER TABLE `inversiones`
  MODIFY `id_inversiones` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `lotes`
--
ALTER TABLE `lotes`
  MODIFY `id_lote` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `produccion`
--
ALTER TABLE `produccion`
  MODIFY `id_producccion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `programacion`
--
ALTER TABLE `programacion`
  MODIFY `id_programacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tipo_recursos`
--
ALTER TABLE `tipo_recursos`
  MODIFY `id_tipo_recursos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `variedad`
--
ALTER TABLE `variedad`
  MODIFY `id_variedad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividad`
--
ALTER TABLE `actividad`
  ADD CONSTRAINT `actividad_variedad` FOREIGN KEY (`fk_id_variedad`) REFERENCES `variedad` (`id_variedad`);

--
-- Filtros para la tabla `costos`
--
ALTER TABLE `costos`
  ADD CONSTRAINT `costos_actividad` FOREIGN KEY (`fk_id_actividad`) REFERENCES `actividad` (`id_actividad`),
  ADD CONSTRAINT `costos_tipo_recursos` FOREIGN KEY (`fk_id_tipo_recursos`) REFERENCES `tipo_recursos` (`id_tipo_recursos`);

--
-- Filtros para la tabla `cultivo`
--
ALTER TABLE `cultivo`
  ADD CONSTRAINT `cultivo_lotes` FOREIGN KEY (`fk_id_lote`) REFERENCES `lotes` (`id_lote`),
  ADD CONSTRAINT `cultivo_variedad` FOREIGN KEY (`fk_id_variedad`) REFERENCES `variedad` (`id_variedad`);

--
-- Filtros para la tabla `inversiones`
--
ALTER TABLE `inversiones`
  ADD CONSTRAINT `inversiones_ibfk_1` FOREIGN KEY (`fk_id_programacion`) REFERENCES `programacion` (`id_programacion`),
  ADD CONSTRAINT `inversiones_ibfk_2` FOREIGN KEY (`fk_id_costos`) REFERENCES `costos` (`id_costos`);

--
-- Filtros para la tabla `lotes`
--
ALTER TABLE `lotes`
  ADD CONSTRAINT `lotes_finca` FOREIGN KEY (`fk_id_finca`) REFERENCES `finca` (`id_finca`);

--
-- Filtros para la tabla `produccion`
--
ALTER TABLE `produccion`
  ADD CONSTRAINT `produccion_ibfk_1` FOREIGN KEY (`fk_id_programacion`) REFERENCES `programacion` (`id_programacion`);

--
-- Filtros para la tabla `programacion`
--
ALTER TABLE `programacion`
  ADD CONSTRAINT `fk_programacion_actividad` FOREIGN KEY (`fk_id_actividad`) REFERENCES `actividad` (`id_actividad`),
  ADD CONSTRAINT `programacion_cultivos` FOREIGN KEY (`fk_id_cultivo`) REFERENCES `cultivo` (`id_cultivo`),
  ADD CONSTRAINT `programacion_usuarios` FOREIGN KEY (`fk_id_usuario`) REFERENCES `usuarios` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
