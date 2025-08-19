export default (str: string): string => {
    return str
        .normalize("NFD")                    // split accents from letters
        .replace(/[\u0300-\u036f]/g, "")     // remove accents
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")         // replace non-alphanumerics with -
        .replace(/^-+|-+$/g, "");            // remove leading/trailing -
}
