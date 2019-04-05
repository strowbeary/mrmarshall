import {Store} from "./Store";

export function Component(descriptor) {
    const store = Store({
        ...descriptor
    });
   return {
       store,
       mount() {
           return descriptor.render.bind(store)
       }
   };
}
