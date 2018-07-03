(function() {
  var $body, $code_pre, $script_area, $style_elem, __js, _body_selection, _code_block, _code_pre, _codes, _colors, _current_code, _gutter, _script_area, _style_elem, _throttle, _writing_rate, createElement, openComment, openInteger, openString, prevAsterisk, prevSlash, scriptSyntax, styleSyntax, writeChar, writeChars;

  _gutter = 50;

  _writing_rate = 25;

  _throttle = {
    start: 4821,
    stop: 5344
  };

  _colors = {
    background: "#111111",
    text: "#f9f9f9",
    console: "#111111",
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

  _codes = "\n\n/* Hi!               \n *\n * Welcome to my website!                  \n *\n *          \n *\n * Give me a bit to put this all together.              \n */\n\n* {\n  -webkit-transition: all 1s;\n  transition: all 1s;\n}\n\npre em:not(.comment) { font-style: normal; }\n\nbody {\n  background-color: " + _colors.background + "; \n  color: " + _colors.text + ";\n  font-size: 13px; \n  line-height: 1.4;\n  margin: 0;\n  -webkit-font-smoothing: subpixel-antialiased;\n}\n\n#my-code {\n  overflow: auto;\n  position: fixed; \n  right: 1vh;\n  top: 50vh; \n  bottom: 1vh; \n}\n\n\n#my-code {\n  background-color: " + _colors.console + "; \n  color: " + _colors.text + ";\n  border: 1px solid rgba(0,0,0,0.2);\n  font-size: 20px;\n  border-radius: 2px;\n  box-shadow: \n    0px 0px 0px 1px rgba(255,255,255,0.2),\n    0px 4px 0px 2px rgba(0,0,0,0.1);\n}\n\n\n\`\n\n~\nvar title = document.createElement(\"h1\");\ntitle.id = \"title\";\ntitle.innerHTML = \"Hamza <em>Khan</em>\";\n" + _body_selection + ".appendChild(title); \n~                 \n\n\`\n\n#title {\n  position: fixed; \n  width: 100%; \n  top: 0;\n  font-size: 48px; \n  line-height: 1;\n  font-family: \"Segoe UI\"; \n  text-align: center;\n  padding: 10px; \n  margin: 0;\n}\n#title em { \n  font-style: normal;\n  color: " + _colors.integer + ";\n}\n\n\`\n\n~\nvar expTitle = document.createElement(\"h2\");\nexpTitle.id = \"expTitle\";\nexpTitle.innerHTML = \"Connect With Me\";\n" + _body_selection + ".appendChild(expTitle); \n~\n\n\`\n\n#expTitle {\n  color: " + _colors.integer + ";\n  position: fixed;\n  width: 100%; \n  top: 40vh;\n} \n\n#expTitle{\n  top: 20vh;\n  text-align: center;\n}\n\n\`\n\n\n~\nvar it = document.createElement(\"div\");\nit.id = \"it\";\nvar gitLink = document.createElement(\"a\");\ngitLink.id = \"gitLink\";\ngitLink.innerHTML = \"GitHub\";\ngitLink.href = \"https://github.com/hamza765\";\ngitLink.target = \"_blank\";\nit.appendChild(gitLink)\n" + _body_selection + ".appendChild(it); \n~\n\n\`\n\n\n#gitLink {\n  position: fixed;\n  top: 50vh;\n  font-size: 20px;\n}\n\n#gitLink{\n  top: 30vh;\n}\n\n#it {\n  text-align: center\n}\n\n#gitLink {\n  color: white;\n} \n\n\`\n~\ngitLink.className = \"btn btn-primary\";\n~\n\n/*\n *\n * Well, that's enough for today.          \n *\n * Hope you had fun.      \n *  \n * If you need to contact me       \n * my email is contact@hamzakhan.org\n *\n *\n * (This is still a WIP)\n * Goodbye!                      \n *\n *\n * Oh, and i have to give credit to Jake Albaugh \n * who originally made the typing simulation   \n *//\n\n";

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

  writeChars(_codes, 0, _writing_rate);

}).call(this);
