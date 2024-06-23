export class Store {
    store = new Map();
    clearTime;
    constructor(options = {}) {
        this.clearTime = options.clearTime;
    }
    get size() {
        return this.store.size;
    }
    get defaultClearTime() {
        return this.clearTime;
    }
    set(key, value, options = {}) {
        this.store.set(key, value);
        if (options.time ?? this.clearTime) {
            setTimeout(() => {
                if (!options.beforeEnd) {
                    this.delete(key);
                    return;
                }
                if (options.beforeEnd()) {
                    this.delete(key);
                    return;
                }
            }, options.time ?? this.clearTime);
        }
    }
    delete(key) {
        this.store.delete(key);
    }
    get(key) {
        return this.store.get(key);
    }
    has(key) {
        return this.store.has(key);
    }
    getMap() {
        return this.store;
    }
}
