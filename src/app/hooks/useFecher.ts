import { useState, useEffect } from 'react';

const key = 'MtVF3iHiL4FqTKUhyunCRKrX3d2PBPIe6BrTs0v-Q5U';

/**
 * Creates the url to fetch the images from Unsplash
 * @param prompt the search param for Unsplash
 * @param amount the amount of images data to fetch, de default is 16
 * @returns the formatted URL to fetch images from Unsplash
 */
const makeURL = (prompt: string, amount = 16): string => {
    const base = `https://api.unsplash.com/photos/random/?query=${prompt}`;
    const count = `&count=${amount}`;
    const id = `&client_id=${key}`;

    return `${base}${count}${id}`;
};

/**
 * Fetches the data to create the deck of cards
 * @param prompt The search param for Unsplash
 * @param amount The amount of images data to fetch, default is 16
 * @returns ImgRequest An object containing the result of the fetch
 * @property {ImgData[]} ImgRequest.imgsData - If the fetch was successful, contains the data for the cards
 * @property {ErrorData} ImgRequest.onError - If the fetch was not successful, returns an array with the error data
 * @property {boolean} ImgRequest.loaded - Returns the status of the fetch
 */
export const useDataFetcher = (prompt: string, amount = 16): ImgRequest => {
    const [imgsData, setImgsData] = useState<ImgData[]>([]);
    const [onError, setOnError] = useState<ErrorData>([false, '']);
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
                        description: errors,
                    } as ErrorFetch;
                }

                const requestArr: FetchData[] = await request.json();
                const requestImgs: ImgData[] = requestArr.map(
                    (img): ImgData => ({
                        url: img.urls.small,
                        alt: { es: img.alternative_slugs.es, en: img.slug },
                        credits: {
                            link: img.links.html,
                            author: img.user.name,
                            portfolio: img.user.portfolio_url,
                        },
                    }),
                );

                setImgsData(requestImgs);
            } catch (err) {
                setOnError([true, '']);
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
