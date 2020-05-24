/**
 *	schedule.js
 *		by Fabian Dubacher
 */

/*----------------------------------------------------------------------------*/
/* FUNCTIONS - SCHEDULE                                                       */
/*----------------------------------------------------------------------------*/

function initSchedule() {
	for(let i = 0; i < 23; ++i) {
		let name = "r" + i + "-wd";
		let time;
		if(i < 9) {
			time = "0" + i + ":00 - 0" + (i+1) + ":00";
		} else if (i === 9) {
			time = "0" + i + ":00 - " + (i+1) + ":00";
		} else {
			time = i + ":00 - " + (i+1) + ":00";
		}
		
		let row = document.getElementById("r" + i);
		
		for(let j = 1; j < 6; ++j) {
			let cell = document.createElement("th");
			cell.classList.add("bgc-white");
			cell.setAttribute("name", name);
			cell.setAttribute("empty", "true");
			row.appendChild(cell);
			
			let table = document.createElement("table");
			table.id = "tbl-d" + j + "t" + i;
			cell.appendChild(table);
		}
	}
}

function addEntryToSchedule(name, displayName, color, day, tFrom, tTo) {
	for(let i = tFrom; i < tTo; ++i) {
		let table = document.getElementById("tbl-d" + day + "t" + i);
		let cell = document.createElement("th");
		cell.setAttribute("name", name);
		cell.textContent = displayName;
		cell.style.backgroundColor = color;
		cell.classList.add("schedule-entry");
		table.appendChild(cell);
		
		table.parentNode.setAttribute("empty", "false");
		let rowId = table.parentNode.parentNode.id; 
		toggleElm(rowId, true);
	}
}


function removeEntryFromSchedule(name) {
	let entry = document.getElementsByName(name);
	let entryLength = entry.length;
	let table;
	for(let i = 0; i < entryLength; ++i) {
		let cell = entry[0];	
		table = cell.parentNode;		
		table.removeChild(cell);
		
		if(table.childElementCount === 0) {
			table.parentNode.setAttribute("empty", "true");
		}
		
		if(hideEmptyRows) {
			let rowId = table.parentNode.parentNode.id;
			hideRowIfEmpty(rowId);
		}
	}
}


function hideRowIfEmpty(rowId) {
	// check if weekday cells of row are empty and hide if they are empty
	let cells = document.getElementsByName(rowId + "-wd");
	for(let i = 0; i < cells.length; ++i) {
		let cell = cells[i];
		if(cell.getAttribute("empty") === "false") {
			return;
		}
	}
	
	toggleElm(rowId, false);
}