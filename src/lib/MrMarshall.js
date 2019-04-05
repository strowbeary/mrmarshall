import {render} from "lighterhtml";

export function MrMarshall(options) {
    function update() {
        const root = document.body;
        render(root, options.component.mount());
        options.component.store.addEventListener("patch", () => {
            render(root, options.component.mount());
        })
    }
    document.addEventListener("DOMContentLoaded", function() {
        update();
    });

    return {
        update
    }
}
