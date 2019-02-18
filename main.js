var Customer = require(".bamazonCustomer.js");

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
      "************************************* \n" +
      "************************************* \n" ,
    choices: ['I am a Customer, "Exit"]         
  })
  .then(answers => {
    switch (answers.menu) {
      case "I am a Customer":
        Customer();
        break;
      case "Exit":
        return;
    }
  });
  