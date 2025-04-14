import { Deck } from '../deck.ts';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import imgDataMock from '../hooks/__test__/fetchMock.json';

describe('Deck', () => {
    let deck: Deck;
    let dataMock: FetchData[];

    beforeEach(() => {
        Deck.cards = new Map();
        deck = new Deck();
        dataMock = imgDataMock;
        deck.createDeck(dataMock);
    });

    describe('loadDeck', () => {
        it('should load cards into the static cards map', () => {
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
            expect(card?.img.src).toBe(`${dataMock[0].urls.small}`);
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

    describe('addToSequenceRandom', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('should use math.random to pick a card', () => {
            expect(deck.sequence.length).toBe(0);
            const randSpy = vi.spyOn(Math, 'random');
            deck.addToSecuenceRandom();
            expect(randSpy).toHaveBeenCalled();
        });

        it('should add a random card id from de Deck to the secuence', () => {
            expect(deck.sequence.length).toBe(0);
            deck.addToSecuenceRandom();
            expect(deck.sequence.length).toBe(1);
            expect([...Deck.cards.keys()]).toContain(deck.sequence[0]);
        });

        it('should pick a card not in the secuence array if noRepeat param is true', () => {
            expect(deck.sequence.length).toBe(0);
            vi.spyOn(Math, 'random')
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(0);
            deck.addToSecuenceRandom();
            expect(deck.sequence.length).toBe(1);
            deck.addToSecuenceRandom(true);
            expect(new Set(deck.sequence).size).toBe(2);
        });

        it('should throw error if noRepeat is true and there is no cards left to add', () => {
            deck.loadCardsIdsToSequence();
            expect(deck.sequence.length).toBe(Deck.cards.size);
            expect(() => deck.addToSecuenceRandom(true)).toThrowError();
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
            deck.createDeck(dataMock);

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
            const [id1, id2, id3] = Deck.getCurrentIds();
            deck.addToSequence(id1);
            deck.addToSequence(id2);
            deck.addToSequence(id3);
            const originalSequence = [...deck.sequence];
            vi.spyOn(Math, 'random').mockReturnValue(0);
            deck.shuffleSequence();
            const expectedSecuence = [id2, id3, id1];

            expect(deck.sequence).not.toEqual(originalSequence);
            expect(deck.sequence).toStrictEqual(expectedSecuence);
        });

        it('should throw an error when trying to shuffle less than 2 cards', () => {
            deck.createDeck(dataMock);
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
            otherDeck.createDeck(dataMock);

            deck.addToSequence(id1);
            deck.addToSequence(id2);
            otherDeck.addToSequence(id1);
            otherDeck.addToSequence(id2);

            expect(deck.hasSameSequenceAs(otherDeck)).toBeTruthy();
        });

        it('should return false when sequences do not match', () => {
            const [id1, id2] = Deck.getCurrentIds();
            const otherDeck = new Deck();
            otherDeck.createDeck(dataMock);

            deck.addToSequence(id1);
            deck.addToSequence(id2);
            otherDeck.addToSequence(id2);
            otherDeck.addToSequence(id1);

            expect(deck.hasSameSequenceAs(otherDeck)).toBeFalsy();
        });

        it('should throw an error when other deck has more cards', () => {
            const [id1, id2] = Deck.getCurrentIds();
            const otherDeck = new Deck();
            otherDeck.createDeck(dataMock);

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
            expect(deck._getTwoRandomIndexes()).toStrictEqual([
                0,
                Deck.cards.size - 1,
            ]);
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
