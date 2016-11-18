_gutter = 50
_writing_rate = 0
_throttle = {
  start: 4821
  stop: 5344
}
_colors = {
  offblack: "dark gray"
  background: "#111111"
  text: "#f9f9f9"
  console: "#1F4D6A"
  dark: "#B69D27"
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
_codes = ["""
* {
  transition: all 1s;
}
body {
  background-color: #{_colors.background};
  color: #{_colors.text};
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
  -webkit-font-smoothing: subpixel-antialiased;
}
~\`
var container = document.createElement("div");
container.id = "container";
#{_body_selection}.appendChild(container);
var title = document.createElement("h1");
title.id = "title";
title.innerHTML = "Hamza Khan";
container.appendChild(title);
 ~
\`
#title {
  position: fixed; width: 100%; 
  top: 0; left: 0; right: 0;
  font-size: 70px; line-height: 1;
  font-weight: 100; text-align: center;
  padding: 10px; margin: 0;
  z-index: 10;
  background-color: #{_colors.offblack};
  border-top: 1px solid rgba(255,255,255,0.2);
  transition: opacity 500ms;
  font-family: Arial;
}
#title em { 
  font-style: normal;
  color: #{_colors.integer};
}
~\`
var projects = document.createElement("div");
projects.id = "projects";
container.appendChild(projects);
 ~
\`
#projects {
  background-color: gray;
  position: fixed; 
  bottom: 70vw;
  left: 1vw;
  right: 70vw;
  top: 10vh; 
}

#projects {
  bottom: 1vw;
  right: 50vw;
}

"""
]

# body selector
$body = document.getElementsByTagName("body")[0]

# easily create element with id
createElement = (tag, id) ->
  el = document.createElement tag
  el.id = id if id
  return el
    
# create our primary elements
_style_elem   = createElement "style", "style-elem"
_script_area  = createElement "div",   "script-area"

# append our primary elements to the body
$body.appendChild _style_elem
$body.appendChild _script_area

# select our primary elements
$style_elem   = document.getElementById "style-elem"
$script_area  = document.getElementById "script-area"

# tracking states
openComment = false
openInteger = false
openString = false
prevAsterisk = false
prevSlash = false



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
  
  # Using CSS
  else
    char = if which == "~" then "" else which      
    $style_elem.innerHTML += char
      

  # set states    
  prevAsterisk = (which == "*")
  prevSlash = (which == "/") && !openComment
  openInteger = if which.match(/[0-9]/) || (openInteger && which.match(/[\.\%pxems]/)) then true else false
  if which == '"' then openString = !openString

  # add text to code block variable for regex matching.
  _code_block += which

# write all the chars
writeChars = (message, index, interval) ->
  if index < message.length
    if index >= _throttle.start && index < _throttle.stop
      interval = 2
    else
      interval = _writing_rate  
    writeChar message[index++]
    setTimeout (->
      writeChars message, index, interval
    ), interval

# detect url parameters
getURLParam = (key, url) ->
  if typeof url == 'undefined'
    url = window.location.href
  match = url.match('[?&]' + key + '=([^&]+)')
  if match then match[1] else 0

# has version parameter?
_version = getURLParam "billy"

# initiate the script
writeChars(_codes[_version], 0, _writing_rate)
