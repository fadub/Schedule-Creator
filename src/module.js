/**
 *	modules.js
 *		by Fabian Dubacher
 */


/*----------------------------------------------------------------------------*/
/* FUNCTIONS - MODULE                                                         */
/*----------------------------------------------------------------------------*/


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


function addModuleToList(module) {	
	let list = document.getElementById("module-list");
	let subList, subElm, subsubList;
	let idCount, partCount;
	
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
	partCount = 1;
	for(let i = 0; i < module.lTimes.length; ++i) {
		let time = module.lTimes[i];
		
		if(!time.plus) {
			++idCount;
			partCount = 1;
		} else {
			++partCount;
		}
		
		let entryDisplayName = module.name + "-" + LECTURE_PREFIX + idCount;
		let entryId = entryDisplayName + partCount;
		let shortName = LECTURE_PREFIX + idCount;
		
		let subsubElm = document.createElement("li");
		
		let cb = document.createElement("input");
		cb.id = entryId;
		cb.type = "checkbox";
		cb.addEventListener("input", checkboxHandler);
		cb.setAttribute("entryDisplayName", entryDisplayName);
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
	partCount = 1;
	for(let i = 0; i < module.eTimes.length; ++i) {
		let time = module.eTimes[i];
		
		if(!time.plus) {
			++idCount;
		}else {
			++partCount;
		}
		
		let entryDisplayName = module.name + "-" + EXERCISE_PREFIX + idCount;
		let entryId = entryDisplayName + partCount;
		let shortName = EXERCISE_PREFIX + idCount;
		
		let subsubElm = document.createElement("li");
		
		let cb = document.createElement("input");
		cb.id = entryId;
		cb.type = "checkbox";
		cb.addEventListener("input", checkboxHandler);
		cb.setAttribute("entryDisplayName", entryDisplayName);
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
	partCount = 1;
	for(let i = 0; i < module.pTimes.length; ++i) {
		let time = module.pTimes[i];
		
		if(!time.plus) {
			++idCount;
		} else {
			++partCount;
		}
		
		let entryDisplayName = module.name + "-" + PRACTICAL_PREFIX + idCount;
		let entryId = entryDisplayName + partCount;
		let shortName = PRACTICAL_PREFIX + idCount;
		
		let subsubElm = document.createElement("li");
		
		let cb = document.createElement("input");
		cb.id = entryId;
		cb.type = "checkbox";
		cb.addEventListener("input", checkboxHandler);
		cb.setAttribute("entryDisplayName", entryDisplayName);
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