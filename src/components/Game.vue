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
                for (let i = this.deck.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
                }
            },
            resetGame() {
                this.lives = 3;
                this.score = 0;

                this.shuffle();
            },
            takeTurn() {
                const new_card = this.deck.splice(index, 1)[0]

            }
        }
    }
</script>
