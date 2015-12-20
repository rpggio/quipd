var ModelBound,
  slice = [].slice,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

ModelBound = (function() {
  var _nextId, childrenProperty, currentContext, currentView, delayed, dotRegex, getBindHelper, getDelayedSetter, getMatchingParenIndex, getPrimitive, getToken, getValue, isPrimitive, loadObj, quoted, removeQuotes, setValue, spaceRegex, spaceRegexMem, stringRegex, tokenRegex, tokens;

  _nextId = 1;

  ModelBound.nextId = function() {
    return _nextId++;
  };

  ModelBound.persist = true;

  ModelBound.properties = {
    autorun: 1,
    events: 1,
    share: 1,
    mixin: 1,
    ref: 1
  };

  ModelBound.reserved = {
    vmId: 1,
    parent: 1,
    children: 1,
    reset: 1,
    data: 1,
    load: 1
  };

  ModelBound.nonBindings = {
    throttle: 1,
    optionsText: 1,
    optionsValue: 1,
    defaultText: 1,
    defaultValue: 1
  };

  ModelBound.bindObjects = {};

  ModelBound.byId = {};

  ModelBound.add = function(viewmodel) {
    return ModelBound.byId[viewmodel.vmId] = viewmodel;
  };

  ModelBound.remove = function(viewmodel) {
    return delete ModelBound.byId[viewmodel.vmId];
  };

  ModelBound.check = function() {
    var args, key, ref;
    key = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (Meteor.isDev && !ModelBound.ignoreErrors) {
      if ((ref = Package['manuel:viewmodel-debug']) != null) {
        ref.VmCheck.apply(ref, [key].concat(slice.call(args)));
      }
    }
  };

  ModelBound.onCreated = function(template) {
    return function() {
      var currentDataAutorunSet, helpers, parentTemplate, prop, ref, templateInstance, viewmodel;
      currentDataAutorunSet = false;
      templateInstance = this;
      viewmodel = template.createViewModel(templateInstance.data);
      ModelBound.add(viewmodel);
      templateInstance.viewmodel = viewmodel;
      viewmodel.templateInstance = templateInstance;
      if ((ref = templateInstance.data) != null ? ref.ref : void 0) {
        parentTemplate = ModelBound.parentTemplate(templateInstance);
        if (parentTemplate) {
          if (!parentTemplate.viewmodel) {
            ModelBound.addEmptyViewModel(parentTemplate);
          }
          viewmodel.parent()[templateInstance.data.ref] = viewmodel;
        }
      }
      Tracker.afterFlush(function() {
        if (!currentDataAutorunSet) {
          currentDataAutorunSet = true;
          templateInstance.autorun(function() {
            return viewmodel.load(Template.currentData());
          });
        }
        ModelBound.assignChild(viewmodel);
        return ModelBound.delay(0, function() {
          var migrationData, viewmodelOnCreated, vmHash;
          vmHash = viewmodel.vmHash();
          if (migrationData = Migration.get(vmHash)) {
            viewmodel.load(migrationData);
            ModelBound.removeMigration(viewmodel, vmHash);
          }
          if (viewmodel.onUrl) {
            ModelBound.loadUrl(viewmodel);
            ModelBound.saveUrl(viewmodel);
          }
          viewmodelOnCreated = viewmodel.onCreated;
          if (_.isFunction(viewmodelOnCreated)) {
            return viewmodelOnCreated.call(viewmodel, templateInstance);
          }
        });
      });
      if (!Tracker.currentComputation) {
        currentDataAutorunSet = true;
        templateInstance.autorun(function() {
          return viewmodel.load(Template.currentData());
        });
      }
      helpers = {};
      for (prop in viewmodel) {
        if (!ModelBound.reserved[prop]) {
          (function(prop) {
            return helpers[prop] = function() {
              return viewmodel[prop]();
            };
          })(prop);
        }
      }
      template.helpers(helpers);
    };
  };

  ModelBound.bindIdAttribute = 'b-id';

  ModelBound.addEmptyViewModel = function(templateInstance) {
    var onCreated, onDestroyed, onRendered, template;
    template = templateInstance.view.template;
    template.viewmodelInitial = {};
    onCreated = ModelBound.onCreated(template);
    onCreated.call(templateInstance);
    onRendered = ModelBound.onRendered(template);
    onRendered.call(templateInstance);
    onDestroyed = ModelBound.onDestroyed(template);
    templateInstance.view.onViewDestroyed(function() {
      return onDestroyed.call(templateInstance);
    });
  };

  getBindHelper = function(useBindings) {
    var bindIdAttribute;
    bindIdAttribute = ModelBound.bindIdAttribute;
    if (!useBindings) {
      bindIdAttribute += "-e";
    }
    return function(bindString) {
      var bindId, bindIdObj, bindObject, bindings, templateInstance;
      bindId = ModelBound.nextId();
      bindObject = ModelBound.parseBind(bindString);
      ModelBound.bindObjects[bindId] = bindObject;
      templateInstance = Template.instance();
      if (!templateInstance.viewmodel) {
        ModelBound.addEmptyViewModel(templateInstance);
      }
      bindings = useBindings ? ModelBound.bindings : _.pick(ModelBound.bindings, 'default');
      Blaze.currentView.onViewReady(function() {
        var element;
        element = templateInstance.$("[" + bindIdAttribute + "='" + bindId + "']");
        templateInstance.viewmodel.bind(bindObject, templateInstance, element, bindings, bindId, this);
      });
      bindIdObj = {};
      bindIdObj[bindIdAttribute] = bindId;
      return bindIdObj;
    };
  };

  ModelBound.bindHelper = getBindHelper(true);

  ModelBound.eventHelper = getBindHelper(false);

  ModelBound.getInitialObject = function(initial, context) {
    if (_.isFunction(initial)) {
      return initial(context);
    } else {
      return initial;
    }
  };

  delayed = {};

  ModelBound.delay = function(time, nameOrFunc, fn) {
    var d, func, id, name;
    func = fn || nameOrFunc;
    if (fn) {
      name = nameOrFunc;
    }
    if (name) {
      d = delayed[name];
    }
    if (d != null) {
      Meteor.clearTimeout(d);
    }
    id = Meteor.setTimeout(func, time);
    if (name) {
      return delayed[name] = id;
    }
  };

  ModelBound.makeReactiveProperty = function(initial) {
    var _value, dependency, funProp, initialValue, isArray;
    dependency = new Tracker.Dependency();
    isArray = _.isArray(initial);
    initialValue = isArray ? new ReactiveArray(initial, dependency) : initial;
    _value = initialValue;
    funProp = function(value) {
      var changeValue;
      if (arguments.length) {
        if (_value !== value) {
          changeValue = function() {
            if (value instanceof Array) {
              _value = new ReactiveArray(value, dependency);
            } else {
              _value = value;
            }
            return dependency.changed();
          };
          if (funProp.delay > 0) {
            ModelBound.delay(funProp.delay, funProp.id, changeValue);
          } else {
            changeValue();
          }
        }
      } else {
        dependency.depend();
      }
      return _value;
    };
    funProp.reset = function() {
      if (_value instanceof ReactiveArray) {
        _value = new ReactiveArray(initial, dependency);
      } else {
        _value = initialValue;
      }
      return dependency.changed();
    };
    funProp.depend = function() {
      return dependency.depend();
    };
    funProp.changed = function() {
      return dependency.changed();
    };
    funProp.delay = 0;
    funProp.id = ModelBound.nextId();
    return funProp;
  };

  ModelBound.bindings = {};

  ModelBound.addBinding = function(binding) {
    var bindingArray, bindings;
    ModelBound.check("@addBinding", binding);
    if (!binding.priority) {
      binding.priority = 1;
    }
    if (binding.selector) {
      binding.priority++;
    }
    if (binding.bindIf) {
      binding.priority++;
    }
    bindings = ModelBound.bindings;
    if (!bindings[binding.name]) {
      bindings[binding.name] = [];
    }
    bindingArray = bindings[binding.name];
    bindingArray[bindingArray.length] = binding;
  };

  ModelBound.getBinding = function(bindName, bindArg, bindings) {
    var binding, bindingArray;
    binding = null;
    bindingArray = bindings[bindName];
    if (bindingArray) {
      if (bindingArray.length === 1 && !(bindingArray[0].bindIf || bindingArray[0].selector)) {
        binding = bindingArray[0];
      } else {
        binding = _.find(_.sortBy(bindingArray, (function(b) {
          return -b.priority;
        })), function(b) {
          return !((b.bindIf && !b.bindIf(bindArg)) || (b.selector && !bindArg.element.is(b.selector)));
        });
      }
    }
    return binding || ModelBound.getBinding('default', bindArg, bindings);
  };

  getDelayedSetter = function(bindArg, setter, bindId) {
    if (bindArg.elementBind.throttle) {
      return function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return ModelBound.delay(bindArg.getVmValue(bindArg.elementBind.throttle), bindId, function() {
          return setter.apply(null, args);
        });
      };
    } else {
      return setter;
    }
  };

  ModelBound.getBindArgument = function(templateInstance, element, bindName, bindValue, bindObject, viewmodel, bindId, view) {
    var bindArg;
    bindArg = {
      templateInstance: templateInstance,
      autorun: function(f) {
        var fun;
        fun = function(c) {
          return f(bindArg, c);
        };
        templateInstance.autorun(fun);
      },
      element: element,
      elementBind: bindObject,
      getVmValue: ModelBound.getVmValueGetter(viewmodel, bindValue, view),
      bindName: bindName,
      bindValue: bindValue,
      viewmodel: viewmodel
    };
    bindArg.setVmValue = getDelayedSetter(bindArg, ModelBound.getVmValueSetter(viewmodel, bindValue, view), bindId);
    return bindArg;
  };

  ModelBound.bindSingle = function(templateInstance, element, bindName, bindValue, bindObject, viewmodel, bindings, bindId, view) {
    var bindArg, binding, eventFunc, eventName, fn1, ref;
    bindArg = ModelBound.getBindArgument(templateInstance, element, bindName, bindValue, bindObject, viewmodel, bindId, view);
    binding = ModelBound.getBinding(bindName, bindArg, bindings);
    if (!binding) {
      return;
    }
    if (binding.bind) {
      binding.bind(bindArg);
    }
    if (binding.autorun) {
      bindArg.autorun(binding.autorun);
    }
    if (binding.events) {
      ref = binding.events;
      fn1 = function(eventName, eventFunc) {
        return element.bind(eventName, function(e) {
          return eventFunc(bindArg, e);
        });
      };
      for (eventName in ref) {
        eventFunc = ref[eventName];
        fn1(eventName, eventFunc);
      }
    }
  };

  stringRegex = /^(?:"(?:[^"]|\\")*[^\\]"|'(?:[^']|\\')*[^\\]')$/;

  quoted = function(str) {
    return stringRegex.test(str);
  };

  removeQuotes = function(str) {
    return str.substr(1, str.length - 2);
  };

  isPrimitive = function(val) {
    return val === "true" || val === "false" || val === "null" || val === "undefined" || $.isNumeric(val);
  };

  getPrimitive = function(val) {
    switch (val) {
      case "true":
        return true;
      case "false":
        return false;
      case "null":
        return null;
      case "undefined":
        return void 0;
      default:
        if ($.isNumeric(val)) {
          return parseFloat(val);
        } else {
          return val;
        }
    }
  };

  tokens = {
    '+': function(a, b) {
      return a + b;
    },
    '-': function(a, b) {
      return a - b;
    },
    '*': function(a, b) {
      return a * b;
    },
    '/': function(a, b) {
      return a / b;
    },
    '&&': function(a, b) {
      return a && b;
    },
    '||': function(a, b) {
      return a || b;
    },
    '===': function(a, b) {
      return a === b;
    },
    '==': function(a, b) {
      return a == b;
    },
    '!===': function(a, b) {
      return a !== b;
    },
    '!==': function(a, b) {
      return a !== b;
    },
    '>': function(a, b) {
      return a > b;
    },
    '>=': function(a, b) {
      return a >= b;
    },
    '<': function(a, b) {
      return a < b;
    },
    '<=': function(a, b) {
      return a <= b;
    }
  };

  tokenRegex = /[\+\-\*\/&\|=><]/;

  dotRegex = /(\D\.)|(\.\D)/;

  spaceRegex = function(token) {
    var t;
    t = token.split('').join('\\');
    return new RegExp("(\\s\\" + t + "\\s)");
  };

  spaceRegexMem = _.memoize(spaceRegex);

  getToken = function(str) {
    var index, regex, token;
    for (token in tokens) {
      regex = spaceRegexMem(token);
      index = str.search(regex);
      if (~index) {
        return str.substr(index, token.length + 2);
      }
    }
    return null;
  };

  getMatchingParenIndex = function(bindValue, parenIndexStart) {
    var currentChar, i, j, openParenCount, ref, ref1;
    if (!~parenIndexStart) {
      return -1;
    }
    openParenCount = 0;
    for (i = j = ref = parenIndexStart + 1, ref1 = bindValue.length; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
      currentChar = bindValue.charAt(i);
      if (currentChar === ')') {
        if (openParenCount === 0) {
          return i;
        } else {
          openParenCount--;
        }
      } else if (currentChar === '(') {
        openParenCount++;
      }
    }
    throw new Error("Unbalanced parenthesis");
  };

  currentView = null;

  currentContext = function() {
    var ref;
    if (currentView) {
      return Blaze.getData(currentView);
    } else {
      return (ref = Template.instance()) != null ? ref.data : void 0;
    }
  };

  getValue = function(container, bindValue, viewmodel) {
    var arg, args, breakOnFirstDot, dotIndex, i, j, left, len, name, neg, negate, newArg, newBindValue, newContainer, parenIndexEnd, parenIndexStart, parsed, primitive, ref, right, second, token, value;
    negate = bindValue.charAt(0) === '!';
    if (negate) {
      bindValue = bindValue.substring(1);
    }
    if (bindValue === "this") {
      value = currentContext();
    } else if (quoted(bindValue)) {
      value = removeQuotes(bindValue);
    } else if ((token = tokenRegex.test(bindValue) && getToken(bindValue))) {
      i = bindValue.indexOf(token);
      left = getValue(container, bindValue.substring(0, i), viewmodel);
      right = getValue(container, bindValue.substring(i + token.length), viewmodel);
      value = tokens[token.trim()](left, right);
    } else {
      dotIndex = bindValue.search(dotRegex);
      if (~dotIndex && bindValue.charAt(dotIndex) !== '.') {
        dotIndex += 1;
      }
      parenIndexStart = bindValue.indexOf('(');
      parenIndexEnd = getMatchingParenIndex(bindValue, parenIndexStart);
      breakOnFirstDot = ~dotIndex && (!~parenIndexStart || dotIndex < parenIndexStart || dotIndex === (parenIndexEnd + 1));
      if (breakOnFirstDot) {
        newContainer = getValue(container, bindValue.substring(0, dotIndex), viewmodel);
        newBindValue = bindValue.substring(dotIndex + 1);
        value = getValue(newContainer, newBindValue, viewmodel);
      } else {
        name = bindValue;
        args = [];
        if (~parenIndexStart) {
          parsed = ModelBound.parseBind(bindValue);
          name = Object.keys(parsed)[0];
          second = parsed[name];
          if (second.length > 2) {
            ref = second.substr(1, second.length - 2).split(',');
            for (j = 0, len = ref.length; j < len; j++) {
              arg = ref[j];
              arg = $.trim(arg);
              newArg = void 0;
              if (arg === "this") {
                newArg = currentContext();
              } else if (quoted(arg)) {
                newArg = removeQuotes(arg);
              } else {
                neg = arg.charAt(0) === '!';
                if (neg) {
                  arg = arg.substring(1);
                }
                arg = getValue(viewmodel, arg, viewmodel);
                if (viewmodel && arg in viewmodel) {
                  newArg = getValue(viewmodel, arg, viewmodel);
                } else {
                  newArg = getPrimitive(arg);
                }
                if (neg) {
                  newArg = !newArg;
                }
              }
              args.push(newArg);
            }
          }
        }
        primitive = isPrimitive(name);
        if (container instanceof ModelBound && !primitive && !container[name]) {
          container[name] = ModelBound.makeReactiveProperty(void 0);
        }
        if (primitive || !name in container) {
          value = getPrimitive(name);
        } else {
          if (_.isFunction(container[name])) {
            value = container[name].apply(container, args);
          } else {
            value = container[name];
          }
        }
      }
    }
    if (negate) {
      return !value;
    } else {
      return value;
    }
  };

  ModelBound.getVmValueGetter = function(viewmodel, bindValue, view) {
    return function(optBindValue) {
      if (optBindValue == null) {
        optBindValue = bindValue;
      }
      currentView = view;
      return getValue(viewmodel, optBindValue.toString(), viewmodel);
    };
  };

  setValue = function(value, container, bindValue, viewmodel) {
    var i, newBindValue, newContainer;
    if (dotRegex.test(bindValue)) {
      i = bindValue.search(dotRegex);
      if (bindValue.charAt(i) !== '.') {
        i += 1;
      }
      newContainer = getValue(container, bindValue.substring(0, i), viewmodel);
      newBindValue = bindValue.substring(i + 1);
      setValue(value, newContainer, newBindValue, viewmodel);
    } else {
      if (_.isFunction(container[bindValue])) {
        container[bindValue](value);
      } else {
        container[bindValue] = value;
      }
    }
  };

  ModelBound.getVmValueSetter = function(viewmodel, bindValue, view) {
    if (!_.isString(bindValue)) {
      return (function() {});
    }
    if (~bindValue.indexOf(')', bindValue.length - 1)) {
      return function() {
        currentView = view;
        return getValue(viewmodel, bindValue, viewmodel);
      };
    } else {
      return function(value) {
        currentView = view;
        return setValue(value, viewmodel, bindValue, viewmodel);
      };
    }
  };

  ModelBound.parentTemplate = function(templateInstance) {
    var ref, view;
    view = (ref = templateInstance.view) != null ? ref.parentView : void 0;
    while (view) {
      if (view.name.substring(0, 9) === 'Template.' || view.name === 'body') {
        return view.templateInstance();
      }
      view = view.parentView;
    }
  };

  ModelBound.assignChild = function(viewmodel) {
    var parentTemplateInstance;
    parentTemplateInstance = ModelBound.parentTemplate(viewmodel.templateInstance);
    while (parentTemplateInstance && !parentTemplateInstance.viewmodel) {
      parentTemplateInstance = ModelBound.parentTemplate(parentTemplateInstance);
    }
    if (parentTemplateInstance != null) {
      parentTemplateInstance.viewmodel.children().push(viewmodel);
    }
  };

  ModelBound.onRendered = function(initial) {
    return function() {
      var autorun, fn1, fun, initialAutorun, j, len, templateInstance, viewmodel, viewmodelOnRendered;
      templateInstance = this;
      viewmodel = templateInstance.viewmodel;
      initialAutorun = initial.autorun;
      ModelBound.check("@onRendered", initialAutorun, templateInstance);
      if (_.isFunction(initialAutorun)) {
        fun = function(c) {
          return initialAutorun.call(viewmodel, c);
        };
        Tracker.afterFlush(function() {
          return templateInstance.autorun(fun);
        });
      } else if (initialAutorun instanceof Array) {
        fn1 = function(autorun) {
          fun = function(c) {
            return autorun.call(viewmodel, c);
          };
          return (function(fun) {
            return Tracker.afterFlush(function() {
              return templateInstance.autorun(fun);
            });
          })(fun);
        };
        for (j = 0, len = initialAutorun.length; j < len; j++) {
          autorun = initialAutorun[j];
          fn1(autorun);
        }
      }
      viewmodelOnRendered = viewmodel.onRendered;
      if (_.isFunction(viewmodelOnRendered)) {
        Tracker.afterFlush(function() {
          return viewmodelOnRendered.call(viewmodel, templateInstance);
        });
      }
    };
  };

  ModelBound.prototype.bind = function(bindObject, templateInstance, element, bindings, bindId, view) {
    var bindName, bindValue, viewmodel;
    viewmodel = this;
    for (bindName in bindObject) {
      bindValue = bindObject[bindName];
      if (!ModelBound.nonBindings[bindName]) {
        ModelBound.bindSingle(templateInstance, element, bindName, bindValue, bindObject, viewmodel, bindings, bindId, view);
      }
    }
  };

  ModelBound.prototype.load = function(obj) {
    var key, value, viewmodel;
    viewmodel = this;
    for (key in obj) {
      value = obj[key];
      if (!ModelBound.properties[key]) {
        if (_.isFunction(value)) {
          viewmodel[key] = value;
        } else if (viewmodel[key]) {
          viewmodel[key](value);
        } else {
          viewmodel[key] = ModelBound.makeReactiveProperty(value);
        }
      }
    }
  };

  ModelBound.prototype.parent = function() {
    var args, parentTemplate, viewmodel;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    ModelBound.check.apply(ModelBound, ["#parent"].concat(slice.call(args)));
    viewmodel = this;
    parentTemplate = ModelBound.parentTemplate(viewmodel.templateInstance);
    return parentTemplate != null ? parentTemplate.viewmodel : void 0;
  };

  ModelBound.prototype.reset = function() {
    var prop, ref, results, viewmodel;
    viewmodel = this;
    results = [];
    for (prop in viewmodel) {
      if (_.isFunction((ref = viewmodel[prop]) != null ? ref.reset : void 0)) {
        results.push(viewmodel[prop].reset());
      }
    }
    return results;
  };

  ModelBound.prototype.data = function(fields) {
    var js, prop, ref, value, viewmodel;
    if (fields == null) {
      fields = [];
    }
    viewmodel = this;
    js = {};
    for (prop in viewmodel) {
      if (!(((ref = viewmodel[prop]) != null ? ref.id : void 0) && (fields.length === 0 || indexOf.call(fields, prop) >= 0))) {
        continue;
      }
      value = viewmodel[prop]();
      if (value instanceof ReactiveArray) {
        js[prop] = value.array();
      } else {
        js[prop] = value;
      }
    }
    return js;
  };

  childrenProperty = function() {
    var array, funProp;
    array = new ReactiveArray();
    funProp = function(search) {
      var predicate;
      array.depend();
      if (arguments.length) {
        ModelBound.check("#children", search);
        predicate = _.isString(search) ? (function(vm) {
          return ModelBound.templateName(vm.templateInstance) === search;
        }) : search;
        return _.filter(array, predicate);
      } else {
        return array;
      }
    };
    return funProp;
  };

  ModelBound.getPathTo = function(element) {
    var i, ix, sibling, siblings;
    if (!element || element.tagName === 'HTML' || element === document.body) {
      return '/';
    }
    ix = 0;
    siblings = element.parentNode.childNodes;
    i = 0;
    while (i < siblings.length) {
      sibling = siblings[i];
      if (sibling === element) {
        return ModelBound.getPathTo(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
      }
      if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
        ix++;
      }
      i++;
    }
  };

  loadObj = function(obj, collection, viewmodel) {
    var array, element, j, len;
    if (obj) {
      array = obj instanceof Array ? obj : [obj];
      for (j = 0, len = array.length; j < len; j++) {
        element = array[j];
        viewmodel.load(collection[element]);
      }
    }
  };

  function ModelBound(initial) {
    var viewmodel;
    ModelBound.check("#constructor", initial);
    viewmodel = this;
    viewmodel.vmId = ModelBound.nextId();
    viewmodel.vmHashCache = null;
    viewmodel.load(initial);
    this.children = childrenProperty();
    viewmodel.vmPathToParent = function() {
      var difference, i, parentPath, viewmodelPath;
      viewmodelPath = ModelBound.getPathTo(viewmodel.templateInstance.firstNode);
      if (!viewmodel.parent()) {
        return viewmodelPath;
      }
      parentPath = ModelBound.getPathTo(viewmodel.parent().templateInstance.firstNode);
      i = 0;
      while (parentPath[i] === viewmodelPath[i] && (parentPath[i] != null)) {
        i++;
      }
      difference = viewmodelPath.substr(i);
      return difference;
    };
    if (initial) {
      loadObj(initial.share, ModelBound.shared, viewmodel);
      loadObj(initial.mixin, ModelBound.mixins, viewmodel);
    }
    return;
  }

  ModelBound.onDestroyed = function() {
    return function() {
      var child, children, indexToRemove, j, len, parent, templateInstance, viewmodel, viewmodelOnDestroyed;
      templateInstance = this;
      viewmodel = templateInstance.viewmodel;
      viewmodelOnDestroyed = viewmodel.onDestroyed;
      if (_.isFunction(viewmodelOnDestroyed)) {
        viewmodelOnDestroyed.call(viewmodel, templateInstance);
      }
      parent = viewmodel.parent();
      if (parent) {
        children = parent.children();
        indexToRemove = -1;
        for (j = 0, len = children.length; j < len; j++) {
          child = children[j];
          indexToRemove++;
          if (child.vmId === viewmodel.vmId) {
            children.splice(indexToRemove, 1);
            break;
          }
        }
      }
      ModelBound.remove(viewmodel);
    };
  };

  ModelBound.templateName = function(templateInstance) {
    var name;
    name = templateInstance.view.name;
    if (name === 'body') {
      return name;
    } else {
      return name.substr(name.indexOf('.') + 1);
    }
  };

  ModelBound.prototype.vmHash = function() {
    var key, viewmodel;
    viewmodel = this;
    key = ModelBound.templateName(viewmodel.templateInstance);
    if (viewmodel.parent()) {
      key += viewmodel.parent().vmHash();
    }
    if (viewmodel.vmTag) {
      key += viewmodel.vmTag();
    }
    if (viewmodel._id) {
      key += viewmodel._id();
    } else {
      key += viewmodel.vmPathToParent();
    }
    viewmodel.vmHashCache = SHA256(key).toString();
    return viewmodel.vmHashCache;
  };

  ModelBound.removeMigration = function(viewmodel, vmHash) {
    return Migration["delete"](vmHash);
  };

  ModelBound.shared = {};

  ModelBound.share = function(obj) {
    var content, key, prop, value;
    for (key in obj) {
      value = obj[key];
      ModelBound.shared[key] = {};
      for (prop in value) {
        content = value[prop];
        if (_.isFunction(content)) {
          ModelBound.shared[key][prop] = content;
        } else {
          ModelBound.shared[key][prop] = ModelBound.makeReactiveProperty(content);
        }
      }
    }
  };

  ModelBound.mixins = {};

  ModelBound.mixin = function(obj) {
    var key, value;
    for (key in obj) {
      value = obj[key];
      ModelBound.mixins[key] = value;
    }
  };

  return ModelBound;

})();
