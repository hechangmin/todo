#todo.js#

JavaScript asynchronous management.

我并没有按照 Deferred/Promise 写，如果各位对 Deferred/Promise 有兴趣。
请参考我另一位朋友的：[https://github.com/Lanfei/deferred](https://github.com/Lanfei/deferred)

##installation##

npm install todo4js

##usage##

```js

require('todo4js');

function task1(next){
    setTimeout(function(){
        console.log('task1', +new Date());
        next(new Error('test error'));
    }, 1000);
}

function task2(next){
    setTimeout(function(){
        console.log('task2', +new Date());
        next(true);
    }, 1000);
}

function taskA(next, params){
    console.log('taskA', params, +new Date());
    next('hello');
}

function taskB(next, params){
    console.log('taskB', params, +new Date());
    next();
}

function task3(next, params){
    console.log('task3', params, +new Date());
    next();
}

function task4(next,params){
    console.log('task4',params,+new Date());
    next();
}

function task5(next,params){
    console.log('task5',params,+new Date());
    next();
}

function task6(next,params){
    console.log('task6',params,+new Date());
    
    setTimeout(function(){
        for(var i = 0; i < 1000; i++){
            next(i, 'notify');  
        }
    }, 1000);
}

function taskC(params){
    console.log('...', params);
}

//ToDo([task2, task3]).done(taskA).done(task4);
//ToDo([task1,task2]).done(taskA).done(task4);
//ToDo([task1,task2]).done(taskA).always(task4);
//ToDo([task1,task2]).fail(taskB).done(task4);
ToDo([task1,task2]).done(taskB).fail([task4,task5]);
//ToDo(task6).progress(taskC);
```
-----------------

##License##

Released under the MIT license

_*[hechangmin@gmail.com](mailto://hechangmin@gmail.com)*_
