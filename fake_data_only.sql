USE laptopshop;

INSERT INTO `users` (`id`,
               `username`, `password`, `email`, `full_name`, `address`, `phone`, `avatar`, `role_id`)
VALUES (1,'Mikzzz1','$2a$10$qOdTgskl8AVbOl5pB41/Vuv06sA6IzY7mjV0K2irHpnQCJ3ciR2BK','minhluky6@gmail.com','Nhật Minh','Hà Nội','0914762528',NULL,2),
       (2,'Mikz','$2a$10$Y3Okrz697jQl8jlHjmTxLO1A2hYf7GUAKnPjVGyWFvuCt3EVSuSzm','minhluky1@gmail.com','Đặng Nhật Minh','Nam Định','0385096603','nhom6/users/2/avatar_1774796481333',1),
       (3,'Mikzzz2','$2a$10$2xIdVK6uKlmUE35Ac4Zx7uZkmjDiONMeVHwO.PRK8/k47fh3ebo7e','minhluky9@gmail.com','Nhật Minh','Hà Nội','0914762528',NULL,2),
       (4,'Vanh','$2a$10$djmpkLmYe65tAjJpIF.6Z.L7r/vTg5/FPp0i0vcpCDH2C6BdlGcMK','Vanhluky@gmail.com','Đặng Nhật Minh','Nam Hồng','1234567892',NULL,2),
       (5,'VanhDz','$2a$10$zqVMjwpxpwN7IgS/hh9Jzu68n23.0CRKKKUnSodbjp8qXuHkuu3lW','minhluky10@gmail.com','Đặng Việt Anh','Nam Định','0914762528',NULL,2),
       (6,'caocao','$2a$10$6DmTlC4t4dwRrXS8tgpmP.Qu4ad3lPVEgzy4KC4xFtmPMPXF7ClRW','caobanh123456@gmail.com','Nguyễn Cao','Hà Nội','0978917563',NULL,2),
       (7,'user','$2a$10$0l/jyPEpVnN4IGFFldAPzuetJ8QSRdJfa8OEm5P1u/IfMUSj/f2Pa','user@gmail.com','Minh Đặng Nhật','Xuân Phương','0385096604',NULL,2);

INSERT INTO `carts` (`id`, `user_id`)
VALUES (1,1),
       (2,2);
INSERT INTO `filters` (`id`, `name`, `type`)
VALUES (3,'Custom Build','type'),
       (4,'Laptop','type'),
       (5,'Desktop','type'),
       (6,'Monitor','type'),
       (7,'MSI','brand'),
       (8,'Intel Core i5','processor'),
       (9,'512GB','storage'),
       (10,'IPS','panel'),
       (11,'VA','panel'),
       (12,'QD - OLED','panel'),
       (13,'Intel Core i7','processor'),
       (14,'1TB','storage');

