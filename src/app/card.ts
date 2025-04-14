/**
 * Represents a card and its properties
 */
export class Card {
    id: string;
    author: string;
    altEs: string;
    altEn: string;
    img: HTMLImageElement;

    constructor(data: FetchData) {
        this.id = data.id;
        this.author = data.user.name;
        this.altEs = data.alternative_slugs.es;
        this.altEn = data.slug;

        const img = new Image();
        img.src = data.urls.small;
        img.alt = this.altEn;
        this.img = img;
    }
}
