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