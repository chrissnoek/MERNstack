import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';

const IssueRow = withRouter(({
    issue,
    location: { search },
    deleteIssue, // this is a function passed by issueList
    closeIssue, // this is a function passed by issueList
    index // this is the index of the isssue in the row
}) => {
    // get the current location search (status filter or effort filter) to 
    const selectedLocation = { pathname: `/issues/${issue.id}`, search }
    return (
        <tr>
            <td>{issue.id}</td>
            <td>{issue.status}</td>
            <td>{issue.owner}</td>
            <td>{issue.created.toDateString()}</td>
            <td>{issue.effort}</td>
            <td>{issue.due ? issue.due.toDateString() : ""}</td>
            <td>{issue.title}</td>
            <td><Link to={`/edit/${issue.id}`}>Edits</Link>
                {' | '}
                <NavLink to={selectedLocation}>Select</NavLink>
                {' | '}
                <button type="button" onClick={() => { closeIssue(index) }}>Close</button>
                {' | '}
                <button type="button" onClick={() => { deleteIssue(index) }}>Delete</button>
            </td>
        </tr>
    );
});

export default function IssueTable({ issues, closeIssue, deleteIssue }) {
    const issueRows = issues.map((issue, index) => (
        <IssueRow
            key={issue.id}
            issue={issue}
            closeIssue={closeIssue}
            index={index}
            deleteIssue={deleteIssue}
        />
    ));
    return (
        <table className="bordered-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Created</th>
                    <th>Effort</th>
                    <th>Due Date</th>
                    <th>Title</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>{issueRows}</tbody>
        </table>
    );
}