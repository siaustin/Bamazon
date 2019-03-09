var Supervisor = function() {
  var mysql = require("mysql");
  var inquirer = require("inquirer");
  var Table = require("cli-table");

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
          "View Product Sales by Department",
          "Create New Department",
          "Exit"
        ]
      })
      .then(answers => {
        console.log(answers.options);
        switch (answers.options) {
          case "View Product Sales by Department":
            showDepartments();
            break;
          case "Create New Department":
            addNewDepartment();
            break;
          case "Exit":
            connection.end();
            process.exit();
            break;
        }
      });
  }

  function showDepartments() {
    var table = new Table({
      head: [
        "DEPT ID",
        "DEPT NAME",
        "DEPT OVERHEAD COST",
        "PRODUCT SALES",
        "TOTAL PROFIT"
      ],
      colWidths: [10, 20, 20, 15, 15]
    });

    connection.query(
      "SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales), SUM(products.product_sales) - departments.over_head_costs AS total_profit FROM products RIGHT JOIN departments ON products.department_name = departments.department_name GROUP BY products.department_name, departments.department_id ORDER BY departments.department_id",
      function(err, res) {
        if (err) throw err;
        res.forEach(element => {
          var row = [];
          if (element["SUM(products.product_sales)"] == null) {
            element["SUM(products.product_sales)"] = 0;
            element.total_profit = 0;
          }
          row.push(
            element.department_id,
            element.department_name,
            element.over_head_costs,
            element["SUM(products.product_sales)"],
            element.total_profit
          );

          table.push(row);
        });
        console.log(table.toString());
        showOptions();
      }
    );
  }

  function addNewDepartment() {
    inquirer
      .prompt([
        {
          name: "name",
          message: "Enter the name of a new department [Press Q to exit]",
          validate: exit
        },
        {
          name: "cost",
          message:
            "Enter the overhead cost of a new department [Press Q to exit]",
          validate: validInput
        }
      ])
      .then(answers => {
        cost = parseFloat(answers.cost);
        connection.query(
          "INSERT INTO departments SET ?",
          {
            department_name: answers.name,
            over_head_costs: cost
          },
          function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " department(s) inserted!\n");
            showOptions();
          }
        );
      });
  }
};

module.exports = Supervisor;
