import {html} from "lighterhtml";

export default {
    name: "app-child",
    state() {
        return {
            count: 0
        }
    },
    methods: {
        increment(e) {
            this.count++;
        }
    },
    render() {
        return html`
            <h1>Counter : ${this.count}</h1>
            <button onclick="${this.increment}">+1</button>
        `;
    }
};
