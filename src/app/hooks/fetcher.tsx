import { useEffect, useState } from 'react';

interface LocalizedText {
    es: string;
    en: string;
}

interface Author {
    link: string;
    author: string;
    portfolio: string;
}

interface ImgData {
    url: string;
    alt: LocalizedText;
    credits: Author;
}

type ErrorState = [isError: boolean, errorMessage: string];

type ImgsRequest = {
    imgsPaths: ImgData[];
    onError: ErrorState;
    onLoad: boolean;
};

interface UnsplashURL {
    small: string;
}

interface UnsplashAltSlug {
    es: string;
}

interface UnsplashLink {
    html: string;
}

interface UnsplashUser {
    name: string;
    portfolio_url: string;
}

interface ImgFetchedData {
    urls: UnsplashURL;
    alternative_slugs: UnsplashAltSlug;
    slug: string;
    links: UnsplashLink;
    user: UnsplashUser;
}

type FetchError = {
    code: number | 'unknown';
    description: string[];
};

const makeRequestUrl = (prompt: string, ammount: number) => {
    const base = `https://api.unsplash.com/photos/random/?query=${prompt}`;
    const count = `&count=${ammount}`;
    const key = 'MtVF3iHiL4FqTKUhyunCRKrX3d2PBPIe6BrTs0v-Q5U';
    const id = `&client_id=${key}`;

    return `${base}${count}${id}`;
};

const useImgPathGetter = (prompt: string, ammount = 12): ImgsRequest => {
    const [imgsPaths, setImgsPaths] = useState<ImgData[]>([]);
    const [onError, setOnError] = useState<ErrorState>([false, '']);
    const [onLoad, setOnLoad] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const fetcher = async () => {
            try {
                const request = await fetch(makeRequestUrl(prompt, ammount), {
                    mode: 'cors',
                    signal: controller.signal,
                });

                if (!request.ok) {
                    const { errors } = await request.json();
                    throw {
                        code: request.status,
                        description: errors,
                    } as FetchError;
                }

                const requestArr: ImgFetchedData[] = await request.json();
                const requestImg: ImgData[] = requestArr.map((img): ImgData => {
                    return {
                        url: img.urls.small,
                        alt: { es: img.alternative_slugs.es, en: img.slug },
                        credits: {
                            link: img.links.html,
                            author: img.user.name,
                            portfolio: img.user.portfolio_url,
                        },
                    };
                });

                setImgsPaths(requestImg);
            } catch (err) {
                const { code = 'unknow', description = ['Unexpected error'] } =
                    err as FetchError;

                const errPrompt = `Error ${code}: ${description.join('')}`;

                setOnError([true, errPrompt]);
            } finally {
                setOnLoad(false);
            }
        };
        fetcher();

        return () => {
            controller.abort();
        };
    }, [prompt, ammount]);

    return { imgsPaths, onError, onLoad };
};

export default useImgPathGetter;
