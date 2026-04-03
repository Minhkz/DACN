DROP DATABASE IF EXISTS laptopshop;
CREATE DATABASE laptopshop;
USE laptopshop;

CREATE TABLE roles (
    id 			INT PRIMARY KEY AUTO_INCREMENT,
    name 		VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE users (
    id 			INT PRIMARY KEY AUTO_INCREMENT,
    username	VARCHAR(255) UNIQUE,
    `password`  VARCHAR(255),
    email 		VARCHAR(255) UNIQUE,
    full_name 	NVARCHAR(255),
    address 	NVARCHAR(255),
    phone 		VARCHAR(255),
    avatar 		VARCHAR(255),
    role_id 	INT,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

CREATE TABLE products (
    id 			INT PRIMARY KEY AUTO_INCREMENT,
    `name` 		NVARCHAR(255) UNIQUE,
    des 		NVARCHAR(255),
    price 		DECIMAL(19,2),
    quantity 	INT,
    sold 		INT,
    `view`		INT,
    avatar 		VARCHAR(255)
);


CREATE TABLE product_img (
    id 			INT PRIMARY KEY AUTO_INCREMENT,
    product_id 	INT,
    src 		VARCHAR(255),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE filters (
    id 			INT PRIMARY KEY AUTO_INCREMENT,
    `name` 		VARCHAR(255),
    `type` 		VARCHAR(255)
);

CREATE TABLE products_filters (
    id 			INT PRIMARY KEY AUTO_INCREMENT,
    product_id 	INT,
    filter_id 	INT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (filter_id) REFERENCES filters(id) ON DELETE CASCADE
);
CREATE TABLE carts (
    id 			INT PRIMARY KEY AUTO_INCREMENT,
    user_id 	INT,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE orders (
    id 					INT PRIMARY KEY AUTO_INCREMENT,
    user_id 			INT,
    `status` 				INT,
    total_price 		DECIMAL(19,0),
    shipping_address 	NVARCHAR(255),
    payment_method 		VARCHAR(255),
    created_date 		TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE products_orders (
    id 					INT PRIMARY KEY AUTO_INCREMENT,
    product_id 			INT,
    order_id 			INT,
    price 				DECIMAL(19,0),
    quantity			INT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE wishlists (
    id 			INT PRIMARY KEY AUTO_INCREMENT,
    user_id 	INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE products_wishlists (
    id 			INT PRIMARY KEY AUTO_INCREMENT,
    product_id 	INT,
    wishlist_id INT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
    id 				INT PRIMARY KEY AUTO_INCREMENT,
    product_id 		INT NOT NULL,
    user_id 		INT NOT NULL,
    content 		NVARCHAR(255),
    rating 			INT,
    created_date 	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE products_carts (
    id 				INT PRIMARY KEY AUTO_INCREMENT,
    product_id 		INT NOT NULL,
    cart_id 		INT NOT NULL,
    quantity 		INT NOT NULL DEFAULT 1,
    price 			DECIMAL(19,2) NOT NULL,

    FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE,

    FOREIGN KEY (cart_id) REFERENCES carts(id)
        ON DELETE CASCADE
);

CREATE TABLE refresh_token(
	id				INT PRIMARY KEY AUTO_INCREMENT,
    user_id			INT NOT NULL,
    token			VARCHAR(500) UNIQUE NOT NULL,
    expiry_date		DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO roles 	(name) VALUES
					('ADMIN'),
					('USER');