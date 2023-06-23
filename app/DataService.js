//this file will have all functions that involves the CRUD operations in sqlite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("MapCoords");

// db name -> MapCoords ; table name -> MapCoords
// Table structure ::
//-------------------------------------
// id -> primary key and INTEGER
// lat -> REAL (aka float)
// long -> REAL
// title -> TEXT (holds name of place)
//-------------------------------------

//all db functions involve promises due to async reasons (pretty sure) 


//creates table
export const createTable = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS MapCoords (id INTEGER PRIMARY KEY, latitude REAL, longitude REAL, title TEXT)",
        [],
        resolve,
        (_, error) => reject(error)
      );
    });
  });
};

//handles inserertions
export const insertIntoTable = (id, latitude, longitude, title) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM MapCoords WHERE id = ?",
        [id],
        (_, result) => {
          if (result.rows.length === 0) {
            db.transaction((tx) => {
              tx.executeSql(
                "INSERT INTO MapCoords (id, latitude, longitude, title) VALUES (?, ?, ?, ?)",
                [id, latitude, longitude, title],
                (_, result) => resolve(result),
                (_, error) => reject(error)
              );
            });
          }
        }
      );
    });
  });
};

//handles dropping and resetting the table
export const dropTable = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("DROP TABLE MapCoords", [], resolve, (_, error) =>
        reject(error)
      );
    });
  });
};

//handles displaying the table (after making sure it is created)
export const displayTable = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS MapCoords (id INTEGER PRIMARY KEY, latitude REAL, longitude REAL, title TEXT)"
      );
      tx.executeSql(
        "SELECT * FROM MapCoords",
        [],
        (_, result) => {
          const { rows } = result;
          const data = rows._array || []; //return an empty array if table was empty
          resolve(data);
        },
        (_, error) => reject(error)
      );
    });
  });
};
