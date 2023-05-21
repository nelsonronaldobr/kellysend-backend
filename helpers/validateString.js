export const validateString = (str) => {
    const regex = /^([^/]*\/){1}[^/]*$/;
    return regex.test(str);
};