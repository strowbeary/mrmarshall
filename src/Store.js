export function Store(storeDescription) {
    const {
        data,
        mutations,
        actions,
        getters,
        modules
    } = storeDescription;

    const patchListener = [];

    const state = new Proxy(data, {
        set(target, p, value) {
            let op;
            if(typeof target[p] === "undefined") {
                op = "add";
            } else if(typeof target[p] !== "undefined" && typeof value !== "undefined") {
                op= "replace"
            } else {
                throw Error("Weird operation");
            }
            const oldValue = target[p];
            target[p] = value;
            patchListener.forEach(listener => listener({
                op,
                property: p,
                oldValue,
                newValue: value
            }));
            return true;
        },
        get(target, p) {
            return target[p];
        },
        deleteProperty(target, p) {
            const oldValue = target[p];
            delete target[p];
            patchListener.forEach(listener => listener({
                op: "remove",
                property: p,
                oldValue
            }));
            return true;
        },
    });

    async function dispatch(action, payload) {
        if (typeof actions[action] === "function") {
            return await actions[action]({dispatch, commit}, payload);
        }
        throw Error(`You cannot dispatch "${action}", it does not correspond to any actions`);
    }

    function commit(mutation, payload) {
        if (typeof mutations[mutation] === "function") {
            mutations[mutation](state, payload);
            return;
        }
        throw Error(`You cannot commit "${mutation}", it does not correspond to any mutations`);
    }

    function serialize() {
        return JSON.stringify(data);
    }

    function onPatch(listener) {
        patchListener.push(listener)
    }
    return {
        dispatch,
        commit,
        serialize,
        onPatch,
        state: new Proxy(data, {
            set(t, p, v) {
                throw Error(`You cannot assign property "${p}" directly. You must use mutations.`);
            },
            get(t, p) {
                if (typeof getters !== "undefined") if (typeof getters[p] === "function") {
                    return (payload) => getters[p](t, payload);
                }
                if (typeof modules !== "undefined") if (typeof modules[p] !== "undefined") {
                    return modules[p];
                }
                if(p === "serialize") {
                    return () => JSON.stringify(t);
                }
                return t[p];
            }
        })
    }
}

export function Entity(entityDescription) {

    function fromObject(object) {
        Object
            .keys(object)
            .filter(key => {
                if (!entityDescription.model.hasOwnProperty(key)) {
                    throw Error(`Property "${key}" does not exist in "${entityDescription.name}" entity `);
                }
                return true;
            });
        const patchedStoreDesc = {...entityDescription, data: object};
        return Store(patchedStoreDesc);
    }

    return {
        fromObject
    }
}
