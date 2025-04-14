interface ImgRequest {
    imgsData: FetchData[];
    onError: ErrorData;
    loaded: boolean;
}

interface ImgData {
    id: string;
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

type ErrorData = [isError: boolean, errorMsg: ErrorFetch];

interface ErrorFetch {
    code: number | 'unknow';
    description: string[];
}

interface FetchData {
    id: string;
    slug: string;
    alternative_slugs: { es: string };
    urls: { small: string };
    links: { html: string };
    user: { name: string; portfolio_url: string };
}

type Deck = Card[];
