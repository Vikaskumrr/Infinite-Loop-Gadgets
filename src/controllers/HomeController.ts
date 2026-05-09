export class HomeController {
    private state: Record<string, unknown>;

    constructor() {
        this.state = {};
    }

    public getState() {
        return this.state;
    }

    public setState(newState: Record<string, unknown>) {
        this.state = { ...this.state, ...newState };
    }

    public resetState() {
        this.state = {};
    }

    // Additional methods to manage Home view can be added here
}
