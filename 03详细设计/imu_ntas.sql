/*
SQLyog 企业版 - MySQL GUI v8.14 
MySQL - 5.5.58 : Database - imu_ntas
*********************************************************************
*/


/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`imu_ntas` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `imu_ntas`;

/*Table structure for table `admin` */

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `id` varchar(10) NOT NULL,
  `apassword` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `admin` */

/*Table structure for table `choose` */

DROP TABLE IF EXISTS `choose`;

CREATE TABLE `choose` (
  `username` varchar(20) NOT NULL,
  `id` int(11) NOT NULL,
  PRIMARY KEY (`username`,`id`),
  KEY `FK_choose2` (`id`),
  CONSTRAINT `FK_choose2` FOREIGN KEY (`id`) REFERENCES `courses` (`id`),
  CONSTRAINT `FK_choose` FOREIGN KEY (`username`) REFERENCES `students` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `choose` */

/*Table structure for table `courses` */

DROP TABLE IF EXISTS `courses`;

CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cid` varchar(10) DEFAULT NULL,
  `cname` varchar(30)  NOT NULL,
  `grade` float NOT NULL,
  `ctype` varchar(20)  NOT NULL,
  `property` varchar(20)  NOT NULL,
  `time` varchar(80) DEFAULT NULL,
  `spot` varchar(30) DEFAULT NULL,
  `state` int(11)  NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `courses` */

/*Table structure for table `event` */

DROP TABLE IF EXISTS `event`;

CREATE TABLE `event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100)  NOT NULL,
  `content` text NOT NULL,
  `pubDate` datetime  NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `event` */

/*Table structure for table `students` */

DROP TABLE IF EXISTS `students`;

CREATE TABLE `students` (
  `username` varchar(20) NOT NULL,
  `spassword` varchar(20)  NOT NULL,
  `sname` char(16) NOT NULL,
  `email` varchar(20)  NULL,
  `telephone` varchar(15) DEFAULT  NULL,
  `birthday` date DEFAULT NULL,
  `sex` varchar(6)  NOT NULL,
  `dep` varchar(30) DEFAULT NULL,
  `edu` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `students` */

/*Table structure for table `teach` */

DROP TABLE IF EXISTS `teach`;

CREATE TABLE `teach` (
  `id` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  PRIMARY KEY (`id`,`username`),
  KEY `FK_teach2` (`username`),
  CONSTRAINT `FK_teach2` FOREIGN KEY (`username`) REFERENCES `teachers` (`username`),
  CONSTRAINT `FK_teach` FOREIGN KEY (`id`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `teach` */

/*Table structure for table `teachers` */

DROP TABLE IF EXISTS `teachers`;

CREATE TABLE `teachers` (
  `username` varchar(20) NOT NULL,
  `tname` varchar(20) NOT NULL,
  `tpassword` varchar(20) NOT NULL,
  `sex` varchar(6) NOT NULL,
  `dep` varchar(50) NOT NULL,
  `birthday` date NOT NULL,
  `nation` varchar(40) NOT NULL,
  `edu` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `teachers` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
