/**
 * Represents a card and its properties
 */
export class Card {
    id: string;
    author: string;
    img: HTMLImageElement;
    altEs: string;
    altEn: string;

    constructor(data: ImgData) {
        this.author = data.credits.author;
        this.altEs = data.alt.es;
        this.altEn = data.alt.en;
        this.id = this._createId();

        const img = new Image();
        img.src = data.url;
        img.alt = this.altEn;
        this.img = img;
    }
    /**
     * Creates a random hex based on a timestamp
     * @returns hex string
     */
    protected _randTimestamp(): string {
        return Math.floor(new Date().getTime() * Math.random()).toString(16);
    }

    /**
     * Creates an unique id for the card that mixes the author string with a random hex
     * @param author a string representing the author name, fetched from Unsplash
     * @returns a unique id, authorName_hexString
     */
    protected _createId(): string {
        return `${this.author}_${this._randTimestamp()}`;
    }
}
