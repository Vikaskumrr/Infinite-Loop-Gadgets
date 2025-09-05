export class HomeController {
    private state: any;

    constructor() {
        this.state = {};
    }

    public getState() {
        return this.state;
    }

    public setState(newState: any) {
        this.state = { ...this.state, ...newState };
    }

    public resetState() {
        this.state = {};
    }

    // Additional methods to manage Home view can be added here
}