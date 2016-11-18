#Just a var used to set padding. I've since removed this, but its up to you.
_gutter = 50
#I believe this this the amount of delay between each char in milliseconds
_writing_rate = 25
_throttle = {
  start: 4821
  stop: 5344
}
_colors = {
  background: "#111111"
  text: "#f9f9f9"  
  console: "#111111"
  dark: "#75715e"
  selector: "#a6da27"
  key: "#64d9ef"
  value: "#fefefe"
  hex: "#f92772"
  text: "#fefefe"
  string: "#d2cc70"  
  var: "#66d9e0"  
  operator: "#f92772"  
  method: "#f9245c"
  integer: "#fd971c"
  run: "#ae81ff"
}
_body_selection = "document.body"
_current_code = 0
_codes = """


/* Hi!               
 *
 * Welcome to my website!                  
 *
 *          
 *
 * Give me a minute to put this all together.              
 */

* {
  -webkit-transition: all 1s;
  transition: all 1s;
}

pre em:not(.comment) { font-style: normal; }

body {
  background-color: #{_colors.background}; 
  color: #{_colors.text};
  font-size: 13px; 
  line-height: 1.4;
  margin: 0;
  -webkit-font-smoothing: subpixel-antialiased;
}

#my-code {
  overflow: auto;
  position: fixed; 
  right: 1vw;
  top: 10vh; 
  bottom: 1vw; 
}


#my-code {
  background-color: #{_colors.console}; 
  color: #{_colors.text};
  border: 1px solid rgba(0,0,0,0.2);
  font-size: 15px;
  border-radius: 2px;
  box-shadow: 
    0px 0px 0px 1px rgba(255,255,255,0.2),
    0px 4px 0px 2px rgba(0,0,0,0.1);
}

/* 
 * Let's make this easier to read, shall we?     
 */

.comment       { color: #{_colors.dark}; }
.selector      { color: #{_colors.selector}; }
.selector .key { color: #{_colors.selector}; }
.selector .int { color: #{_colors.selector}; }
.key           { color: #{_colors.key}; }
.int           { color: #{_colors.integer}; }
.hex           { color: #{_colors.hex}; }
.hex .int      { color: #{_colors.hex}; }
.value         { color: #{_colors.value}; }
.var           { color: #{_colors.var}; }
.operator      { color: #{_colors.operator}; }
.string        { color: #{_colors.string}; }
.method        { color: #{_colors.method}; }
.run-command   { color: #{_colors.run}; }

/* 
 *
 * See? Pretty cool...             
 *       
 *
 * But let's go further.               
 *
 */

\`

/* 
 * Let's write some Javascript.             
 * First we write some code and then type '~' to run it.        
 */

/* Let's add a 'h1' element to put my name on here. */
var title = document.createElement("h1");
title.id = "title";

/* Now we'll add my name to it */
title.innerHTML = "Isn't programming <em>FUN</em>?";

/* Finally, let's add it to the page */
#{_body_selection}.appendChild(title);
             
/* 
 * 
 * Ready?              
 * 
 * Let's run it!              
 * 
 */

 ~                 

/*
 * Awesome! Now we need to position it.           
 * We need CSS for that.         
 */ 
 \`

#my-code {
  left: 1vw;
  bottom: 1vw;
  top: 49%;
  right: 1vw;
}

#title {
  position: fixed; 
  width: 100%; 
  top: 0;
  font-size: 28px; 
  line-height: 1;
  font-family: "Segoe UI"; 
  text-align: center;
  padding: 10px; 
  margin: 0;
}
#title em { 
  font-style: normal;
  color: #{_colors.integer};
}



/* 
 * Ok, let's add an iframe, but we're done with the title    
 * so let's get rid of it for now      
 */

#title {
  left: 100%;
  display: none;
}

~\`

/* Ok, now we create the iframe */      

var frame = document.createElement("iframe");         

/* Give it a source and id */          

frame.src = "https://hamza765.github.io";                 
frame.id = "frame";         


/* Finally, let's add it to the page */
#{_body_selection}.appendChild(frame); 

~\`

#frame {
  position: fixed;
  left: 1vw;
  top: 1vw;
  right: 1vw;
} 

/*
 *
 * Well, that's enough for today.          
 *
 * Hope you had fun.      
 *  
 * I'll do this again soon.       
 *
 * Goodbye!                      
 *
 */                                  
"""


# body selector
$body = document.getElementsByTagName("body")[0]

# easily create element with id
createElement = (tag, id) ->
  el = document.createElement tag
  el.id = id if id
  return el
	  
# create our primary elements
_style_elem 	= createElement "style", "style-elem"
_code_pre 		= createElement "pre",   "my-code"
_script_area 	= createElement "div",   "script-area"

# append our primary elements to the body
$body.appendChild _style_elem
$body.appendChild _code_pre
$body.appendChild _script_area

# select our primary elements
$style_elem 	= document.getElementById "style-elem"
$code_pre 		= document.getElementById "my-code"
$script_area 	= document.getElementById "script-area"

# tracking states
openComment = false
openInteger = false
openString = false
prevAsterisk = false
prevSlash = false


