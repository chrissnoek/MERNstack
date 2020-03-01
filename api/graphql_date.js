const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

const GraphQLDate = new GraphQLScalarType({
    name: "GraphQLDate",
    description: "A Date() type in GraphQL as a scalar",
    // gets invoked when we query data
    serialize(value) {
        return value.toISOString();
    },
    // gets invoked to parse client input that was passed through variables
    parseValue(value) {
        const dateValue = new Date(value);
        return Number.isNaN(dateValue.getTime()) ? undefined : dateValue;
    },
    // gets invoked to parse client input that was passed inline in the query
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            const value = new Date(ast.value);
            return Number.isNaN(value.getTime()) ? undefined : value;
        }
        return undefined;
    }
});

module.exports = GraphQLDate;