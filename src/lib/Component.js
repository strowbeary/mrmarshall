import {render} from "lighterhtml";

export function Component(descriptor) {
    const eventTarget = new EventTarget();

    const stateChangesHandler = {
        set(t, p, v) {
            throw Error("Use methods to set state");
        },
        get(t, p) {
            if (p === "createRef") {
                return t.createRef;
            }
            if (descriptor.stores) {
                const storeIndex = descriptor.stores.findIndex(store => typeof store.state[p] !== "undefined");
                if (storeIndex !== -1) {
                    return t.stores[storeIndex].state[p];
                }
            }
            if (typeof t.methods[p] === "function") {
                return t.methods[p].bind(new Proxy(t.state, {
                    set(t, p, v) {
                        t[p] = v;
                        eventTarget.dispatchEvent(new CustomEvent("stateChange"));
                        return true;
                    }
                }))
            }
            return t.state[p];
        }
    };

    customElements.define(descriptor.name, class extends HTMLElement {
        constructor() {
            super();

            this.store = new Proxy(
                {
                    stores: descriptor.stores instanceof Array ? descriptor.stores : {},
                    state: descriptor.state ? descriptor.state() : {},
                    methods: descriptor.methods ? descriptor.methods : {},
                    $createRef(ref) {
                        console.log(ref);
                    }
                },
                stateChangesHandler
            );

            this.render = render.bind(
                this.store,
                this.attachShadow({mode: "closed"}),
                descriptor.render
            );

            eventTarget.addEventListener("stateChange", () => this.render(), false);
            if (descriptor.beforeMount) {
                descriptor.beforeMount.call(this.store);
            }
            if (descriptor.stores instanceof Array) {
                descriptor.stores.forEach(store => store.addEventListener("patch", () => this.render(), false))
            }
            this.render();

            if (descriptor.mounted) {
                descriptor.mounted.call(this.store);
            }
        }
    });
}
