/**
 *	schedule-creator.js
 *		by Fabian Dubacher
 */
 
'use strict';


/*----------------------------------------------------------------------------*/
/* DECLARATION AND INITIALIZATION                                             */
/*----------------------------------------------------------------------------*/

const LECTURE_PREFIX = "v";
const EXERCISE_PREFIX = "u";
const PRACTICAL_PREFIX = "p";

let initializedComponents = false;
let fileSelect = undefined;



/*----------------------------------------------------------------------------*/
/* FUNCTIONS - HANDLERS                                                        */
/*----------------------------------------------------------------------------*/

function handleException(ex) {
	alert("An error with the following message occured:\n\n" 
	+ ">> " + ex.message + " <<" 
	+ "\n\n Please read the README. If it doesn't seem helpful contact the maintainer.");
}

function checkboxHandler(event) {
	let cb = event.target;
	let name = cb.getAttribute("entryId");	// it is a name, because the entry can span onto multiple cells and thus needs multiple elements with the same property
	
	if(cb.checked) {
		let color = cb.getAttribute("entryColor");
		let day = Number(cb.getAttribute("entryDay"));
		let tFrom = Number(cb.getAttribute("entryFrom"));
		let tTo = Number(cb.getAttribute("entryTo"));
		addEntryToSchedule(name, color, day, tFrom, tTo);
	} else {
		removeEntryFromSchedule(name);
	}
}


/*----------------------------------------------------------------------------*/
/* FUNCTIONS - HELPERS                                                        */
/*----------------------------------------------------------------------------*/


function dayNumToText(dayNum) {
	let dayText;
	switch(dayNum) {
		case 1: dayText = "mo"; break;
		case 2: dayText = "tu"; break;
		case 3: dayText = "we"; break;
		case 4: dayText = "th"; break;
		case 5: dayText = "fr"; break;
		default: dayText = undefined;
	}
	
	return dayText;
}


function createModuleFromRaw(rawModule) {
	let module = {
		name: rawModule.name,
		color: rawModule.color,
		lTimes: [],
		eTimes: [],
		pTimes: []
	};
	
	// lectures
	for(let i = 0; (i+2) < rawModule.lectureTimes.length; i+=3) {
		let plus = false;
		if(rawModule.lectureTimes[i] === "+") {
			++i;
			plus = true;
		}
		
		let day = rawModule.lectureTimes[i];
		let tFrom = Number(rawModule.lectureTimes[i+1]);
		let tTo = Number(rawModule.lectureTimes[i+2]);
		
		let dayNum;
		switch(day) {
			case "mo": dayNum = 1; break;
			case "tu": dayNum = 2; break;
			case "we": dayNum = 3; break;
			case "th": dayNum = 4; break;
			case "fr": dayNum = 5; break;
			default:
				throw(new Error("something wrong with your lecture times in '" + module.name + "'"));
		}
		
		if (tFrom >= tTo) {
			throw(new Error("something wrong with your lecture times in '" + module.name + "'"));
		}
	
		module.lTimes.push({
			day: dayNum,
			tFrom: tFrom,
			tTo: tTo,
			plus: plus
		});
	}
	
	
	// exercise
	for(let i = 0; (i+2) < rawModule.exerciseTimes.length; i+=3) {
		let plus = false;
		if(rawModule.exerciseTimes[i] === "+") {
			++i;
			plus = true;
		}
		
		let day = rawModule.exerciseTimes[i];
		let tFrom = Number(rawModule.exerciseTimes[i+1]);
		let tTo = Number(rawModule.exerciseTimes[i+2]);
		
		let dayNum;
		switch(day) {
			case "mo": dayNum = 1; break;
			case "tu": dayNum = 2; break;
			case "we": dayNum = 3; break;
			case "th": dayNum = 4; break;
			case "fr": dayNum = 5; break;
			default:
				throw(new Error("something wrong with your exercise times in '" + module.name + "'"));
		}
		
		if (tFrom >= tTo) {
			throw(new Error("something wrong with your lecture times in '" + module.name + "'"));
		}
	
		module.eTimes.push({
			day: dayNum,
			tFrom: tFrom,
			tTo: tTo,
			plus: plus
		});
	}
	
	
	// practicals
	for(let i = 0; (i+2) < rawModule.practicalTimes.length; i+=3) {
		let plus = false;
		if(rawModule.practicalTimes[i] === "+") {
			++i;
			plus = true;
		}
		
		let day = rawModule.practicalTimes[i];
		let tFrom = Number(rawModule.practicalTimes[i+1]);
		let tTo = Number(rawModule.practicalTimes[i+2]);
		
		let dayNum;
		switch(day) {
			case "mo": dayNum = 1; break;
			case "tu": dayNum = 2; break;
			case "we": dayNum = 3; break;
			case "th": dayNum = 4; break;
			case "fr": dayNum = 5; break;
			default:
				throw(new Error("something wrong with your lecture times in '" + module.name + "'"));
		}
		
		if (tFrom >= tTo) {
			throw(new Error("something wrong with your practical times in " + module.name));
		}
	
		module.pTimes.push({
			day: dayNum,
			tFrom: tFrom,
			tTo: tTo,
			plus: plus
		});
	}
	
	return module;
}


