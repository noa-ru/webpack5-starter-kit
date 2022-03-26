export default function promiseFn() {
    new Promise(function (resolve, reject) {
       setTimeout(function (){
           console.log('promiseFnMessage!');
           resolve();
       },1000);
    });
}