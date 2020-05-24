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

function checkboxHandler(event) {
	let cb = event.target;
	let name = cb.id;	// it is a name, because the entry can span over multiple cells and by that results in grouped by name elements
	let displayName = cb.getAttribute("entryDisplayName");
	
	if(cb.checked) {
		let color = cb.getAttribute("entryColor");
		let day = Number(cb.getAttribute("entryDay"));
		let tFrom = Number(cb.getAttribute("entryFrom"));
		let tTo = Number(cb.getAttribute("entryTo"));
		addEntryToSchedule(name, displayName, color, day, tFrom, tTo);
	} else {
		removeEntryFromSchedule(name);
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