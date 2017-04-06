    // domElementProvider.each
    domElementProvider.each = function( obj , callback )
    {
          var i = 0,
              value;

          function removeObject(loop)
          {
            var ret = [];
            domElementLoop(loop,function(obj)
            {
              ret.push(obj);
            });

            return ret;
          }

          if ($isFunction(obj))
          { 
              callback = obj;
              obj = ($isArray(this[0]) || $isObject(this[0]))?this[0]:removeObject(this);

          }

          if ($isFunction(callback))
          {
            if ($isArray(obj))
            {
              for (; i < obj.length; i++)
              {
                value = callback.call(obj[i], i, obj[i]);
                if (value === false)
                {
                  break;
                }
              }
            } else
            {
              for (i in obj)
              {
                value = callback.call(obj[i], i, obj[i]);
                if (value === false)
                {
                  break;
                }
              }
            }
          }

          return obj;
    };