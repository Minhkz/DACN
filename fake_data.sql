CREATE DATABASE  IF NOT EXISTS `iphoneshop` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `iphoneshop`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: iphoneshop
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `location` enum('HOME','OFFICE') DEFAULT NULL,
  `short_desc` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `detail_desc` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `reciver_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `reciver_phone` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `address_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` (`id`, `user_id`, `location`, `short_desc`, `detail_desc`, `reciver_name`, `reciver_phone`) VALUES (1,4,'HOME','Số 29','Số 29, ngõ 80/66, Xuân Phương, Hà Nội','Nhật Minh','0385096604'),(2,3,'HOME','Số 29','Số 29, ngõ 80/66, Xuân Phương, Hà Nội','Nhật Minh','0385096604');
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_product`
--

DROP TABLE IF EXISTS `cart_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_product` (
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` float DEFAULT NULL,
  PRIMARY KEY (`cart_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_product_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_product_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_product`
--

LOCK TABLES `cart_product` WRITE;
/*!40000 ALTER TABLE `cart_product` DISABLE KEYS */;
INSERT INTO `cart_product` (`cart_id`, `product_id`, `quantity`, `price`) VALUES (2,2,1,25350000),(2,3,1,1399000),(3,1,1,14900000),(3,7,1,1990000);
/*!40000 ALTER TABLE `cart_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `sum` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` (`id`, `user_id`, `sum`) VALUES (1,4,0),(2,3,2),(3,9,2);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trade_mark` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trade_mark` (`trade_mark`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` (`id`, `trade_mark`) VALUES (1,'Apple'),(2,'Samsung');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_product`
--

DROP TABLE IF EXISTS `order_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_product` (
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`order_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_product_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_product_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_product`
--

LOCK TABLES `order_product` WRITE;
/*!40000 ALTER TABLE `order_product` DISABLE KEYS */;
INSERT INTO `order_product` (`order_id`, `product_id`, `quantity`, `price`) VALUES (1,1,1,14900000),(2,1,1,14900000),(2,2,1,25350000),(2,6,1,17990000),(3,2,2,25350000),(3,9,3,14370000),(3,13,3,13990000),(4,1,2,14900000),(5,2,1,25350000),(6,1,1,14900000),(7,1,4,14900000),(8,1,1,14900000),(8,2,1,25350000),(9,1,1,14900000),(10,1,1,14900000),(11,1,1,14900000),(12,1,1,14900000),(13,4,3,5490000),(14,4,3,5490000),(15,2,2,25350000),(16,1,8,14900000),(17,2,9,25350000),(19,4,1,5490000),(20,4,1,5490000);
/*!40000 ALTER TABLE `order_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `total_price` double DEFAULT NULL,
  `address_id` int DEFAULT NULL,
  `total_product` int DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `payment_ref` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `payment_status` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `payment_method` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `address_id` (`address_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`) ON DELETE SET NULL,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` (`id`, `user_id`, `total_price`, `address_id`, `total_product`, `status`, `payment_ref`, `payment_status`, `payment_method`) VALUES (1,4,14929005,1,1,'COMPLETED','UNKNOW','PAYMENT_UNPAID','COD'),(2,4,58269005,1,3,'COMPLETED','UNKNOW','PAYMENT_UNPAID','COD'),(3,4,135809005,1,3,'COMPLETED','UNKNOW','PAYMENT_UNPAID','COD'),(4,3,29829005,2,1,'PENDING','UNKNOW','PAYMENT_UNPAID','COD'),(5,3,25379005,2,1,'PENDING','UNKNOW','PAYMENT_UNPAID','COD'),(6,3,14929005,2,1,'PENDING','54b4d5e62b88440ba2b17f3f270cc496','PAYMENT_UNPAID','BANKING'),(7,3,59649005,2,1,'PENDING','UNKNOW','PAYMENT_UNPAID','COD'),(8,3,40279005,2,2,'COMPLETED','8803f1f51200444294c8886999cb1648','PAYMENT_UNPAID','BANKING'),(9,4,14949005,1,1,'PENDING','4f672b04481d4b5db6766a505ffbac47','PAYMENT_UNPAID','BANKING'),(10,4,14929005,1,1,'PENDING','804357bf2b274a71be4924fc0cdba255','PAYMENT_UNPAID','BANKING'),(11,4,14929005,1,1,'PENDING','b900a2d4f9004efc92134ebc3d7e79ec','PAYMENT_UNPAID','BANKING'),(12,4,14929005,1,1,'PENDING','3d365abab7f949abab132cec13a01ded','PAYMENT_SUCCEED','BANKING'),(13,4,16499005,1,3,'PENDING','UNKNOW','PAYMENT_UNPAID','COD'),(14,4,16499005,1,3,'COMPLETED','UNKNOW','PAYMENT_UNPAID','COD'),(15,3,50734000,2,1,'COMPLETED','bccbf9858f474887a475f4b353a451cc','PAYMENT_SUCCEED','BANKING'),(16,4,119234000,1,1,'PENDING','21358bd60bab413c88c0b26425c6d44e','PAYMENT_UNPAID','BANKING'),(17,3,228184000,2,1,'PENDING','b4f762e396de47d2ae79fd331089fdec','PAYMENT_UNPAID','BANKING'),(18,3,34000,2,0,'PENDING','5500299e8430434e9d85e5fd84cb0fa6','PAYMENT_UNPAID','BANKING'),(19,4,5519005,1,1,'PENDING','UNKNOW','PAYMENT_UNPAID','COD'),(20,4,5519005,1,1,'PENDING','e20cbb924e90400782cb1c902fc5460c','PAYMENT_UNPAID','BANKING');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `is_active` bit(1) DEFAULT NULL,
  `code` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKm36ap4hf05m0uihe5ftw2omon` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(13,2) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `status` enum('COMPLETED','FAILED','PENDING','REFUNDED') DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  `payment_method_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK81gagumt0r8y3rmudcgpbk42l` (`order_id`),
  KEY `FKce1n8pa67lq4l57l9mhugdgab` (`payment_method_id`),
  CONSTRAINT `FK81gagumt0r8y3rmudcgpbk42l` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKce1n8pa67lq4l57l9mhugdgab` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `price` double NOT NULL,
  `detail_desc` text NOT NULL,
  `short_desc` varchar(600) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `quantity` int NOT NULL,
  `sold` int DEFAULT '1',
  `image` varchar(1000) DEFAULT NULL,
  `is_featured` int DEFAULT NULL,
  `is_discount` int DEFAULT NULL,
  `category_id` int NOT NULL,
  `spec_id` int NOT NULL,
  `image_detail` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `spec_id` (`spec_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`spec_id`) REFERENCES `specifications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` (`id`, `name`, `price`, `detail_desc`, `short_desc`, `quantity`, `sold`, `image`, `is_featured`, `is_discount`, `category_id`, `spec_id`, `image_detail`) VALUES (1,'Apple iPhone 14 Pro Max 128GB Deep Purple',14900000,'iPhone 14 Pro Max 128GB là chiếc flagship mạnh mẽ của Apple với thiết kế sang trọng, khung thép không gỉ và mặt lưng kính cường lực. Máy sở hữu màn hình Super Retina XDR 6.7 inch với công nghệ Dynamic Island và Always-On Display độc đáo.\r\n\r\nHiệu năng vượt trội nhờ chip A16 Bionic tiết kiệm pin, hỗ trợ mọi tác vụ từ lướt web, chơi game đến xử lý đồ họa nặng. Cụm camera 48MP cho phép chụp ảnh siêu chi tiết, quay video 4K Cinematic Mode và hỗ trợ chụp đêm cực tốt.\r\n\r\nDung lượng 128GB đáp ứng nhu cầu lưu trữ cơ bản, pin lớn cho thời lượng sử dụng cả ngày, cùng các công nghệ mới như Face ID, 5G, iOS 16 và nhiều tiện ích thông minh trong hệ sinh thái Apple.','iPhone 14 Pro Max 128GB mang thiết kế sang trọng, màn hình 6.7\" Super Retina XDR với Dynamic Island và Always-On Display hiện đại. Chip A16 Bionic mạnh mẽ, camera 48MP chuyên nghiệp cho ảnh sắc nét và video 4K sống động. Dung lượng 128GB đủ dùng, pin bền bỉ cả ngày, hỗ trợ 5G, Face ID và hệ sinh thái iOS mượt mà, đáp ứng hoàn hảo nhu cầu công việc lẫn giải trí.',12,8,'1759673253159-Iphone_14pro_1.png',1,0,1,1,'1759673253163-Iphone_14pro_1.png'),(2,'Blackmagic Pocket Cinema Camera 6k',25350000,'Blackmagic Pocket Cinema Camera 6K là máy quay chuyên nghiệp nhỏ gọn, tích hợp cảm biến Super 35mm 6K HDR (6144 x 3456) cho chất lượng điện ảnh với dải tương phản động lên đến 13 stops và ISO kép tối đa 25.600, giúp quay tốt cả trong điều kiện thiếu sáng.\r\n\r\nMáy sử dụng ngàm ống kính Canon EF, hỗ trợ đa dạng ống kính DSLR/Cinema, mang đến khả năng sáng tạo linh hoạt. Hệ thống quay định dạng Blackmagic RAW và ProRes 422/444 đảm bảo giữ chi tiết tối đa cho hậu kỳ.\r\n\r\nMàn hình cảm ứng 5 inch Full HD sáng rõ, cho phép lấy nét, kiểm soát màu sắc, và điều chỉnh tham số nhanh chóng. Hỗ trợ cổng mini XLR, HDMI, USB-C, cùng khe thẻ CFast 2.0 và SD UHS-II, ngoài ra có thể ghi trực tiếp ra SSD qua USB-C.\r\n\r\nThiết kế gọn nhẹ nhưng chắc chắn với vỏ carbon composite, tích hợp công cụ chuyên nghiệp như False Color, Focus Peaking, LUT 3D, và chạy hệ điều hành Blackmagic OS trực quan. Máy cũng hỗ trợ quay 120fps ở Full HD, phù hợp cho cả điện ảnh, quảng cáo lẫn vlog chuyên nghiệp.','Blackmagic Pocket Cinema Camera 6K trang bị cảm biến Super 35mm 6K HDR, dải sáng 13 stops, ISO kép 25.600 cho hình ảnh điện ảnh sắc nét cả trong điều kiện thiếu sáng. Hỗ trợ ngàm Canon EF, quay Blackmagic RAW/ProRes, màn hình cảm ứng 5\" trực quan, nhiều cổng kết nối (mini XLR, HDMI, USB-C) và lưu trên thẻ CFast, SD hoặc SSD. Thiết kế gọn nhẹ nhưng chuyên nghiệp, tối ưu cho nhà làm phim, quảng cáo và sáng tạo nội dung.',8,2,'1759673242992-Blackmagic_camera.png',1,0,1,2,'1759673242996-Blackmagic_camera.png'),(3,'Apple Watch Series 9 GPS 41mm Starlight Aluminium',1399000,'Apple Watch Series 9 GPS 41mm (Starlight Aluminium Case) là chiếc smartwatch thế hệ mới của Apple, sở hữu thiết kế sang trọng, nhỏ gọn với vỏ nhôm màu Starlight tinh tế và dây đeo thoải mái.\r\n\r\nMáy trang bị màn hình Retina Always-On sáng rực rỡ, dễ nhìn ngay cả ngoài trời, hỗ trợ nhiều mặt đồng hồ tùy chỉnh theo phong cách cá nhân. Hiệu năng vượt trội nhờ chip S9 SiP mới, cho trải nghiệm mượt mà, đồng thời hỗ trợ cử chỉ điều khiển bằng tay Double Tap tiện lợi.\r\n\r\nTích hợp nhiều tính năng theo dõi sức khỏe: đo nhịp tim, SpO₂, ECG, giấc ngủ, chu kỳ kinh nguyệt, cùng các chế độ luyện tập thể thao đa dạng. Hệ thống GPS chính xác, chống nước WR50 giúp thoải mái bơi lội, luyện tập ngoài trời.\r\n\r\nHỗ trợ Apple Pay, Siri on-device, thông báo thông minh, gọi điện & nhắn tin khi kết nối iPhone, thời lượng pin lên đến 18 giờ sử dụng. Là trợ thủ hoàn hảo cho công việc, rèn luyện sức khỏe và phong cách sống hiện đại.','Apple Watch Series 9 GPS 41mm Starlight Aluminium sở hữu thiết kế sang trọng, màn hình Retina Always-On sắc nét, chip S9 SiP mạnh mẽ với cử chỉ Double Tap. Trang bị các tính năng sức khỏe như đo nhịp tim, SpO₂, ECG, theo dõi giấc ngủ, luyện tập đa dạng. Hỗ trợ GPS chính xác, chống nước WR50, pin 18 giờ, là lựa chọn lý tưởng cho phong cách sống năng động và hiện đại.',26,1,'1759673230894-AW_series9.png',1,1,1,3,'1759673230898-AW_series9.png'),(4,'AirPods Max SilverStarlight Aluminium',5490000,'AirPods Max Silver là tai nghe chụp tai cao cấp của Apple, mang đến trải nghiệm âm thanh sống động và đẳng cấp. Với thiết kế vỏ nhôm anodized (Aluminium) bền nhẹ, màu Silver/Starlight sang trọng, phần chụp tai bằng đệm mút nhớ êm ái cùng khung thép không gỉ phủ vải lưới thoáng khí, giúp đeo thoải mái suốt nhiều giờ.\r\n\r\nTai nghe tích hợp driver dynamic Apple thiết kế riêng, cho âm thanh Hi-Fi chi tiết, dải bass mạnh mẽ, mid trong trẻo và treble sắc nét. Công nghệ Adaptive EQ tự động điều chỉnh âm thanh theo từng người dùng, kết hợp cùng Active Noise Cancellation (ANC) loại bỏ tiếng ồn và chế độ Transparency cho phép nghe môi trường xung quanh tự nhiên.\r\n\r\nAirPods Max sử dụng chip Apple H1 trên mỗi bên tai, hỗ trợ Spatial Audio với head tracking tạo hiệu ứng âm thanh vòm 3D chân thực. Tính năng Digital Crown giúp điều chỉnh âm lượng, chuyển bài hát, nhận cuộc gọi dễ dàng.\r\n\r\nPin cho thời gian nghe nhạc lên đến 20 giờ với ANC hoặc Transparency, sạc nhanh chỉ 5 phút có ngay 1,5 giờ sử dụng. Đi kèm Smart Case tiết kiệm pin khi không dùng.','AirPods Max Silver mang thiết kế nhôm cao cấp, đệm tai êm ái và khung thép phủ vải thoáng khí, cho cảm giác sang trọng và thoải mái. Trang bị driver dynamic cho âm thanh Hi-Fi sống động, cùng Adaptive EQ, ANC, Transparency và Spatial Audio chân thực. Tích hợp chip Apple H1, điều khiển bằng Digital Crown, pin nghe đến 20 giờ, sạc nhanh 5 phút cho 1,5 giờ dùng, kèm Smart Case tiết kiệm pin.',1,3,'1759673217958-AirPost_sliver.png',1,1,1,4,'1759673217961-AirPost_sliver.png'),(5,'Samsung Galaxy Watch6 Classic 47mm Black',3690000,'Samsung Galaxy Watch6 Classic 47mm Black là chiếc smartwatch cao cấp với thiết kế viền xoay rotating bezel truyền thống sang trọng, khung thép không gỉ chắc chắn và mặt kính Sapphire Crystal chống trầy xước.\r\n\r\nMàn hình Super AMOLED 1.5 inch sắc nét, độ sáng cao, hỗ trợ Always-On Display cùng khả năng tùy chỉnh mặt đồng hồ đa dạng. Hiệu năng mạnh mẽ nhờ chip Exynos W930, RAM 2GB và bộ nhớ 16GB, chạy trên hệ điều hành Wear OS by Samsung tối ưu với Google và Galaxy Ecosystem.\r\n\r\nTích hợp nhiều cảm biến sức khỏe: đo nhịp tim, SpO₂, huyết áp, ECG, theo dõi giấc ngủ nâng cao, phân tích thành phần cơ thể (BIA). Hỗ trợ hơn 90 chế độ luyện tập thể thao, GPS chính xác và chống nước chuẩn 5ATM + IP68, phù hợp cả bơi lội lẫn vận động ngoài trời.\r\n\r\nPin dung lượng lớn, dùng thoải mái cả ngày, sạc nhanh tiện lợi. Kết nối dễ dàng với smartphone Android, hỗ trợ nhận thông báo, gọi điện, nghe nhạc, thanh toán không chạm qua Samsung Pay. Là lựa chọn lý tưởng cho người yêu công nghệ, thể thao và phong cách hiện đại.','Samsung Galaxy Watch6 Classic 47mm Black sở hữu thiết kế viền xoay sang trọng, khung thép bền chắc và kính Sapphire chống trầy. Màn hình Super AMOLED 1.5\" sắc nét với Always-On Display, chip Exynos W930 mạnh mẽ, RAM 2GB, bộ nhớ 16GB. Hỗ trợ đo nhịp tim, SpO₂, huyết áp, ECG, theo dõi giấc ngủ, hơn 90 chế độ luyện tập, GPS chính xác, chống nước 5ATM + IP68. Pin bền, sạc nhanh, kết nối mượt mà với hệ sinh thái Galaxy.',12,1,'1759673201457-SamSung.png',1,0,2,5,'1759673201466-SamSung.png'),(6,'Galaxy Z Fold5 Unlocked | 256GB | Phantom Black',17990000,'Samsung Galaxy Z Fold5 256GB Phantom Black là chiếc flagship màn hình gập cao cấp, mang thiết kế mỏng nhẹ hơn thế hệ trước nhưng vẫn bền bỉ với bản lề Flex Hinge chắc chắn và kính Gorilla Glass Victus 2.\r\n\r\nMáy sở hữu màn hình gập chính 7.6 inch Dynamic AMOLED 2X, tần số quét 120Hz siêu mượt, độ sáng đến 1750 nits, cùng màn hình phụ 6.2 inch AMOLED 120Hz, tối ưu cho đa nhiệm và giải trí.\r\n\r\nHiệu năng mạnh mẽ với chip Snapdragon 8 Gen 2 for Galaxy, RAM 12GB và bộ nhớ 256GB, xử lý mượt mọi tác vụ từ công việc đến chơi game. Hỗ trợ bút S Pen Fold Edition giúp ghi chú, vẽ và làm việc linh hoạt.\r\n\r\nCụm 3 camera sau: 50MP (OIS) + 12MP góc siêu rộng + 10MP tele 3x, hỗ trợ quay video 8K, cùng camera trong 4MP ẩn dưới màn hình và camera ngoài 10MP, đáp ứng tốt nhu cầu chụp ảnh, selfie và video call.\r\n\r\nPin 4400mAh dùng cả ngày, hỗ trợ sạc nhanh 25W, sạc không dây, sạc ngược cho thiết bị khác. Máy chạy One UI trên Android, tích hợp nhiều tính năng tối ưu cho màn hình gập, bảo mật vân tay cạnh bên và kết nối 5G tốc độ cao.','Samsung Galaxy Z Fold5 256GB Phantom Black sở hữu thiết kế gập mỏng nhẹ với bản lề Flex Hinge chắc chắn, màn hình chính 7.6\" Dynamic AMOLED 2X 120Hz siêu sáng và màn hình phụ 6.2\" tiện dụng. Trang bị chip Snapdragon 8 Gen 2 for Galaxy, RAM 12GB, bộ nhớ 256GB, hỗ trợ S Pen, camera sau 50MP + 12MP + 10MP, pin 4400mAh sạc nhanh 25W. Kết nối 5G, bảo mật vân tay, tối ưu đa nhiệm cho công việc và giải trí.',16,1,'1759673183797-GalaxyZ5.png',1,0,2,6,'1759673183801-GalaxyZ5.png'),(7,'Galaxy Buds FE Graphite Black',1990000,'Samsung Galaxy Buds FE Graphite là tai nghe true wireless nhỏ gọn, thiết kế hiện đại và vừa vặn, mang lại cảm giác đeo thoải mái suốt ngày dài.\r\n\r\nTrang bị Active Noise Cancelling (ANC) giúp loại bỏ tiếng ồn hiệu quả, đồng thời có Ambient Sound để nghe âm thanh môi trường khi cần. Âm thanh được tối ưu với driver chất lượng cao, mang đến bass mạnh mẽ, treble rõ nét và âm trường cân bằng.\r\n\r\nMicro kép cùng công nghệ chống ồn khi gọi, cho chất lượng đàm thoại rõ ràng ngay cả trong môi trường ồn ào.\r\n\r\nTai nghe hỗ trợ Bluetooth 5.2, kết nối mượt mà với thiết bị Galaxy và đồng bộ nhanh qua Samsung SmartThings. Thời lượng pin lên đến 6 giờ nghe nhạc liên tục (ANC bật) và tổng cộng đến 30 giờ khi dùng kèm hộp sạc.\r\n\r\nHỗ trợ thao tác cảm ứng thông minh, dễ dàng điều khiển nhạc, cuộc gọi. Thiết kế màu Graphite sang trọng, gọn nhẹ, dễ mang theo, phù hợp cho cả làm việc lẫn giải trí.','Samsung Galaxy Buds FE Graphite có thiết kế nhỏ gọn, ôm tai thoải mái, mang lại trải nghiệm âm thanh chất lượng với bass mạnh mẽ, treble rõ nét. Hỗ trợ Active Noise Cancelling loại bỏ tiếng ồn, Ambient Sound nghe môi trường tự nhiên. Micro kép chống ồn cho đàm thoại rõ ràng, pin đến 6 giờ (30 giờ kèm hộp sạc), kết nối Bluetooth 5.2 ổn định, thao tác cảm ứng tiện lợi.',30,1,'1759673148742-GalaxyFE.png',1,0,2,7,'1759673148746-GalaxyFE.png'),(8,'Apple iPad 9 10.2\" 64GB Wi-Fi Silver (MK2L3) 2021',3980000,'Apple iPad 9 (2021) 10.2 inch Wi-Fi 64GB Silver là chiếc máy tính bảng phổ biến của Apple, thiết kế mỏng nhẹ, viền nhôm sang trọng và màn hình Retina 10.2 inch sắc nét, hỗ trợ True Tone điều chỉnh màu sắc phù hợp môi trường.\r\n\r\nHiệu năng mạnh mẽ với chip A13 Bionic cho tốc độ xử lý nhanh, đáp ứng mượt mà từ học tập, làm việc văn phòng đến chơi game, giải trí. Dung lượng 64GB phù hợp nhu cầu lưu trữ cơ bản.\r\n\r\nCamera sau 8MP và camera trước 12MP Ultra Wide hỗ trợ Center Stage, giúp khung hình tự động điều chỉnh khi gọi video call. Hỗ trợ Apple Pencil (gen 1) và bàn phím Smart Keyboard, biến iPad thành công cụ học tập, sáng tạo và làm việc hiệu quả.\r\n\r\nChạy hệ điều hành iPadOS, tích hợp nhiều tính năng thông minh, đồng bộ mượt mà với hệ sinh thái Apple. Pin cho thời gian sử dụng lên đến 10 giờ, kết nối Wi-Fi ổn định, phù hợp cho nhu cầu học online, giải trí và làm việc di động.','Apple iPad 9 10.2\" 64GB Wi-Fi Silver (2021) sở hữu thiết kế mỏng nhẹ, màn hình Retina sắc nét hỗ trợ True Tone. Trang bị chip A13 Bionic mạnh mẽ, xử lý mượt mà học tập, làm việc và giải trí. Camera sau 8MP, camera trước 12MP Ultra Wide với Center Stage, hỗ trợ Apple Pencil (gen 1) và Smart Keyboard. Pin dùng đến 10 giờ, kết nối Wi-Fi ổn định, chạy iPadOS với nhiều tính năng thông minh.',5,1,'1759673136146-IPad9.png',1,0,1,8,'1759673136148-IPad9.png'),(9,'Apple iPhone 14 Pro 512GB Gold ',14370000,'iPhone 14 Pro 512GB Gold là flagship cao cấp của Apple với thiết kế khung thép không gỉ sáng bóng và mặt lưng kính cường lực sang trọng. Màu Gold nổi bật, tinh tế, phù hợp với người dùng yêu thích sự đẳng cấp.\r\n\r\nMáy trang bị màn hình Super Retina XDR OLED 6.1 inch, hỗ trợ ProMotion 120Hz, độ sáng tối đa 2000 nits ngoài trời, tích hợp công nghệ Always-On Display và Dynamic Island hiện đại.\r\n\r\nHiệu năng mạnh mẽ đến từ chip A16 Bionic, tối ưu tốc độ xử lý và tiết kiệm năng lượng. Bộ nhớ trong 512GB rộng rãi, thoải mái lưu trữ hình ảnh, video, ứng dụng và dữ liệu nặng.\r\n\r\nCụm camera chuyên nghiệp: chính 48MP, góc siêu rộng 12MP, tele 12MP hỗ trợ zoom quang học 3x, quay video ProRes, Cinematic 4K, cùng camera trước 12MP hỗ trợ Face ID bảo mật an toàn.\r\n\r\nDung lượng pin đủ dùng cả ngày, hỗ trợ sạc nhanh, MagSafe và sạc không dây Qi. Máy chạy iOS 16, đồng bộ mượt mà trong hệ sinh thái Apple, hỗ trợ 5G tốc độ cao, mang lại trải nghiệm toàn diện cho cả công việc lẫn giải trí.','iPhone 14 Pro 512GB Gold sở hữu thiết kế sang trọng với khung thép không gỉ và mặt lưng kính. Màn hình 6.1\" Super Retina XDR OLED, hỗ trợ Dynamic Island, Always-On và ProMotion 120Hz. Hiệu năng mạnh mẽ nhờ chip A16 Bionic, bộ nhớ 512GB thoải mái lưu trữ. Camera chính 48MP chuyên nghiệp, quay 4K Cinematic/ProRes, Face ID an toàn, pin cả ngày, hỗ trợ sạc nhanh, MagSafe và 5G tốc độ cao.',23,1,'1759673094436-Iphone_14 pro_Gold.png',0,1,1,9,'1759673094439-Iphone_14 pro_Gold.png'),(10,'Apple iPhone 14 Pro 1TB Silver',14990000,'iPhone 14 Pro 1TB Silver là phiên bản cao cấp nhất của dòng iPhone 14 Pro, nổi bật với thiết kế khung thép không gỉ sáng bóng và mặt lưng kính cường lực sang trọng màu Silver tinh tế.\r\n\r\nMáy trang bị màn hình 6.1 inch Super Retina XDR OLED, hỗ trợ Dynamic Island, Always-On Display và công nghệ ProMotion 120Hz, cho trải nghiệm hiển thị mượt mà và sắc nét, độ sáng tối đa lên đến 2000 nits ngoài trời.\r\n\r\nHiệu năng vượt trội với chip A16 Bionic, tối ưu hóa tốc độ xử lý và tiết kiệm năng lượng. Bộ nhớ 1TB siêu lớn, thoải mái lưu trữ ảnh, video 4K ProRes, ứng dụng và dữ liệu công việc.\r\n\r\nHệ thống 3 camera sau chuyên nghiệp: chính 48MP, góc siêu rộng 12MP, tele 12MP zoom quang học 3x, quay video 4K Cinematic, ProRes, Action Mode ổn định. Camera trước 12MP hỗ trợ Face ID và chụp selfie chất lượng cao.\r\n\r\nPin bền bỉ sử dụng cả ngày, hỗ trợ sạc nhanh 20W, MagSafe và sạc không dây Qi. Máy chạy iOS 16, đồng bộ hoàn hảo với hệ sinh thái Apple, kết nối 5G tốc độ cao, phù hợp cả công việc lẫn giải trí chuyên nghiệp.','iPhone 14 Pro 1TB Silver sở hữu thiết kế khung thép không gỉ và mặt lưng kính sang trọng. Màn hình 6.1\" Super Retina XDR OLED với Dynamic Island, Always-On và ProMotion 120Hz siêu mượt. Chip A16 Bionic mạnh mẽ, bộ nhớ 1TB lưu trữ thoải mái. Camera chính 48MP chuyên nghiệp, quay 4K ProRes/Cinematic, Face ID bảo mật, pin bền bỉ cả ngày, hỗ trợ sạc nhanh, MagSafe và 5G tốc độ cao.',10,1,'1759673083030-Iphone_14pro_1TB_Gold.png',0,1,1,10,'1759673083033-Iphone_14pro_1TB_Gold.png'),(11,'Apple iPhone 11 128GB White',5100000,'Apple iPhone 11 128GB White sở hữu thiết kế tinh tế với mặt kính cường lực và khung nhôm bền bỉ, mang đến vẻ ngoài hiện đại và sang trọng. Máy trang bị màn hình Liquid Retina HD 6.1 inch cho màu sắc sống động, hỗ trợ True Tone và Haptic Touch. Bộ vi xử lý A13 Bionic mạnh mẽ đảm bảo hiệu năng mượt mà, xử lý tốt các tác vụ đa nhiệm và chơi game đồ họa cao. Hệ thống camera kép 12MP (góc rộng và góc siêu rộng) cho phép chụp ảnh sắc nét, hỗ trợ chế độ Night Mode, quay video 4K chất lượng cao. Camera trước 12MP với tính năng Smart HDR và quay video slo-mo, mang đến trải nghiệm selfie tuyệt vời. Dung lượng 128GB cung cấp không gian lưu trữ thoải mái. Pin tối ưu giúp sử dụng cả ngày, hỗ trợ sạc nhanh và sạc không dây. iPhone 11 chạy iOS, mang đến trải nghiệm mượt, an toàn cùng hệ sinh thái Apple phong phú. Phiên bản màu trắng tinh khôi phù hợp với người dùng yêu thích phong cách trẻ trung, thanh lịch.','Apple iPhone 11 128GB White nổi bật với thiết kế kính và nhôm sang trọng, màn hình Liquid Retina 6.1\" sống động. Chip A13 Bionic mạnh mẽ cho hiệu năng mượt mà, camera kép 12MP chụp đêm ấn tượng, quay 4K chất lượng cao. Camera trước 12MP hỗ trợ slo-mo và Smart HDR. Bộ nhớ 128GB thoải mái lưu trữ, pin bền bỉ cả ngày, hỗ trợ sạc nhanh và không dây. Phiên bản màu trắng mang phong cách trẻ trung, tinh tế.',33,1,'1759673068759-IPhone_11_128G.png',0,0,1,11,'1759673068761-IPhone_11_128G.png'),(12,'Apple iPhone 13 mini 128GB Pink',8500000,'Apple iPhone 13 mini 128GB Pink là lựa chọn hoàn hảo cho những ai yêu thích smartphone nhỏ gọn nhưng vẫn mạnh mẽ. Máy sở hữu thiết kế viền phẳng hiện đại, khung nhôm chắc chắn và mặt lưng kính hồng thanh lịch. Màn hình Super Retina XDR OLED 5.4 inch mang đến chất lượng hiển thị sắc nét, màu sắc sống động. Bộ vi xử lý A15 Bionic mạnh mẽ, tối ưu hóa hiệu năng và tiết kiệm pin, cho phép bạn thoải mái xử lý đa nhiệm và chơi game mượt mà. Camera kép 12MP với cảm biến lớn hơn, hỗ trợ chế độ Night Mode, Deep Fusion và quay video 4K Dolby Vision HDR, giúp ghi lại hình ảnh và video sống động trong mọi điều kiện ánh sáng. Camera trước 12MP hỗ trợ Smart HDR 4, Photographic Styles và quay video 4K, mang đến trải nghiệm selfie ấn tượng. Bộ nhớ 128GB phù hợp cho nhu cầu lưu trữ ảnh, video và ứng dụng. Pin cải tiến cho thời lượng sử dụng cả ngày, hỗ trợ sạc nhanh và sạc không dây MagSafe. iPhone 13 mini Pink là sự kết hợp giữa thời trang và công nghệ, lý tưởng cho người dùng yêu thích thiết kế nhỏ gọn nhưng không muốn đánh đổi hiệu năng.','Apple iPhone 13 mini 128GB Pink sở hữu thiết kế nhỏ gọn, sang trọng với màn hình Super Retina XDR 5.4\" sắc nét. Chip A15 Bionic mạnh mẽ, camera kép 12MP hỗ trợ Night Mode, quay video 4K Dolby Vision HDR. Camera trước 12MP cho selfie chất lượng cao. Bộ nhớ 128GB đáp ứng tốt nhu cầu lưu trữ, pin dùng cả ngày, hỗ trợ sạc nhanh và MagSafe. Phiên bản màu hồng mang đến vẻ ngoài trẻ trung, tinh tế.',20,1,'1759673057770-Iphone13miniPink.png',0,0,1,13,'1759673057773-Iphone13miniPink.png'),(13,'Apple iPhone 14 Pro 256GB Space Black',13990000,'Apple iPhone 14 Pro 256GB Space Black là siêu phẩm cao cấp với thiết kế khung thép không gỉ bền bỉ, mặt lưng kính sang trọng phủ lớp màu đen huyền bí. Máy sở hữu màn hình Super Retina XDR 6.1 inch với tần số quét ProMotion 120Hz, hỗ trợ Always-On Display, HDR10 và Dolby Vision, mang đến trải nghiệm hiển thị mượt mà, sống động. Dynamic Island thay thế phần tai thỏ truyền thống, vừa hiện đại vừa trực quan. Sức mạnh từ chip A16 Bionic cho hiệu năng vượt trội, tiết kiệm pin, xử lý mượt mà mọi tác vụ từ làm việc đến chơi game đồ họa cao. Camera chính 48MP kết hợp cùng hệ thống camera chuyên nghiệp cho khả năng chụp ảnh chi tiết, hỗ trợ ProRAW, quay video ProRes và Cinematic Mode 4K. Camera trước 12MP với Photonic Engine và Autofocus mang lại chất lượng selfie tự nhiên, sắc nét. Bộ nhớ 256GB đáp ứng nhu cầu lưu trữ thoải mái cho ảnh, video và ứng dụng nặng. Pin tối ưu dùng cả ngày, hỗ trợ sạc nhanh và MagSafe. iPhone 14 Pro 256GB Space Black là lựa chọn hoàn hảo cho người dùng yêu thích sự sang trọng, hiệu năng mạnh mẽ và nhiếp ảnh chuyên nghiệp.','Apple iPhone 14 Pro 256GB Space Black nổi bật với thiết kế thép không gỉ sang trọng, màn hình Super Retina XDR 6.1\" ProMotion 120Hz và Dynamic Island hiện đại. Chip A16 Bionic mạnh mẽ, camera chính 48MP hỗ trợ ProRAW, quay ProRes và Cinematic Mode 4K. Bộ nhớ 256GB thoải mái lưu trữ, pin dùng cả ngày, sạc nhanh và MagSafe. Phiên bản Space Black mang đến vẻ đẹp huyền bí, đẳng cấp.',4,1,'1759673047215-Iphone14 pro_SpaceBlack.png',0,0,1,14,'1759673047219-Iphone14 pro_SpaceBlack.png');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `body` text NOT NULL,
  `is_approved` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `body`, `is_approved`, `created_at`) VALUES (1,1,3,'đẹp ',1,'2025-10-09 16:46:39'),(2,1,3,'đẹp ',1,'2025-10-09 16:47:05'),(3,1,3,'đẹp',1,'2025-10-09 16:47:10'),(4,1,3,'đẹp',1,'2025-10-09 16:47:14'),(5,1,3,'đẹp',1,'2025-10-09 16:47:19'),(6,1,3,'đẹp',1,'2025-10-09 16:47:23'),(7,1,3,'đẹp',1,'2025-10-09 16:47:27'),(8,2,3,'đẹp',1,'2025-10-19 15:01:33'),(9,1,4,'hi nhóm 10',1,'2025-11-13 21:45:38'),(10,6,3,'Helllo',1,'2025-12-26 08:53:04');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` enum('USER','ADMIN','STAFF') DEFAULT 'USER',
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` (`id`, `name`, `description`) VALUES (1,'ADMIN','Quản trị hệ thống, có toàn quyền'),(2,'STAFF','Quản lý đơn hàng'),(3,'USER','Người dùng thông thường');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specifications`
--

DROP TABLE IF EXISTS `specifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `color` varchar(255) DEFAULT NULL,
  `pin` int DEFAULT '3000',
  `screen_type` varchar(100) NOT NULL,
  `screen_size` float DEFAULT '6.1',
  `protection` varchar(4) DEFAULT NULL,
  `rom` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specifications`
--

LOCK TABLES `specifications` WRITE;
/*!40000 ALTER TABLE `specifications` DISABLE KEYS */;
INSERT INTO `specifications` (`id`, `color`, `pin`, `screen_type`, `screen_size`, `protection`, `rom`) VALUES (1,'Deep Purple',3000,'AMOLED',6.1,'IP68',128),(2,'Blackmagic',3000,'LED-backlit IPS LCD',6.7,'IP68',1000),(3,'Starlight',3000,'IPS Quantum',5.8,'IP68',64),(4,'Silver',3000,'ClearBlack',5.8,'IP67',64),(5,'Black',3000,'AMOLED',5.8,'IP68',64),(6,'Phantom Black',5000,'AMOLED',6.1,'IP68',256),(7,'Black',4000,'AMOLED',5.8,'IP68',64),(8,'Silver',5000,'Super LCD',6.7,'IP67',64),(9,'Gold',3000,'AMOLED',6.1,'IP68',256),(10,'Silver',4000,'AMOLED',6.1,'IP68',1000),(11,'White',4000,'AMOLED',6.1,'IP67',128),(12,'White',3000,'AMOLED',6.7,'IP68',1000),(13,'Pink',5000,'Super LCD',6.7,'IP67',128),(14,'Space Black',3000,'AMOLED',6.1,'IP67',256);
/*!40000 ALTER TABLE `specifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spring_session`
--

DROP TABLE IF EXISTS `spring_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spring_session` (
  `PRIMARY_ID` char(36) NOT NULL,
  `SESSION_ID` char(36) NOT NULL,
  `CREATION_TIME` bigint NOT NULL,
  `LAST_ACCESS_TIME` bigint NOT NULL,
  `MAX_INACTIVE_INTERVAL` int NOT NULL,
  `EXPIRY_TIME` bigint NOT NULL,
  `PRINCIPAL_NAME` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`PRIMARY_ID`),
  UNIQUE KEY `SPRING_SESSION_IX1` (`SESSION_ID`),
  KEY `SPRING_SESSION_IX2` (`EXPIRY_TIME`),
  KEY `SPRING_SESSION_IX3` (`PRINCIPAL_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spring_session`
--

LOCK TABLES `spring_session` WRITE;
/*!40000 ALTER TABLE `spring_session` DISABLE KEYS */;
INSERT INTO `spring_session` (`PRIMARY_ID`, `SESSION_ID`, `CREATION_TIME`, `LAST_ACCESS_TIME`, `MAX_INACTIVE_INTERVAL`, `EXPIRY_TIME`, `PRINCIPAL_NAME`) VALUES ('01dc4aaf-4e8d-49e0-abf4-c2c2562154bc','cb6f4640-d4e0-4d92-8b4c-28a8066fa8ca',1772376834711,1772376834711,1800,1772378634711,NULL),('1e863e85-5528-4eef-8554-3b45a4cb01b7','e7c64c0b-dd7f-4ff7-9978-7abc73a83af2',1772376831464,1772376831464,1800,1772378631464,NULL),('1f96c6c6-f167-41c6-88fa-42086c3aa597','cc189e94-bec9-490f-b85c-2f8dffd41b8e',1772376917728,1772376917728,1800,1772378717728,NULL),('22105e6c-d793-46c0-a84e-7ba6843622de','b72b8c95-dc73-4e20-9083-a0c5b8a9e0b9',1772377154710,1772377154710,1800,1772378954710,NULL),('25687186-f4b2-46f5-8852-6fff8e009bca','e27c144a-b200-4924-a3fa-d95cc94a136a',1772376856885,1772376856885,1800,1772378656885,NULL),('2af9ac32-640c-43db-a6ab-dcae69e12139','3f5a4a23-e41f-4f66-9fb3-3d1317d93c91',1772376802282,1772377144171,604800,1772981944171,'Mikz'),('2da8cd46-97cf-4c8e-a45c-44b4e7a4f9c2','16a63dba-fac9-4d62-a63a-846813ef4af1',1772376831460,1772376831460,1800,1772378631460,NULL),('31261dd3-6892-46a4-9d22-e5523fbba87d','f55f85e4-3a74-4a77-899b-d4ee92e090b3',1772377154708,1772377154708,1800,1772378954708,NULL),('470508fe-922a-4d97-b5c8-d1d7164bd992','67a4f5b9-455f-463d-9e0e-9377d414becf',1772376917720,1772376917720,1800,1772378717720,NULL),('5589c0a6-fe5d-4261-a459-e44fdf26f950','b3487e10-8052-4fc0-920a-038dab551671',1772376834712,1772376834712,1800,1772378634712,NULL),('93df21b3-0721-4409-b92c-0019bf2ff3ee','67bbcf6b-fc42-49ee-aa5f-a939b2bf389a',1772376917718,1772376917718,1800,1772378717718,NULL),('9a0c6989-2be4-462d-8210-d7c507fcbc63','9ffa1e74-734b-4633-b70c-349fc5f36ab5',1772377154711,1772377154711,1800,1772378954711,NULL),('a4083714-eb73-4e53-8990-ee36a8ffce92','cc8a2e0f-7037-4768-97ce-d5cd1011e343',1772376834718,1772376834718,1800,1772378634718,NULL),('b413946e-b670-408f-9be2-a8aa001dfb96','27e7cdef-a590-4ba6-a577-b50dfb9570bf',1772377154710,1772377154710,1800,1772378954710,NULL),('b4ec6678-194b-46ba-8ea2-8eb961fc8553','e9aae8bc-80b6-4af1-9013-08c8868e8b3a',1772376856885,1772376856885,1800,1772378656885,NULL),('edf6bfa9-74fc-4774-ad5a-d921a5661c84','46fc477a-62a2-436a-a307-ccaa3c25f86d',1772376856885,1772376856885,1800,1772378656885,NULL),('f7fce510-f195-44f7-b0da-2e2d4513b5c4','20bff0a6-336a-4c6c-ac67-f3287ff3b5f4',1772376831467,1772376831467,1800,1772378631467,NULL);
/*!40000 ALTER TABLE `spring_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spring_session_attributes`
--

DROP TABLE IF EXISTS `spring_session_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spring_session_attributes` (
  `SESSION_PRIMARY_ID` char(36) NOT NULL,
  `ATTRIBUTE_NAME` varchar(200) NOT NULL,
  `ATTRIBUTE_BYTES` blob NOT NULL,
  PRIMARY KEY (`SESSION_PRIMARY_ID`,`ATTRIBUTE_NAME`),
  CONSTRAINT `SPRING_SESSION_ATTRIBUTES_FK` FOREIGN KEY (`SESSION_PRIMARY_ID`) REFERENCES `spring_session` (`PRIMARY_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spring_session_attributes`
--

LOCK TABLES `spring_session_attributes` WRITE;
/*!40000 ALTER TABLE `spring_session_attributes` DISABLE KEYS */;
INSERT INTO `spring_session_attributes` (`SESSION_PRIMARY_ID`, `ATTRIBUTE_NAME`, `ATTRIBUTE_BYTES`) VALUES ('2af9ac32-640c-43db-a6ab-dcae69e12139','address',_binary '�\�\0sr\0java.lang.Integer⠤���8\0I\0valuexr\0java.lang.Number����\��\0\0xp\0\0\0'),('2af9ac32-640c-43db-a6ab-dcae69e12139','avatar',_binary '�\�\0t\01759672857680-mikz.png'),('2af9ac32-640c-43db-a6ab-dcae69e12139','checkoutSource',_binary '�\�\0t\0detail'),('2af9ac32-640c-43db-a6ab-dcae69e12139','email',_binary '�\�\0t\0minh@gmail.com'),('2af9ac32-640c-43db-a6ab-dcae69e12139','fullName',_binary '�\�\0t\0Đặng Nhật Minh'),('2af9ac32-640c-43db-a6ab-dcae69e12139','id',_binary '�\�\0sr\0java.lang.Integer⠤���8\0I\0valuexr\0java.lang.Number����\��\0\0xp\0\0\0'),('2af9ac32-640c-43db-a6ab-dcae69e12139','jakarta.servlet.jsp.jstl.fmt.locale.session',_binary '�\�\0sr\0java.util.Locale~�`�0�\�\0I\0hashcodeL\0countryt\0Ljava/lang/String;L\0\nextensionsq\0~\0L\0languageq\0~\0L\0scriptq\0~\0L\0variantq\0~\0xp����t\0USt\0\0t\0enq\0~\0q\0~\0x'),('2af9ac32-640c-43db-a6ab-dcae69e12139','jakarta.servlet.jsp.jstl.fmt.request.charset',_binary '�\�\0t\0UTF-8'),('2af9ac32-640c-43db-a6ab-dcae69e12139','orderId',_binary '�\�\0sr\0java.lang.Integer⠤���8\0I\0valuexr\0java.lang.Number����\��\0\0xp\0\0\0'),('2af9ac32-640c-43db-a6ab-dcae69e12139','org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository.CSRF_TOKEN',_binary '�\�\0sr\06org.springframework.security.web.csrf.DefaultCsrfTokenZ\�\�/��\�\0L\0\nheaderNamet\0Ljava/lang/String;L\0\rparameterNameq\0~\0L\0tokenq\0~\0xpt\0X-CSRF-TOKENt\0_csrft\0$c343586a-aa57-4ec0-b8fe-292c407321f8'),('2af9ac32-640c-43db-a6ab-dcae69e12139','productDetailId',_binary '�\�\0sr\0java.lang.Integer⠤���8\0I\0valuexr\0java.lang.Number����\��\0\0xp\0\0\0'),('2af9ac32-640c-43db-a6ab-dcae69e12139','productDetailQuanity',_binary '�\�\0sr\0java.lang.Integer⠤���8\0I\0valuexr\0java.lang.Number����\��\0\0xp\0\0\0'),('2af9ac32-640c-43db-a6ab-dcae69e12139','role',_binary '�\�\0t\0ADMIN'),('2af9ac32-640c-43db-a6ab-dcae69e12139','SPRING_SECURITY_CONTEXT',_binary '�\�\0sr\0=org.springframework.security.core.context.SecurityContextImpl\0\0\0\0\0\0l\0L\0authenticationt\02Lorg/springframework/security/core/Authentication;xpsr\0Oorg.springframework.security.authentication.UsernamePasswordAuthenticationToken\0\0\0\0\0\0l\0L\0credentialst\0Ljava/lang/Object;L\0	principalq\0~\0xr\0Gorg.springframework.security.authentication.AbstractAuthenticationTokenӪ(~nGd\0Z\0\rauthenticatedL\0authoritiest\0Ljava/util/Collection;L\0detailsq\0~\0xpsr\0&java.util.Collections$UnmodifiableList�%1�\�\0L\0listt\0Ljava/util/List;xr\0,java.util.Collections$UnmodifiableCollectionB\0�\�^�\0L\0cq\0~\0xpsr\0java.util.ArrayListx�\��\�a�\0I\0sizexp\0\0\0w\0\0\0sr\0Borg.springframework.security.core.authority.SimpleGrantedAuthority\0\0\0\0\0\0l\0L\0rolet\0Ljava/lang/String;xpt\0\nROLE_ADMINxq\0~\0\rsr\0Horg.springframework.security.web.authentication.WebAuthenticationDetails\0\0\0\0\0\0l\0L\0\rremoteAddressq\0~\0L\0	sessionIdq\0~\0xpt\00:0:0:0:0:0:0:1t\0$5b9cab44-8994-4ccb-adeb-4a5122aead2cpsr\02org.springframework.security.core.userdetails.User\0\0\0\0\0\0l\0Z\0accountNonExpiredZ\0accountNonLockedZ\0credentialsNonExpiredZ\0enabledL\0authoritiest\0Ljava/util/Set;L\0passwordq\0~\0L\0usernameq\0~\0xpsr\0%java.util.Collections$UnmodifiableSet��я��U\0\0xq\0~\0\nsr\0java.util.TreeSetݘP��\�[\0\0xpsr\0Forg.springframework.security.core.userdetails.User$AuthorityComparator\0\0\0\0\0\0l\0\0xpw\0\0\0q\0~\0xpt\0Mikz'),('2af9ac32-640c-43db-a6ab-dcae69e12139','SPRING_SECURITY_SAVED_REQUEST',_binary '�\�\0sr\0Aorg.springframework.security.web.savedrequest.DefaultSavedRequest\0\0\0\0\0\0l\0I\0\nserverPortL\0contextPatht\0Ljava/lang/String;L\0cookiest\0Ljava/util/ArrayList;L\0headerst\0Ljava/util/Map;L\0localesq\0~\0L\0matchingRequestParameterNameq\0~\0L\0methodq\0~\0L\0\nparametersq\0~\0L\0pathInfoq\0~\0L\0queryStringq\0~\0L\0\nrequestURIq\0~\0L\0\nrequestURLq\0~\0L\0schemeq\0~\0L\0\nserverNameq\0~\0L\0servletPathq\0~\0xp\0\0�t\0\0sr\0java.util.ArrayListx�\��\�a�\0I\0sizexp\0\0\0w\0\0\0sr\09org.springframework.security.web.savedrequest.SavedCookie\0\0\0\0\0\0l\0I\0maxAgeZ\0secureI\0versionL\0commentq\0~\0L\0domainq\0~\0L\0nameq\0~\0L\0pathq\0~\0L\0valueq\0~\0xp����\0\0\0\0\0ppt\0SESSIONpt\00NWI5Y2FiNDQtODk5NC00Y2NiLWFkZWItNGE1MTIyYWVhZDJjxsr\0java.util.TreeMap��>-%j\�\0L\0\ncomparatort\0Ljava/util/Comparator;xpsr\0*java.lang.String$CaseInsensitiveComparatorw\\}\\P\�\�\0\0xpw\0\0\0t\0acceptsq\0~\0\0\0\0w\0\0\0t\0*/*xt\0accept-encodingsq\0~\0\0\0\0w\0\0\0t\0gzip, deflate, br, zstdxt\0accept-languagesq\0~\0\0\0\0w\0\0\0t\08vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5xt\0\nconnectionsq\0~\0\0\0\0w\0\0\0t\0\nkeep-alivext\0cookiesq\0~\0\0\0\0w\0\0\0t\08SESSION=NWI5Y2FiNDQtODk5NC00Y2NiLWFkZWItNGE1MTIyYWVhZDJjxt\0hostsq\0~\0\0\0\0w\0\0\0t\0localhost:8080xt\0referersq\0~\0\0\0\0w\0\0\0t\0\"http://localhost:8080/client/homesxt\0	sec-ch-uasq\0~\0\0\0\0w\0\0\0t\0A\"Not:A-Brand\";v=\"99\", \"Google Chrome\";v=\"145\", \"Chromium\";v=\"145\"xt\0sec-ch-ua-mobilesq\0~\0\0\0\0w\0\0\0t\0?0xt\0sec-ch-ua-platformsq\0~\0\0\0\0w\0\0\0t\0	\"Windows\"xt\0sec-fetch-destsq\0~\0\0\0\0w\0\0\0t\0scriptxt\0sec-fetch-modesq\0~\0\0\0\0w\0\0\0t\0no-corsxt\0sec-fetch-sitesq\0~\0\0\0\0w\0\0\0t\0same-originxt\0\nuser-agentsq\0~\0\0\0\0w\0\0\0t\0oMozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36xxsq\0~\0\0\0\0w\0\0\0sr\0java.util.Locale~�`�0�\�\0I\0hashcodeL\0countryq\0~\0L\0\nextensionsq\0~\0L\0languageq\0~\0L\0scriptq\0~\0L\0variantq\0~\0xp����t\0VNq\0~\0t\0viq\0~\0q\0~\0xsq\0~\0<����q\0~\0q\0~\0q\0~\0?q\0~\0q\0~\0xsq\0~\0<����t\0FRq\0~\0t\0frq\0~\0q\0~\0xsq\0~\0<����q\0~\0q\0~\0q\0~\0Cq\0~\0q\0~\0xsq\0~\0<����t\0USq\0~\0t\0enq\0~\0q\0~\0xsq\0~\0<����q\0~\0q\0~\0q\0~\0Gq\0~\0q\0~\0xxt\0continuet\0GETsq\0~\0pw\0\0\0t\0cur\0[Ljava.lang.String;�\�V\�\�{G\0\0xp\0\0\0t\0_jp.aijdnutxpt\0\rc=_jp.aijdnutt\0/chat/128/udeddsml/jsonpt\0-http://localhost:8080/chat/128/udeddsml/jsonpt\0httpt\0	localhostt\0/chat/128/udeddsml/jsonp'),('2af9ac32-640c-43db-a6ab-dcae69e12139','sum',_binary '�\�\0sr\0java.lang.Integer⠤���8\0I\0valuexr\0java.lang.Number����\��\0\0xp\0\0\0\0'),('2af9ac32-640c-43db-a6ab-dcae69e12139','total',_binary '�\�\0sr\0java.lang.Double��\�J)k�\0D\0valuexr\0java.lang.Number����\��\0\0xpAU\r�@\0\0\0');
/*!40000 ALTER TABLE `spring_session_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `full_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `address` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `avatar` varchar(1000) DEFAULT NULL,
  `provider` varchar(100) DEFAULT NULL,
  `role_id` int NOT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `phone` (`phone`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `username`, `email`, `password`, `full_name`, `address`, `phone`, `avatar`, `provider`, `role_id`, `created_date`) VALUES (3,NULL,'minhluky0@gmail.com',NULL,'Minh Đặng Nhật',NULL,NULL,'default-google.png','GOOGLE',3,'2025-10-05 20:57:15'),(4,'Mikz','minh@gmail.com','$2a$10$h4vrtSH8wWPhwx/Qo0WXRuY08FGr8.RhZKMjaEus6SQoCTL3qQ06O','Đặng Nhật Minh','Nam Định','0385096604','1759672857680-mikz.png','LOCAL',1,'2025-10-05 21:00:58'),(7,'nhatminh','minhdang123@gmail.com','$2a$10$br8FToC9MLJMsI52ojn1g.MbdRobG5bw84h4I9QtuNiB8B6GK.IR6','Đặng Minh','Nam Định','0552139990',NULL,'LOCAL',3,'2025-10-06 21:07:56'),(8,NULL,'Minhkz@github.com',NULL,'Minhkz',NULL,NULL,'default-github.png','GITHUB',3,'2025-10-06 21:52:09'),(9,'staff','vanhluky@gmail.com','$2a$10$RcS0jiZaeGmpumoPuAE08ukW3qIRBcV/IORnDMjJygTNYzQTyU4hO','staff','Xuân Phương','0948235654','1759931538896-mikz.png','LOCAL',2,'2025-10-08 20:52:19');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist_items`
--

DROP TABLE IF EXISTS `wishlist_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist_items` (
  `wishlist_id` int NOT NULL,
  `product_id` int NOT NULL,
  `added_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`wishlist_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `wishlist_items_ibfk_1` FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wishlist_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist_items`
--

LOCK TABLES `wishlist_items` WRITE;
/*!40000 ALTER TABLE `wishlist_items` DISABLE KEYS */;
INSERT INTO `wishlist_items` (`wishlist_id`, `product_id`, `added_at`) VALUES (1,1,'2025-10-09 18:23:17'),(1,2,'2025-10-09 18:23:19'),(1,4,'2026-03-01 21:56:55'),(1,7,'2026-03-01 21:56:58'),(1,12,'2025-11-13 21:46:05'),(1,13,'2025-11-13 21:46:03'),(2,1,'2025-10-08 21:31:25'),(2,7,'2025-10-10 18:47:49'),(3,1,'2025-12-26 08:58:00'),(3,2,'2025-10-09 16:46:20'),(3,3,'2025-11-08 16:48:10'),(3,4,'2025-11-08 16:48:18');
/*!40000 ALTER TABLE `wishlist_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
INSERT INTO `wishlists` (`id`, `user_id`) VALUES (3,3),(1,4),(2,9);
/*!40000 ALTER TABLE `wishlists` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-18 20:42:27
