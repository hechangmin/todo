require('./todo.js');

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