// == Imports and Require Statements ==//
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
require("dotenv").config();

// == mySQL connection ==//
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "employee_db",
});

connection.connect(function (err) {
  if (err) throw err;
  runSearch();
});
console.log("You're connected!");

// Build a command-line application that at a minimum allows the user to:
// - Add departments, roles, employees
// - View departments, roles, employees
// - Update employee roles
// Bonus points if you're able to:  -- View the total utilized budget of a department -- ie the combined salaries of all employees in that department

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View Departments",
        "View Roles",
        "Update Employee Role",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Remove Employee", //see ice cream crud excercise 9 // Bonus points - Delete departments, roles, and employees
        "Update Employee Manager", // Bonus points - Update employee managers
        "View Employees By Manager", // Bonuse points - View employees by manager
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees": //Done
          allEmployees();
          break;

        case "View Departments": //Done
          viewDepts();
          break;

        case "View Roles": //Done
          viewRoles();
          break;

        case "Update Employee Role": //Done
          inquirer
            .prompt([
              {
                name: "employeeId",
                type: "input",
                message:
                  "Please enter the ID of the employee you'd like to update",
              },
              {
                name: "newRole",
                type: "input",
                message: "Please enter the new role id for employee",
              },
            ])
            .then((answer) => {
              updateRole(answer.employeeId, answer.newRole);
            });
          break;

        case "Add Employee": //Done
          employeeInfo();
          break;

        case "Add Department":
          inquirer
            .prompt([
              {
                name: "newDept",
                type: "input",
                message: "What is the new Department Name",
              },
            ])
            .then((answer) => {
              addDept(answer.newDept);
            });
          break;

        case "Add Role":
          employeeInfo();
          break;

        case "View All Employees By Department":
          employeesByDept();
          break;

        case "View Employees By Manager":
          employeesByMgr();
          break;

        case "Remove Employee":
          inquirer
            .prompt([
              {
                name: "removeId",
                type: "input",
                message:
                  "Please enter the ID of the employee you'd like to remove",
              },
            ])
            .then((answer) => {
              removeEmployee(answer.removeId);
            });
          break;

        case "Update Employee Role":
          updateRole();
          break;

        case "Update Employee Manager":
          updateMgr();
          break;

        case "Exit":
          exit();
          break;
      }
    });
}

const employeeInfo = () => {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "roleId",
        type: "input",
        message: "Enter the new employee's role id",
      },
      {
        name: "managerId",
        type: "input",
        message: "Enter the manager's id of the new employee",
      },
    ])
    .then((response) => {
      addEmployee(
        response.firstName,
        response.lastName,
        response.roleId,
        response.managerId
      );
    });
};

//  Queries------------------//

// "View All Employees" -- working
function allEmployees() {
  let allEmp = connection.query(
    'SELECT employee.id AS "Employee ID", employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title AS "Job Title", department.name AS "Department", role.salary AS "Salary", CONCAT(manager.first_name, " ", manager.last_name) AS "Manager" FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;',

    function (error, allEmp) {
      if (error) throw error;
      console.table(allEmp);
      returnHome();
    }
  );
}

//"View Departments" -- working
function viewDepts() {
  let depts = connection.query(
    'SELECT id AS "Department ID", name AS "Department Name" FROM department;',

    function (error, depts) {
      if (error) throw error;
      console.table(depts);
      returnHome();
    }
  );
}

//"View Roles" -- working
function viewRoles() {
  let roles = connection.query(
    'SELECT role.id AS "Role ID", role.title AS "Role Title", role.salary AS "Salary", department.name AS "Department" FROM role INNER JOIN department ON role.department_id = department.id;',

    function (error, roles) {
      if (error) throw error;
      console.table(roles);
      returnHome();
    }
  );
}

//"Update Employee Role" -- working
function updateRole(employeeId, newRoleId) {
  let updateRole = connection.query(
    `UPDATE employee SET role_id = ${newRoleId} WHERE id = ${employeeId};`,
    function (error, updateRole) {
      if (error) throw error;
      console.log("The employee role has been updated!"),
        //console.table(newRole);
        returnHome();
    }
  );
}

//"Add Employee" -- working
const addEmployee = (firstName, lastName, roleId, managerId) => {
  let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', '${roleId}', '${managerId}');`;

  connection.query(query, (err, res) => {
    if (err) throw err;

    console.log("Employee Added!");

    runSearch();
  });
};

//"Add Department" --is working
function addDept(newDept) {
  let add = connection.query(
    `INSERT INTO department (name) VALUES('${newDept}')`,
    function (error, add) {
      if (error) throw error;
      console.log("The Department has been added!");
      returnHome();
    }
  );
}

//"Remove Employee" -- is working
function removeEmployee(removeId) {
  let remove = connection.query(
    "DELETE FROM employee WHERE id = ?",
    [removeId],
    function (error, removeId) {
      if (error) throw error;
      console.log("The Employee has been removed!");
      returnHome();
    }
  );
}

// "View All Employees" -- is working
function allEmployees() {
  let allEmp = connection.query(
    'SELECT employee.id AS "Employee ID", employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title AS "Job Title", department.name AS "Department", role.salary AS "Salary", CONCAT(manager.first_name, " ", manager.last_name) AS "Manager" FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;',

    function (error, allEmp) {
      if (error) throw error;
      console.table(allEmp);
      returnHome();
    }
  );
}

//View All Employees By Department" -- lists all emmployees in order by dept.
function employeesByDept() {
  let department = connection.query(
    'SELECT employee.id, employee.first_name AS "First Name", employee.last_name AS "Last Name", department.name AS "Department" FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id WHERE department.id;',

    function (error, department) {
      if (error) throw error;
      console.table(department);
      returnHome();
    }
  );
}

// // Bonuse points - View employees by manager -- this isn't showing they way it should
function employeesByMgr() {
  let manager = connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, department.name, employee.manager_id AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id;",
    //"SELECT employee.id, employee.first_name, employee.last_name, department.name, employee.manager_id AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id;",
    //'SELECT employee.manager_id AS "Mgr ID", CONCAT(manager.first_name, " ", manager.last_name) AS "Manager", employee.id AS "Employee ID", CONCAT(employee.first_name, " ", employee.last_name) AS "Employee Name", department.name AS "Dept Name",  role.title AS "Position" FROM employee LEFT JOIN employee on manager.id = employee.manager_id, LEFT JOIN department ON department.id = role.department_id WHERE employee.manager_id; ',
    function (error, manager) {
      if (error) throw error;
      console.table(manager);
      returnHome();
    }
  );
}

const returnHome = () => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "return",
        message:
          "Would you like to return to the options list to continue working?",
      },
    ])
    .then((choice) => {
      if (choice.return) {
        runSearch();
      } else {
        exit();
      }
    });
};

const exit = () => {
  console.log("Exiting application");
  process.exit();
};

runSearch();
