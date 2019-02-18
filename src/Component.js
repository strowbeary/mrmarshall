import {render} from "lighterhtml";

export const componentDidUpdate = new CustomEvent("componentDidUpdate");

export function Component(componentDescriptor) {
    let mountNode = null;
    let componentEventBus = new EventTarget();

    let proxiedState = new Proxy(componentDescriptor.viewState, {
        set(t, p, v) {
            t[p] = v;
            componentEventBus.dispatchEvent(componentDidUpdate);
            return true;
        },
        get(t, p) {
            return t[p];
        }
    });
    componentDescriptor.dependencies.forEach(store => store.onPatch(() => update()));

    function renderHtml() {
        return componentDescriptor.render(
            componentDescriptor.eventHandlers(
                proxiedState,
                ...componentDescriptor.dependencies
            ),
            proxiedState,
            componentEventBus,
            ...componentDescriptor.dependencies
        )
    }

    function update() {
        if(mountNode) {
            render(mountNode, () => renderHtml())
        }
    }

    function mount(node) {
        mountNode = node;
        update();
    }
    function mountHere(eventBus, props = {}) {
        componentEventBus = eventBus;
        Object.getOwnPropertyNames(props).forEach(p => proxiedState[p] = props[p]);
        console.log(proxiedState);
        return renderHtml();
    }

    componentEventBus.addEventListener("componentDidUpdate", () => update());
    return {
        mount,
        mountHere,
        forceUpdate: update()
    }
}
