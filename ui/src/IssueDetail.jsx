import React from 'react';

const IssueDetail = ({ issue }) => {
    if (issue) {
        return (
            <div>
                <h3>Description</h3>
                <pre>{issue.description}</pre>
            </div>
        )
    }
    return null;
}

export default IssueDetail;