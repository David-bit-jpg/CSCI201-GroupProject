-- MySQL dump 10.13  Distrib 8.0.34, for macos13 (arm64)
--
-- Host: localhost    Database: chatmate
-- ------------------------------------------------------
-- Server version	8.2.0

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
-- Table structure for table `Chat`
--

DROP TABLE IF EXISTS `Chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Chat` (
  `chatID` int NOT NULL AUTO_INCREMENT,
  `userID` int DEFAULT NULL,
  `roomID` int DEFAULT NULL,
  `messageContent` text,
  `timeStamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`chatID`),
  KEY `userID` (`userID`),
  KEY `roomID` (`roomID`),
  CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `User` (`userID`),
  CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`roomID`) REFERENCES `GroupChat` (`groupChatID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Chat`
--

LOCK TABLES `Chat` WRITE;
/*!40000 ALTER TABLE `Chat` DISABLE KEYS */;
/*!40000 ALTER TABLE `Chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Friend`
--

DROP TABLE IF EXISTS `Friend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Friend` (
  `friendID` int NOT NULL AUTO_INCREMENT,
  `userID` int DEFAULT NULL,
  `friendUserID` int DEFAULT NULL,
  `friendDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`friendID`),
  KEY `userID` (`userID`),
  KEY `friendUserID` (`friendUserID`),
  CONSTRAINT `friend_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `User` (`userID`),
  CONSTRAINT `friend_ibfk_2` FOREIGN KEY (`friendUserID`) REFERENCES `User` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Friend`
--

LOCK TABLES `Friend` WRITE;
/*!40000 ALTER TABLE `Friend` DISABLE KEYS */;
/*!40000 ALTER TABLE `Friend` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GroupChat`
--

DROP TABLE IF EXISTS `GroupChat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GroupChat` (
  `groupChatID` int NOT NULL AUTO_INCREMENT,
  `joinDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`groupChatID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GroupChat`
--

LOCK TABLES `GroupChat` WRITE;
/*!40000 ALTER TABLE `GroupChat` DISABLE KEYS */;
/*!40000 ALTER TABLE `GroupChat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MessageHistory`
--

DROP TABLE IF EXISTS `MessageHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MessageHistory` (
  `messageID` int NOT NULL AUTO_INCREMENT,
  `userID` int DEFAULT NULL,
  `chatID` int DEFAULT NULL,
  `messageContent` text,
  `timeStamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`messageID`),
  KEY `userID` (`userID`),
  CONSTRAINT `messagehistory_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `User` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MessageHistory`
--

LOCK TABLES `MessageHistory` WRITE;
/*!40000 ALTER TABLE `MessageHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `MessageHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `jwt_tokens` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserGroupChatMap`
--

DROP TABLE IF EXISTS `UserGroupChatMap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserGroupChatMap` (
  `userID` int NOT NULL,
  `groupChatID` int NOT NULL,
  PRIMARY KEY (`userID`,`groupChatID`),
  KEY `groupChatID` (`groupChatID`),
  CONSTRAINT `usergroupchatmap_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `User` (`userID`),
  CONSTRAINT `usergroupchatmap_ibfk_2` FOREIGN KEY (`groupChatID`) REFERENCES `GroupChat` (`groupChatID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserGroupChatMap`
--

LOCK TABLES `UserGroupChatMap` WRITE;
/*!40000 ALTER TABLE `UserGroupChatMap` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserGroupChatMap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserList`
--

DROP TABLE IF EXISTS `UserList`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserList` (
  `chatID` int NOT NULL,
  `userID` int NOT NULL,
  PRIMARY KEY (`chatID`,`userID`),
  KEY `userID` (`userID`),
  CONSTRAINT `userlist_ibfk_1` FOREIGN KEY (`chatID`) REFERENCES `Chat` (`chatID`),
  CONSTRAINT `userlist_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `User` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserList`
--

LOCK TABLES `UserList` WRITE;
/*!40000 ALTER TABLE `UserList` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserList` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-18 19:47:00
