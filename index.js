class parallelThread {

    constructor(workerAnonymousFunction, ...args) {

        if (!Worker in window) throw Error(``);

        function callWorkerInvoker(fn, ...args) {

            this.send = function(msg) {

                let isFunction = false;
                if(typeof msg === 'function') {

                    msg = msg.toString();
                    isFunction = true; 

                }

                this.postMessage({
                    isFunction,
                    msg
                });

            }

            console.log(this);

            this.get = function(callback) {

                this.onmessage = (msg) => {

                    if(msg.data.isFunction) {
                        msg.data.msg = new Function(`return (${ msg.data.msg })`)(msg.data.msg);
                    }
        
                    callback(msg.data.msg, msg);

                }

            }

            fn(...args);

        }

        var blobURL = URL.createObjectURL(new Blob([`(${ (callWorkerInvoker, fn, ...args) => callWorkerInvoker(fn, ...args) })(${ callWorkerInvoker }, ${ workerAnonymousFunction }, ${ args })`], {
            type: 'application/javascript'
        }));

        this.thread = new Worker(blobURL);

        return this;

    }

    disconnect() {

        this.thread.terminate();

    }

    send(msg) {

        let isFunction = false;
        if(typeof msg === 'function') {

            msg = msg.toString();
            isFunction = true; 

        }

        this.thread.postMessage({
            isFunction,
            msg
        });

    }

    get(callback) {

        this.thread.onmessage = (msg) => {

            if(msg.data.isFunction) {
                msg.data.msg = new Function(`return (${ msg.data.msg })`)(msg.data.msg);
            }

            callback(msg.data.msg, msg);
        };

    }

}
