var FocusChain = (function () {
    function FocusChain(viewModels) {
        this.viewModels = viewModels;
    }
    FocusChain.fromTemplateTree = function (root, templateName) {
        var chain = new ReactiveArray();
        if (root.templateInstance.view['name'] === templateName) {
            chain.push(root);
        }
        var current;
        var visitor = function (vm) {
            if (current.templateInstance.view['name'] === templateName) {
                chain.push(root);
            }
            var children = current.children();
            for (var i = 0, len = children.length; i < len; i++) {
                var child = children[i];
                visitor(child);
            }
        };
        visitor(root);
    };
    return FocusChain;
})();
//# sourceMappingURL=focusChain.js.map