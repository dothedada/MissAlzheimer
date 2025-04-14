import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { makeURL, useImgDataFetcher } from '../useDataFetcher.ts';
import mockData from './fetchMock.json';
import mockErrorData from './fetchErrorMock.json';

let randomString: string;
let randomNumber: number;

describe('makeURL', () => {
    beforeEach(() => {
        randomString = Math.floor(Math.random() * 1_000_000).toString(36);
        randomNumber = Math.floor(Math.random() * 16) + 1;
    });

    it('should start with the url to the api of Unsplash for random images', () => {
        const unsplashUrl = 'https://api.unsplash.com/photos/random';
        const query = makeURL('abc', 1);

        expect(query.startsWith(unsplashUrl)).toBe(true);
    });

    it('should include the query word', () => {
        const query = makeURL(randomString, 1);

        expect(query).toContain(`query=${randomString}`);
    });

    it('should return the requested amount', () => {
        const query = makeURL('abc', randomNumber);

        expect(query).toContain(`count=${randomNumber}`);
    });

    it('should throws an error if any of the makeURL params is missing', () => {
        expect(() => {
            // @ts-ignore
            makeURL(randomString);
        }).toThrowError();
        expect(() => {
            // @ts-ignore
            makeURL();
        }).toThrowError();
    });
});

describe('useImgDataFetcher', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        global.fetch = vi.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData),
            }),
        );
    });

    it('should should make the fetch with the right url', async () => {
        randomString = Math.floor(Math.random() * 1_000_000).toString(36);
        randomNumber = Math.floor(Math.random() * 16) + 1;

        renderHook(() => useImgDataFetcher(randomString, randomNumber));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();

            const fetchUrl = (global.fetch as Mock).mock.calls[0][0];
            expect(fetchUrl).toContain(`query=${randomString}`);
            expect(fetchUrl).toContain(`count=${randomNumber}`);
            expect(fetchUrl).toContain('api.unsplash.com/photos/random');
        });
    });

    it('should change the state of onloadign when the data is fetched', async () => {
        const { result } = renderHook(() => useImgDataFetcher('lucy'));

        expect(result.current.loaded).toBe(false);
        await waitFor(() => {
            expect(result.current.loaded).toBe(true);
        });
    });

    it('should return error if the response is not ok', async () => {
        vi.clearAllMocks();

        global.fetch = vi.fn().mockImplementation(() =>
            Promise.resolve({
                ok: false,
                status: 666,
                json: () => Promise.resolve(mockErrorData),
            }),
        );

        const { result } = renderHook(() => useImgDataFetcher('lucy'));

        await waitFor(() => {
            expect(result.current.onError[0]).toBe(true);
            expect(result.current.onError[1].code).toBe(666);
            expect(result.current.onError[1].description).toBe(
                mockErrorData.errors[0],
            );
        });
    });
});
