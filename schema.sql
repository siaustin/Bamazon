DROP DATABASE IF EXISTS bamazon_DB;
CREATE database bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products
    (product_name, department_name, price, stock_quantity)
  VALUES
    ("Macbook Pro", "Electronics", 2399.00, 43),
    ("Where the Crawdads Sing", "Books", 15.60, 16),
    ("Ray Bans", "Eyewear", 120.50, 35),
    ("Instant Pot", "Kithchen", 79.95, 22),
    ("Fitbit Versa", "Fitness", 169.95, 5),
    ("Echo Dot", "Electronics", 39.99, 80),
    ("Thayers Alcohol-Free Witch Hazel Toner", "Skin Care", 6.99, 41),
    ("Ring Doorbell", "Home Improvement", 1.99, 37),
    ("Dog Bed", "Pet Supplies", 39.99, 21),
    ("Samsung TV 65in", "Electronics", 1200.00, 48),

  CREATE TABLE departments
  (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NULL,
    over_head_costs DECIMAL (15, 2),
    PRIMARY KEY(department_id)
  );

    ALTER TABLE products
  ADD product_sales DECIMAL(15,2) NULL;

    ALTER TABLE products MODIFY COLUMN product_sales DECIMAL(15,2) DEFAULT 0;

    INSERT INTO departments (department_name, over_head_costs)

    VALUES
      ("Electronics", 5000.00),
      ("Books", 125.00),
      ("Eyewear", 94.00),
      ("Kitchen", 55.00),
      ("Fitness", 25.00),
      ("Skin Care", 33.00),
      ("Home Improvement", 125.00),
      ("Pet Supplies", 45.00);