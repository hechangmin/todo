/**
 * 异步回调
 *
 * @author  hechangmin (hechangmin@gmail.com)
 * @date    2014-08-21
 */

(function(undefined){

    // 辅助方法，判断类型
    var isType = function(type) {
        return function(obj) {
            return Object.prototype.toString.call(obj) === '[object ' + type + ']';
        };
    };
    var isObject   = isType('Object');
    var isError    = isType('Error');
    var isArray    = Array.isArray || isType('Array');
    var isFunction = isType('Function');

    // 辅助方法，绑定默认参数
    if(typeof Function.prototype.bind === 'undefined') {
        Function.prototype.bind = function(thisArg) {
            var f = this,
                slice = Array.prototype.slice,
                args = slice.call(arguments, 1);
            return function() {
                return f.apply(thisArg, args.concat(slice.call(arguments)));
            };
        };
    }
    
    //定义几个常量，内部使用
    var NOREADY = 0;
    var READY = 1;
    var START = 2;

    var add = function(type, that, fns){
        if(isArray(fns)){
            that[type].push(fns.concat([]));
        }else{
            that[type].push(fns);
        }

        doTask(that, type);
    };

    var notify = function(that, params){
        for(var j = 0, fn; fn = that['_progress'][j++];){
            if(isFunction(fn)){
                fn(params);
            }else if(isArray(fn)){
                for(var k = 0, step; step = fn[k++];){
                    if(isFunction(step)){
                        step(params);
                    }
                }
            }
        }
    };

    //处理任务队列
    var doTask = function(that, type){
        var curTask;
        var self = that;

        if(READY !== that._status[type]){
            return;
        }

        if(self[type].length > 0){
            self._status[type] = START;
            curTask = self[type].shift();

            if(!isArray(curTask)){
                curTask = [curTask];    
            }

            self.nCurTimes = 0;
            self.nTotalTimes = curTask.length;
            
            for (var i = 0, task; task = curTask[i++];) {
                
                if(isFunction(task)){
                    
                    var done = function(params, state){
                        
                        this.nCurTimes++;

                        if(arguments.length === 1){
                            this._params = params;
                        }
                        
                        if(this['_progress'].length > 0 && arguments.length > 1 && 'notify' === state){
                            notify(this, params);
                        }
                        
                        if(isError(params)){
                            this._status['_fail'] = READY;
                            doTask(this, '_fail');
                            this._status['_done'] = NOREADY;
                        }

                        if(this.nCurTimes >= this.nTotalTimes){
                            if(this._status[type] !== NOREADY){
                                this._status[type] = READY;
                                doTask(this, type); 
                            }
                        }
                    };

                    task(done.bind(self), self._params);
                }
            }
        }
    };

    ToDo = function(fns){
        return new createThis(fns);
    };

    var createThis = function(fns){
        this['_fail'] = [];
        this['_done'] = [];
        this['_progress'] = [];

        this._status = {
            _done : READY,
            _fail : NOREADY,
            _progress : NOREADY
        };

        add('_done', this, fns);

        return this;
    };
    
    createThis.prototype = ToDo.fn = ToDo.prototype;

    ToDo.fn.progress = function(fnProgress) {
        add('_progress', this, fnProgress);
        return this;
    };

    ToDo.fn.then = function(fnDone, fnFail, fnProgress) {
        if(fnDone){
            add('_done', this, fnDone); 
        }

        if(fnFail){
            add('_fail', this, fnFail); 
        }
        
        if(fnProgress){
            add('_progress', this, fnProgress); 
        }
        
        return this;
    };

    ToDo.fn.always = function(fns){
        add('_fail', this, fns);
        add('_done', this, fns);
        return this;
    };

    ToDo.fn.fail = function(fns){
        add('_fail', this, fns);
        return this;
    };

    ToDo.fn.done = function(fns){
        add('_done', this, fns);
        return this;
    };
}());