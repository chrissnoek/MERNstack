const cont = ["Africa", "America", "AsiaAA"];
const helloCont = Array.from(cont, c => `Hello ${c}`);
const message = helloCont.join(" ");

const element = (
  <div title="Outer div">
    <h1>{message}</h1>
  </div>
);

// render
ReactDOM.render(element, document.getElementById("content"));
