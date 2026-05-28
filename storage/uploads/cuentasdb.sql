CREATE DATABASE  IF NOT EXISTS `cuentasdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cuentasdb`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: cuentasdb
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cuenta`
--

DROP TABLE IF EXISTS `cuenta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuenta` (
  `IdCuenta` int NOT NULL AUTO_INCREMENT,
  `NoCuenta` varchar(10) DEFAULT NULL,
  `FechaApertura` datetime DEFAULT NULL,
  `MontoInicial` float DEFAULT NULL,
  `Saldo` float DEFAULT NULL,
  `IdCuentaHabiente` int DEFAULT NULL,
  PRIMARY KEY (`IdCuenta`),
  KEY `IdCuentaHabiente` (`IdCuentaHabiente`),
  CONSTRAINT `cuenta_ibfk_1` FOREIGN KEY (`IdCuentaHabiente`) REFERENCES `cuentahabiente` (`IdCuentaHabiente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuenta`
--

LOCK TABLES `cuenta` WRITE;
/*!40000 ALTER TABLE `cuenta` DISABLE KEYS */;
/*!40000 ALTER TABLE `cuenta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuentahabiente`
--

DROP TABLE IF EXISTS `cuentahabiente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuentahabiente` (
  `IdCuentaHabiente` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) NOT NULL,
  `Dpi` varchar(16) DEFAULT NULL,
  `Pasaporte` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`IdCuentaHabiente`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuentahabiente`
--

LOCK TABLES `cuentahabiente` WRITE;
/*!40000 ALTER TABLE `cuentahabiente` DISABLE KEYS */;
INSERT INTO `cuentahabiente` VALUES (1,'Adolfo','0123456',''),(2,'Alex','45689','696598712559'),(3,'Jose','415785','5698653-56989'),(4,'Pedro','956896585','6565'),(5,'Enrique','0188456','65956'),(6,'Luis','2359895656','ACDF6656'),(7,'Byron','0213545','PAS456789');
/*!40000 ALTER TABLE `cuentahabiente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientos`
--

DROP TABLE IF EXISTS `movimientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos` (
  `IdMovinmiento` int NOT NULL AUTO_INCREMENT,
  `Tipo` varchar(15) NOT NULL,
  `Monto` float DEFAULT NULL,
  `Fecha` datetime DEFAULT NULL,
  `IdCuenta` int NOT NULL,
  PRIMARY KEY (`IdMovinmiento`),
  KEY `IdCuenta` (`IdCuenta`),
  CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`IdCuenta`) REFERENCES `cuenta` (`IdCuenta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos`
--

LOCK TABLES `movimientos` WRITE;
/*!40000 ALTER TABLE `movimientos` DISABLE KEYS */;
/*!40000 ALTER TABLE `movimientos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-04  7:54:09
