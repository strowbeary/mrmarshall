import {Component, mapClass, Store} from "../../lib";
import {html} from "lighterhtml";
import "./app-container.scss";

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
        },
        changeName(e) {
            this.name = e.target.value
        }
    },
    render() {
        return html`
            <h1 class="${mapClass({
                red: this.name === "second"
            })}">${this.userName}</h1>
            <input type="text" onkeyup="${this.change}" value="${this.userName}"/>
            <input type="text" onkeyup="${this.changeName}" value="${this.name}"/>
            <slot></slot>
        `;
    }
});