function initSchedule() {
	for(let i = 0; i < 24; ++i) {
		let time;
		if(i < 9) {
			time = "0" + i + ":00 - 0" + (i+1) + ":00";
		} else if (i === 9) {
			time = "0" + i + ":00 - " + (i+1) + ":00";
		} else {
			time = i + ":00 - " + (i+1) + ":00";
		}
		
		let row = document.getElementById("r" + i);
		row.innerHTML = " \
				<th>" + time + "</th> \
				<th class=\"bgc-white\"> \
					<table id=\"tbl-d1t" + i + "\"> \
					</table> \
				</th> \
				<th class=\"bgc-white\"> \
					<table id=\"tbl-d2t" + i + "\"> \
					</table> \
				</th> \
				<th class=\"bgc-white\"> \
					<table id=\"tbl-d3t" + i + "\"> \
					</table> \
				</th> \
				<th class=\"bgc-white\"> \
					<table id=\"tbl-d4t" + i + "\"> \
					</table> \
				</th> \
				<th class=\"bgc-white\"> \
					<table id=\"tbl-d5t" + i + "\"> \
					</table> \
				</th>";
	}
}

function addEntryToSchedule(name, color, day, tFrom, tTo) {
	for(let i = tFrom; i < tTo; ++i) {
		let table = document.getElementById("tbl-d" + day + "t" + i);
		let cell = document.createElement("th");
		cell.setAttribute("name", name);
		cell.textContent = name;
		cell.style.backgroundColor = color;
		table.appendChild(cell);
	}
}


function removeEntryFromSchedule(name) {
	let entry = document.getElementsByName(name);
	let entryLength = entry.length;
	for(let i = 0; i < entryLength; ++i) {
		let cell = entry[0];
		cell.parentNode.removeChild(cell);
	}
}


function addModuleToList(module) {	
	let list = document.getElementById("module-list");
	let subList, subElm, subsubList;
	let idCount;
	
	// module
	let elm = document.createElement("li");
	elm.style.color = module.color;
	let name = document.createElement("span");
	name.style.fontWeight = "bold";
	name.textContent = module.name;
	
	elm.appendChild(name);
	list.appendChild(elm);
	
	// lectures
	subList = document.createElement("ul");
	subElm = document.createElement("li");
	subElm.textContent = "Lectures";
	
	subsubList = document.createElement("ul");
	
	subList.appendChild(subElm);
	subList.appendChild(subsubList);
	elm.appendChild(subList);
	
	idCount = 0;
	for(let i = 0; i < module.lTimes.length; ++i) {
		let time = module.lTimes[i];
		
		if(!time.plus) {
			++idCount;
		}
		
		let entryId = module.name + "-" + LECTURE_PREFIX + idCount;
		let shortName = LECTURE_PREFIX + idCount;
		
		let subsubElm = document.createElement("li");
		
		let cb = document.createElement("input");
		cb.id = entryId;
		cb.type = "checkbox";
		cb.addEventListener("input", checkboxHandler);
		cb.setAttribute("entryId", entryId);
		cb.setAttribute("entryColor", module.color);
		cb.setAttribute("entryDay", time.day);
		cb.setAttribute("entryFrom", time.tFrom);
		cb.setAttribute("entryTo", time.tTo);
		let label = document.createElement("label");
		label.htmlFor = entryId;
		label.textContent = shortName + " ; " + dayNumToText(time.day) + "-" + time.tFrom + "-" + time.tTo;
		
		subsubElm.appendChild(cb);
		subsubElm.appendChild(label);
		subsubList.appendChild(subsubElm);
	}
	
	// exercise
	subList = document.createElement("ul");
	subElm = document.createElement("li");
	subElm.textContent = "Exercise";
	
	subsubList = document.createElement("ul");
	
	subList.appendChild(subElm);
	subList.appendChild(subsubList);
	elm.appendChild(subList);
	
	idCount = 0;
	for(let i = 0; i < module.eTimes.length; ++i) {
		let time = module.eTimes[i];
		
		if(!time.plus) {
			++idCount;
		}
		
		let entryId = module.name + "-" + EXERCISE_PREFIX + idCount;
		let shortName = EXERCISE_PREFIX + idCount;
		
		let subsubElm = document.createElement("li");
		
		let cb = document.createElement("input");
		cb.id = module.name;
		cb.type = "checkbox";
		cb.addEventListener("input", checkboxHandler);
		cb.setAttribute("entryId", entryId);
		cb.setAttribute("entryColor", module.color);
		cb.setAttribute("entryDay", time.day);
		cb.setAttribute("entryFrom", time.tFrom);
		cb.setAttribute("entryTo", time.tTo);
		let label = document.createElement("label");
		label.htmlFor = module.name;
		label.textContent = shortName + " ; " + dayNumToText(time.day) + "-" + time.tFrom + "-" + time.tTo;
		
		subsubElm.appendChild(cb);
		subsubElm.appendChild(label);
		subsubList.appendChild(subsubElm);
	}
	
	// practical
	subList = document.createElement("ul");
	subElm = document.createElement("li");
	subElm.textContent = "Practical";
	
	subsubList = document.createElement("ul");
	
	subList.appendChild(subElm);
	subList.appendChild(subsubList);
	elm.appendChild(subList);
	
	idCount = 0;
	for(let i = 0; i < module.pTimes.length; ++i) {
		let time = module.pTimes[i];
		
		if(!time.plus) {
			++idCount;
		}
		
		let entryId = module.name + "-" + PRACTICAL_PREFIX + idCount;
		let shortName = PRACTICAL_PREFIX + idCount;
		
		let subsubElm = document.createElement("li");
		
		let cb = document.createElement("input");
		cb.id = module.name;
		cb.type = "checkbox";
		cb.addEventListener("input", checkboxHandler);
		cb.setAttribute("entryId", entryId);
		cb.setAttribute("entryColor", module.color);
		cb.setAttribute("entryDay", time.day);
		cb.setAttribute("entryFrom", time.tFrom);
		cb.setAttribute("entryTo", time.tTo);
		let label = document.createElement("label");
		label.htmlFor = module.name;
		label.textContent = shortName + " ; " + dayNumToText(time.day) + "-" + time.tFrom + "-" + time.tTo;
		
		subsubElm.appendChild(cb);
		subsubElm.appendChild(label);
		subsubList.appendChild(subsubElm);
	}

}


