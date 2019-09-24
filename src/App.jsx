class IssueFilter extends React.Component {
  render() {
    return <div>This is a placholder for the issueFilter</div>;
  }
}

class IssueRow extends React.Component {
  render() {
    const style = this.props.rowStyle;
    return (
      <tr>
        <td style={style}>{this.props.issueId}</td>
        <td style={style}>{this.props.issueTitle}</td>
      </tr>
    );
  }
}

class IssueTable extends React.Component {
  render() {
    const rowStyle = { border: "1px solid silver", padding: 4 };
    return (
      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={rowStyle}>ID</th>
            <th style={rowStyle}>Title</th>
          </tr>
        </thead>
        <tbody>
          <IssueRow
            issueTitle="Title of the first issue"
            issueId={1}
            rowStyle={rowStyle}
          />
          <IssueRow
            issueTitle="Title of the second issue"
            issueId={2}
            rowStyle={rowStyle}
          />
        </tbody>
      </table>
    );
  }
}

class IssueAdd extends React.Component {
  render() {
    return <div>This is a placholder for the IssueAdd</div>;
  }
}

class IssueList extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr></hr>
        <IssueTable />
        <hr></hr>
        <IssueAdd />
      </React.Fragment>
    );
  }
}
const element = <IssueList />;

// render
ReactDOM.render(element, document.getElementById("contents"));
