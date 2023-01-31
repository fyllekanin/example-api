import express from 'express';
const router = express.Router();

const CACHE = new Map();

export class MagicApi {
    #myDatabase;

    constructor(database) {
        this.#myDatabase = database;
    }

    async getCardByName(request, response) {
        const cardName = request.params.name;
        const card = this.#myDatabase.getMagicCards()
            .find(card => card.name === cardName);

        if (!card) {
            response.status(404).json();
            return;
        }

        response.status(200).json(card);
    }

    async getCardsByName(request, response) {
        const cardName = request.params.name;

        const cacheKey = `${cardName}-${request.query.released_at}`;
        if (request.query.released_at) {
            if (CACHE.has(cacheKey)) {
                response.status(200).json(CACHE.get(cacheKey));
                return;
            }
        }

        const cards = this.#myDatabase.getMagicCards()
            .filter(card => {
                if (request.query.released_at) {
                    return card.name === cardName && card.released_at === request.query.released_at;
                }
                return card.name === cardName;
            });

        if (request.query.released_at) {
            CACHE.set(cacheKey, cards);
        }

        if (!cards) {
            response.status(404).json();
            return;
        }

        response.status(200).json(cards);
    }

    getApi() {
        return router
            .get('/card/name/:name', this.getCardByName.bind(this))
            .get('/cards/name/:name', this.getCardsByName.bind(this));
    }
}
