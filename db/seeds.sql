INSERT INTO department
    (name)
VALUES
    ('Operations'),
    /* Id 1 */
    ('Live Pets'),
    /* Id 2 */
    ('Pet Supplies')
/* Id 3 */

INSERT INTO role
    (title, salary, department_id)
/*department_id references the table department column id */
VALUES
    ('Operations Manager', 50000, 1),
    /* Id 1 */
    ('Live Pets Manager', 40000, 2),
    /* Id 2 */
    ('Pet Supplies Manager', 40000, 3),
    /* Id 3 */
    ('Live Pet Associate', 30000, 2),
    /* Id 4 */
    ('Pet Supplies Associate', 30000, 3),
    /* Id 5 */
    ('Cashier', 30000, 1),
    /* Id 6 */
    ('Bookkeeping', 30000, 1);
/* Id 7 */

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
/*role_id references the table "role" column "id" */
VALUES
    /*manager_id references the this table column id */
    ('Abby', 'Jones', 1, NULL),
    /* Id 1 */
    /* Abby is the operations manager*/
    ('Shay', 'Smith', 2, 1),
    /* Id 2 */
    /* Shay is live pet mgr reporting to Abby*/
    ('Klaire', 'Johnson', 3, 1),
    /* Id 3 */
    /*Klaire is pet supply mgr reporting to Abby*/
    ('Ashton', 'Williams', 5, 3),
    /* Id 4 */
    /*Ashton is pet supply associate reporting to Klaire*/
    ('Aiden', 'Allen', 5, 3 ),
    /* Id 5 */
    /*Aiden is pet supply associate reporting to Klaire*/
    ('Laney', 'Ryff', 4, 2),
    /* Id 6 */
    /*Laney is a Live pet associate reporting to Shay*/
    ('Lily', 'Swaney', 4, 2),
    /* Id 7 */
    /*Lily is a Live pet associate reporting to Shay*/
    ('Eva', 'Kay', 6, 1),
    /* Id 8 */
    /*Eva is a cashier reporting to Abby*/
    ('Tyler', 'Erickson', 6, 1);
/*Id 9*/
/*Tyler is a cashier reporting to Abby*/
('Mara', 'Franklin',7, 1); /*Id 10*/ /*Mara is the bookkeeper reporting to Abby*/
