import { Card } from '../card';
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

/**
 * Takes the data of the images and return a deck for the game
 *  @param imgs an array with the data fetches from Unsplash
 *  @returns an array of objects with the url of the image and an Id
 */
export const createDeck = (imgs: ImgData[]): Deck => {
    const deck: Deck = [];

    for (const imgData of imgs) {
        deck.push(new Card(imgData));
    }

    return deck;
};

/**
 * Returns true if the id is in the deck
 * @param deck of cards to evaluate
 * @param id of the card to check for
 * @returns true if the card is on the deck
 */
export const hasCard = (deck: Deck, id: string): boolean => {
    return deck.find((card) => card.id === id);
};
