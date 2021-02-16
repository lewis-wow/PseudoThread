class PseudoThread {

    constructor(workerAnonymousFunction, ...args) {

        if (!Worker in window) throw Error(``);

        var blobURL = URL.createObjectURL(new Blob([`(${ (fn, ...args) => fn(...args) })(${ workerAnonymousFunction }, ${ args })`], {
            type: 'application/javascript'
        }));

        this.thread = new Worker(blobURL);

        return this;

    }

    disconnect() {

        this.thread.terminate();

    }

}
