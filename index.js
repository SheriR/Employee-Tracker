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

// Bonus points if you're able to:
// - Update employee managers
// - View employees by manager
// - Delete departments, roles, and employees
// - View the total utilized budget of a department-- ie the combined salaries of all employees in that department

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees", //Done
        "View Departments", //Done
        "View Roles", //Done
        "Add Department", //Done
        "Add Role", //Done
        "Add Employee", //Done
        "Update Employee Role", //Done
        "Update Employee Manager", // Bonus points -- Done
        "Delete Department", //Bonus points - Delete departments, roles, and employee
        "Delete Role", //Bonus points
        "Delete Employee", //Bonus points --Done
        "View Employees By Manager", // Bonuse points
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

        case "Add Department": //Done
          inquirer
            .prompt([
              {
                name: "newDept",
                type: "input",
                message: "What is the new Department Name?",
              },
            ])
            .then((answer) => {
              addDept(answer.newDept);
            });
          break;

        case "Add Role": //Done
          inquirer
            .prompt([
              {
                name: "newRole",
                type: "input",
                message: "What is the new Role you'd like to add?",
              },
              {
                name: "newRoleSalary",
                type: "input",
                message: "What is the salary of the new Role you're adding?",
              },
              {
                name: "newRoleDeptId",
                type: "input",
                message: "Please provide the Dept Id of the new Role.",
              },
            ])
            .then((answer) => {
              addRole(
                answer.newRole,
                answer.newRoleSalary,
                answer.newRoleDeptId
              );
            });
          break;

        case "Add Employee": //Done
          employeeInfo();
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

        case "Update Employee Manager": //Done
          inquirer
            .prompt([
              {
                name: "employeeId",
                type: "input",
                message:
                  "Please enter the ID of the employee you'd like to update",
              },
              {
                name: "newMgr",
                type: "input",
                message: "Please enter the emplyee's new Manager Id",
              },
            ])
            .then((answer) => {
              updateMgr(answer.employeeId, answer.newMgr);
            });
          break;

        case "Delete Department":
          inquirer
            .prompt([
              {
                name: "deleteDeptId",
                type: "input",
                message:
                  "Please enter the ID of the Department you'd like to delete",
              },
            ])
            .then((answer) => {
              deleteDept(answer.deleteDeptId);
            });
          break;

        case "Delete Employee": //Done
          inquirer
            .prompt([
              {
                name: "deleteId",
                type: "input",
                message:
                  "Please enter the ID of the employee you'd like to delete",
              },
            ])
            .then((answer) => {
              deleteEmployee(answer.deleteId);
            });
          break;

        case "View Employees By Manager":
          inquirer
            .prompt([
              {
                name: "byMgr",
                type: "input",
                message:
                  "Please enter the Manager's Employee Id to view the employees reporting to him/her",
              },
            ])
            .then((answer) => {
              employeesByMgr(answer.byMgr);
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
      console.log("The employee role has been updated!"), returnHome();
    }
  );
}

//"Update Employee Manager" -- working
function updateMgr(employeeId, newMgr) {
  let query = connection.query(
    `UPDATE employee SET manager_id = ${newMgr} WHERE id = ${employeeId};`,
    function (error, res) {
      if (error) throw error;
      // console.log(`The employee's manager has been changed to ${res.insertId}`),
      console.log("The employee's manager has been changed!");
      returnHome();
    }
  );
}

//"Add Employee" -- working
function addEmployee(firstName, lastName, roleId, managerId) {
  let query = connection.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', '${roleId}', '${managerId}');`,
    function (error, res) {
      if (error) throw error;
      console.log(`Employee ID ${res.insertId} has been added!`);
      returnHome();
    }
  );
}

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

//"Add Role" -- is working
function addRole(newRole, newRoleSalary, newRoleDeptId) {
  let add = connection.query(
    `INSERT INTO role (title, salary, department_id) VALUES('${newRole}', '${newRoleSalary}', '${newRoleDeptId}');`,

    function (error, add) {
      if (error) throw error;
      console.log("The new Role has been added!");
      returnHome();
    }
  );
}

//"Delete Employee" -- is working
function deleteEmployee(deleteId) {
  let query = connection.query(
    "DELETE FROM employee WHERE id = ?",
    [deleteId],
    function (error, res) {
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

//View employees by manager - Bonuse points -- is working
function employeesByMgr(byMgr) {
  let manager = connection.query(
    "SELECT * FROM employee WHERE manager_id =?",
    [byMgr],

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
