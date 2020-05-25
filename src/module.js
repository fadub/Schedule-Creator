/**
 *	modules.js
 *		by Fabian Dubacher
 */


/*----------------------------------------------------------------------------*/
/* FUNCTIONS - MODULE                                                         */
/*----------------------------------------------------------------------------*/


function createCSVfromModuleList() {
	// calling every lecture, exercise, practical an 'entry' here
	let csv = "";
	for(let i = 0; i < modules.length; ++i) {
		let module = modules[i];
		
		// generall
		csv = csv + module.name + "," + module.color;
		
		//lecture
		if(module.lTimes.length > 0) csv = csv + "," + "lecture";
		for(let j = 0; j < module.lTimes.length; ++j) {
			lTime = module.lTimes[j];
			if(lTime.plus) csv = csv + ",+";
			csv = csv + "," + dayNumToText(lTime.day) + "," + lTime.tFrom + "," + lTime.tTo + "," + lTime.enable;
		}
		
		//exercise
		if(module.eTimes.length > 0) csv = csv + "," + "exercise";
		for(let j = 0; j < module.eTimes.length; ++j) {
			eTime = module.eTimes[j];
			if(eTime.plus) csv = csv + ",+";
			csv = csv + "," + dayNumToText(eTime.day) + "," + eTime.tFrom + "," + eTime.tTo + "," + eTime.enable;
		}
		
		//practical
		if(module.pTimes.length > 0) csv = csv + "," + "practical";
		for(let j = 0; j < module.pTimes.length; ++j) {
			pTime = module.pTimes[j];
			if(pTime.plus) csv = csv + ",+";
			csv = csv + "," + dayNumToText(pTime.day) + "," + pTime.tFrom + "," + pTime.tTo + "," + pTime.enable;
		}
		
		csv = csv + "\r\n";
	}
	
	return csv;
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


function createModuleFromRaw(rawModule) {
	let module = {
		name: rawModule.name,
		color: rawModule.color,
		lTimes: [],
		eTimes: [],
		pTimes: []
	};
	
	let idCount, partCount;
	
	// lectures
	idCount = 0;
	partCount = 0;
	for(let i = 0; (i+3) < rawModule.lectureTimes.length; i+=4) {
		let plus = false;
		if(rawModule.lectureTimes[i] === "+") {
			++i;
			plus = true;
		}
		
		let day = rawModule.lectureTimes[i];
		let tFrom = Number(rawModule.lectureTimes[i+1]);
		let tTo = Number(rawModule.lectureTimes[i+2]);
		let enable = Number(rawModule.lectureTimes[i+3]);
		
		if((enable !== 0) && (enable !== 1)) {
			throw(new Error("something wrong with your enables in lecture of '" + module.name + "'"));
		}
		
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
		
		
		if(plus) {
			++partCount;
		} else {
			++idCount;
			partCount = 1;
		}
		
		let displayName = module.name + "-" + LECTURE_PREFIX + idCount;
		let id = displayName + partCount;
		let shortName = LECTURE_PREFIX + idCount;
		
		module.lTimes.push({
			id: id,
			displayName: displayName,
			shortName: shortName, 
			day: dayNum,
			tFrom: tFrom,
			tTo: tTo,
			plus: plus,
			enable: enable
		});
	}
	
	
	// exercise
	idCount = 0;
	partCount = 0;
	for(let i = 0; (i+3) < rawModule.exerciseTimes.length; i+=4) {
		let plus = false;
		if(rawModule.exerciseTimes[i] === "+") {
			++i;
			plus = true;
		}
		
		let day = rawModule.exerciseTimes[i];
		let tFrom = Number(rawModule.exerciseTimes[i+1]);
		let tTo = Number(rawModule.exerciseTimes[i+2]);
		let enable = Number(rawModule.exerciseTimes[i+3]);
		
		if((enable !== 0) && (enable !== 1)) {
			throw(new Error("something wrong with your enables in exercise of '" + module.name + "'"));
		}
		
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
		
		if(plus) {
			++partCount;
		} else {
			++idCount;
			partCount = 1;
		}
		
		let displayName = module.name + "-" + EXERCISE_PREFIX + idCount;
		let id = displayName + partCount;
		let shortName = EXERCISE_PREFIX + idCount;
	
		module.eTimes.push({
			id: id,
			displayName: displayName,
			shortName: shortName, 
			day: dayNum,
			tFrom: tFrom,
			tTo: tTo,
			plus: plus,
			enable: enable
		});
	}
	
	
	// practicals
	idCount = 0;
	partCount = 0;
	for(let i = 0; (i+3) < rawModule.practicalTimes.length; i+=4) {
		let plus = false;
		if(rawModule.practicalTimes[i] === "+") {
			++i;
			plus = true;
		}
		
		let day = rawModule.practicalTimes[i];
		let tFrom = Number(rawModule.practicalTimes[i+1]);
		let tTo = Number(rawModule.practicalTimes[i+2]);
		let enable = Number(rawModule.practicalTimes[i+3]);
		
		if((enable !== 0) && (enable !== 1)) {
			throw(new Error("something wrong with your enables in practical of '" + module.name + "'"));
		}
		
		
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
		
		if(plus) {
			++partCount;
		} else {
			++idCount;
			partCount = 1;
		}
		
		let displayName = module.name + "-" + PRACTICAL_PREFIX + idCount;
		let id = displayName + partCount;
		let shortName = PRACTICAL_PREFIX + idCount;
	
		module.pTimes.push({
			id: id,
			displayName: displayName,
			shortName: shortName, 
			day: dayNum,
			tFrom: tFrom,
			tTo: tTo,
			plus: plus,
			enable: enable
		});
	}
	
	return module;
}


function addModuleToList(module) {	
	let list = document.getElementById("module-list");
	let subList, subElm, subsubList;
	
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
	
	for(let i = 0; i < module.lTimes.length; ++i) {
		let time = module.lTimes[i];
		
		let subsubElm = document.createElement("li");
		
		let cb = document.createElement("input");
		cb.id = time.id;
		cb.name = "event";
		cb.type = "checkbox";
		cb.addEventListener("input", checkboxHandler);
		cb.setAttribute("entryType", "lecture");
		cb.setAttribute("entryModule", module.name);
		cb.setAttribute("entryDisplayName", time.displayName);
		cb.setAttribute("entryShortName", time.shortName);
		cb.setAttribute("entryColor", module.color);
		cb.setAttribute("entryDay", time.day);
		cb.setAttribute("entryFrom", time.tFrom);
		cb.setAttribute("entryTo", time.tTo);
		let label = document.createElement("label");
		label.htmlFor = time.id;
		label.textContent = time.shortName + " ; " + dayNumToText(time.day) + "-" + time.tFrom + "-" + time.tTo;
		
		subsubElm.appendChild(cb);
		subsubElm.appendChild(label);
		subsubList.appendChild(subsubElm);
		
		if(time.enable) {
			cb.checked = true;
			addEntryToSchedule(time.id, time.displayName, module.color, time.day, time.tFrom, time.tTo);
		}
	}
	
	// exercise
	subList = document.createElement("ul");
	subElm = document.createElement("li");
	subElm.textContent = "Exercise";
	
	subsubList = document.createElement("ul");
	
	subList.appendChild(subElm);
	subList.appendChild(subsubList);
	elm.appendChild(subList);
	
	for(let i = 0; i < module.eTimes.length; ++i) {
		let time = module.eTimes[i];
		
		let subsubElm = document.createElement("li");
		
		let cb = document.createElement("input");
		cb.id = time.id;
		cb.name = "event";
		cb.type = "checkbox";
		cb.addEventListener("input", checkboxHandler);
		cb.setAttribute("entryType", "exercise");
		cb.setAttribute("entryModule", module.name);
		cb.setAttribute("entryDisplayName", time.displayName);
		cb.setAttribute("entryShortName", time.shortName);
		cb.setAttribute("entryColor", module.color);
		cb.setAttribute("entryDay", time.day);
		cb.setAttribute("entryFrom", time.tFrom);
		cb.setAttribute("entryTo", time.tTo);
		let label = document.createElement("label");
		label.htmlFor = time.id;
		label.textContent = time.shortName + " ; " + dayNumToText(time.day) + "-" + time.tFrom + "-" + time.tTo;
		
		subsubElm.appendChild(cb);
		subsubElm.appendChild(label);
		subsubList.appendChild(subsubElm);
		
		if(time.enable) {
			cb.checked = true;
			addEntryToSchedule(time.id, time.displayName, module.color, time.day, time.tFrom, time.tTo);
		}
	}
	
	// practical
	subList = document.createElement("ul");
	subElm = document.createElement("li");
	subElm.textContent = "Practical";
	
	subsubList = document.createElement("ul");
	
	subList.appendChild(subElm);
	subList.appendChild(subsubList);
	elm.appendChild(subList);
	
	for(let i = 0; i < module.pTimes.length; ++i) {
		let time = module.pTimes[i];
		
		let subsubElm = document.createElement("li");
		
		let cb = document.createElement("input");
		cb.id = time.id;
		cb.name = "event";
		cb.type = "checkbox";
		cb.addEventListener("input", checkboxHandler);
		cb.setAttribute("entryType", "practical");
		cb.setAttribute("entryModule", module.name);
		cb.setAttribute("entryDisplayName", time.displayName);
		cb.setAttribute("entryShortName", time.shortName);
		cb.setAttribute("entryColor", module.color);
		cb.setAttribute("entryDay", time.day);
		cb.setAttribute("entryFrom", time.tFrom);
		cb.setAttribute("entryTo", time.tTo);
		let label = document.createElement("label");
		label.htmlFor = time.id;
		label.textContent = time.shortName + " ; " + dayNumToText(time.day) + "-" + time.tFrom + "-" + time.tTo;
		
		subsubElm.appendChild(cb);
		subsubElm.appendChild(label);
		subsubList.appendChild(subsubElm);
		
		if(time.enable) {
			cb.checked = true;
			addEntryToSchedule(time.id, time.displayName, module.color, time.day, time.tFrom, time.tTo);
		}
	}

}


function updateUIwithModuleList(modules) {
	clearList();
	initSchedule();
	
	for(let i = 0; i < modules.length; ++i) {
		addModuleToList(modules[i]);
	}
}


function clearList() {
	let list = document.getElementById("module-list");
	removeChildren(list);
}


function toggleEntryInModule(moduleName, type, shortName, enable) {
	for(let i = 0; i < modules.length; ++i) {
		let module = modules[i];
		if(module.name === moduleName) {
			if(type === "lecture") {
				for(let j = 0; j < module.lTimes.length; ++j) {
					lTime = module.lTimes[j];
					if(lTime.shortName === shortName) {
						lTime.enable = Number(enable);
						return;
					}
				}
			} else if (type === "exercise") {
				for(let j = 0; j < module.eTimes.length; ++j) {
					eTime = module.eTimes[j];
					if(eTime.shortName === shortName) {
						eTime.enable = Number(enable);
						return;
					}
				}
			} else if(type === "practical") {
				for(let j = 0; j < module.pTimes.length; ++j) {
					pTime = module.pTimes[j];
					if(pTime.shortName === shortName) {
						pTime.enable = Number(enable);
						return;
					}
				}
			} else {
				throw new Error("something wrong with the list entry");
			}
		} else {
			continue;
		}
	}
}