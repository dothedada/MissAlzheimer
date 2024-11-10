import { useEffect, useState } from 'react';

type imgsFetch = string[];
type errorFetch = [boolean, string | unknown];
type loadingFetch = boolean;
type imgArray = {
    imgsPaths: imgsFetch;
    onError: errorFetch;
    onLoad: loadingFetch;
};

const useImgPathGetter = (prompt: string): imgArray => {
    const [imgsPaths, setImgsPaths] = useState<imgsFetch>([]);
    const [onError, setOnError] = useState<errorFetch>([false, '']);
    const [onLoad, setOnLoad] = useState<loadingFetch>(true);

    useEffect(() => {
        const fetcher = async () => {
            try {
                setImgsPaths(['']);
            } catch (err) {
                console.log(err);
                setOnError([true, err]);
            } finally {
                setOnLoad(false);
            }
        };

        fetcher();

        return () => {
            console.log('unmount');
        };
    }, [prompt]);

    return { imgsPaths, onError, onLoad };
};

export default useImgPathGetter;
