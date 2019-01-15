function formatSelector(s){
  let open = false;
  let output = "";
  let i = 0;
  while(i<s.length){
    let char = s[i];
    if(open){
      if((/[\w-\=\(\)\"\"\^\*\|\[\]]/).test(char)){
        output += char;
        i++;
      }else{
        output += `${char==="]"?char:""}</span>`;
        open = false;
      }
    }else{
      switch(char){
        case ".":
          output += `<span class="cl">.`;
          open = true;
          break;
        case "#":
          output += `<span class="id">#`;
          open = true;
          break;
        case ":":
          output += `<span class="ps">:`;
          open = true;
          break;
        case "[":
          output += `<span class="at">[`;
          open = true;
          break;
        case "*":
          output += `<span class="gl"></span>`;
          break;
        case "]":
          break;
        default:
          if((/\w/).test(char)){
            output += `<span class="tag">${char}`
            open = true;
          }else{
            output += char;
          }
      }
      i++;
    } 
  }
  if(open){
    output += "</span>";
  }
  return output
}

function colorize(block){
  if(block.length<2){
    return "";
  }
  let bits = block.split("{");
  let string = "";
  let selectors = bits[0].split(",");
  for(let i = 0; i < selectors.length; i++){
    string += formatSelector(selectors[i]);
    if(i < (selectors.length - 1)){
      string+=",";
    }
  }
  let decs = bits[1].split(";").filter(a=>a.length>2);
  let isMultiLine = selectors.length+decs.length > 2;
  string += "{";
  for(let dec of decs){
    let tokens = dec.split(":");
    if(tokens.length === 2){
      let important = tokens[1].split("!");
      string += `<span class="pr">${tokens[0]}</span>:<span class="val">${important[0]}</span>${important[1]?'<span class="i">!important</span>':""};`;
    }
  }
  string += isMultiLine?"\n}":" }";
  return string
}

function highlight(){
let codes = document.querySelectorAll("code");
  for(let code of codes){
    let blocks = code.textContent.split("}");
    if(blocks.length>1){
      let r ="";
      let skip = false;
      for (let block of blocks){
        r+= skip?"\n":"";
        r+= block.length > 1 ? colorize(block.trim()) : "";
        skip = true;
      }
      code.innerHTML = r;
    }
  }
}

function sendKeyPress(){
  window.frames[0].document.dispatchEvent(new KeyboardEvent("keyup",{key:"F1"}));
}

document.addEventListener("keyup",(e)=>(e.key==="F1"&&sendKeyPress()));

document.addEventListener('DOMContentLoaded',highlight);
