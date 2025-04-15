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
        this.altEs = this.cleantAltTxt(data.alternative_slugs.es);
        this.altEn = this.cleantAltTxt(data.slug);

        const img = new Image();
        img.src = data.urls.small;
        img.alt = this.altEn;
        this.img = img;
    }

    /**
     * Removes the ID from the slug and changes the hyphens to ' '
     * @param txt takes the string to clean up
     * @returns a string with no ID, hyphens or trailling whitespace
     */
    cleantAltTxt(txt: string): string {
        return txt.replace(this.id, '').replace(/-/g, ' ').trim();
    }
}
