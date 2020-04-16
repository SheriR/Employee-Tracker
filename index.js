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
        "Delete Department", //Bonus points
        "Delete Role", //Bonus points
        "Delete Employee", //Bonus points --Done
        "View Employees By Manager", // Bonuse points --Done
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees": //Done Done
          allEmployees();
          break;

        case "View Departments": //Done Done
          viewDepts();
          break;

        case "View Roles": //Done Done
          viewRoles();
          break;

        case "Add Department": //Done Done
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

        case "Add Role": //Re-did Done
          newRoleInfo();
          break;

        case "Add Employee": //Re-did Done
          employeeInfo();
          break;

        case "Update Employee Role": //Re-did Done
          changeRole();
          break;

        case "Update Employee Manager": //Done
          changeMgr();
          break;

        case "Delete Department":
          deleteDept();
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

        case "Exit":
          exit();
          break;
      }
    });
}

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

var roleList = [];
var empList = [];
var deptList = [];
var roleId = [];
var empId = [];

//setting up functions to gather data for choices list
function getRoleList() {
  connection.query("SELECT * FROM role", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      roleList.push(data[i].id + "-" + data[i].title);
    }
  });
}

function getEmpList() {
  let query = connection.query(
    "SELECT * FROM employee",

    function (err, query) {
      if (err) throw err;
      for (i = 0; i < query.length; i++) {
        empList.push(
          query[i].id + "-" + query[i].first_name + " " + query[i].last_name
        );
      }
    }
  );
}

function getDeptList() {
  let query = connection.query(
    "SELECT * FROM department",

    function (err, query) {
      if (err) throw err;
      for (i = 0; i < query.length; i++) {
        deptList.push(query[i].id + "-" + query[i].name);
      }
    }
  );
}

const getRoleId = () => {
  let query = "SELECT id, title FROM role";
  connection.query(query, function (err, answer) {
    roleId = answer;
  });
};

const getEmpId = () => {
  let query = "SELECT id, FROM employee";
  connection.query(query, function (err, answer) {
    empId = answer;
  });
};

//"Add Department" --is working
function addDept(newDept) {
  let add = connection.query(
    `INSERT INTO department (name) VALUES('${newDept}')`,
    function (error, add) {
      if (error) throw error;
      console.log(`The department, ${newDept}, has been added!`);
      returnHome();
    }
  );
}

//"Add Role" -- Re-wrote code working on re-do
const newRoleInfo = () => {
  getDeptList();

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
        type: "list",
        message: "What department will the new role fall under?",
        choices: deptList,
      },
    ])
    .then((answer) => {
      addRole(answer.newRole, answer.newRoleSalary, answer.newRoleDeptId);
      console.log(answer.newRoleDeptId, "dept selected");
    });
};

//"Add Role" continued....
function addRole(newRole, newRoleSalary, newRoleDeptId) {
  let deptNewRollFallsUnder = newRoleDeptId.split("-");

  let query = `INSERT INTO role (title, salary, department_id) VALUES('${newRole}', '${newRoleSalary}', '${deptNewRollFallsUnder[0]}');`;

  connection.query(query, function (error, query) {
    if (error) throw error;
    console.log(`The role, ${newRole}, has been added!`);
    returnHome();
  });
}

//"Add Employee" -- Re-wrote code working on re-do
const employeeInfo = () => {
  getRoleList();
  getEmpList();

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
        name: "role_id",
        message: "What is the employee's role?",
        choices: roleList,
        type: "list",
      },
      {
        name: "manager_id",
        message: "Who is the employee's manager?",
        choices: empList,
        type: "list",
      },
    ])
    .then((answer) => {
      addEmployee(
        answer.firstName,
        answer.lastName,
        answer.role_id,
        answer.manager_id
      );
      //console.log(answer.role_id);
    });
};

//"Add Employee" continued....
function addEmployee(firstName, lastName, role_id, manager_id) {
  let role = role_id.split("-");
  let manager = manager_id.split("-");

  let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', '${role[0]}', '${manager[0]}');`;

  connection.query(query, function (error, query) {
    if (error) throw error;
    console.log(`New Employee ${firstName} ${lastName} has been added!`);
    returnHome();
  });
}

//"Update Employee Role" -- Re-wrote code working on re-do
const changeRole = () => {
  getRoleList();
  getEmpList();

  inquirer
    .prompt([
      {
        name: "employeeToUpdate",
        message: "What employee will you be changing the role for?",
        choices: empList,
        type: "list",
      },
      {
        name: "newRole",
        type: "list",
        message: "What is their new Role?",
        choices: roleList,
      },
    ])
    .then((answer) => {
      updateRole(answer.employeeToUpdate, answer.newRole);
    });
};

//"Update Employee Role" continued....
function updateRole(employee, newRole) {
  let employeeId = employee.split("-");
  let newRoleId = newRole.split("-");

  let query = `UPDATE employee SET role_id = ${newRoleId[0]} WHERE id = ${employeeId[0]}`;
  connection.query(query, function (error, query) {
    if (error) throw error;
    console.log(`The employee's role has been updated!`);
    returnHome();
  });
}

//"Update Employee Manager" -- Re-wrote code working on re-do
const changeMgr = () => {
  getEmpList();
  inquirer
    .prompt([
      {
        name: "employee",
        message: "Please select the employee you'd like to update",
        type: "list",
        choices: empList,
      },
      {
        name: "newMgr",
        message: "Please select the employee's new manager",
        type: "list",
        choices: empList,
      },
    ])
    .then((answer) => {
      updateMgr(answer.employee, answer.newMgr);
    });
};

//"Update Employee Manager" continued....
function updateMgr(employee, newMgr) {
  let employeeId = employee.split("-");
  let newMgrId = newMgr.split("-");

  let query = `UPDATE employee SET manager_id = ${newMgrId[0]} WHERE id = ${employeeId[0]};`;
  connection.query(query, function (error, query) {
    if (error) throw error;
    console.log(`The employee's manager has been changed to ${newMgr}`),
      //console.log("The employee's manager has been changed!");
      returnHome();
  });
}

//"Delete Department"
// function deleteDept(deleteDeptId) {
//   inquirer
//     .prompt([
//       {
//         name: "deleteDeptId",
//         type: "input",
//         message:
//           "Please enter the Department ID of the department you'd like to delete",
//       },
//     ])
//     .then(employeesByMgr(byMgr)) => {
//       console.table(manager);
//       //deleteDept(answer.deleteDeptId);
//     });
// }

//"Delete Role"

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

//"View employees by manager" - Bonuse points -- is working
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
