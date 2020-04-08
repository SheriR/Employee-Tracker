INSERT INTO department
    (name)
VALUES
    ('management'),
    /* Id 1 */
    ('dept manager'),
    /* Id 2 */
    ('sales floor')
/* Id 3 */

INSERT INTO role
    (title, salary, department_id)
/*department_id references the table department column id */
VALUES
    ('Store Manager', 120000, 1),
    /* Id 1 */
    ('Operations Manager', 60000, 1),
    /* Id 2 */
    ('Sales Floor Manager', 70000, 1),
    /* Id 3 */
    ('Live Pet Dept Manager', 50000, 2),
    /* Id 4 */
    ('Pet Supplies Dept Manager', 55000, 2),
    /* Id 5 */
    ('Live Pet Sales', 30000, 3),
    /* Id 6 */
    ('Pet Supplies Sales', 30000, 3);
/* Id 7 */

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
/*role_id references the table "role" column "id" */
VALUES
    /*manager_id references the this table column id */
    ('Abby', 'Jones', 1, NULL),
    /* Id 1 */
    /* Abby is the store manager*/
    ('Klaire', 'Smith', 2, 1),
    /* Id 2 */
    /* Klaire is operations, reporting to Abby*/
    ('Shay', 'Johnson', 3, 1),
    /* Id 3 */
    /*Shay is sales floor manager reporting to Abby*/
    ('Ashton', 'Williams', 5, 3),
    /* Id 4 */
    /*Ashton is pet supply manager reporting to Shay*/
    ('Aiden', 'Allen', 4, 3 ),
    /* Id 5 */
    /*Aiden is live pet dept manager reporting to Shay*/
    ('Laney', 'Ryff', 6, 5),
    /* Id 6 */
    /*Laney is a Live pet sales reporting to Aiden*/
    ('Lily', 'Swaney', 6, 5),
    /* Id 7 */
    /*Lily is a Live pet sales reporting to Aiden*/
    ('Eva', 'Kay', 7, 4),
    /* Id 8 */
    /*Eva is a pet supplies sales reporting to Ashton*/
    ('Tyler', 'Erickson', 7, 4); /*Id 9*/ /*Tyler is a pet supplies sales reporting to Ashton*/
