"use strict";

var cont = ["Africa", "America", "AsiaAA"];
var helloCont = Array.from(cont, function (c) {
  return "Hello ".concat(c);
});
var message = helloCont.join(" ");
var element = React.createElement("div", {
  title: "Outer div"
}, React.createElement("h1", null, message)); // render

ReactDOM.render(element, document.getElementById("content"));