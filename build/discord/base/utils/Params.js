export function getCustomIdParams(definition, customId) {
    const regex = new RegExp(`^${definition.replace(/:[^\s/]+/g, "([^/]+)")}$`);
    const paramNames = definition.match(/:([^\s/]+)/g) || [];
    const match = customId.match(regex);
    if (!match)
        return null;
    const params = {};
    const arrayNameRegex = new RegExp(/^\[(.*)\]$/);
    match.slice(1).forEach((value, index) => {
        const paramName = paramNames[index].slice(1);
        const arrayParamName = paramName.match(arrayNameRegex);
        if (arrayParamName) {
            params[arrayParamName[1]] = value.split(",").filter(Boolean);
        }
        else {
            params[paramName] = value;
        }
    });
    return params;
}
