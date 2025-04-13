import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Card } from '../card';
import { imgDataMock } from './imgDataMock';

describe('Card', () => {
    let card: Card;
    let mockImgData: ImgData;

    beforeEach(() => {
        mockImgData = imgDataMock[0];
        card = new Card(mockImgData);
    });

    it('should create a card instance with the given data', () => {
        expect(card).toBeInstanceOf(Card);
        expect(card.author).toBe(mockImgData.credits.author);
        expect(card.altEs).toBe(mockImgData.alt.es);
        expect(card.altEn).toBe(mockImgData.alt.en);
        expect(card.img.src).toBe(`${mockImgData.url}/`);
        expect(card.id).toContain(mockImgData.credits.author);
    });

    it('_randTimestamp should create an hex string', () => {
        const card = new Card(mockImgData);
        // @ts-ignore
        const timestamp = card._randTimestamp();

        expect(typeof timestamp).toBe('string');
        expect(/^[0-9a-f]+$/.test(timestamp)).toBe(true);
    });

    it('should generate a random timestamp that doesnt collide in 1000 calls', () => {
        const timestampsSet: Set<string> = new Set();
        const timestampsArr: string[] = [];
        for (let i = 0; i < 1000; i++) {
            // @ts-ignore
            const timestamp = card._randTimestamp();
            timestampsArr.push(timestamp);
            timestampsSet.add(timestamp);
        }
        expect(timestampsSet.size).toBe(timestampsArr.length);
    });

    it('_createId should concatenate the author name with the hex string', () => {
        // @ts-ignore
        const spy = vi.spyOn(card, '_randTimestamp').mockReturnValue('abc123');
        // @ts-ignore
        const id = card._createId();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(id).toBe(`${mockImgData.credits.author}_abc123`);
    });
});
