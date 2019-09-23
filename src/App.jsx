class HelloWorld extends React.Component {
  render() {
    const cont = ["Africa", "America", "AsiaAAAA"];
    const helloCont = Array.from(cont, c => `Hello ${c}`);
    const message = helloCont.join(" ");

    return (
      <div title="Outer div">
        <h1>{message}</h1>
      </div>
    );
  }
}
const element = <HelloWorld />;

// render
ReactDOM.render(element, document.getElementById("contents"));
