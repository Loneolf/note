class EventBus {

    private events: { [type: string]: Function[] } = {};

    on(type: string, listener: Function) {
        if (!this.events[type]) {
            this.events[type] = [listener];
        } else {
            this.events[type].push(listener);
        }
    }
    emit(type: string, ...args: any[]) {
        if (this.events[type]) {
            this.events[type].forEach(listener => listener(...args));
        }
    }
    off(type: string) {
        if (this.events[type]) {
            delete this.events[type]
        }
    }
    offAll() {
        this.events = {}
    }
    cmd(type: string) {
        return this.events[type];
    }
}

const eventBusObj = new EventBus();
export default eventBusObj;