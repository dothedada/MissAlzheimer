import { describe, it, expect, beforeEach } from 'vitest';
import { Card } from '../card';
import fetchDataMock from '../hooks/__test__/fetchMock.json';

describe('Card', () => {
    const imgsData = fetchDataMock as FetchData[];
    let i: number;
    let j: number;

    beforeEach(() => {
        ((max: number): [number, number] => {
            i = Math.floor(Math.random() * max);
            j = Math.floor(Math.random() * (max - 1));

            if (j >= i) {
                j++;
            }
            return [i, j];
        })(imgsData.length);
    });

    it('should create a card instance with the given data', () => {
        for (const imgData of imgsData) {
            const card = new Card(imgData);
            expect(card).toBeInstanceOf(Card);
            expect(card.author).toBe(imgData.user.name);
            expect(card.img.src).toBe(`${imgData.urls.small}`);
            expect(card.id).toBe(imgData.id);
        }
    });

    it('sould removes the id from the alt texts and replace hyphens', () => {
        const newCard1 = new Card(imgsData[i]);
        const newCard2 = new Card(imgsData[j]);

        expect(newCard1.altEn).not.toContain(newCard1.id);
        expect(newCard2.altEn).not.toContain(newCard2.id);
        expect(newCard1.altEs).not.toContain(newCard1.id);
        expect(newCard2.altEs).not.toContain(newCard2.id);
        expect(newCard1.altEn).not.toContain('-');
        expect(newCard2.altEn).not.toContain('-');
        expect(newCard1.altEs).not.toContain('-');
        expect(newCard2.altEs).not.toContain('-');
        console.log(newCard1);
    });
});
