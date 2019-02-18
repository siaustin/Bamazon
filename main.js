var Customer = require(".bamazonCustomer.js");

inquirer
  .prompt({
    name: "products",
    type: "list",
    message: 
      "\n" +
      "************************************* \n" +
      "************************************* \n" +
      "*                                   * \n" +
      "*        Welcome To Bamazon         * \n" + 
      "*                                   * \n" +
      "*    Select from the Products Below * \n",
    choices: ['I am a Customer, "Exit"]         
  })
  .then(answers => {
    switch (answers.products)
  })