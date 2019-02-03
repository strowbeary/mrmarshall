import {createStore, createEntity} from "../src";

const label = createEntity({
    name: "user",
    model: {
        name: String
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
            commit("setName", data);
        }
    },
    getters: {
        sayHello(state) {
            return "Hello " + state.name
        }
    }
});

const labelStore = label.fromObject({
    name: true
});

console.log(labelStore.state.name);
labelStore.commit("setName", "Lisa");

console.log(labelStore.state.name);
labelStore
    .dispatch("getNameFromWeb", "http://faker.hook.io/?property=name.findName&locale=fr")
    .then(() => {
        console.log(labelStore.state.name);
        console.log(labelStore.state.sayHello());
    });

console.dir(labelStore.serialize());
