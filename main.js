var Customer = require("./bamazonCustomer.js");
var Manager = require("./bamazonManager.js");
var Supervisor = require("./bamazonSupervisor.js");
var inquirer = require("inquirer");

inquirer
  .prompt({
    name: "menu",
    type: "list",
    message:
      "\n" +
      "************************************* \n" +
      "************************************* \n" +
      "*                                   * \n" +
      "*        Welcome To Bamazon         * \n" +
      "*                                   * \n" +
      "*    Are You a Customer, Manager    * \n" +
      "*          Or Supervisor?           * \n" +
      "*                                   * \n" +
      "************************************* \n" +
      "************************************* \n",
    choices: ["I am a Customer", "I am a Manager", "I am a Supervisor", "Exit"]
  })
  .then(answers => {
    switch (answers.menu) {
      case "I am a Customer":
        Customer();
        break;
      case "I am a Manager":
        Manager();
        break;
      case "I am a Supervisor":
        Supervisor();
        break;
      case "Exit":
        return;
    }
  });
