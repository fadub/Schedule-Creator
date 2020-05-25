/**
 *	handler.js
 *		by Fabian Dubacher
 */

/*----------------------------------------------------------------------------*/
/* FUNCTIONS - HANDLERS                                                       */
/*----------------------------------------------------------------------------*/

function handleException(ex) {
	alert("An error with the following message occured:\n\n" 
	+ ">> " + ex.message + " <<" 
	+ "\n\n Please read the README. If it doesn't seem helpful contact the maintainer.");
}


function importCSVhandler(file, done) {
	const fr = new FileReader();
	fr.addEventListener("load", function(event) {
		done(event.target.result);
	});
	fr.readAsText(file);
}


function checkboxHandler(event) {
	let cb = event.target;
	let name = cb.id;	// it is a name, because the entry can span over multiple cells and by that results in grouped by name elements
	let moduleName = cb.getAttribute("entryModule");
	let shortName = cb.getAttribute("entryShortName");
	let type = cb.getAttribute("entryType");
	let displayName = cb.getAttribute("entryDisplayName");
	let color = cb.getAttribute("entryColor");
	let day = Number(cb.getAttribute("entryDay"));
	let tFrom = Number(cb.getAttribute("entryFrom"));
	let tTo = Number(cb.getAttribute("entryTo"));
	
	if(cb.checked) {
		addEntryToSchedule(name, displayName, color, day, tFrom, tTo);
		toggleEntryInModule(moduleName, type, shortName, cb.checked);
	} else {
		removeEntryFromSchedule(name);
		toggleEntryInModule(moduleName, type, shortName, cb.checked);
	}
}


function toggleEmptyRowsHandler(show) {
	if(show) {
		for(let i = 0; i < 24; ++i) {
			let rowId = "r" + i;
			toggleElm(rowId, show);
		}
	} else {
		outter: for(let i = 0; i < 24; ++i) {
			let rowId = "r" + i;
			hideRowIfEmpty(rowId);
		}
	}
}


function saveHandler() {
	let csv = createCSVfromModuleList();
	exportToCsv(csv);
}