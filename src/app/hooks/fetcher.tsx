import { useEffect, useState } from 'react';

type ImgData = {
    url: string;
    alt: { es: string; en: string };
    credits: {
        link: string;
        author: string;
        portfolio: string;
    };
};
type ImgsRequest = {
    imgsPaths: ImgData[];
    onError: [boolean, string | unknown];
    onLoad: boolean;
};

const makeRequestUrl = (prompt: string, ammount: number) => {
    const base = `https://api.unsplash.com/photos/random/?query=${prompt}`;
    const count = `&count=${ammount}`;
    const key = 'MtVF3iHiL4FqTKUhyunCRKrX3d2PBPIe6BrTs0v-Q5U';
    const id = `&client_id=${key}`;

    return `${base}${count}${id}`;
};

const useImgPathGetter = (prompt: string, ammount = 12): ImgsRequest => {
    const [imgsPaths, setImgsPaths] = useState([]);
    const [onError, setOnError] = useState([false, '']);
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
                    throw { code: request.status, description: errors };
                }

                const requestArr = await request.json();
                const requestImg = requestArr.map((img): ImgData => {
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
                const { code, description } = err;
                const errPrompt = `Error ${code}: ${description}`;

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
