  /*Deferred Function*/
  function $d()
  {
    this._done = [];
    this._fail = [];
    this.$$state = {
      pending : true,
      value : null,
      resolvedWith : ""
    };
  }
  $d.prototype =
  {
    execute: function (list, args) {
      var i = this[list].length,
          deferredFn = this[list];

      args = Array.prototype.slice.call(args);
      while (i--) deferredFn[i].apply(null, args);
      this.$$state.pending = false;
      this.$$state.value = args;
      this.$$state.resolvedWith = list;

        //promise is Pending
      if(!this._processComplete)
      {
        this._processComplete = function(resolver,callback)
        {
            if($isEqual(resolver,list)){
              callback.apply(null,args);
            }
        };
      }
    },
    resolve: function () {
      this.execute('_done', arguments);
    },
    reject: function () {
      this.execute('_fail', arguments);
    },
    done: function (callback) 
    {
      if(this._processComplete )
      {
        this._processComplete ('_done',callback);
      }

      this._done.push(callback);
    },
    fail: function (callback) 
    {
      if(this._processComplete)
      {
        this._processComplete('_fail',callback);
      }

      this._fail.push(callback);
    }
  };
  /** End of Defered*/

  /**Promise Function*/
  function $p()
  {
    var self = this;
    this.pending = [];
    this.resolve = function (result) 
    {
      self.complete('resolve', result);
    },
    this.reject = function (result) {
      self.complete('reject', result);
    }
    this.$$state = {
      pending : true,
      value : null,
      resolvedWith : ""
    };
  };
  $p.prototype =
  {
    then: function (success, failure) 
    {
      this.pending.push({
        resolve: success,
        reject: failure || function(){}
      });

      if(this.$$ProcessComplete)
      {
        this.$$ProcessComplete();
      }

      return this;
    },
    complete: function (type, result) 
    {
      while (this.pending[0]) 
      {
        this.pending.shift() [type](result);
        this.$$state.pending = false;
        this.$$state.value = result;
        this.$$state.resolvedWith = type;
      }

      //jEli Background Watcher
      //promise is Pending
      if(!this.$$ProcessComplete)
      {
        this.$$ProcessComplete = function()
        {
          this.complete(type,result);
        };
      }
    },
    all : function(resolve){
      var slice = [].slice,
          resolveValues = arguments.length == 1 && $isArray(resolve)? resolve : slice.call(arguments),
          length = resolveValues.length,
          remaining = length,
          deferred = new $p(),
          failed = 0,
          results = [];

        function updateDefered(idx,err){
          return function(res){
            results[idx] = res;
            if(err){
              ++failed;
            }

            if(!(--remaining)){
              deferred[(failed)?'reject':'resolve'](results);
            }
          };
        }

      for(var i=0; i < length; i++){
        var cur = resolveValues[i];
        if(cur.$$state){
           cur.then(updateDefered(i),updateDefered(i,1))
        }else{
          updateDefered(i)(cur);
        }
      }

      return deferred;

    }
  };

  /** End of Promise**/

  /** Promise with Timeout **/
  function $chain()
  {
      return ({
        delay : function (ms) 
        {
          var p = new $p();
          setTimeout(p.resolve, ms);
          return p;
        }
      });
  };

/**End Of TimeoutPromise*/

 //timeout functionality
  function $timeout(fn,timer)
  {
    if($isFunction(fn))
    {
      $chain()
      .delay(timer || 0)
      .then(fn);
    }
  }
