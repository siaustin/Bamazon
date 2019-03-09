var Manager = function() {
  var mysql = require("mysql");
  var inquirer = require("inquirer");
  var Table = require("cli-table");
  var departmentsList = [];

  var validInput = value => {
    if (/\d/.test(value)) {
      return true;
    } else if (value === "q" || value === "Q") {
      process.exit();
    } else {
      return "Please use numbers only!";
    }
  };

  var exit = value => {
    if (value === "q" || value === "Q") {
      process.exit();
    } else {
      return true;
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
    showOptions();
  });

  function showOptions() {
    inquirer
      .prompt({
        name: "options",
        type: "list",
        message: "Choose from these options",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "Exit"
        ]
      })
      .then(answers => {
        console.log(answers.options);
        switch (answers.options) {
          case "View Products for Sale":
            showProducts();
            break;
          case "View Low Inventory":
            showLowInventory();
            break;
          case "Add to Inventory":
            addToInventory();
            break;
          case "Add New Product":
            addNewProduct();
            break;
          case "Exit":
            connection.end();
            process.exit();
            break;
        }
      });
  }

  function showProducts() {
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
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      res.forEach(element => {
        var row = [];
        row.push(
          element.item_id,
          element.product_name,
          element.department_name,
          element.price,
          element.stock_quantity,
          element.product_sales
        );
        table.push(row);
      });
      console.log(table.toString());
      showOptions();
    });
  }

  function showLowInventory() {
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
    connection.query(
      "SELECT * FROM products WHERE ?? < ?",
      ["stock_quantity", "15"],
      function(err, res) {
        if (err) throw err;
        res.forEach(element => {
          var row = [];
          row.push(
            element.item_id,
            element.product_name,
            element.department_name,
            element.price,
            element.stock_quantity,
            element.product_sales
          );
          table.push(row);
        });
        console.log(table.toString());
        showOptions();
      }
    );
  }

  function addToInventory() {
    inquirer
      .prompt([
        {
          name: "id",
          message: "Enter an item id you would like to add [Press Q to exit]",
          validate: validInput
        },
        {
          name: "qty",
          message:
            "Enter how many units of the product you would like to add [Press Q to exit]",
          validate: validInput
        }
      ])
      .then(answers => {
        addToInventoryProcess(answers.id, answers.qty);
      });
  }

  function addToInventoryProcess(id, qty) {
    qty = parseInt(qty);
    connection.query(
      "SELECT * FROM products WHERE ?",
      { item_id: id },
      function(err, res) {
        if (err) throw err;
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: res[0].stock_quantity + qty
            },
            {
              item_id: id
            }
          ],
          function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product(s) updated!\n");
            showOptions();
          }
        );
      }
    );
  }

  function addNewProduct() {
    connection.query("SELECT * FROM departments", function(err, res) {
      if (err) throw err;
      res.forEach(element => {
        departmentsList.push(element.department_name);
      });
    });
    inquirer
      .prompt([
        {
          name: "product",
          message:
            "Enter the name of a product you would like to add [Press Q to exit]",
          validate: exit
        },
        {
          name: "department",
          type: "list",
          message:
            "Choose the department name you would like to add your product into",
          choices: departmentsList
        },
        {
          name: "price",
          message: "Enter the price for new product [Press Q to exit]",
          validate: validInput
        },
        {
          name: "qty",
          message:
            "Enter how many items of the product you would like to add? [Press Q to exit]",
          validate: validInput
        }
      ])
      .then(answers => {
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: answers.product,
            department_name: answers.department,
            price: answers.price,
            stock_quantity: answers.qty
          },
          function(err, res) {
            console.log(res.affectedRows + " product(s) inserted!\n");
            showOptions();
          }
        );
      });
  }
};

module.exports = Manager;
