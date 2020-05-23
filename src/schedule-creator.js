/**
 *	schedule-creator.js
 *		by Fabian Dubacher
 */


/*----------------------------------------------------------------------------*/
/* DECLARATION AND INITIALIZATION                                             */
/*----------------------------------------------------------------------------*/

let initializedComponents = false;
let fileSelect = undefined;
let modules = undefined; 



/*----------------------------------------------------------------------------*/
/* FUNCTIONS - HANDLERS                                                        */
/*----------------------------------------------------------------------------*/

function handleException(ex) {
	alert("An error with the following message occured:\n\n" 
	+ ">> " + ex.message + " <<" 
	+ "\n\n Please read the README. If it doesn't seem helpful contact the maintainer.");
}

function checkboxHandler(event) {
	let checked = event.target.checked;
	let moduleName = event.target.id;
	
	if(checked) {
		let module = getModuleByName(moduleName);
		addModuleToSchedule(module);
	} else {
		removeModuleFromSchedule(moduleName);
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


function getModuleByName(name, paramModules) {
	let _modules = paramModules;
	if(!_modules) {
		_modules = modules
	}
	
	for(let i = 0; i < _modules.length; ++i) {
		let _module = _modules[i];
		if (_module.name === name) {
			return _module;
		}
	}
}


function createModuleFromRaw(rawModule) {
	let module = {
		name: rawModule.name,
		lTimes: [],
		eTimes: [],
		pTimes: []
	};
	
	// lectures
	for(let i = 0; (i+2) < rawModule.lectureTimes.length; i+=3) {
		let day = rawModule.lectureTimes[i];
		let tFrom = rawModule.lectureTimes[i+1];
		let tTo = rawModule.lectureTimes[i+2];
		
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
		
		if (day !== "mo" 
			&& day !== "tu"
			&& day !== "we"
			&& day !== "th"
			&& day !== "fr") 
		{
			throw(new Error("something wrong with your lecture times in '" + module.name + "'"));
		}
		
		if (tFrom >= tTo) {
			throw(new Error("something wrong with your lecture times in '" + module.name + "'"));
		}
	
		module.lTimes.push({
			day: dayNum,
			tFrom: tFrom,
			tTo: tTo
		});
	}
	
	
	// exercise
	for(let i = 0; (i+2) < rawModule.exerciseTimes.length; i+=3) {
		let day = rawModule.exerciseTimes[i];
		let tFrom = rawModule.exerciseTimes[i+1];
		let tTo = rawModule.exerciseTimes[i+2];
		
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
		
		if (day !== "mo" 
			&& day !== "tu"
			&& day !== "we"
			&& day !== "th"
			&& day !== "fr") 
		{
			throw(new Error("something wrong with your lecture times in '" + module.name + "'"));
		}
		
		if (tFrom >= tTo) {
			throw(new Error("something wrong with your lecture times in '" + module.name + "'"));
		}
	
		module.eTimes.push({
			day: dayNum,
			tFrom: tFrom,
			tTo: tTo
		});
	}
	
	
	// practicals
	for(let i = 0; (i+2) < rawModule.practicalTimes.length; i+=3) {
		let day = rawModule.practicalTimes[i];
		let tFrom = rawModule.practicalTimes[i+1];
		let tTo = rawModule.practicalTimes[i+2];
		
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
			tTo: tTo
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

function addEntryToSchedule(module) {
	
	// TODO implement
	
	// not useable
	for(let i = module.tFrom; i < module.tTo; ++i) {
		let table = document.getElementById("tbl-d" + module.day + "t" + i);
		let cell = document.createElement("th");
		cell.name = module.name;
		cell.textContent = module.name;
		table.appendChild(cell);
	}
}


function removeEntryFromSchedule(name) {
		
	// TODO implement
	
	// not useable
	let entry = document.getElementsByName(name);
	for(let i = 0; i < moduleEntryParts.length; ++i) {
		let entryPart = moduleEntryParts[i];
		entryPart.parentNode.removeChild(entryPart);
	}
}


function addModuleToList(module) {
	let list = document.getElementById("module-list");
	
	let elm = document.createElement("li");
	let name = document.createTextNode(module.name);
	elm.appendChild(name);
	list.appendChild(elm);
	
	// lectures
	for(let i = 0; i < module.lTimes.length; ++i) {
		let time = module.lTimes[i];
		
		let subList = document.createElement("ul");
		let subElm = document.createElement("li");
		
		let cb = document.createElement("input");
		cb.id = module.name;
		cb.type = "checkbox";
		cb.addEventListener("input", checkboxHandler);
		let label = document.createElement("label");
		label.htmlFor = module.name;
		label.textContent = "v" + (i+1) + " ; " + dayNumToText(time.day) + "-" + time.tFrom + "-" + time.tTo;
		
		subElm.appendChild(cb);
		subElm.appendChild(label);
		subList.appendChild(subElm);
		elm.appendChild(subList);
	}
	
	// exercise
	for(let i = 0; i < module.eTimes.length; ++i) {
		let time = module.eTimes[i];
		
		let subList = document.createElement("ul");
		let subElm = document.createElement("li");
		
		let cb = document.createElement("input");
		cb.id = module.name;
		cb.type = "checkbox";
		cb.addEventListener("input", checkboxHandler);
		let label = document.createElement("label");
		label.htmlFor = module.name;
		label.textContent = "u" + (i+1) + " ; " + dayNumToText(time.day) + "-" + time.tFrom + "-" + time.tTo;
		
		subElm.appendChild(cb);
		subElm.appendChild(label);
		subList.appendChild(subElm);
		elm.appendChild(subList);
	}
	
	// practicals
	for(let i = 0; i < module.pTimes.length; ++i) {
		let time = module.pTimes[i];
		
		let subList = document.createElement("ul");
		let subElm = document.createElement("li");
		
		let cb = document.createElement("input");
		cb.id = module.name;
		cb.type = "checkbox";
		cb.addEventListener("input", checkboxHandler);
		let label = document.createElement("label");
		label.htmlFor = module.name;
		label.textContent = "p" + (i+1) + " ; " + dayNumToText(time.day) + "-" + time.tFrom + "-" + time.tTo;
		
		subElm.appendChild(cb);
		subElm.appendChild(label);
		subList.appendChild(subElm);
		elm.appendChild(subList);
	}

}


function clearList() {
	let list = document.getElementById("module-list");
	list.innerHTML = "";
}


/*----------------------------------------------------------------------------*/
/* FUNCTIONS - HANDLERS                                                        */
/*----------------------------------------------------------------------------*/

function handleException(ex) {
	alert("An error with the following message occured:\n\n" 
	+ ">> " + ex.message + " <<" 
	+ "\n\n Please read the README. If it doesn't seem helpful contact the maintainer.");
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
				lectureTimes: [],
				exerciseTimes: [],
				practicalTimes: []
			};
			
			let line = lines[i];
			let values = line.split(",");
			
			rawModule.name = values[0]; // first value = name
			let state = "";
			for(let j = 1; j < values.length; ++j) {
				let value = values[j].trim();
				if(value === "lecture") { // state selection
					state = value;
					continue;
				} else if(value === "exercise") {
					state = value;
					continue;
				} else if(value === "practical") {
					state = value;
					continue;
				}
				
				if(state === "lecture") {	// parsing times
					rawModule.lectureTimes.push(value);
				} else if (state === "exercise") {
					rawModule.exerciseTimes.push(value);
				} else if (state === "practical") {
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
	initSchedule();
	
	for(let i = 0; i < modules.length; ++i) {
		addModuleToList(modules[0]);
	}
}


function initializeComponents() {
	if ((document.readyState === "complete" || document.readyState === "loaded") && !initializedComponents) {
	
		// btnImport
		fileSelect = document.getElementById("file-select");
		fileSelect.addEventListener("change", (event) => {
			importCSV(event.target.files[0], (csvRaw) => {
				modules = csvToModules(csvRaw);
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