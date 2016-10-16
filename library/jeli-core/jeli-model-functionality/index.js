  
  function matchScopeObject(ckey,fn)
  {
      var fnd = false;
      for(var i in ckey)
      { 
          if(!$isUndefined(fn))
          {
              if(fn.indexOf(ckey[i]) > -1 )
              {
                  fnd = ckey[i];
              }
          }
      }

      return fnd;
  }

  //RegExp to match is array key
  var isArrayKey = new RegExp(/.*\[(\d+)\]/);
      //isArrayType Function
      //deepCheck the key of a require Model
      //if Model type is Array
      //remove array brackect and return the keys
      function isArrayType(key,model)
      {
        if(expect(key).contains('['))
        {
          var sptKey = key.split('['),
              len = sptKey.length;
          while(len--)
          {
            var set = ((expect(sptKey[len]).contains(']'))?sptKey[len].split(']')[0]:sptKey[len]);
            sptKey[len] = (!$isObject(model[set]))?model[set]:set;
          }

          return function(create,value){
                var end = sptKey[sptKey.length-1],
                    nModel = matchStringWithArray(sptKey.join("."),model,create);
                  if(value){
                    nModel[end] = removeSingleQuote(value);
                    return;
                  }

                 return nModel[end]; 
          };
        }

        return false;
      }


  //match key with array type
  function matchStringWithArray(key,model,create)
  {
      var splitKey = $removeWhiteSpace(key).split('.'),
          modelDepth = model,
          i,
          diveIntoArray = function()
          {
              var justKey, isInArray,
                  dived = false;
              isInArray = isArrayKey.exec(splitKey[i]);
              if (isInArray && isInArray.length && modelDepth) 
              {
                  justKey = splitKey[i].split('[')[0];
                  modelDepth = modelDepth[justKey][isInArray[1]];
                  dived = true;
              }

              return dived;
          };



          for(i = 0; i < splitKey.length - 1; i++)
          {
              if(!diveIntoArray())
              {
                //get or set the Object
                  modelDepth = createNewInstance(modelDepth,splitKey[i],create);
              }
          }

          //commented because of array-like loop

          // if(splitKey.length > 1){
          //     diveIntoArray();
          // }

          return modelDepth;
  }

    function createNewInstance(model,key,create)
    {
      if(create && !model[key])
      {
        model[key] = {};
      }

      return model && model[key] || {};
    }

  /*Get and Set the value of a given key to a model*/
  function setModelValue(key,model,value)
  {

      var setKey = $removeWhiteSpace(key).split('.').pop(),
          deepModel = matchStringWithArray(key,model);

          if(!$isUndefined(value) && deepModel)
          {
              var check = isArrayKey.exec(setKey), //isArrayKey RegExp
                  deepArrayChecker = isArrayType(setKey,model); //isArrayType Function
              if(check && check.length)
              {
                  var dKey = check[0].split('[')[0];
                  if(!deepModel.hasOwnProperty(dKey))
                  {
                      deepModel[dKey] = [];
                  }
                  deepModel[dKey][+check[1]] = removeSingleQuote(value);
              }else if(deepArrayChecker)
              {
                deepArrayChecker(true,value);
              }else
              {
                  deepModel[setKey] = removeSingleQuote(value);
              }
          }

          return value;
  }

  //$modelSetterGetter for $scope
  function $modelSetterGetter(key,context,create)
  {
      var namespaces = $removeWhiteSpace(key).split("."),
          func = namespaces.pop()
          ,deepContext = matchStringWithArray(key,context,create);

          var check = isArrayKey.exec( func );
          if(check && check.length && deepContext)
          {
              var dKey = func.split('[')[0];
                  if(deepContext.hasOwnProperty(dKey))
                  {
                      return deepContext[dKey][+check[1]];
                  }else{
                      return "";
                  }
          }else{
              var deepArrayChecker = isArrayType(key,context);
              if(deepArrayChecker){
                  return deepArrayChecker();
              }
              
              return (!$isUndefined(deepContext))?deepContext[ func ] : "" ;
          }

  }

  //@function simpleBooleanParser
  //credit to  CMCDragonkai for the idea
  function simpleBooleanParser($boolValue)
  {
    switch($boolValue)
    {
      case(true):
      case('true'):
      case(1):
      case('1'):
      case('yes'):
      case('on'):
        return true;
      break;
      case('false'):
      case(false):
      case('0'):
      case(0):
      case('off'):
      case('no'):
        return false;
      break;
      default:
      return undefined;
      break;
    }
  }

  //@Function Name simpleTextParse
  //@return NUMBER OR STRING
  function simpleArgumentParser(arg,sub){
    if(arg){
      return !isNaN(parseInt(arg))?parseInt(arg): (simpleBooleanParser(arg) || arg);
    }
  }

  //Logic Directive Logic Checker
  //@Private Function
  //@arguments : $logic (String)
  //@arguments : $model (Element Scope)
  function $logicChecker($logic, $model,ignore)
  {
      if($isBooleanValue.indexOf($logic) > -1)
      {
          return simpleBooleanParser( $logic );
      }

      //get Function Arg
      function getFunctionArg(key,list)
      {
        var nArgument = [];
         if(list[key] && list)
         {
           var arg = list[parseInt(key) + 2].split(","),
              aLen = 0;

              while(aLen < arg.length){
                nArgument.push( simpleArgumentParser(arg[aLen++]) );
              }
         }

         return nArgument;
      }

      var splitExpr = $removeWhiteSpace($logic).split(/([|()=<>!*+//&-])/ig);
      for(var i in splitExpr)
      {
        if(splitExpr[i].match(/[a-zA-Z]/ig))
        {
            //get the exprValue from model
            var exprValue =  maskedEval(splitExpr[i],$model);
            //check if exprValue is a function
            //initialize the function and set the value
            if($isFunction(exprValue))
            {
                //wrap the user function in a masked IIFE
                //IIFE only returns the actually result of the user function
                var arg = getFunctionArg(i,splitExpr);
                //remove the function method from the list
                splitExpr.splice(parseInt(i) + 1,3);
                exprValue = exprValue.apply(exprValue,arg);
            }
            //check if exprValue is an Object or Array
            //set the value to true
            else if($isObject(exprValue) || $isArray(exprValue))
            {
                exprValue = true;
            }

            //convert null to false as it will be remove 
            //by jolin FN
            if($isNull(exprValue) || $isUndefined(exprValue)){
              exprValue = false;
            }

            splitExpr[i] = (($isString(exprValue))?"'"+exprValue+"'" : exprValue);
        }
      };
        //MaskedEval 
        return maskedEval(splitExpr.join(''));
  }

  function maskedEval(scr,useScope)
  {
      if(!useScope){
        // set up an object to serve as the context for the code
        // being evaluated. 
        var mask = {};
        // mask global properties 
        for (p in this){
          mask[p] = undefined;
        }
      }
      
      // execute script in private context
      return (new Function( "with(this) { try{ return " + scr + " }catch(e){ return undefined; } }")).call(useScope || mask);
  }

  //@Function execFnByName
  //@Arguments : FUNCTION,MODEL,ELEMENT,EVENT
  //Initialize the the Function 
  //@return FN value
  function execFnByName(fn,context,dis,ev)
  {
      var fn = $removeWhiteSpace(fn),
          namespaces = fn.split("."),
          func = namespaces.pop(),
          arg = func.match(/^(?:.*?)\((.*?)\)/),
          mfn = func.match(/^(.*?)\(.*?\)/),
          setValuechecker = fn.split(/([=])/ig),
          narg = [];

          //check if Operation is set value
          if(setValuechecker.length > 1)
          {
            var lastIndex = setValuechecker.pop();
                setModelValue( setValuechecker.shift(), context, $logicChecker(lastIndex,context,true) );
          }else
          {
            //Check if Arguments is required
            if(null !== arg)
            {
                arg = arg[1].split(',');
                for(var i=0; i < arg.length; i++)
                {
                  if(arg[i] === "$event")
                  {
                    narg.push(ev);
                  }else
                  {
                    var param = maskedEval(arg[i],context);
                    narg.push( !$isUndefined(param)?param:simpleArgumentParser(arg[i]) );
                  }
                }
            }


            //set nameSpaces
            if(namespaces.length > 0)
            {
                for(var i = 0; i < namespaces.length; i++) 
                {
                    context = context[namespaces[i]];
                }           
            }


            if(null !== mfn)
            {
                mfn = mfn[1];
            }
            else
            {
                mfn = fn;
            }

            var initializer = context[mfn] || function(){  };

            //initialize the function returned
            return initializer.apply(context,narg);
          }
  }