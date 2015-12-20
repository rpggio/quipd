var addBinding, attr, attrPremade, changeBinding, disable, enable, enableDisable, fn, i, isArray, len, showHide,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

isArray = function(obj) {
  return obj instanceof Array;
};

addBinding = ViewModel.addBinding;

addBinding({
  name: 'default',
  bind: function(bindArg, event) {
    ViewModel.check('$default', bindArg);
    bindArg.element.on(bindArg.bindName, function(event) {
      bindArg.setVmValue(event);
    });
  }
});

addBinding({
  name: 'toggle',
  events: {
    click: function(bindArg) {
      var value;
      value = bindArg.getVmValue();
      return bindArg.setVmValue(!value);
    }
  }
});

showHide = function(reverse) {
  return function(bindArg) {
    var show;
    show = bindArg.getVmValue();
    if (reverse) {
      show = !show;
    }
    if (show) {
      return bindArg.element.show();
    } else {
      return bindArg.element.hide();
    }
  };
};

addBinding({
  name: 'if',
  autorun: showHide(false)
});

addBinding({
  name: 'visible',
  autorun: showHide(false)
});

addBinding({
  name: 'unless',
  autorun: showHide(true)
});

addBinding({
  name: 'hide',
  autorun: showHide(true)
});

addBinding({
  name: 'value',
  events: {
    'input propertychange': function(bindArg) {
      var newVal;
      newVal = bindArg.element.val();
      if (newVal !== bindArg.getVmValue()) {
        return bindArg.setVmValue(newVal);
      }
    }
  },
  autorun: function(bindArg) {
    var newVal;
    newVal = bindArg.getVmValue();
    if (newVal !== bindArg.element.val()) {
      return bindArg.element.val(newVal);
    }
  }
});

addBinding({
  name: 'text',
  autorun: function(bindArg) {
    bindArg.element.text(bindArg.getVmValue());
  }
});

addBinding({
  name: 'html',
  autorun: function(bindArg) {
    return bindArg.element.html(bindArg.getVmValue());
  }
});

changeBinding = function(eb) {
  return eb.value || eb.check || eb.text || eb.html || eb.focus || eb.hover || eb.toggle || eb["if"] || eb.visible || eb.unless || eb.hide || eb.enable || eb.disable;
};

addBinding({
  name: 'change',
  bind: function(bindArg) {
    var bindValue;
    bindValue = changeBinding(bindArg.elementBind);
    return bindArg.autorun(function(c) {
      var newValue;
      newValue = bindArg.getVmValue(bindValue);
      if (!c.firstRun) {
        return bindArg.setVmValue(newValue);
      }
    });
  },
  bindIf: function(bindArg) {
    return changeBinding(bindArg.elementBind);
  }
});

addBinding({
  name: 'enter',
  events: {
    'keyup': function(bindArg, event) {
      if (event.which === 13 || event.keyCode === 13) {
        return bindArg.setVmValue(event);
      }
    }
  }
});

addBinding({
  name: 'attr',
  bind: function(bindArg) {
    var attr, fn;
    fn = function(attr) {
      return bindArg.autorun(function() {
        return bindArg.element.attr(attr, bindArg.getVmValue(bindArg.bindValue[attr]));
      });
    };
    for (attr in bindArg.bindValue) {
      fn(attr);
    }
  }
});

attrPremade = ['src', 'href', 'readonly'];

fn = function(attr) {
  return addBinding({
    name: attr,
    bind: function(bindArg) {
      bindArg.autorun(function() {
        return bindArg.element.attr(attr, bindArg.getVmValue(bindArg.bindValue[attr]));
      });
    }
  });
};
for (i = 0, len = attrPremade.length; i < len; i++) {
  attr = attrPremade[i];
  fn(attr);
}

addBinding({
  name: 'check',
  events: {
    'change': function(bindArg) {
      bindArg.setVmValue(bindArg.element.is(':checked'));
    }
  },
  autorun: function(bindArg) {
    var elementCheck, vmValue;
    vmValue = bindArg.getVmValue();
    elementCheck = bindArg.element.is(':checked');
    if (elementCheck !== vmValue) {
      return bindArg.element.prop('checked', vmValue);
    }
  }
});

addBinding({
  name: 'check',
  selector: 'input[type=radio]',
  events: {
    'change': function(bindArg) {
      var checked, name, rawElement;
      checked = bindArg.element.is(':checked');
      bindArg.setVmValue(checked);
      rawElement = bindArg.element[0];
      if (checked && (name = rawElement.name)) {
        bindArg.templateInstance.$("input[type=radio][name=" + name + "]").each(function() {
          if (rawElement !== this) {
            return $(this).trigger('change');
          }
        });
      }
    }
  },
  autorun: function(bindArg) {
    var elementCheck, vmValue;
    vmValue = bindArg.getVmValue();
    elementCheck = bindArg.element.is(':checked');
    if (elementCheck !== vmValue) {
      return bindArg.element.prop('checked', vmValue);
    }
  }
});

