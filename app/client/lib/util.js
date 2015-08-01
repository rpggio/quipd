
Util = {};

Util.getLastWord = function(text) {
    if(!text || !text.length){
        return text;
    }
    text = text.trim();
    var lastIndex = text.lastIndexOf(' ');
    if(lastIndex < 0){
        return text;
    }
    return text.slice(lastIndex + 1);
}

Util.getFirstWord = function(text) {
    if(!text || !text.length){
        return text;
    }
    text = text.trim();
    var index = text.indexOf(' ');
    if(index < 0){
        return text;
    }
    return text.slice(0, index);
}