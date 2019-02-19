import {render} from "lighterhtml";

export const componentDidUpdate = new CustomEvent("componentDidUpdate");

export function Component(componentDescriptor) {

    let mountNode = null;
    let propsReceived = false;
    let componentEventBus = new EventTarget();
    componentEventBus.addEventListener("componentDidUpdate", () => update());

    let proxiedState = new Proxy(componentDescriptor.viewState, {
        set(t, p, v) {
            t[p] = v;
            update();
            return true;
        },
        get(t, p) {
            return t[p];
        }
    });


    componentDescriptor.dependencies.forEach(store => store.onPatch(() => update()));

    const eventHandlers = componentDescriptor.eventHandlers(
        proxiedState,
        ...componentDescriptor.dependencies
    );

    function renderHtml() {
        return componentDescriptor.render(
            eventHandlers,
            proxiedState,
            componentEventBus,
            ...componentDescriptor.dependencies
        );
    }

    function update() {
        if (mountNode) {
            render(mountNode, () => renderHtml())
        }
        componentEventBus.dispatchEvent(componentDidUpdate);
    }

    function mount(node) {
        mountNode = node;
        update();
    }

    function mountHere(eventBus, props = {}) {
        componentEventBus = eventBus;
        if (!propsReceived) {
            proxiedState = new Proxy(Object.assign(componentDescriptor.viewState, props), {
                set(t, p, v) {
                    console.log(v);
                    t[p] = v;
                    update();
                    return true;
                },
                get(t, p) {
                    return t[p];
                }
            });
            update();
            propsReceived = true;
        }

        componentEventBus.addEventListener("componentDidUpdate", update);

        return renderHtml();
    }

    return {
        mount,
        mountHere,
        forceUpdate: update
    }
}
