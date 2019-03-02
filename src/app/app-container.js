import 'babel-polyfill';
import {Component} from "../lib/Component";
import {html} from "lighterhtml";
import {Store} from "../lib/Store";

const sessionStore = Store({
    data: {
        userName: "remicaillot"
    },
    mutations: {
        SET_USERNAME(state, newUsername) {
            state.userName = newUsername
        }
    }
});

Component({
    name: "app-container",
    beforeMount() {
        import("./app-child.js").then(descriptor => Component(descriptor.default))
    },
    stores: [
        sessionStore
    ],
    state() {
        return {
            name: "First",
            userName: "strowbeary"
        }
    },
    methods: {
        change(e) {
            sessionStore.commit("SET_USERNAME", e.target.value)
        }
    },
    render() {
        return html`
            <h1>${this.userName}</h1>
            <input type="text" onkeyup="${this.change}" value="${this.userName}"/>
            <app-child></app-child>
        `;
    }
});
