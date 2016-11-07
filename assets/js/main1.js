var $body, $code_pre, $script_area, $style_elem, __js, _body_selection, _code_block, _code_pre, _codes, _colors, _cousin_id, _current_code, _gutter, _pen_id, _script_area, _style_elem, _throttle, _version, _writing_rate, createElement, getURLParam, openComment, openInteger, openString, prevAsterisk, prevSlash, scriptSyntax, styleSyntax, writeChar, writeChars;



_gutter = 20;

_writing_rate = 0;

_throttle = {
    start: 4821,
    stop: 5344
};

_colors = {
    background: "#000000",
    text: "#f9f9f9",
    offblack: "#111111",
    dark: "#75715e",
    selector: "#a6da27",
    key: "#64d9ef",
    value: "#fefefe",
    hex: "#f92772",
    text: "#fefefe",
    string: "#d2cc70",
    "var": "#66d9e0",
    operator: "#f92772",
    method: "#f9245c",
    integer: "#fd971c",
    run: "#ae81ff"
};

_body_selection = "document.body";

_current_code = 0;

_codes = ["body {\n  background-color: " + _colors.background + ";\n  color: " + _colors.text + ";\n  font-size: 13px;\n  line-height: 1.4;\n  margin: 0;\n  -webkit-font-smoothing: subpixel-antialiased;\n}\n\n#my-code {\n  overflow: auto;\n  position: fixed; width: 70%;\n  margin: 0;\n  top: " + _gutter + "px; bottom: " + (_gutter + 35) + "px; left: 5%;\n}\n\n/* ...                  \n *\n * Oh, hello there!\n * I didn't even see you there.            \n *\n *          \n *\n * Welcome to my website!            \n *\n * \n * My name is Hamza Khan\n *\n * Wanna watch?                       \n * Cool!\n *\n * This CSS is being injected into a DOM <style> tag  \n * and written in this <pre> element simultaneously.        \n *\n * Confused? Check it out!\n *\n */\n\n#my-code {\n  transition: left 500ms, width 500ms, opacity 500ms;\n  background-color: " + _colors.offblack + "; color: " + _colors.text + ";\n  border: 1px solid rgba(0,0,0,0.2);\n  padding: 24px 12px;\n  box-sizing: border-box;\n  border-radius: 2px;\n  box-shadow: \n    0px 0px 0px 1px rgba(255,255,255,0.2),\n    0px 4px 0px 2px rgba(0,0,0,0.1);\n}\n\n/* \n * Syntax highlighting \n * Colors loosely based on Monokai Phoenix\n */\n\npre em:not(.comment) { font-style: normal; }\n\n.comment       { color: " + _colors.dark + "; }\n.selector      { color: " + _colors.selector + "; }\n.selector .key { color: " + _colors.selector + "; }\n.selector .int { color: " + _colors.selector + "; }\n.key           { color: " + _colors.key + "; }\n.int           { color: " + _colors.integer + "; }\n.hex           { color: " + _colors.hex + "; }\n.hex .int      { color: " + _colors.hex + "; }\n.value         { color: " + _colors.value + "; }\n.var           { color: " + _colors["var"] + "; }\n.operator      { color: " + _colors.operator + "; }\n.string        { color: " + _colors.string + "; }\n.method        { color: " + _colors.method + "; }\n.run-command   { color: " + _colors.run + "; }\n\n/* \n *\n * Pretty cool, huh?            \n *\n * Well, this is under construction for now. \n *\n * If you need me, my email is Hamz5678@hotmail.com. \n * \n * Bye for now!          \n */\n"];

$body = document.getElementsByTagName("body")[0];

createElement = function(tag, id) {
    var el;
    el = document.createElement(tag);
    if (id) {
        el.id = id;
    }
    return el;
};

_style_elem = createElement("style", "style-elem");

_code_pre = createElement("pre", "my-code");

_script_area = createElement("div", "script-area");

$body.appendChild(_style_elem);

$body.appendChild(_code_pre);

$body.appendChild(_script_area);

$style_elem = document.getElementById("style-elem");

$code_pre = document.getElementById("my-code");

$script_area = document.getElementById("script-area");

openComment = false;

openInteger = false;

openString = false;

prevAsterisk = false;

prevSlash = false;

