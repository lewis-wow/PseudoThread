class PseudoThread {

    constructor(workerAnonymousFunction) {

        if (!Worker in window) throw Error(``);

        var blobURL = URL.createObjectURL(new Blob(['(',

            function (workerAnonymousFunction) {

                workerAnonymousFunction();

            }.toString(),

            `)(${ workerAnonymousFunction })`
        ], {
            type: 'application/javascript'
        }));

        this._worker = new Worker(blobURL);

        return this;

    }

    accessThread(callback) {

        callback(this._worker);

    }

    disconnect() {

        this._worker.terminate();

    }

}
