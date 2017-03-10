export default class Event {
    constructor(event) {
        this.name = event.key;

        this.count = event.value;
    }
}