scriptSyntax = function(string, which) {
    var s;
    if (openInteger && !which.match(/[0-9\.]/) && !openString && !openComment) {
        s = string.replace(/([0-9\.]*)$/, "<em class=\"int\">$1</em>" + which);
    } else if (which === '*' && !openComment && prevSlash) {
        openComment = true;
        s = string + which;
    } else if (which === '/' && openComment && prevAsterisk) {
        openComment = false;
        s = string.replace(/(\/[^(\/)]*\*)$/, "<em class=\"comment\">$1/</em>");
    } else if (which === 'r' && !openComment && string.match(/[\n ]va$/)) {
        s = string.replace(/va$/, "<em class=\"var\">var</em>");
    } else if (which.match(/[\!\=\-\?]$/) && !openString && !openComment) {
        s = string + "<em class=\"operator\">" + which + "</em>";
    } else if (which === "(" && !openString && !openComment) {
        s = string.replace(/(\.)?(?:([^\.\n]*))$/, "$1<em class=\"method\">$2</em>(");
    } else if (which === '"' && !openComment) {
        s = openString ? string.replace(/(\"[^"\\]*(?:\\.[^"\\]*)*)$/, "<em class=\"string\">$1\"</em>") : string + which;
    } else if (which === "~" && !openComment) {
        s = string + "<em class=\"run-command\">" + which + "</em>";
    } else {
        s = string + which;
    }
    return s;
};

styleSyntax = function(string, which) {
    var crazy_reghex, preformatted_string, s;
    if (openInteger && !which.match(/[0-9\.\%pxems]/) && !openString && !openComment) {
        preformatted_string = string.replace(/([0-9\.\%pxems]*)$/, "<em class=\"int\">$1</em>");
    } else {
        preformatted_string = string;
    }
    if (which === '*' && !openComment && prevSlash) {
        openComment = true;
        s = preformatted_string + which;
    } else if (which === '/' && openComment && prevAsterisk) {
        openComment = false;
        s = preformatted_string.replace(/(\/[^(\/)]*\*)$/, "<em class=\"comment\">$1/</em>");
    } else if (which === ':') {
        s = preformatted_string.replace(/([a-zA-Z- ^\n]*)$/, '<em class="key">$1</em>:');
    } else if (which === ';') {
        crazy_reghex = /((#[0-9a-zA-Z]{6})|#(([0-9a-zA-Z]|\<em class\=\"int\"\>|\<\/em\>){12,14}|([0-9a-zA-Z]|\<em class\=\"int\"\>|\<\/em\>){8,10}))$/;
        if (preformatted_string.match(crazy_reghex)) {
            s = preformatted_string.replace(crazy_reghex, '<em class="hex">$1</em>;');
        } else {
            s = preformatted_string.replace(/([^:]*)$/, '<em class="value">$1</em>;');
        }
    } else if (which === '{') {
        s = preformatted_string.replace(/(.*)$/, '<em class="selector">$1</em>{');
    } else {
        s = preformatted_string + which;
    }
    return s;
};

__js = false;

_code_block = "";

writeChar = function(which) {
    var char, code_html, prior_block_match, prior_comment_match, script_tag;
    if (which === "`") {
        which = "";
        __js = !__js;
    }
    if (__js) {
        if (which === "~" && !openComment) {
            script_tag = createElement("script");
            prior_comment_match = /(?:\*\/([^\~]*))$/;
            prior_block_match = /([^~]*)$/;
            if (_code_block.match(prior_comment_match)) {
                script_tag.innerHTML = _code_block.match(prior_comment_match)[0].replace("*/", "") + "\n\n";
            } else {
                script_tag.innerHTML = _code_block.match(prior_block_match)[0] + "\n\n";
            }
            $script_area.innerHTML = "";
            $script_area.appendChild(script_tag);
        }
        char = which;
        code_html = scriptSyntax($code_pre.innerHTML, char);
    } else {
        char = which === "~" ? "" : which;
        $style_elem.innerHTML += char;
        code_html = styleSyntax($code_pre.innerHTML, char);
    }
    prevAsterisk = which === "*";
    prevSlash = (which === "/") && !openComment;
    openInteger = which.match(/[0-9]/) || (openInteger && which.match(/[\.\%pxems]/)) ? true : false;
    if (which === '"') {
        openString = !openString;
    }
    _code_block += which;
    return $code_pre.innerHTML = code_html;
};

writeChars = function(message, index, interval) {
    if (index < message.length) {
        if (index >= _throttle.start && index < _throttle.stop) {
            interval = 2;
        } else {
            interval = _writing_rate;
        }
        $code_pre.scrollTop = $code_pre.scrollHeight;
        writeChar(message[index++]);
        return setTimeout((function() {
            return writeChars(message, index, interval);
        }), interval);
    }
};

getURLParam = function(key, url) {
    var match;
    if (typeof url === 'undefined') {
        url = window.location.href;
    }
    match = url.match('[?&]' + key + '=([^&]+)');
    if (match) {
        return match[1];
    } else {
        return 0;
    }
};

_version = getURLParam("billy");

writeChars(_codes[_version], 0, _writing_rate);
