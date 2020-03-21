const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db.js');

async function get(_, { id }) {
    const db = getDb();
    const issue = await db.collection('issues').findOne({ id });
    return issue;
}

async function update(_, { id, changes }) {
    const db = getDb();

    // check if there are changes to fields to validate them
    if (changes.title || changes.status || changes.owner) {
        const issue = await db.collection('issues').findOne({ id });
        // copy and merge changed values to the target object ()
        Object.assign(issue, changes);
        validate(issue);
    }
    // now update the issue in db
    await db.collection('issues').updateOne({ id }, { $set: changes });
    const savedIssue = await db.collection('issues').findOne({ id });
    return savedIssue;
}

async function remove(_, { id }) {
    const db = getDb();
    // find issue
    const issue = await db.collection('issues').findOne({ id });
    if (!issue) return false;
    issue.deleted = new Date();

    // store deleted issue in new collection so we can retrieve them later
    let result = await db.collection('deleted_issues').insertOne({ issue });
    if (result.insertedId) {
        result = await db.collection('issues').removeOne({ id });
        return result.deletedCount === 1;
    }
    return false;
}

async function list(_, { status, effortMin, effortMax }) {
    const db = getDb();
    const filter = {};

    if (status) filter.status = status;

    if (effortMin !== undefined || effortMax !== undefined) {
        filter.effort = {};
        if (effortMin !== undefined) filter.effort.$gte = effortMin;
        if (effortMax !== undefined) filter.effort.$lte = effortMax;
    }

    const issues = await db.collection('issues').find(filter).toArray();
    return issues;
}

function validate(issue) {
    const errors = [];
    if (issue.title.length < 3) {
        errors.push('Field "title" must be at least 3 characters long.');
    }
    if (issue.status === 'Assigned' && !issue.owner) {
        errors.push('Field "owner" is required when status is "Assigned"');
    }
    if (errors.length > 0) {
        throw new UserInputError('Invalid input(s)', { errors });
    }
}

async function add(_, { issue }) {
    const db = getDb();
    validate(issue);

    const newIssue = Object.assign({}, issue);
    newIssue.created = new Date();
    newIssue.id = await getNextSequence('issues');

    const result = await db.collection('issues').insertOne(newIssue);
    const savedIssue = await db.collection('issues')
        .findOne({ _id: result.insertedId });
    return savedIssue;
}


module.exports = { list, add, get, update, delete: remove };