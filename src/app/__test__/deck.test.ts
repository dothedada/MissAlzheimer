import { Deck } from '../deck.ts';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { imgDataMock } from './imgDataMock.ts';

describe('Deck', () => {
    let deck: Deck;
    let dataMock: ImgData[];

    beforeEach(() => {
        Deck.cards = new Map();
        deck = new Deck();
        dataMock = imgDataMock;
        deck.loadDeck(dataMock);
    });

    describe('loadDeck', () => {
        it('should load cards into the static cards map', () => {
            console.log(Deck.cards);
            expect(Deck.cards.size).toBe(dataMock.length);
        });
    });

    describe('getIdsOnDeck', () => {
        it('should return an array with the generated ids for the cards', () => {
            const ids = Deck.getCurrentIds();

            expect(Array.isArray(ids)).toBe(true);
            expect(ids.length).toBe(dataMock.length);
        });
    });
    describe('getCardById', () => {
        it('should return the correct card when it exists', () => {
            const ids = Deck.getCurrentIds();
            const card = deck.getCardById(ids[0]);

            expect(card).toBeDefined();
            expect(card?.img.src).toBe(`${dataMock[0].url}/`);
        });

        it('should return undefined when card does not exist', () => {
            const card = deck.getCardById('nonexistent');

            expect(card).toBeUndefined();
        });
    });

    describe('loadCardsIdsToSequence', () => {
        it('should load all card ids into the sequence', () => {
            const [id1, id2, id3] = Deck.getCurrentIds();
            deck.loadCardsIdsToSequence();

            expect(deck.sequence.length).toBe(dataMock.length);
            expect(deck.sequence).toContain(id1);
            expect(deck.sequence).toContain(id2);
            expect(deck.sequence).toContain(id3);
        });
    });

    describe('flushSequence', () => {
        it('should remove all card ids from the sequence', () => {
            deck.loadCardsIdsToSequence();

            expect(deck.sequence.length).toBeGreaterThan(0);

            deck.flushSequence();

            expect(deck.sequence.length).toBe(0);
        });
    });

    describe('addToSequence', () => {
        it('should add a card id to the sequence', () => {
            const [id1] = Deck.getCurrentIds();
            deck.addToSequence(id1);

            expect(deck.sequence.length).toBe(1);
            expect(deck.sequence[0]).toBe(id1);
        });

        it('should throw an error when adding a non-existent card id', () => {
            expect(() => {
                deck.addToSequence('nonexistent');
            }).toThrow(Error);
        });
    });

    describe('removeFromSequence', () => {
        it('should remove all instances of a card id from the sequence', () => {
            const [id1, id2] = Deck.getCurrentIds();
            deck.addToSequence(id1);
            deck.addToSequence(id2);
            deck.addToSequence(id1);

            expect(deck.sequence.length).toBe(3);

            deck.removeFromSequence(id1);

            expect(deck.sequence.length).toBe(1);
            expect(deck.sequence[0]).toBe(id2);
        });

        it('should throw an error when removing a non-existent card id', () => {
            deck.loadDeck(dataMock);

            expect(() => {
                deck.removeFromSequence('nonexistent');
            }).toThrow(Error);
        });
    });

    describe('shuffleSequence', () => {
        it('should not introduce new elements to the sequence', () => {
            deck.loadCardsIdsToSequence();
            const lgth = deck.sequence.length;
            deck.shuffleSequence();
            expect(deck.sequence.length).toBe(lgth);
        });
        it('should expect to be a sequence created by Math.random', () => {
            deck.loadCardsIdsToSequence();
            const mockRandom = vi.spyOn(Math, 'random').mockReturnValue(0.5);
            deck.shuffleSequence();

            expect(mockRandom).toHaveBeenCalled();
        });

        it('shold change the deck sequence', () => {
            deck.loadCardsIdsToSequence();
            const originalSequence = [...deck.sequence];
            vi.spyOn(Math, 'random').mockReturnValue(0);
            deck.shuffleSequence();
            const [id1, id2, id3] = Deck.getCurrentIds();
            const expectedSecuence = [id2, id3, id1];

            expect(deck.sequence).not.toEqual(originalSequence);
            expect(deck.sequence).toStrictEqual(expectedSecuence);
        });

        it('should throw an error when trying to shuffle less than 2 cards', () => {
            deck.loadDeck(dataMock);
            const [id1] = Deck.getCurrentIds();
            deck.addToSequence(id1);

            expect(() => {
                deck.shuffleSequence();
            }).toThrow(Error);
        });
    });

    describe('containsCard', () => {
        it('should return true when the sequence contains the card id', () => {
            const [id1] = Deck.getCurrentIds();
            deck.addToSequence(id1);

            expect(deck.containsCard(id1)).toBeTruthy();
        });

        it('should return false when the sequence does not contain the card id', () => {
            const [id1] = Deck.getCurrentIds();

            expect(deck.containsCard(id1)).toBeFalsy();
        });
    });

    describe('hasSameSequenceAs', () => {
        it('should return true when sequences match', () => {
            const [id1, id2] = Deck.getCurrentIds();
            const otherDeck = new Deck();
            otherDeck.loadDeck(dataMock);

            deck.addToSequence(id1);
            deck.addToSequence(id2);
            otherDeck.addToSequence(id1);
            otherDeck.addToSequence(id2);

            expect(deck.hasSameSequenceAs(otherDeck)).toBeTruthy();
        });

        it('should return false when sequences do not match', () => {
            const [id1, id2] = Deck.getCurrentIds();
            const otherDeck = new Deck();
            otherDeck.loadDeck(dataMock);

            deck.addToSequence(id1);
            deck.addToSequence(id2);
            otherDeck.addToSequence(id2);
            otherDeck.addToSequence(id1);

            expect(deck.hasSameSequenceAs(otherDeck)).toBeFalsy();
        });

        it('should throw an error when other deck has more cards', () => {
            const [id1, id2] = Deck.getCurrentIds();
            const otherDeck = new Deck();
            otherDeck.loadDeck(dataMock);

            deck.addToSequence(id1);
            otherDeck.addToSequence(id1);
            otherDeck.addToSequence(id2);

            expect(() => {
                deck.hasSameSequenceAs(otherDeck);
            }).toThrow(Error);
        });
    });

    describe('twoRandomIndexes', () => {
        it('should throw an error if sequence is two short', () => {
            expect(() => {
                // @ts-ignore
                deck._getTwoRandomIndexes();
            }).toThrow(Error);
        });

        it('should return two indexes between sequence bound', () => {
            deck.loadCardsIdsToSequence();
            vi.spyOn(Math, 'random')
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(0.999);
            // @ts-ignore
            expect(deck._getTwoRandomIndexes()).toStrictEqual([0, 2]);
        });
    });

    describe('swapCardsOnSequence', () => {
        it('should swap cards in the sequence the specified number of times', () => {
            const [id1, id2] = Deck.getCurrentIds();
            deck.addToSequence(id1);
            deck.addToSequence(id2);
            const originalSequence = [...deck.sequence];
            // @ts-ignore
            vi.spyOn(deck, '_getTwoRandomIndexes').mockReturnValue([0, 1]);
            deck.swapCardsOnSequence(1);

            expect(deck.sequence[0]).toBe(originalSequence[1]);
            expect(deck.sequence[1]).toBe(originalSequence[0]);
        });

        it('should throw an error when trying to swap with less than 2 cards', () => {
            const [id1] = Deck.getCurrentIds();
            deck.addToSequence(id1);

            expect(() => {
                deck.swapCardsOnSequence(1);
            }).toThrow(Error);
        });
    });
});
