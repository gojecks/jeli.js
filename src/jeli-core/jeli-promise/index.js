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

$d.prototype.execute = function (list, args) {
  var i = this[list].length,
      deferredFn = this[list];

  args = Array.prototype.slice.call(args);
  while (i--) deferredFn[i].apply(null, args);
  this.$$state.pending = false;
  this.$$state.value = args;
  this.$$state.resolvedWith = list;
};

$d.prototype.resolve = function () {
  this.execute('_done', arguments);
};

$d.prototype.reject = function () {
  this.execute('_fail', arguments);
};

$d.prototype.done = function (callback) 
{
  this._done.push(callback);
  $$ProcessComplete.call(this);
};

$d.prototype.fail = function (callback) 
{
  this._fail.push(callback);
  $$ProcessComplete.call(this);
};
  /** End of Defered*/

  /**Promise Function*/
function $p()
{
  var self = this;
  this.pending = [];
  this.resolve = function (result) 
  {
    self.complete('resolve', arguments);
  };

  this.reject = function (result) {
    self.complete('reject', arguments);
  };

  this.$$state = {
    pending : true,
    value : null,
    resolvedWith : ""
  };
}

$p.prototype.then = function (success, failure) 
{
  this.pending.push({
    resolve: success,
    reject: failure || function(){}
  });

  $$ProcessComplete.call(this);

  return this;
};

$p.prototype.catch = function(failure){
  this.pending.push({
    reject: failure || function(){},
    resolve: function(){}
  });

    $$ProcessComplete.call(this);
};

$p.prototype.complete = function (type, result) 
{
  while (this.pending[0]) 
  {
    this.pending.shift() [type].apply(null, result);
  }

    this.$$state.pending = false;
    this.$$state.value = result;
    this.$$state.resolvedWith = type;
};

$p.prototype.all  = function(resolve){
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

};

function $$ProcessComplete(){
  if(!this.$$state.pending){
    this.complete(this.$$state.resolvedWith, this.$$state.value);
  }
}

/** End of Promise**/
