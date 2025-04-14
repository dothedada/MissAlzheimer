import { useState, useEffect } from 'react';

const key = 'MtVF3iHiL4FqTKUhyunCRKrX3d2PBPIe6BrTs0v-Q5U';

/**
 * Creates the url to fetch the images from Unsplash
 * @param prompt the search param for Unsplash
 * @param amount the amount of images data to fetch
 * @returns the formatted URL to fetch images from Unsplash
 */
export const makeURL = (prompt: string, amount: number): string => {
    if (!prompt || amount === undefined) {
        throw new Error('missing prompt and/or amount params');
    }

    const base = `https://api.unsplash.com/photos/random/?query=${prompt}`;
    const count = `&count=${amount}`;
    const id = `&client_id=${key}`;

    return `${base}${count}${id}`;
};

/**
 * Fetches the data to create the deck of cards
 * @param prompt The search param for Unsplash
 * @param amount The amount of images data to fetch, the default is 16
 * @returns ImgRequest An object containing the result of the fetch
 * @property {ImgData[]} ImgRequest.imgsData - If the fetch was successful, contains the data for the cards
 * @property {ErrorData} ImgRequest.onError - If the fetch was not successful, returns an array with the error data
 * @property {boolean} ImgRequest.loaded - Returns the status of the fetch
 */
export const useImgDataFetcher = (prompt: string, amount = 16): ImgRequest => {
    const [imgsData, setImgsData] = useState<ImgData[]>([]);
    const [onError, setOnError] = useState<ErrorData>([false, {}]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                const request = await fetch(makeURL(prompt, amount), {
                    mode: 'cors',
                    signal: controller.signal,
                });

                if (!request.ok) {
                    const { errors } = await request.json();
                    throw {
                        code: request.status,
                        description: errors.join(', '),
                    };
                }

                const requestArr = await request.json();

                setImgsData(requestArr);
            } catch (err) {
                setOnError([true, err as ErrorFetch]);
            } finally {
                setLoaded(true);
            }
        })();

        return () => {
            controller.abort();
        };
    }, [prompt, amount]);

    return { imgsData, onError, loaded };
};
