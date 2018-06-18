// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { remote } = require("electron");
const { BrowserWindow, Menu, MenuItem } = remote;

/* define variable */
var dbdata = document.querySelector(".db_data");
var sqlcode = document.querySelector(".sql_code");
var buttonoper = document.querySelector(".button_oper");
var defaults = document.querySelector(".default");

var list = [dbdata, sqlcode, buttonoper];

/* define onclick function */
function modeclick(index) {
  if (list[index].classList.contains("contain_open")) {
    list[index].classList.remove("contain_open");
    list[index].classList.add("contain_close");
    defaults.classList.add("contain_open");
  } else {
    for (let i = 0; i < list.length; ++i) {
      list[i].classList.remove("contain_open");
      list[i].classList.add("contain_close");
    }
    defaults.classList.remove("contain_open");
    defaults.classList.add("contain_close");
    list[index].classList.remove("contain_close");
    list[index].classList.add("contain_open");
  }
}

module.exports.modeclick = modeclick;
