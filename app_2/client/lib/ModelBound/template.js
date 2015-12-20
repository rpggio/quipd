var getPathTo, htmls;

Template.registerHelper('b', ViewModel.bindHelper);

Template.registerHelper('on', ViewModel.eventHelper);

getPathTo = function(element) {
  var i, ix, sibling, siblings;
  if (element.tagName === 'HTML' || element === document.body) {
    return '~';
  }
  ix = 0;
  siblings = element.parentNode.childNodes;
  i = 0;
  while (i < siblings.length) {
    sibling = siblings[i];
    if (sibling === element) {
      return getPathTo(element.parentNode) + '~' + element.tagName + '#' + (ix + 1) + '#';
    }
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
      ix++;
    }
    i++;
  }
};

Blaze.Template.prototype.viewmodel = function(initial) {
  var event, eventFunction, fn, ref, template;
  template = this;
  ViewModel.check('T#viewmodel', initial, template);
  ViewModel.check('T#viewmodelArgs', template, arguments);
  template.viewmodelInitial = initial;
  template.onCreated(ViewModel.onCreated(template));
  template.onRendered(ViewModel.onRendered(initial));
  template.onDestroyed(ViewModel.onDestroyed());
  if (initial.events) {
    ref = initial.events;
    fn = function(event, eventFunction) {
      var eventObj;
      eventObj = {};
      eventObj[event] = function(e, t) {
        var templateInstance, viewmodel;
        templateInstance = Template.instance();
        viewmodel = templateInstance.viewmodel;
        return eventFunction.call(viewmodel, e, t);
      };
      return template.events(eventObj);
    };
    for (event in ref) {
      eventFunction = ref[event];
      fn(event, eventFunction);
    }
  }
};

Blaze.Template.prototype.createViewModel = function(context) {
  var initial, template, viewmodel;
  template = this;
  ViewModel.check('T#createViewModel', context, template);
  initial = ViewModel.getInitialObject(template.viewmodelInitial, context);
  viewmodel = new ViewModel(initial);
  return viewmodel;
};

htmls = {};

Blaze.Template.prototype.elementBind = function(selector, data) {
  var bindId, bindOject, html, name;
  name = this.viewName;
  html = null;
  if (data) {
    html = $("<div></div>").append($(Blaze.toHTMLWithData(this, data)));
  } else if (htmls[name]) {
    html = htmls[name];
  } else {
    html = $("<div></div>").append($(Blaze.toHTML(this)));
    htmls[name] = html;
  }
  bindId = html.find(selector).attr("b-id");
  bindOject = ViewModel.bindObjects[bindId];
  return bindOject;
};
