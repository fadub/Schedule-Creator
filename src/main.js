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

let modules = undefined;

let fileSelect = undefined;
let cbToggleEmptyRows = undefined;
let btnSave = undefined;


/*----------------------------------------------------------------------------*/
/* FUNCTIONS - MAIN FLOW                                                      */
/*----------------------------------------------------------------------------*/


function initializeComponents() {
	if ((document.readyState === "complete" || document.readyState === "loaded") && !initializedComponents) {
	
		// fileSelect
		fileSelect = document.getElementById("file-select");
		fileSelect.addEventListener("change", (event) => {
			
			importCSVhandler(event.target.files[0], (csvRaw) => {
				modules = csvToModules(csvRaw);
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
		
		// btnSave
		btnSave = document.getElementById("btn-save");
		btnSave.addEventListener("click", () => {
			saveHandler();
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