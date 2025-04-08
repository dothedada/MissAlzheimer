interface ImgRequest {
    imgsData: ImgData[];
    onError: ErrorData;
    loaded: boolean;
}

interface ImgData {
    url: string;
    alt: LocalTxt;
    credits: Author;
}

interface LocalTxt {
    es: string;
    en: string;
}

interface Author {
    link: string;
    author: string;
    portfolio: string;
}

type ErrorData = [isError: boolean, errorMsg: string];

interface ErrorFetch {
    code: number | 'unknow';
    description: string[];
}

interface FetchData {
    urls: { small: string };
    alternative_slugs: { es: string };
    slug: string;
    links: { html: string };
    user: { name: string; portfolio_url: string };
}
