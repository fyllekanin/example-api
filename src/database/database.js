import fs from 'fs';

export class Database {
    #magicCards = [];

    getMagicCards() {
        return this.#magicCards;
    }

    async initialize() {
        console.log('Starting initializing of the database');
        return new Promise(resolve => {
            Promise.all([this.#loadMagicCards()]).then(result => {
                this.#magicCards = result[0];
    
                console.log('Initializing of the database finished');
                resolve();
            });
        });
    }

    async #loadMagicCards() {
        return new Promise(resolve => {
            fs.readFile('./data/magic/default-cards-20230131100839.json', 'utf8', (err, data) => {
                if (err) {
                    throw new Error (err);
                }
                resolve(JSON.parse(data));
            });
        });
    }
}
