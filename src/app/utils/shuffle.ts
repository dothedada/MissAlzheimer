/**
 * Uses the fisher-yates algorithm to fully shuffle the ids on the deck,
 * return a new copy of the deck
 * @param cards the array of cards ids
 * @returns new shuffle deck
 */
export const shuffleCards = (cards: string[]): string[] => {
    if (cards.length < 2) {
        return cards;
    }
    const newDeck = [...cards];
    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    return newDeck;
};

/**
 * Get two random numbers from between 0 and the max amount
 * @param max the upper limit for the indexes
 * @throws Errors if max is lesser than 2
 * @returns an array of two different and random numbers
 */
const getTwoRandomIndexes = (max: number): [number, number] => {
    if (max < 2) {
        throw new Error('max must be higher than 2');
    }

    const i = Math.floor(Math.random() * max);
    let j = Math.floor(Math.random() * (max - 1));

    if (j >= i) {
        j++;
    }

    return [i, j];
};

/**
 * Makes the specified amount of changes on the deck and returns a new deck
 * @param cards the array of id to shiffle
 * @param amount the amount of changes needed
 * @returns the new ids array with the cards shuffled
 */
export const shiftCards = (cards: string[], amount: number): string[] => {
    if (cards.length < 2) {
        return cards;
    }
    const newDeck = [...cards];
    let shifts = Math.min(amount, newDeck.length);

    while (shifts) {
        const [i, j] = getTwoRandomIndexes(newDeck.length);
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
        shifts--;
    }

    return newDeck;
};
