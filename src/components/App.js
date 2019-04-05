import { Component, Store } from "../lib";
import {html, render} from "lighterhtml";

export default Component({
    name: "app",
    data() {
        return {
            userName: "remicaillot"
        }
    },
    mutations: {
        SET_USERNAME(state, newUsername) {
            state.userName = newUsername
        }
    },
    actions: {
        change({dispatch, commit}, value) {
            commit("SET_USERNAME", value)
        },
    },
    render() {
        return html`
           <h1>Hello ${this.state.userName}</h1>
           <button onclick="${() => this.dispatch('change', 'Hello')}"></button>
        `;
    }
});