addBinding({
  name: 'group',
  selector: 'input[type=checkbox]',
  events: {
    'change': function(bindArg) {
      var elementValue, vmValue;
      vmValue = bindArg.getVmValue();
      elementValue = bindArg.element.val();
      if (bindArg.element.is(':checked')) {
        if (indexOf.call(vmValue, elementValue) < 0) {
          return vmValue.push(elementValue);
        }
      } else {
        return vmValue.remove(elementValue);
      }
    }
  },
  autorun: function(bindArg) {
    var elementCheck, elementValue, newValue, vmValue;
    vmValue = bindArg.getVmValue();
    elementCheck = bindArg.element.is(':checked');
    elementValue = bindArg.element.val();
    newValue = indexOf.call(vmValue, elementValue) >= 0;
    if (elementCheck !== newValue) {
      return bindArg.element.prop('checked', newValue);
    }
  }
});

addBinding({
  name: 'group',
  selector: 'input[type=radio]',
  events: {
    'change': function(bindArg) {
      var checked, name, rawElement;
      checked = bindArg.element.is(':checked');
      if (checked) {
        bindArg.setVmValue(bindArg.element.val());
        rawElement = bindArg.element[0];
        if (name = rawElement.name) {
          bindArg.templateInstance.$("input[type=radio][name=" + name + "]").each(function() {
            if (rawElement !== this) {
              return $(this).trigger('change');
            }
          });
        }
      }
    }
  },
  autorun: function(bindArg) {
    var elementValue, vmValue;
    vmValue = bindArg.getVmValue();
    elementValue = bindArg.element.val();
    return bindArg.element.prop('checked', vmValue === elementValue);
  }
});

addBinding({
  name: 'class',
  bindIf: function(bindArg) {
    return _.isString(bindArg.bindValue);
  },
  bind: function(bindArg) {
    return bindArg.prevValue = '';
  },
  autorun: function(bindArg) {
    var newValue;
    newValue = bindArg.getVmValue();
    bindArg.element.removeClass(bindArg.prevValue);
    bindArg.element.addClass(newValue);
    return bindArg.prevValue = newValue;
  }
});

addBinding({
  name: 'class',
  bindIf: function(bindArg) {
    return !_.isString(bindArg.bindValue);
  },
  bind: function(bindArg) {
    var cssClass, fn1;
    fn1 = function(cssClass) {
      return bindArg.autorun(function() {
        if (bindArg.getVmValue(bindArg.bindValue[cssClass])) {
          bindArg.element.addClass(cssClass);
        } else {
          bindArg.element.removeClass(cssClass);
        }
      });
    };
    for (cssClass in bindArg.bindValue) {
      fn1(cssClass);
    }
  }
});

addBinding({
  name: 'style',
  priority: 2,
  bindIf: function(bindArg) {
    return _.isString(bindArg.bindValue) && bindArg.bindValue.charAt(0) === '[';
  },
  autorun: function(bindArg) {
    var item, itemString, items, j, len1, value;
    itemString = bindArg.bindValue.substr(1, bindArg.bindValue.length - 2);
    items = itemString.split(',');
    for (j = 0, len1 = items.length; j < len1; j++) {
      item = items[j];
      value = bindArg.getVmValue($.trim(item));
      bindArg.element.css(value);
    }
  }
});

addBinding({
  name: 'style',
  bindIf: function(bindArg) {
    return _.isString(bindArg.bindValue);
  },
  autorun: function(bindArg) {
    var newValue;
    newValue = bindArg.getVmValue();
    if (_.isString(newValue)) {
      newValue = ViewModel.parseBind(newValue);
    }
    return bindArg.element.css(newValue);
  }
});

addBinding({
  name: 'style',
  bindIf: function(bindArg) {
    return !_.isString(bindArg.bindValue);
  },
  bind: function(bindArg) {
    var fn1, style;
    fn1 = function(style) {
      return bindArg.autorun(function() {
        bindArg.element.css(style, bindArg.getVmValue(bindArg.bindValue[style]));
      });
    };
    for (style in bindArg.bindValue) {
      fn1(style);
    }
  }
});

addBinding({
  name: 'hover',
  bind: function(bindArg) {
    var setBool;
    setBool = function(val) {
      return function() {
        return bindArg.setVmValue(val);
      };
    };
    bindArg.element.hover(setBool(true), setBool(false));
  }
});

addBinding({
  name: 'focus',
  events: {
    focus: function(bindArg) {
      if (!bindArg.getVmValue()) {
        bindArg.setVmValue(true);
      }
    },
    blur: function(bindArg) {
      if (bindArg.getVmValue()) {
        bindArg.setVmValue(false);
      }
    }
  },
  autorun: function(bindArg) {
    var value;
    value = bindArg.getVmValue();
    if (bindArg.element.is(':focus') !== value) {
      if (value) {
        bindArg.element.focus();
      } else {
        bindArg.element.blur();
      }
    }
  }
});

