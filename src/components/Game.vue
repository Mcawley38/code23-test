<template>
    <main class="w-80 m-auto">
        <div class="flex justify-between">
            <span>Score: {{score.current_score}}</span>
            <span>Lives:  {{lives}}<span></span></span>
        </div>
        <div v-show="!lives" class="text-center text-gray-600 mb-4">
            <span class="text-red-400 font-bold">YOU LOSE !!!!!</span>
        </div>
        <div class="text-center text-gray-600 mb-4">
            Highscore: {{score.high_score}}
        </div>
        <div v-if="deck.length" class="w-56 h-80 m-auto relative">
            <img class="w-full h-full absolute" :src="this.deck[0].suit + '.png'" :alt="deck[0].suit"/>
            <h2 class="text-3xl absolute">{{deck[0].value}}</h2>
        </div>
        <div class="flex justify-between mt-4">
            <button
                    :disabled="!lives"
                    @click="takeTurn(true)"
                    class="px-5 py-3 rounded "
                    :class="highButtonClasses"
            >
                High
            </button>
            <button
                    @click="resetGame"
                    class="px-5 py-3 rounded bg-yellow-500 m-auto"
            >
                Shuffle
            </button>
            <button
                    :disabled="!lives"
                    @click="takeTurn(false)"
                    class="px-5 py-3 rounded"
                    :class="lowButtonClasses"
            >
                Low
            </button>
        </div>
    </main>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'Game',
        data: () => ({
            deck: [],
            lives: 3,
            score: {
                high_score: 0,
                current_score: 0,
            }
        }),
        mounted() {
            this.getDeck()
        },
        computed: {
            highButtonClasses() {
                return {
                    'bg-gray-400': !this.lives,
                    'bg-green-400': this.lives,
                }
            },
            lowButtonClasses() {
                return {
                    'bg-gray-400': !this.lives,
                    'bg-blue-400': this.lives,
                }
            }
        },
        methods: {
            async getDeck() {
                await axios.get('https://higher-lower.code23.com/api/deck')
                    .then(response => {
                        this.deck = response.data
                        this.shuffle() // bit of a cheaty way to do i'll admit but i'm short on time
                    })
            },
            shuffle() {
                for (let i = this.deck.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
                }
            },
            resetGame() {
                this.lives = 3
                this.score.current_score = 0

                this.shuffle()
            },
            takeTurn(greater) {
                const old_card = this.deck.shift()
                this.deck.push(old_card)

                this.oldGreaterThanNew(old_card) === greater
                    ? this.incrementScore()
                    : this.deductLife()
            },
            oldGreaterThanNew(old_card) {
                if (!isNaN(old_card.value)) {
                    return !isNaN(this.deck[0].value)
                        ? parseInt(old_card.value) > parseInt(this.deck[0].value)
                        : this.deck[0].value === 'A' // Aces low
                } else {
                    const suits = ['A', 'J', 'Q', 'K']// Aces low, kings high, index of values will represent order of precedence

                    const old_suit_val = Object.keys(suits).find(key => suits[key] === old_card.value),
                        new_suit_val = Object.keys(suits).find(key => suits[key] === this.deck[0].value)


                    return old_suit_val > new_suit_val
                }
            },
            incrementScore() {
                this.score.current_score++

                (this.score.high_score < this.score.current_score)
                && (this.score.high_score = this.score.current_score)
            },
            deductLife() {
                --this.lives
            }
        }
    }
</script>
