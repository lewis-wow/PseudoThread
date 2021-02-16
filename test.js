

const myWorker = new PseudoThread(function () {

    let a = 0;
    for(let i = 0; i < 1000; i++) {
        a += i;
    }

    this.postMessage(a);

});


myWorker.accessThread(function (worker) {

    worker.onmessage = function (msg) {

        console.log(msg.data);

    }

});
