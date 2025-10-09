// ⚠️ Hardcoded credentials
const password = "admin123";

// ⚠️ Use of eval
const userInput = "console.log('Hello')";
eval(userInput);

// ⚠️ SQL injection risk
const query = "SELECT * FROM users WHERE name = '" + userInput + "'";

// ⚠️ Insecure HTTP request
fetch("http://insecure-api.com/data")
  .then(response => response.json())
  .then(data => console.log(data));