function clearList() {
	let list = document.getElementById("module-list");
	let children = list.childNodes;
	for(let i = 0; i < children.length; ++i) {
		let child = children[i];
		child.parentNode.removeChild(child);
	}
}


/*----------------------------------------------------------------------------*/
/* FUNCTIONS - MAIN FLOW                                                      */
/*----------------------------------------------------------------------------*/


function importCSV(file, done) {
	const fr = new FileReader();
	fr.addEventListener("load", function(event) {
		done(event.target.result);
	});
	fr.readAsText(file);
}


function csvToModules(csvRaw) {
	let modules = [];
	
	try {
		let lines = csvRaw.split("\r\n");
		for(let i = 0; i < lines.length; ++i) {
			let rawModule = {
				name: "",
				color: "",
				lectureTimes: [],
				exerciseTimes: [],
				practicalTimes: []
			};
			
			let line = lines[i];
			if(line === "") continue;
			
			let values = line.split(",");
			
			rawModule.name = values[0].trim(); // first value = name
			rawModule.color = values[1].trim(); // second value = color
			let state = "";
			let plus = false;
			for(let j = 2; j < values.length; ++j) {
				let value = values[j].trim();
				if(value === "lecture" || value === "exercise" || value === "practical") { // state selection
					state = value;
					continue;
				}
				
				if(value === "+") { plus = true; continue; }
				
				if(state === "lecture") {	// parsing times
					if(plus) { rawModule.lectureTimes.push("+"); plus = false;}
					rawModule.lectureTimes.push(value);
				} else if (state === "exercise") {
					if(plus) { rawModule.exerciseTimes.push("+"); plus = false;}
					rawModule.exerciseTimes.push(value);
				} else if (state === "practical") {
					if(plus) { rawModule.practicalTimes.push("+"); plus = false;}
					rawModule.practicalTimes.push(value);
				} else {
					throw(new Error("something wrong with the CSV"));
				}
			}
			
			let module = createModuleFromRaw(rawModule);
			modules.push(module);
		}
	} catch(ex) {
		handleException(ex);
	}
	
	return modules;
}


function updateUIwithModuleList(modules) {
	clearList();
	initSchedule();
	
	for(let i = 0; i < modules.length; ++i) {
		addModuleToList(modules[i]);
	}
}


function initializeComponents() {
	if ((document.readyState === "complete" || document.readyState === "loaded") && !initializedComponents) {
	
		// btnImport
		fileSelect = document.getElementById("file-select");
		fileSelect.addEventListener("change", (event) => {
			importCSV(event.target.files[0], (csvRaw) => {
				let modules = csvToModules(csvRaw);
				updateUIwithModuleList(modules);
			});
		});
	
		initializedComponents = true;
	}
}


/*----------------------------------------------------------------------------*/
/* MAIN                                                                       */
/*----------------------------------------------------------------------------*/

document.onreadystatechange = function() {
    initializeComponents();
}