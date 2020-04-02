import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { FiX, FiTrash2, FiEdit } from "react-icons/fi";
import { Button, Tooltip, OverlayTrigger, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const IssueRow = withRouter(({
    issue,
    location: { search },
    deleteIssue, // this is a function passed by issueList
    closeIssue, // this is a function passed by issueList
    index // this is the index of the isssue in the row
}) => {
    // get the current location search (status filter or effort filter) to 
    const selectedLocation = { pathname: `/issues/${issue.id}`, search }
    const closeTooltip = <Tooltip id="close-tooltip" placement="top">Close Issue</Tooltip>;
    const deleteTooltip = <Tooltip id="delete-tooltip" placement="top">Delete Issue</Tooltip>;
    const editTooltip = <Tooltip id="edit-tooltip" placement="top">Edit Issue</Tooltip>;

    function onClose(e) {
        e.preventDefault();
        closeIssue(index);
    }

    function onDelete(e) {
        e.preventDefault();
        deleteIssue(index);
    }

    const tableRow = (
        <tr>
            <td>{issue.id}</td>
            <td>{issue.status}</td>
            <td>{issue.owner}</td>
            <td>{issue.created.toDateString()}</td>
            <td>{issue.effort}</td>
            <td>{issue.due ? issue.due.toDateString() : ""}</td>
            <td>{issue.title}</td>
            <td>
                <LinkContainer to={`/edit/${issue.id}`}>
                    <OverlayTrigger delayShow={1000} overlay={editTooltip}>
                        <Button type="button"><FiEdit /></Button>
                    </OverlayTrigger>
                </LinkContainer>
                {' | '}
                <OverlayTrigger delayShow={1000} overlay={closeTooltip}>
                    <Button type="button" onClick={onClose}><FiX /></Button>
                </OverlayTrigger>
                {' | '}
                <OverlayTrigger delayShow={1000} overlay={deleteTooltip}>
                    <Button type="button" onClick={onDelete}><FiTrash2 /></Button>
                </OverlayTrigger>
            </td>
        </tr>
    );
    return (
        <LinkContainer to={selectedLocation}>{tableRow}</LinkContainer>
    )
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
        <Table responsive bordered hover variant="dark" size="sm">
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
        </Table>
    );
}