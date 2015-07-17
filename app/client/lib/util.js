
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