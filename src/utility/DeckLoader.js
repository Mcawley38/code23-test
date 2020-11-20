import axios from 'axios'

export default class DeckLoader {
    constructor() {
        this.deck = []
    }

    handle() {
        this.loadDeck().then(
            deck => deck.shuffleDeck()
                .getDeck()
        )

        return this
    }

    async loadDeck() {
        this.deck = await axios.get('https://higher-lower.code23.com/api/deck')
            .then(response => {
                return response.data
            })

        return this
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
        }

        return this
    }

    getDeck() {
        return this.deck
    }
}
