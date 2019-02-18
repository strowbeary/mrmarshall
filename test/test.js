import {Store} from "../src/Store";
import {Component} from "../src";
import {html} from "lighterhtml";

const labelStore = Store({
    name: "user",
    data: {
        name: ""
    },
    mutations: {
        setName(state, payload) {
            state.name = payload;
        }
    },
    actions: {
        async getNameFromWeb({dispatch, commit}, payload) {
            const response = await fetch(payload);
            const data = await response.text();
            commit("setName", data.split("\"")[1]);
        }
    },
    getters: {
        sayHello(state) {
            return "Hello " + state.name
        }
    }
});

const testComp = Component({
    dependencies: [],
    viewState: {
        text: ""
    },
    eventHandlers(self) {
        return {
            handleClick(e) {
                self.text = "Changed";
            }
        };
    },
    render(eventHandlers, viewState, eventBus, labelStore) {
        return html`
            <p>${viewState.text}</p>
            <button onclick="${eventHandlers.handleClick}">Change</button>
        `;
    }
});

window.addEventListener("load", () => {
    Component({
        dependencies: [labelStore],
        viewState: {
            checked: false,
            label: "First"
        },
        eventHandlers(self) {
            return ({
                onCheckboxClick(e) {
                    e.preventDefault();
                    console.log(e.target);
                    self.checked = !e.target.checked;
                }
            })
        },
        render(eventHandlers, viewState, eventBus, labelStore) {
            return html`
                <h1>${labelStore.state.name}</h1>
                <input type="checkbox" checked="${viewState.checked}" onclick="${eventHandlers.onCheckboxClick}">
                ${testComp.mountHere(eventBus, {text: "Hello"})}
            `;
        }
    })
        .mount(document.body);

    labelStore.dispatch("getNameFromWeb", "http://faker.hook.io/?property=name.findName&locale=fr");

});
