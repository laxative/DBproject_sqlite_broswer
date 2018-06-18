const swal = require("sweetalert2");
const fs = require("fs");

var sqlite3 = require("sqlite3").verbose();

var SQLiteAPI = {
  db: null,
  dbpath: "none",
  tables: null,
  importDB: function() {
    return new Promise(resolve => {
      swal({
        title: "Input DB filepath",
        text: "Please input your db filepath that you wonna import",
        type: "question",
        input: "text",
        showCancelButton: true,
        closeOnConfirm: false,
        inputPlaceholder: "Write filepath here"
      }).then(async result => {
        swal({
          title: "Finish!",
          type: "success",
          confirmButtonText: "Finish"
        });
        this.dbpath = result.value;
        // open db file
        this.db = new sqlite3.Database(this.dbpath);
        this.tables = await this.getTableList();
        resolve();
      });
    });
  },
  closeDB: function() {
    this.db.close();
    this.dbpath = "none";
  },
  /* The function that get table list */
  getTableList: function() {
    return new Promise((resolve, reject) => {
      // get table list
      this.db.all("select name from sqlite_master where type='table'", function(
        err,
        tables
      ) {
        if (err) reject(err);
        /* remove table sqlite_sequence */
        tables.splice(0, 1);
        resolve(tables);
      });
    });
  },
  /* the function get all attributes of a table */
  _attribute: function(table) {
    return new Promise((resolve, reject) => {
      this.db.all(`select * from ${table}`, (err, res) => {
        if (err) reject(err);
        resolve(Object.keys(res[0]));
      });
    });
  },
  /* The function search */
  search: function(table) {
    return new Promise((resolve, reject) => {
      var sqlcode = null;
      sqlcode = `SELECT * FROM ${table}`;
      this.db.all(sqlcode, (err, res) => {
        resolve(res);
      });
    });
  },
  runSQLcode: function(sqlcode) {
    return new Promise((resolve, reject) => {
      this.db.all(sqlcode, (err, res) => {
        if (err) reject("error");
        resolve(res);
      });
    });
  },
  /* the function for button search */
  _search: function(table, attr, nested, aggr, keywords, having) {
    return new Promise((resolve, reject) => {
      var sqlcode = "SELECT ";
      if (attr != "") {
        sqlcode += `${attr} `;
        if (
          attr != "" &&
          (aggr.toUpperCase() != "NONE" &&
            aggr.toUpperCase() != "HAVING" &&
            aggr != "")
        )
          sqlcode += `, ${aggr}(${attr}) `;
      } else sqlcode += "* "; /* no certain attribute */
      /* from which table */
      sqlcode += `FROM ${table}`;
      /* having keywords, using like or other nested */
      if (keywords != "") {
        sqlcode += " WHERE ";
        if (nested == "") {
          _keywords = keywords.replace(/, /gi, " ").split(" ");
          list = [];
          for (var i = 0; i < _keywords.length; ++i)
            list.push(`${attr} LIKE '%${_keywords[i]}%'`);
          sqlcode += list.join(" OR ");
        } else {
          sqlcode += `${attr} ${nested.toUpperCase()} (${keywords})`;
        }
      }
      /* having aggrgate */
      if (aggr.toUpperCase() == "HAVING") {
        sqlcode += ` GROUP BY ${attr} HAVING (${having})`;
      }
      /* add order by */
      if (attr != "") sqlcode += ` ORDER BY ${attr};`;
      this.db.all(sqlcode, (err, res) => {
        if (err) reject("error");
        resolve(res);
      });
    });
  },
  getQuestion(type) {
    return new Promise((resolve, reject) => {
      var question = {};
      switch (type) {
        case 0 /* insert */:
          swal({
            title: "Input Table",
            text: "Please input your table that you wonna insert",
            input: "text",
            showCancelButton: true,
            closeOnConfirm: false
          }).then(async result => {
            attribute = await this._attribute(result.value);
            question.steps = [];
            question.queue = [];
            for (let i = 0; i < attribute.length; ++i) {
              question.steps.push(`${i + 1}`);
              question.queue.push({
                title: `${attribute[i]}`,
                text: "Please input the data"
              });
            }
            question.table = result.value;
            resolve(question);
          });
          break;
        case 1 /* update */:
          question.steps = [
            "1",
            "2",
            "3",
            "4",
            "5"
          ]; /* table, attribute, value */
          question.queue = [
            { title: "Table", text: "Please input the table you wonna update" },
            { title: "Attribute", text: "which attribute you wonna update" },
            { title: "Value", text: "Please input the value" },
            {
              title: "Attribute according",
              text: "which attribute you according to"
            },
            {
              title: "Value according",
              text: "Please input the value that according to"
            }
          ];
          resolve(question);
          break;
        case 2 /* delete */:
          question.steps = ["1", "2", "3"]; /* table, attribute, value */
          question.queue = [
            {
              title: "Table",
              text: "Please input the table that the item you wonna delete"
            },
            {
              title: "Attribute",
              text:
                "Please input the attribute that the item you wonna delete according to"
            },
            { title: "Value", text: "Please input the value" }
          ];
          resolve(question);
          break;
        default:
          break;
      }
    });
  },
  askInsertData: function(type) {
    this.getQuestion(type).then(question => {
      swal
        .mixin({
          input: "text",
          confirmButtonText: "Next &rarr;",
          showCancelButton: false,
          progressSteps: question.steps
        })
        .queue(question.queue)
        .then(result => {
          var sqlcode = null;
          switch (type) {
            case 0 /*insert*/:
              attr = [];
              for (let i = 0; i < question.queue.length; ++i) {
                attr.push(question.queue[i].title);
              }
              attr = attr.join(",");
              value = result.value.join(",");
              sqlcode = `INSERT INTO ${
                question.table
              }(${attr}) VALUES(${value})`;
              console.log(sqlcode);
              this.db.run(sqlcode, function(err) {
                if (err) {
                  return console.log(err.message);
                }
                // get the last insert id
                console.log(
                  `A row has been inserted with rowid ${this.lastID}`
                );
              });
              break;
            case 1 /*update*/:
              sqlcode = `UPDATE ${result.value[0]} SET ${result.value[1]}='${
                result.value[2]
              }' WHERE ${result.value[3]}='${result.value[4]}'`;
              console.log(sqlcode);
              this.db.run(sqlcode, err => {
                if (err) {
                  console.error(err.message);
                }
                console.log(`Row(s) updated: ${this.changes}`);
              });
              break;
            case 2 /*delete*/:
              sqlcode = `DELETE FROM ${result.value[0]} WHERE ${
                result.value[1]
              }=${result.value[2]}`;
              console.log(sqlcode);
              this.db.run(sqlcode, err => {
                if (err) {
                  console.error(err.message);
                }
                console.log(`Row(s) updated: ${this.changes}`);
              });
              break;
          }
        });
    });
  }
};

module.exports = SQLiteAPI;
