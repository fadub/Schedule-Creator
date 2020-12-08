/**
 *	helper.js
 *		by Fabian Dubacher
 */


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


function toggleElm(id, show) {
	let elm = document.getElementById(id);
	if(show) {
		elm.classList.remove("hide");
	} else {
		elm.classList.add("hide");
	}
}


function exportToCsv(csv) {
	let downloadLink = document.createElement("a");
	downloadLink.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
	downloadLink.download = "my_schedule.csv";
	downloadLink.click();
}


function removeChildren(elm, indexFrom) {
	let length = elm.children.length;
	
	if(indexFrom === undefined) {
		indexFrom = 0;
	} else if (indexFrom >= length) {
		return;
	}
	
	for(let i = 0; i < (length-indexFrom); ++i) {
		let child = elm.children[indexFrom];
		child.parentNode.removeChild(child);
	}
}


function trimStringArray(arr) {
	for(let i = 0; i < arr.length; i++) {
		arr[i] = arr[i].trim();
	}
}


function isColor(strColor){
  let s = new Option().style;
  s.color = strColor;
  return s.color == strColor;
}


function cutTrailingCommas(splitValues) {
	let i;
	for(i = 0; i < splitValues.length; i++) {
		if(splitValues[i] === "") {
			break;
		}
	}
	
	if(i < splitValues.length) {
		return splitValues.slice(0,i);
	} else {
		return splitValues;
	}
}


function isCsvLineValid(csvValues) {
	// check name and color
	let name = csvValues[0];
	let color = csvValues[1];
	
	if(name === "" || color === "" || !isColor(color)) {
		return false;
	} else {
		return true;
	}
}