INSERT INTO `products` (`id`, `name`, `des`, `price`, `quantity`, `sold`, `view`, `avatar`)
VALUES (5,'Laptop MSI Modern 15 F13MG-667VN','Laptop MSI Modern 15 F13MG-667VN - Core i5-1334U - 16GB - 512GB - 15.6\" FHD IPS - Bảo hành 24 tháng',19789000.00,8,0,0,'nhom6/products/5/d76bbf3e-b2f3-498e-a2aa-9afcc17dbb6d'),
       (6,'Màn Hình MSI MAG 255F','Màn Hình MSI MAG 255F X24 25 Inch 240Hz Rapid IPS Full HD 0.5ms Chuyên Game FPS - Hàng Chính Hãng',3190000.00,8,0,0,'nhom6/products/6/aab0ef33-a9bd-4db7-a016-fa0d096b9df4'),
       (7,'Màn Hình - Monitor Gaming MSI MPG 341CQPX','Màn Hình - Monitor Gaming MSI MPG 341CQPX QD-OLED 34 inch UWQHD 240Hz 0.03ms - Bảo hành 36 tháng',21490000.00,12,0,0,'nhom6/products/7/c9ec490e-227f-4a1e-8a0e-032ca480aac2'),
       (8,'Laptop MSI GAMING KATANA 15 B13VFK-676','Laptop MSI GAMING KATANA 15 B13VFK-676(VN/I7/13620H/16GB/1TB SSD/RTX4060 8GB/15.6FHD144HZ/WIN11/ĐEN)',29229000.00,9,0,0,'nhom6/products/8/93ee1e4e-bc32-4994-a2ad-220e4e39f8a2'),
       (9,'(XUEPC039-G) Bộ Máy Tính PC Gaming','(XUEPC039-G) Bộ Máy Tính PC Gaming Intel Core I5-14600KF VGA RTX 5060Ti 16GB | Chơi Game, Livestream, Đồ Họa | RAM 16GB',37223000.00,2,0,0,'nhom6/products/9/fbabf998-cafe-43db-94b1-c22830788bd9'),
       (10,'Màn Hình MSI G275L E14','Màn Hình MSI G275L E14 (27/FHD/144hz/IPS) - Chính Hãng - Bảo Hành 24T',2647000.00,10,0,0,'nhom6/products/10/8bc459ff-c94a-44c6-b484-6cee6676453d'),
       (11,'VGA MSI GeForce','VGA MSI GeForce RTX 5060 Ti 8GB VENTUS 3X OC - Card màn hình Chính Hãng',12606332.00,4,0,0,'nhom6/products/11/37b808db-0d15-491f-8ce6-1306f69d31d8');

INSERT INTO `orders` (`id`,
               `user_id`, `status`, `total_price`, `shipping_address`, `payment_method`, `created_date`)
VALUES (2,1,0,420000.00,'Hà Nội','COD','2026-03-30 13:28:35'),
       (3,2,0,4000.00,'Hà Nội','COD','2026-04-04 14:35:32'),
       (4,3,0,10200.00,'Vĩnh Phúc','COD','2026-04-04 14:35:55'),
       (5,6,0,8000.00,'Phú Thọ','COD','2026-04-04 14:36:31');
INSERT INTO `product_img` (`id`, `product_id`, `src`)
VALUES (13,5,'nhom6/products/5/02b0f944-eca1-4b86-ad00-a092cdf2c85a'),
       (14,5,'nhom6/products/5/b7eafd41-d5c1-4e3d-90e8-51573552029a'),
       (15,6,'nhom6/products/6/6a86fb6d-7f61-4fd7-91b8-0bb4eaaf3168'),
       (16,6,'nhom6/products/6/232ae659-12b1-4ed6-9efa-6792e9eec64a'),
       (17,7,'nhom6/products/7/b025fcba-55c6-449b-8959-202e1f793eef'),
       (18,8,'nhom6/products/8/389b89cb-cb71-4130-8807-5f087b3a2413'),
       (19,8,'nhom6/products/8/5eaa3093-a60e-4281-9748-fa73e822f107'),
       (20,9,'nhom6/products/9/d42df7aa-3f74-4524-b227-c8b2f63af947'),
       (21,10,'nhom6/products/10/5b5ba3e3-9006-4989-96a6-0fa8a00a7764'),
       (22,10,'nhom6/products/10/c9248352-1b6a-4e57-b23f-996e69b5dd60'),
       (23,11,'nhom6/products/11/efcc6e6b-981e-410d-bcfa-0837a167cb52'),
       (24,11,'nhom6/products/11/218840b7-b27b-47b2-bd03-9e92411e5e58'),
       (25,11,'nhom6/products/11/dd0a39b1-6b20-4ef3-ac52-d6ba3792c865');
INSERT INTO `products_filters` (`id`, `product_id`, `filter_id`)
VALUES (9,5,4),
       (10,5,7),
       (11,5,8),
       (12,5,9),
       (13,5,10),
       (14,6,6),
       (15,6,7),
       (16,6,10),
       (17,7,6),
       (18,7,7),
       (19,7,12),
       (20,8,4),
       (21,8,7),
       (22,8,13),
       (23,8,14),
       (24,9,5),
       (25,9,7),
       (26,9,8),
       (27,9,9),
       (28,10,6),
       (29,10,7),
       (30,10,10),
       (31,11,3),
       (32,11,7);





