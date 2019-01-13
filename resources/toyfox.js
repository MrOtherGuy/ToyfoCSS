function removeTab(e){
	e.stopPropagation();
	let tab = e.target.parentNode;
	if(tab.parentNode.children.length < 2){
		return
	};
	let isSelected = tab.hasAttribute("selected");
	isSelected&&changeSelected(tab.previousSibling);
	tab.parentNode.removeChild(tab);
	
	return
}

function getTabScrollbox(){
	return document.querySelector("#tabbrowser-tabs>div");
}

function addTab(text){
	let rand = ()=>(["a Tab","another tab","Toyfox is so cool!","...","I'm out of ideas","tabberino","tab this"][Math.floor(Math.random()*7)])
	let txt = (typeof text) === "string" ? text : rand();
  let atab = new tab(txt);
	let scrollbox = getTabScrollbox();
	scrollbox.append(atab);
	changeSelected(atab);
	scrollbox.scrollLeft=scrollbox.scrollLeftMax;
}

function scrollInc(e){
	let steps = 14;
	let abs = e.deltaY > 0 ? 7 : -7;
	let scrollBox = getTabScrollbox();
	let running = true;
	let anim = ()=>{
		if(steps>0){
			scrollBox.scrollLeft += abs;
			steps--;
			window.requestAnimationFrame(anim);
		}
	};
	anim();
}

function changeSelected(e){
	let isTab = (el)=>(el.classList.contains("tabbrowser-tab"));
	let getTab = (el)=>(isTab(el)?el:getTab(el.parentNode));
	 for(let node of getTabScrollbox().children){
		node.removeAttribute("selected");
	}
	let aTab = getTab(e.target?e.target:e);
	aTab.setAttribute("selected","true");
	document.getElementById("main-window").setAttribute("title",aTab.title);
}

function iconizedLabel(text){
  let out = document.createElement("div");
	let con = document.createElement("div");
	let txt = document.createElement("div");
	let im = document.createElement("div");
	con.classList.add("label-container");
	im.classList.add("icon-image");
	txt.textContent = text;
	txt.classList.add("label");
	con.appendChild(txt);
	out.setAttribute("title",text);
	out.append(im);
	out.append(con);
	return out
}

function bookmark(text){
	let bm = new iconizedLabel(text);
	bm.classList.add("bookmark-item");
	bm.addEventListener("click",()=>(addTab(bm.children[1].textContent)));
	return bm
}

function addBookmark(s,where){
	let el;
	switch (where){
		case("toolbar"):
		  el = "#PlacesToolbar";
			break;
		case("sidebar"):
			el = "#sidebar>.tree";
			break;
		default:
			return;
	}
	document.querySelector(el).appendChild(new bookmark(s));
}

function tab(text){
	let tab = new iconizedLabel(text);
	let cl = tab.appendChild(document.createElement("div"));
	tab.classList.add("tabbrowser-tab");
	tab.children[1].classList.add("tab-text");
	cl.classList.add("tab-close-button");
	cl.classList.add("icon-image");
	cl.addEventListener("click",removeTab,false);
	return tab
}

function createButtonIcons(){
	let buttons = document.querySelectorAll(".toolbarbutton");
	for(let button of buttons){
		let icon = document.createElement("div");
		icon.textContent = "♦";
		icon.classList.add("toolbarbutton-icon");
		button.append(icon);
	}
}

function toggleElement(e){
	if(e.hasAttribute("hidden")){
		e.removeAttribute("hidden");
	}else{
		e.setAttribute("hidden","true");
	}
}

function toggleMenu(){
	toggleElement(document.querySelector("#toolbar-menubar"));
}
function toggleSidebar(){
	toggleElement(document.querySelector("#sidebar"));
}

function toggleBMB(){
	toggleElement(document.querySelector("#PersonalToolbar"));
}

function toggleDemo(){
	let win = document.querySelector("#main-window");
	if(win.hasAttribute("data-demo-colors")){
		win.removeAttribute("data-demo-colors");
	}else{
		win.setAttribute("data-demo-colors","true");
	}
}

function initButtons(){
	document.querySelector("#new-tab-button").addEventListener("click",addTab,false);
  document.querySelector("#PanelUI-button").addEventListener("click",toggleDemo,false);
  document.querySelector("#sidebar-button").addEventListener("click",toggleSidebar);
  document.querySelector("#BMB-button").addEventListener("click",toggleBMB,false);
	getTabScrollbox().addEventListener("click",changeSelected,false);
}

function splitRules(txt){
	let a = [];
  let rules = txt.split("}");
  for(let rule of rules){
    rule.trim().length>1&&a.push(rule.replace(/url\s*(\/\*.*\*\/)*\s*\(.*\)/gi,"")+"}");
  }
  return a
}

function clearStylesheet(ss){
	while(ss.cssRules.length > 0){
		ss.deleteRule(0);
	}
	console.log("cleared");
}

function loadCSS(){
	//document.querySelector("#externalStyle").textContent = document.querySelector("#editCSS").value.replace(/url\s*(\/\*.*\*\/)*\s*\(.*\)/gi,"");;
	let ss = document.styleSheets[1];
	if(!ss || ss.title != "ext"){
		return
	}
	clearStylesheet(ss);
	let editor = document.querySelector("#editCSS");
	let rules = splitRules(editor.value);
	let i = 0;
	try{
		for(let idx = 0; i < rules.length; i++){
		  ss.insertRule(rules[i],i);
		}
		editor.classList.remove("invalid");
	}catch(e){
			editor.classList.add("invalid");
	}
}

let GLOBAL_TIMEOUT=null;

function lazyLoadCSS(){
	if(GLOBAL_TIMEOUT){
		window.clearTimeout(GLOBAL_TIMEOUT);
	}
	GLOBAL_TIMEOUT = window.setTimeout(loadCSS,1300);
}

document.addEventListener('DOMContentLoaded',()=>{

getTabScrollbox().addEventListener("wheel",scrollInc,false);
initButtons();
addTab();
addBookmark("voodoo","toolbar");
addBookmark("power","toolbar");
let sidebarItems = ["one","two","three","four","five","six","seven","eight","ten"];
for (let item of sidebarItems){
	addBookmark(item,"sidebar");
}
createButtonIcons();
document.addEventListener("keyup",(e)=>(e.key==="F1"&&toggleMenu()));
document.querySelector("#editCSS").addEventListener("input",lazyLoadCSS,false);

//getTabScrollbox().children[0].click();
});