# script syntax highlighting logic
scriptSyntax = (string, which) ->
  
  # if end of integer (%, ., or px too)
  if openInteger && !which.match(/[0-9\.]/) && !openString && !openComment
    s = string.replace(/([0-9\.]*)$/, "<em class=\"int\">$1</em>" + which)
  
  # open comment detection
  else if which == '*' && !openComment && prevSlash
    openComment = true
    s = string + which
  
  # closed comment detection    
  else if which == '/' && openComment && prevAsterisk
    openComment = false
    s = string.replace(/(\/[^(\/)]*\*)$/, "<em class=\"comment\">$1/</em>") 
  
  # var detection
  else if which == 'r' && !openComment && string.match(/[\n ]va$/)
    s = string.replace(/va$/, "<em class=\"var\">var</em>")  
  
  # operator detection
  else if which.match(/[\!\=\-\?]$/) && !openString && !openComment
    s = string + "<em class=\"operator\">" + which + "</em>"

  # pre paren detection
  else if which == "(" && !openString && !openComment
    s = string.replace(/(\.)?(?:([^\.\n]*))$/, "$1<em class=\"method\">$2</em>(")      
    
  # detecting quotes    
  else if which == '"' && !openComment
    s = if openString then string.replace(/(\"[^"\\]*(?:\\.[^"\\]*)*)$/, "<em class=\"string\">$1\"</em>") else string + which
      
  # detecting run script command ~
  else if which == "~" && !openComment
    s = string + "<em class=\"run-command\">" + which + "</em>"

  # ignore syntax temporarily or permanently
  else
    s = string + which
    
  # return script formatted string    
  return s


# style syntax highlighting logic
styleSyntax = (string, which) ->
 
  # if end of integer (%, ., or px too), close it and continue
  if openInteger && !which.match(/[0-9\.\%pxems]/) && !openString && !openComment
    preformatted_string = string.replace(/([0-9\.\%pxems]*)$/, "<em class=\"int\">$1</em>")
  else
    preformatted_string = string
  
  # open comment detection
  if which == '*' && !openComment && prevSlash
    openComment = true
    s = preformatted_string + which
    
  # closed comment detection    
  else if which == '/' && openComment && prevAsterisk
    openComment = false
    s = preformatted_string.replace(/(\/[^(\/)]*\*)$/, "<em class=\"comment\">$1/</em>") 
    
  # wrap style declaration
  else if which == ':'
    s = preformatted_string.replace(/([a-zA-Z- ^\n]*)$/, '<em class="key">$1</em>:')
    
  # wrap style value 
  else if which == ';'
    # detect hex code
    crazy_reghex = /((#[0-9a-zA-Z]{6})|#(([0-9a-zA-Z]|\<em class\=\"int\"\>|\<\/em\>){12,14}|([0-9a-zA-Z]|\<em class\=\"int\"\>|\<\/em\>){8,10}))$/
    
    # is hex    
    if preformatted_string.match(crazy_reghex)
      s = preformatted_string.replace(crazy_reghex, '<em class="hex">$1</em>;')
    # is standard value      
    else
      s = preformatted_string.replace(/([^:]*)$/, '<em class="value">$1</em>;')

  # wrap selector
  else if which == '{'
    s = preformatted_string.replace(/(.*)$/, '<em class="selector">$1</em>{')
  
  # ignore syntax temporarily or permanently
  else
    s = preformatted_string + which

  # return style formatted string    
  return s


__js = false
_code_block = ""

# write a single character
writeChar = (which) ->
  
  # toggle CSS/JS on `
  if which == "`"
		# reset it to empty string so as not to show in DOM    
    which = ""
    __js = !__js
    
  # Using JS  
  if __js
    # running a command block. initiated with "~"
    if which == "~" && !openComment
      script_tag = createElement "script"
      # two matches based on prior scenario
      prior_comment_match = /(?:\*\/([^\~]*))$/
      prior_block_match = /([^~]*)$/
      
      if _code_block.match(prior_comment_match)      
        script_tag.innerHTML = _code_block.match(prior_comment_match)[0].replace("*/", "") + "\n\n"
      else
        script_tag.innerHTML = _code_block.match(prior_block_match)[0] + "\n\n"

      $script_area.innerHTML = "" 
      $script_area.appendChild script_tag    
    char = which 
    code_html = scriptSyntax($code_pre.innerHTML, char)
  
  # Using CSS
  else
    char = if which == "~" then "" else which      
    $style_elem.innerHTML += char
    code_html = styleSyntax($code_pre.innerHTML, char)
      

  # set states    
  prevAsterisk = (which == "*")
  prevSlash = (which == "/") && !openComment
  openInteger = if which.match(/[0-9]/) || (openInteger && which.match(/[\.\%pxems]/)) then true else false
  if which == '"' then openString = !openString

  # add text to code block variable for regex matching.
  _code_block += which
    
  # add character to pre. This is where the code is actually added to the <pre> tag. So if you dont want to show the code, remove this
  $code_pre.innerHTML = code_html

# write all the chars
writeChars = (message, index, interval) ->
  if index < message.length
    if index >= _throttle.start && index < _throttle.stop
      interval = 2
    else
      interval = _writing_rate
    $code_pre.scrollTop = $code_pre.scrollHeight    
    writeChar message[index++]
    setTimeout (->
      writeChars message, index, interval
    ), interval

# initiate the script
writeChars(_codes, 0, _writing_rate)
