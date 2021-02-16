
const newThread = new parallelThread(function() {

    this.get(msg => msg()); //console the message

});

newThread.send(() => console.log("hello, i am consoled from parallel thread"));
