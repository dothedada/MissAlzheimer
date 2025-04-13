import { createId } from './utils/utils.ts';

export class Card {
    id: string;
    author: string;
    img: HTMLImageElement;
    altEs: string;
    altEn: string;

    constructor(data: ImgData) {
        this.id = createId(data.credits.author);
        this.author = data.credits.author;
        this.altEs = data.alt.es;
        this.altEn = data.alt.en;

        const img = new Image();
        img.src = data.url;
        img.alt = this.altEn;
        this.img = img;
    }
}
