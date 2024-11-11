import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useImgPathGetter from '../app/hooks/fetcher';

describe('URL Image getter:', () => {
    it('should return an object with imgsPaths, onError and onLoad keys', async () => {
        global.fetch = vi.fn().mockResolvedValue({
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

        global.fetch = vi.fn().mockResolvedValue({
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
});
