var Customer = function() {
  var mysql = require("mysql");
  var inquirer = require("inquirer");
  var Table = require("cli-table");

  var table = new Table({
    head: [
      "ID",
      "PRODUCT NAME",
      "DEPARTMENT NAME",
      "PRICE",
      "QTY",
      "PRODUCT SALES"
    ],
    colWidths: [5, 40, 20, 10, 10, 15]
  });

  var validInput = value => {
    if (/\d/.test(value)) {
      return true;
    } else if (value === "q" || value === "Q") {
      process.exit();
    } else {
      return "Please use numbers only!";
    }
  };

  var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    showProducts();
  });

  function showProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      res.forEach(element => {
        var row = [];

        console.log(element);

        row.push(
          element.item_id,
          element.product_name,
          element.department_name,
          element.price,
          element.stock_quantity,
          element.product_sales ? element.product_sales : 0
        );

        table.push(row);
      });

      console.log(table.toString());
      placeOrder();
    });
  }

  function placeOrder() {
    inquirer
      .prompt([
        {
          name: "id",
          message:
            "Enter an Id of the product you would like to buy [Press Q to exit]",
          validate: validInput
        },
        {
          name: "qty",
          message:
            "Enter how many units of the product you would like to buy [Press Q to exit]",
          validate: validInput
        }
      ])
      .then(answers => {
        readProducts(answers.id, answers.qty);
      });
  }

  function readProducts(id, qty) {
    connection.query(
      "SELECT * FROM products WHERE ?",
      {
        item_id: id
      },
      function(err, res) {
        if (err) throw err;
        qty = parseInt(qty);
        if (res[0].stock_quantity >= qty) {
          customerOrder(
            qty,
            res[0].price,
            res[0].stock_quantity,
            res[0].item_id,
            res[0].product_sales
          );
        } else {
          console.log("Insufficient quantity!");
        }
      }
    );
  }

  function customerOrder(quantity, price, stockQty, id, sales) {
    console.log("Your order is being processed \n");
    console.log("Your total cost is: " + (quantity * price).toFixed(2));

    connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: stockQty - quantity,
          product_sales: sales + quantity * price
        },
        {
          item_id: id
        }
      ],
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " product(s) updated!\n");
      }
    );

    connection.end();
  }
};
module.exports = Customer;
