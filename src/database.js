import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("little_lemon");

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists menuitems (id text primary key not null, name text, price text, description text, image text, category text);",
          [],
          (_, result) => {
            // console.log("Table creation result:", result);
            resolve(result);
          },
          (_, error) => {
            // console.error("Table creation error:", error);
            reject(error);
          }
        );
      },
      null,
      null
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction(
      (tx) => {
        tx.executeSql("select * from menuitems", [], (_, { rows }) => {
          const menuItems = rows._array;
          // console.log("Menu items from the database:", menuItems);
          resolve(menuItems);
        });
      },
      null,
      null
    );
  });
}

export function saveMenuItems(menuItems) {
  db.transaction(
    (tx) => {
      // Check if menuItems is defined before proceeding
      if (menuItems) {
        // Implement a single SQL statement to save all menu data in a table called menuitems.
        const sqlStatement = `INSERT INTO menuitems (id, name, description, price, image, category) VALUES ${menuItems
          .map(
            (item) =>
              `('${item.id}', '${item.name}', '${item.description.replace(
                /'/g,
                "''"
              )}', '${item.price}', '${item.image}', '${item.category}')`
          )
          .join(", ")};`;

        // console.log("Generated SQL statement:", sqlStatement);

        // Execute the SQL statement
        tx.executeSql(
          sqlStatement,
          [],
          (_, result) => {
            // console.log("Save menu items result:", result);
          },
          (_, error) => {
            // console.error("Save menu items error:", error);
          }
        );
      }
    },
    (error) => {
      // console.error("Transaction error:", error);
    },
    null
  );
}

export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        let sqlQuery = "SELECT * FROM menuitems";

        if (
          (query && query.trim() !== "") ||
          (activeCategories && activeCategories.length > 0)
        ) {
          sqlQuery += " WHERE";
        }

        if (query && query.trim() !== "") {
          const queryString = query.trim();
          const titleCondition = `name LIKE '%${queryString}%'`;
          // console.log("Query String Condition:", titleCondition);
          sqlQuery += ` ${titleCondition}`;
        }

        if (activeCategories && activeCategories.length > 0) {
          const categoryCondition = activeCategories
            .map((category) => `LOWER(category) = LOWER('${category}')`)
            .join(" OR ");
          // console.log("Category Condition:", categoryCondition);
          sqlQuery +=
            query && query.trim() !== ""
              ? ` AND (${categoryCondition})`
              : ` ${categoryCondition}`;
        }

        // console.log("Final SQL Query:", sqlQuery);

        tx.executeSql(sqlQuery, [], (_, { rows }) => {
          console.log("Filtered Rows:", rows._array);
          resolve(rows._array);
        });
      },
      reject,
      resolve
    );
  });
}
