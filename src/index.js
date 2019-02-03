export function createStore(storeDescription) {
    const {
        data,
        mutations,
        actions,
        getters,
        modules
    } = storeDescription;

    const state = new Proxy(data, {
        set(target, p, value) {
            if (target.hasOwnProperty(p)) {
                target[p] = value;
                return true;
            } else {
                throw Error(`Property "${p}" does not exist in this state`);
            }
        },
        get(target, p) {
            return target[p];
        }
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
        return JSON.stringify(state);
    }

    return {
        dispatch,
        commit,
        serialize,
        state: new Proxy(state, {
            get(target, p) {
                if (typeof getters !== "undefined") if (typeof getters[p] === "function") {
                    return (payload) => getters[p](target, payload);
                }
                if (typeof modules !== "undefined") if (typeof modules[p] !== "undefined") {
                    return modules[p];
                }

                return target[p];
            },
            set(target, p,) {
                throw Error(`You cannot assign property "${p}" directly. You must use mutations.`);
            }
        })
    }
}

export function createEntity(entityDescription) {

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
        return createStore(patchedStoreDesc);
    }

    return {
        fromObject
    }
}
