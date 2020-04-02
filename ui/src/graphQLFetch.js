const dateRegex = new RegExp("^\\d\\d\\d\\d-\\d\\d-\\d\\d");

function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
}

export default async function graphQLFetch(query, variables = {}, showError = null) {
    try {
        const response = await fetch(window.ENV.UI_API_ENDPOINT, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ query, variables })
        });
        const body = await response.text();
        const result = JSON.parse(body, jsonDateReviver);

        // alert the error message when the result is containing erros
        if (result.errors) {
            const error = result.errors[0];
            if (error.extensions.code === "BAD_USER_INPUT") {
                console.log(error);
                const details = error.extensions.exception.errors.join("\n ");
                showError(`${error.message}\n ${details}`);
            } else if (showError) {
                showError(`${error.extensions.code}\n ${error.message}`);
            }
        }
        return result.data;
    } catch (e) {
        if (showError) showError(`Error in sending data to server: ${e.message}`);
        return null;
    }
}