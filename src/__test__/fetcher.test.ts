import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useImgPathGetter from '../app/hooks/fetcher';

describe('URL Image getter:', () => {
    it('should return an object with imgsPaths, onError and onLoad keys', async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => {},
        });

        const { result } = await waitFor(() =>
            renderHook(() => useImgPathGetter('test')),
        );

        expect(result.current).toHaveProperty('imgsPaths');
        expect(result.current).toHaveProperty('onError');
        expect(result.current).toHaveProperty('onLoad');
    });

    it('should set onLoad true once it finishes fetching', async () => {
        const { result } = await waitFor(() =>
            renderHook(() => useImgPathGetter('test')),
        );

        expect(result.current.onLoad).toBe(false);
    });

    it('should populate imgsPaths with an array objects of length equal to the ammount requested', async () => {
        const dataMock = [
            {
                urls: { small: 'https://url.two' },
                alternative_slugs: {
                    es: 'cadena en español',
                },
                slug: 'cadena en inglés',
                links: { html: 'https://url.one/autor_dos' },
                user: { name: 'autor dos', portfolio_url: 'https://autor.dos' },
            },
        ];

        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => dataMock,
        });

        const { result } = await waitFor(() =>
            renderHook(() => useImgPathGetter('test')),
        );

        expect(result.current.onLoad).toBe(false);

        expect(result.current.imgsPaths).toEqual([
            {
                url: 'https://url.two',
                alt: {
                    es: 'cadena en español',
                    en: 'cadena en inglés',
                },
                credits: {
                    author: 'autor dos',
                    link: 'https://url.one/autor_dos',
                    portfolio: 'https://autor.dos',
                },
            },
        ]);
    });

    it('should return onError true and the description if response is not ok', async () => {
        const errorNumber = 404;
        const errorMessage = 'something happen';

        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: false,
            status: errorNumber,
            json: async () => ({
                errors: errorMessage,
            }),
        });

        const { result } = renderHook(() => useImgPathGetter('test', 2));

        await waitFor(() => {
            expect(result.current.onLoad).toBe(false);
        });

        expect(result.current.onError[0]).toBe(true);
        expect(result.current.onError[1]).toBe(
            `Error ${errorNumber}: ${errorMessage}`,
        );
    });

    it('should return the ammount of images requested', async () => {
        const ammount = Math.floor(Math.random() * 12) + 1;
        const dataMock = Array(ammount).fill({
            urls: { small: 'https://url.two' },
            alternative_slugs: {
                es: 'cadena en español',
            },
            slug: 'cadena en inglés',
            links: { html: 'https://url.one/autor_dos' },
            user: { name: 'autor dos', portfolio_url: 'https://autor.dos' },
        });

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => dataMock,
        });

        const { result } = renderHook(() => useImgPathGetter('test', ammount));

        await waitFor(() => {
            expect(result.current.onLoad).toBe(false);
        });

        expect(result.current.imgsPaths.length).toBe(ammount);
    });

    it('should fetch once, and the query must have the prompt using the prompt', async () => {
        const prompt = 'portrait';

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [],
        });

        const { result } = renderHook(() => useImgPathGetter(prompt, 1));

        await waitFor(() => expect(result.current.onLoad).toBe(false));

        expect(global.fetch).toBeCalledTimes(1);
        expect(global.fetch).toBeCalledWith(
            expect.stringContaining(`query=${prompt}`),
            expect.any(Object),
        );
    });
});