enable = function(elem) {
  if (elem.is('button') || elem.is('input') || elem.is('textarea')) {
    return elem.removeAttr('disabled');
  } else {
    return elem.removeClass('disabled');
  }
};

disable = function(elem) {
  if (elem.is('button') || elem.is('input') || elem.is('textarea')) {
    return elem.attr('disabled', 'disabled');
  } else {
    return elem.addClass('disabled');
  }
};

enableDisable = function(reverse) {
  return function(bindArg) {
    var isEnable;
    isEnable = bindArg.getVmValue();
    if (reverse) {
      isEnable = !isEnable;
    }
    if (isEnable) {
      return enable(bindArg.element);
    } else {
      return disable(bindArg.element);
    }
  };
};

addBinding({
  name: 'enable',
  autorun: enableDisable(false)
});

addBinding({
  name: 'disable',
  autorun: enableDisable(true)
});

addBinding({
  name: 'options',
  selector: 'select:not([multiple])',
  autorun: function(bindArg) {
    var defaultText, defaultValue, item, itemText, itemValue, j, len1, optionsText, optionsValue, selected, selection, source;
    source = bindArg.getVmValue();
    optionsText = bindArg.elementBind.optionsText;
    optionsValue = bindArg.elementBind.optionsValue;
    selection = bindArg.getVmValue(bindArg.elementBind.value);
    bindArg.element.find('option').remove();
    defaultText = bindArg.elementBind.defaultText;
    defaultValue = bindArg.elementBind.defaultValue;
    if ((defaultText != null) || (defaultValue != null)) {
      itemText = _.escape(bindArg.getVmValue(defaultText) || '');
      itemValue = _.escape(bindArg.getVmValue(defaultValue) || '');
      bindArg.element.append("<option selected='selected' value=\"" + itemValue + "\">" + itemText + "</option>");
    }
    for (j = 0, len1 = source.length; j < len1; j++) {
      item = source[j];
      itemText = _.escape(optionsText ? item[optionsText] : item);
      itemValue = _.escape(optionsValue ? item[optionsValue] : item);
      selected = selection === itemValue ? "selected='selected'" : "";
      bindArg.element.append("<option " + selected + " value=\"" + itemValue + "\">" + itemText + "</option>");
    }
  }
});

addBinding({
  name: 'options',
  selector: 'select[multiple]',
  autorun: function(bindArg) {
    var item, itemText, itemValue, j, len1, optionsText, optionsValue, selected, selection, source;
    source = bindArg.getVmValue();
    optionsText = bindArg.elementBind.optionsText;
    optionsValue = bindArg.elementBind.optionsValue;
    selection = bindArg.getVmValue(bindArg.elementBind.value);
    bindArg.element.find('option').remove();
    for (j = 0, len1 = source.length; j < len1; j++) {
      item = source[j];
      itemText = _.escape(optionsText ? item[optionsText] : item);
      itemValue = _.escape(optionsValue ? item[optionsValue] : item);
      selected = indexOf.call(selection, itemValue) >= 0 ? "selected='selected'" : "";
      bindArg.element.append("<option " + selected + " value=\"" + itemValue + "\">" + itemText + "</option>");
    }
  }
});

addBinding({
  name: 'value',
  selector: 'select[multiple]',
  events: {
    change: function(bindArg) {
      var elementValues, j, len1, selected, v;
      elementValues = bindArg.element.val();
      selected = bindArg.getVmValue();
      if (isArray(selected)) {
        selected.clear();
        if (isArray(elementValues)) {
          for (j = 0, len1 = elementValues.length; j < len1; j++) {
            v = elementValues[j];
            selected.push(v);
          }
        }
      }
    }
  }
});

addBinding({
  name: 'ref',
  bind: function(bindArg) {
    bindArg.viewmodel[bindArg.bindValue] = bindArg.element;
  }
});

addBinding({
  name: 'value',
  selector: 'input[type=file]:not([multiple])',
  events: {
    change: function(bindArg, event) {
      var file, ref;
      file = ((ref = event.target.files) != null ? ref.length : void 0) ? event.target.files[0] : null;
      bindArg.setVmValue(file);
    }
  }
});

addBinding({
  name: 'value',
  selector: 'input[type=file][multiple]',
  events: {
    change: function(bindArg, event) {
      var file, files, j, len1, ref, results;
      files = bindArg.getVmValue();
      files.clear();
      ref = event.target.files;
      results = [];
      for (j = 0, len1 = ref.length; j < len1; j++) {
        file = ref[j];
        results.push(files.push(file));
      }
      return results;
    }
  }
});

