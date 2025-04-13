import { error } from 'console';
import { Deck } from '../deck.ts';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Deck', () => {
    let deck: Deck;
    let mockData: ImgData[] = [];

    beforeEach(() => {
        Deck.cards = new Map();

        mockData = [
            {
                url: 'https://test1.com',
                alt: { es: 'testEs1', en: 'testEn1' },
                credits: {
                    link: 'https://linkAImagenEnUnsplash1.com',
                    author: 'author1',
                    portfolio: 'https://lnkAlPorta1.com',
                },
            },
            {
                url: 'https://test2.com',
                alt: { es: 'testEs2', en: 'testEn2' },
                credits: {
                    link: 'https://linkAImagenEnUnsplash2.com',
                    author: 'author2',
                    portfolio: 'https://lnkAlPorta2.com',
                },
            },
            {
                url: 'https://test3.com',
                alt: { es: 'testEs3', en: 'testEn3' },
                credits: {
                    link: 'https://linkAImagenEnUnsplash3.com',
                    author: 'author3',
                    portfolio: 'https://lnkAlPorta3.com',
                },
            },
        ];

        deck = new Deck();
        deck.loadDeck(mockData);
    });

    describe('loadDeck', () => {
        it('should load cards into the static cards map', () => {
            expect(Deck.cards.size).toBe(mockData.length);
        });
    });

    describe('getIdsOnDeck', () => {
        it('should return an array with the generated ids for the cards', () => {
            const ids = Deck.getCurrentIds();
            expect(Array.isArray(ids)).toBe(true);
            expect(ids.length).toBe(3);
        });
    });
    describe('getCardById', () => {
        it('should return the correct card when it exists', () => {
            const ids = Deck.getCurrentIds();
            const card = deck.getCardById(ids[0]);

            expect(card).toBeDefined();
            expect(card?.img.src).toBe(`${mockData[0].url}/`);
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

            expect(deck.sequence.length).toBe(mockData.length);
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
            deck.loadDeck(mockData);

            expect(() => {
                deck.removeFromSequence('nonexistent');
            }).toThrow(Error);
        });
    });

    //shuffleSequence(): void {
    //    if (this.sequence.length < 2) {
    //        throw new Error(`Need at least 2 card ids to shuffle`);
    //    }
    //
    //    const sequence = this.sequence;
    //    for (let i = sequence.length - 1; i > 0; i--) {
    //        const j = Math.floor(Math.random() * (i + 1));
    //        [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
    //    }
    //
    //    this.sequence = sequence;
    //}
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
            deck.loadDeck(mockData);
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
            otherDeck.loadDeck(mockData);

            deck.addToSequence(id1);
            deck.addToSequence(id2);
            otherDeck.addToSequence(id1);
            otherDeck.addToSequence(id2);

            expect(deck.hasSameSequenceAs(otherDeck)).toBeTruthy();
        });

        it('should return false when sequences do not match', () => {
            const [id1, id2] = Deck.getCurrentIds();
            const otherDeck = new Deck();
            otherDeck.loadDeck(mockData);

            deck.addToSequence(id1);
            deck.addToSequence(id2);
            otherDeck.addToSequence(id2);
            otherDeck.addToSequence(id1);

            expect(deck.hasSameSequenceAs(otherDeck)).toBeFalsy();
        });

        it('should throw an error when other deck has more cards', () => {
            const [id1, id2] = Deck.getCurrentIds();
            const otherDeck = new Deck();
            otherDeck.loadDeck(mockData);

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
                // @ts-ignore - Acceso a método privado para pruebas
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
            // @ts-ignore - Acceso a método privado para pruebas
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
