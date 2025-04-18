import { Card } from './card';

/**
 * Represents a deck of cards with functionality for managing and manipulating
 * card sequences.
 *
 * This class provides methods for loading card data, managing sequences of cards,
 * shuffling, comparing sequences, and performing various sequence operations.
 */
export class Deck {
    /**
     * Static repository of all available cards indexed by their IDs.
     */
    static cards: Map<string, Card> = new Map();

    /**
     * Ordered sequence of card IDs that represents the state of the deck.
     */
    sequence: string[] = [];

    /**
     * creates the cards elements an place them in the Deck
     *  @param data an array with the data fetches from Unsplash
     */
    createDeck(data: FetchData[]): void {
        for (const imgData of data) {
            const card = new Card(imgData);
            Deck.cards.set(card.id, card);
        }
    }

    /**
     * Get the current ids in the deck
     * @returns an array of ids
     */
    static getCurrentIds(): string[] {
        return [...Deck.cards.keys()];
    }

    /**
     * Gets one card by the id
     * @param id the card id
     * @returns the Card object or undefined
     */
    getCardById(id: string): Card | undefined {
        return Deck.cards.get(id);
    }

    /**
     * Load all the cards ids to the sequence
     */
    loadCardsIdsToSequence(): void {
        this.sequence = [...Deck.cards.keys()];
    }

    /**
     * removes all cards ids from the sequence
     */
    flushSequence(): void {
        this.sequence = [];
    }

    /**
     * Add the card id to the sequence
     * @param id the card id to look for
     * @throws Error if the card id does not exist
     */
    addToSequence(id: string) {
        if (!Deck.cards.has(id)) {
            throw new Error(`There is no card with id '${id}'`);
        }

        this.sequence.push(id);
    }

    /**
     * Adds a random card to the sequence array
     * @param noRepeat - Controls if repeated cards are allowed. If true, only adds cards not already in the sequence.
     * @default false
     * @throws When there are no more unique cards available to add to the sequence (when noRepeat is true)
     * @throws When the internal deck array becomes empty during processing
     */
    addToSecuenceRandom(noRepeat = false) {
        const selected = new Set(this.sequence);

        if (noRepeat && Deck.cards.size === selected.size) {
            throw new Error('cannot add more cards to the secuence');
        }

        const deckArr = [...Deck.cards.keys()];
        let newCard: string;
        do {
            if (!deckArr.length) {
                throw new Error('cannot add more cards to the secuence');
            }
            const index = Math.floor(Math.random() * deckArr.length);
            newCard = deckArr[index];
            deckArr.splice(index, 1);
        } while (noRepeat && selected.has(newCard));

        this.sequence.push(newCard);
    }

    /**
     * Removes all the cards ids with the given id from the sequence
     * @param id the card id to look for
     * @throws Error if the card id does not exist
     */
    removeFromSequence(id: string): void {
        if (!Deck.cards.has(id)) {
            throw new Error(`There is no card with id '${id}'`);
        }

        this.sequence = this.sequence.filter((cardId) => cardId !== id);
    }

    /**
     * Uses the fisher-yates algorithm to fully shuffle the ids on the sequence,
     * @throws Error if there is not enough cards to shuffle
     */
    shuffleSequence(): void {
        if (this.sequence.length < 2) {
            throw new Error(`Need at least 2 card ids to shuffle`);
        }

        const sequence = this.sequence;
        for (let i = sequence.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
        }

        this.sequence = sequence;
    }

    /**
     * Checks if a card id is on the cards sequence
     * @param id of the card to check for
     */
    containsCard(id: string): boolean {
        return this.sequence.some((cardId) => cardId === id);
    }

    /**
     * Compare if the card sequence matches the given deck sequence
     * @param otherDeck the deck to compare to
     * @returns true if the current sequence match the game, otherwise is false
     */
    hasSameSequenceAs(otherDeck: Deck): boolean {
        if (this.sequence.length < otherDeck.sequence.length) {
            throw new Error('User deck cannot be bigger than game deck');
        }

        for (let i = 0; i < otherDeck.sequence.length; i++) {
            if (this.sequence[i] !== otherDeck.sequence[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Swap two ids on the sequence the amount of times requested
     * @param amount the times needed to swap the sequence
     * returns void
     */
    swapCardsOnSequence(amount: number): void {
        if (this.sequence.length < 2) {
            throw new Error('needs a sequence length > 1 to swap');
        }

        const sequence = this.sequence;
        for (let i = Math.min(this.sequence.length, amount); i > 0; i--) {
            const [j, k] = this._getTwoRandomIndexes();
            [sequence[j], sequence[k]] = [sequence[k], sequence[j]];
        }
    }

    /**
     * Get two random indexes from the sequence
     * @returns an array of two different numbers
     */
    protected _getTwoRandomIndexes(): [number, number] {
        if (this.sequence.length < 2) {
            throw new Error('the sequence must have a length more than 1');
        }

        const i = Math.floor(Math.random() * this.sequence.length);
        let j = Math.floor(Math.random() * (this.sequence.length - 1));

        if (j >= i) {
            j++;
        }
        return [i, j];
    }
}
