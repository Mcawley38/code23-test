<template>
    <main>
        <div>
            <span>Score: {{score.current_score}}</span>
            <span>Lives:  {{score.lives}}<span></span></span>
        </div>
        <div>
            {{score.high_score}}
        </div>
        <div class="w-56 h-56 bg-red-500"></div>
        <a>High</a>
        <a>low</a>
    </main>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'Game',
        data: () => ({
            deck: [],
            lives: 0,
            score: {
                high_score: 0,
                current_score: 0,
            },
            cards: {
                new: {},
                old: {},
            }
        }),
        methods: {
            getDeck() {
                axios.get('https://higher-lower.code23.com/api/deck')
                    .then(response => {
                        this.deck = response.data
                    })
            },
            shuffle() {
                this.resetGame();

                for (let i = this.deck.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
                }
            },
            resetGame() {
                this.lives = 3
                this.score = 0

                this.shuffle()
            },
            takeTurn() {
                this.cards.old = this.deck.shift()
                this.cards.new = this.deck[0]

                this.oldGreaterThanNew()
                    ? this.incrementScore()
                    :this.deductLife()
            },
            oldGreaterThanNew() {
                if (!isNaN(this.cards.old.value)) {
                    return !isNaN(this.cards.new.value)
                        ? parseInt(this.cards.old.value) > parseInt(this.cards.new.value)
                        : this.cards.new.value === 'A' // Aces low
                } else {
                    const suits = ['A', 'J', 'Q', 'K']// Aces low, kings high, index of values will represent order of precedence

                    const old_suit_val = Object.keys(suits).find(key => suits[key] === this.cards.old.value),
                        new_suit_val = Object.keys(suits).find(key => suits[key] === this.cards.new.value)
                    console.log(old_suit_val, new_suit_val)
                    return old_suit_val > new_suit_val
                }
            },
            incrementScore(){
                this.score.current_score ++

                (this.score.high_score < this.score.current_score)
                && (this.score.high_score = this.score.current_score)
            },
            deductLife(){
                -- this.lives
            }
        }
    }
</script>
