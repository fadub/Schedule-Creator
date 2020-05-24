/**
 *	main.js
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
let hideEmptyRows = false;

let fileSelect = undefined;
let cbToggleEmptyRows = undefined;


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
	
		// fileSelect
		fileSelect = document.getElementById("file-select");
		fileSelect.addEventListener("change", (event) => {
			importCSV(event.target.files[0], (csvRaw) => {
				let modules = csvToModules(csvRaw);
				updateUIwithModuleList(modules);
				toggleElm("schedule-options", true);
			});
		});
		
		// cbToggleEmptyRows
		cbToggleEmptyRows = document.getElementById("cb-toggle-empty-rows");
		cbToggleEmptyRows.checked = true;
		cbToggleEmptyRows.addEventListener("change", (event) => {
			if(hideEmptyRows) hideEmptyRows = false;
			else hideEmptyRows = true;
			toggleEmptyRowsHandler(event.target.checked);
		});
	
		initializedComponents = true;
	}
}


/*----------------------------------------------------------------------------*/
/* ENTRY POINT                                                                       */
/*----------------------------------------------------------------------------*/

document.onreadystatechange = function() {
    initializeComponents();
}