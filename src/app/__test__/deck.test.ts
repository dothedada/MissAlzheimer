import { Card } from '../card.ts';
import { Deck } from '../deck.ts';
import { describe, it, expect, beforeEach } from 'vitest';

interface ImgData {
    url: string;
    alt: LocalTxt;
    credits: Author;
}

interface LocalTxt {
    es: string;
    en: string;
}

interface Author {
    link: string;
    author: string;
    portfolio: string;
}

describe('Deck', () => {
    let deck: Deck;
    let mockData: ImgData[] = [];

    beforeEach(() => {
        // Reiniciar el mapa estático de cartas antes de cada test
        Deck.cards = new Map();

        // Crear datos de prueba
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

        // Inicializar un nuevo deck para cada test
        deck = new Deck();
    });

    describe('loadDeck', () => {
        it('should load cards into the static cards map', () => {
            deck.loadDeck(mockData);

            expect(Deck.cards.size).toBe(mockData.length);
            expect(Deck.cards.has('card1')).toBeTruthy();
            expect(Deck.cards.has('card2')).toBeTruthy();
            expect(Deck.cards.has('card3')).toBeTruthy();
        });
    });

    describe('getCardById', () => {
        it('should return the correct card when it exists', () => {
            deck.loadDeck(mockData);

            const card = deck.getCardById('card1');

            expect(card).toBeDefined();
            expect(card?.id).toBe('card1');
        });

        it('should return undefined when card does not exist', () => {
            deck.loadDeck(mockData);

            const card = deck.getCardById('nonexistent');

            expect(card).toBeUndefined();
        });
    });

    describe('loadCardsIdsToSequence', () => {
        it('should load all card ids into the sequence', () => {
            deck.loadDeck(mockData);
            deck.loadCardsIdsToSequence();

            expect(deck.sequence.length).toBe(mockData.length);
            expect(deck.sequence).toContain('card1');
            expect(deck.sequence).toContain('card2');
            expect(deck.sequence).toContain('card3');
        });
    });

    describe('flushSequence', () => {
        it('should remove all card ids from the sequence', () => {
            deck.loadDeck(mockData);
            deck.loadCardsIdsToSequence();

            expect(deck.sequence.length).toBeGreaterThan(0);

            deck.flushSequence();

            expect(deck.sequence.length).toBe(0);
        });
    });

    describe('addToSequence', () => {
        it('should add a card id to the sequence', () => {
            deck.loadDeck(mockData);

            deck.addToSequence('card1');

            expect(deck.sequence.length).toBe(1);
            expect(deck.sequence[0]).toBe('card1');
        });

        it('should throw an error when adding a non-existent card id', () => {
            deck.loadDeck(mockData);

            expect(() => {
                deck.addToSequence('nonexistent');
            }).toThrow(Error);
        });
    });

    describe('removeFromSequence', () => {
        it('should remove all instances of a card id from the sequence', () => {
            deck.loadDeck(mockData);

            // Add card1 twice
            deck.addToSequence('card1');
            deck.addToSequence('card2');
            deck.addToSequence('card1');

            expect(deck.sequence.length).toBe(3);

            deck.removeFromSequence('card1');

            expect(deck.sequence.length).toBe(1);
            expect(deck.sequence[0]).toBe('card2');
        });

        it('should throw an error when removing a non-existent card id', () => {
            deck.loadDeck(mockData);

            expect(() => {
                deck.removeFromSequence('nonexistent');
            }).toThrow(Error);
        });
    });

    describe('shuffleSequence', () => {
        it('should shuffle the sequence', () => {
            deck.loadDeck(mockData);
            deck.loadCardsIdsToSequence();

            const originalSequence = [...deck.sequence];

            // Mock Math.random para simular un shuffle predecible
            const mockMath = Object.create(global.Math);
            mockMath.random = () => 0.5;
            global.Math = mockMath;

            deck.shuffleSequence();

            // Restaurar Math.random
            global.Math = Object.create(Math);

            // Verificar que la secuencia haya cambiado (esto podría fallar en raros casos)
            expect(deck.sequence).not.toEqual(originalSequence);
        });

        it('should throw an error when trying to shuffle less than 2 cards', () => {
            deck.loadDeck(mockData);
            deck.addToSequence('card1');

            expect(() => {
                deck.shuffleSequence();
            }).toThrow(Error);
        });
    });

    describe('containsCard', () => {
        it('should return true when the sequence contains the card id', () => {
            deck.loadDeck(mockData);
            deck.addToSequence('card1');

            expect(deck.containsCard('card1')).toBeTruthy();
        });

        it('should return false when the sequence does not contain the card id', () => {
            deck.loadDeck(mockData);

            expect(deck.containsCard('card1')).toBeFalsy();
        });
    });

    describe('hasSameSequenceAs', () => {
        it('should return true when sequences match', () => {
            const otherDeck = new Deck();

            deck.loadDeck(mockData);
            otherDeck.loadDeck(mockData);

            deck.addToSequence('card1');
            deck.addToSequence('card2');

            otherDeck.addToSequence('card1');
            otherDeck.addToSequence('card2');

            expect(deck.hasSameSequenceAs(otherDeck)).toBeTruthy();
        });

        it('should return false when sequences do not match', () => {
            const otherDeck = new Deck();

            deck.loadDeck(mockData);
            otherDeck.loadDeck(mockData);

            deck.addToSequence('card1');
            deck.addToSequence('card2');

            otherDeck.addToSequence('card2');
            otherDeck.addToSequence('card1');

            expect(deck.hasSameSequenceAs(otherDeck)).toBeFalsy();
        });

        it('should throw an error when other deck has more cards', () => {
            const otherDeck = new Deck();

            deck.loadDeck(mockData);
            otherDeck.loadDeck(mockData);

            deck.addToSequence('card1');

            otherDeck.addToSequence('card1');
            otherDeck.addToSequence('card2');

            expect(() => {
                deck.hasSameSequenceAs(otherDeck);
            }).toThrow(Error);
        });
    });

    describe('swapCardsOnSequence', () => {
        it('should swap cards in the sequence the specified number of times', () => {
            deck.loadDeck(mockData);
            deck.addToSequence('card1');
            deck.addToSequence('card2');

            const originalSequence = [...deck.sequence];

            // Mock para #getTwoRandomIndexes para simular un swap específico
            // @ts-ignore - Acceso a método privado para pruebas
            jest.spyOn(deck, '#getTwoRandomIndexes').mockReturnValue([0, 1]);

            deck.swapCardsOnSequence(1);

            // Verificar que se haya realizado el swap
            expect(deck.sequence[0]).toBe(originalSequence[1]);
            expect(deck.sequence[1]).toBe(originalSequence[0]);
        });

        it('should throw an error when trying to swap with less than 2 cards', () => {
            deck.loadDeck(mockData);
            deck.addToSequence('card1');

            expect(() => {
                deck.swapCardsOnSequence(1);
            }).toThrow(Error);
        });
    });
});
