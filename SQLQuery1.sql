USE pink_shop;

create table Category(
category_id INT primary key IDENTITY(1,1),
category_name VARCHAR(50) NOT NULL
);

create table Products(
product_id INT PRIMARY KEY IDENTITY(1,1),
product_name varchar(50) not null,
description varchar(100) not null,
stock_quantity int not null,
price decimal(10,2) not null,
image_url varchar(100) not null,
category_id int not null,

foreign key (category_id)
references Category(category_id)
);


create table Orders(
order_id int primary key identity(1,1),
total_price decimal(10,2) not null,
order_date datetime not null default getdate(),
);


create table Order_item(
order_item_id int primary key identity(1,1),
quantity int not null,
unit_price decimal(10,2) not null ,
order_id int not null,
product_id int not null,

foreign key (order_id)
references Orders(order_id),

foreign key (product_id)
references Products(product_id),

);

insert into Category (category_name) values 
('accessories'),
('watches'),
('shoes'),
('wallet'),
('jewelry');

SELECT * FROM Category;


insert into Products (product_name, description, stock_quantity, image_url, price, category_id) values 
(
    'Pink Handbag',
    'A stylish pink handbag suitable for everyday use.',
    10,
    'images/pink_handbag.jfif',
    35.00,
    1
),
(
    'White Sneakers',
    'Comfortable white sneakers designed for everyday wear.',
    15,
    'images/white_sneakers.jfif',
    60.00,
    2
),
(
    'Rose Gold Watch',
    'An elegant rose gold watch with a modern finish.',
    8,
    'images/pink_watch.jpg',
    120.00,
    3
),
(
    'Black Sunglasses',
    'Stylish black sunglasses with UV protection.',
    20,
    'images/sunglasses.jfif',
    25.00,
    1
),
(
    'Leather Wallet',
    'A premium leather wallet with multiple card slots.',
    12,
    'images/wallet.jfif',
    40.00,
    4
),
(
    'Silver Necklace',
    'An elegant silver necklace with a minimalist design.',
    7,
    'images/silver_necklace.jfif',
    55.00,
    5
);
SELECT * FROM Products;


INSERT INTO Orders (total_price)
VALUES (130.00);
SELECT * FROM Orders;

INSERT INTO Order_item
(quantity, unit_price, order_id, product_id)
VALUES
(2, 35.00, 1, 1),
(1, 60.00, 1, 2);
SELECT * FROM Order_item;

SELECT
    Orders.order_id,
    Orders.order_date,
    Products.product_name,
    Order_item.quantity,
    Order_item.unit_price,
    Order_item.quantity * Order_item.unit_price AS item_total
FROM Order_item
INNER JOIN Orders
    ON Order_item.order_id = orders.order_id
INNER JOIN Products
    ON Order_item.product_id = Products.product_id;






SELECT * FROM Products WHERE price>30;
UPDATE Products set stock_quantity =15 WHERE product_id=3;
DELETE FROM Products WHERE product_id=1;