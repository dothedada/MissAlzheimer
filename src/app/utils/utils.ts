/**
 * Creates a random hex based on a timestamp
 * @returns hex string
 */
const randTimestamp = (): string => {
    return (new Date().getTime() * Math.floor(Math.random())).toString(16);
};

/**
 * Creates an unique id for the card that mixes the author string with a random hex
 * @param author a string representing the author name, fetched from Unsplash
 * @returns a unique id, authorName_hexString
 */
export const createId = (author: string): string => {
    return `${author}_${randTimestamp()}`;
};
