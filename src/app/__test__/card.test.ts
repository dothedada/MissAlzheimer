import { describe, it, expect } from 'vitest';
import { Card } from '../card';
import fetchDataMock from '../hooks/__test__/fetchMock.json';

describe('Card', () => {
    const imgsData = fetchDataMock as FetchData[];
    it('should create a card instance with the given data', () => {
        for (const imgData of imgsData) {
            const card = new Card(imgData);
            expect(card).toBeInstanceOf(Card);
            expect(card.author).toBe(imgData.user.name);
            expect(card.altEs).toBe(imgData.alternative_slugs.es);
            expect(card.altEn).toBe(imgData.slug);
            expect(card.img.src).toBe(`${imgData.urls.small}`);
            expect(card.id).toBe(imgData.id);
        }
    });
});
