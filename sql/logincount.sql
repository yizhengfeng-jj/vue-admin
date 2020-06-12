/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50537
Source Host           : localhost:3306
Source Database       : myblog

Target Server Type    : MYSQL
Target Server Version : 50537
File Encoding         : 65001

Date: 2020-06-12 11:06:59
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for logincount
-- ----------------------------
DROP TABLE IF EXISTS `logincount`;
CREATE TABLE `logincount` (
  `loginTime` datetime NOT NULL,
  `userId` varchar(255) NOT NULL,
  `loginCount` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
