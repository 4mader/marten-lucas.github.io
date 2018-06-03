var s;

window.onload = function () {

s = Snap("#foosball_table");
	Snap.load("foosball_table.svg", function(f) {
		s.append(f);
		
		// add onclick function to wildcard ids "_move_"
		$( '[id*=_move_]' ).click( function() {
			console.log( this.id );
			rod_move(this);
		});
		
		$( '[id$=_up], [id$=_back], [id$=_front]' ).click( function() {
			console.log( this.id );
			rod_tilt(this);
		});
	});
	
};


function toggle_guides() {
	var checkbox_guides = document.getElementById("checkbox_toggle_guides");

    var guides = s.select('#guides')
	
	if (checkbox_guides.checked) {
		guides.attr({ display : "inline" });      
	} else {       
        guides.attr({ display : "none" });      
    }
}


function rod_selector_string(rod_id) {
	//get Player and rod from clicked arrow
	var rod_name = rod_id.substring(0, 4);
	// built selector for all layers of rod
	return "#"+rod_name+"_up,#"+rod_name+"_front,#"+rod_name+"_back";
}

function rod_move(rod_arrow) {
	var step_size = 5
	//get Player and rod from clicked arrow
	var rod_selector = rod_selector_string(rod_arrow.id);
	// get svg of clicked arrow
	var arrow_clicked = s.select("#"+rod_arrow.id);
	
	var re_P1 = new RegExp("P1"); 	
	var re_P2 = new RegExp("P2"); 
	var re_away = new RegExp("away");
	var re_toward = new RegExp("toward");
	 
	
	// determine direction from player and away/toward 
	if (re_away.test(rod_arrow.id) && /P1/.test(rod_arrow.id)) {
		var direction = 1;
	};
	if (re_toward.test(rod_arrow.id) && /P2/.test(rod_arrow.id)) {
		var direction = 1;
	};
	
	if (re_toward.test(rod_arrow.id) && /P1/.test(rod_arrow.id)) {
		var direction = -1;
	};
	if (re_away.test(rod_arrow.id) && /P2/.test(rod_arrow.id)) {
		var direction = -1;
	};
	
	// get bounding box of table
	var table = s.select("#table");
	var bb_table = table.getBBox();
	
	$(rod_selector).each(function(i, rod) {
		// check if rod is "active" 
		if (s.select("#"+rod.id).attr("display")=="inline"){
			// move rod
			var rod_svg = s.select("#"+rod.id);
			var matrix = rod_svg.transform().localMatrix
			
			console.log( rod_svg.id + ": matrix.f);
			matrix.f = matrix.f + step_size * direction
			console.log( rod_svg.id + ": matrix.f);
			
			rod_svg.transform(matrix);
		
			//if further step would leave the field, hide the clicked arrow
			bb_rod = rod_svg.getBBox();
			
			if ((bb_rod.y2 + step_size * direction) < bb_table.y2 && (bb_rod.y + step_size * direction) > bb_table.y) {
				arrow_clicked.attr({ display : "inline" });   	
			} else {
				arrow_clicked.attr({ display : "none" });   	
			}
		}
		
	});	
	

	
	
	// make the opposite arrow visible (step always possible) 
	if (re_toward.test(rod_arrow.id)) {
	var arrow_opposite = s.select("#" + rod_name + "_move_away");
	} else {
	var arrow_opposite = s.select("#" + rod_name + "_move_toward");
	};
	arrow_opposite.attr({ display : "inline" });   


};



function rod_tilt(rod_clicked, new_tilt) {
	// new_tilt as optional argument
	new_tilt = new_tilt || 'automatic';
	
	// set position of all tilts equal to the clicked
	var rod_clicked_svg = s.select("#"+rod_clicked.id);
	var matrix_visible = rod_clicked_svg.transform().localMatrix;
	var rod_selector=rod_selector_string(rod_clicked.id);
	
	$(rod_selector).each(function(i, rod_display) {
		var tilt_svg = s.select("#"+rod_display.id);
		var matrix = tilt_svg.transform().localMatrix
		
		console.log( rod_display.id + ": matrix.f);
		matrix.f = matrix_visible.f 
		console.log( rod_display.id + ": matrix.f);
		
		 tilt_svg.transform(matrix);
		// });
		
	// if no new_tilt is given determine new tilt
	if (new_tilt == "automatic") {
		var re_isup = new RegExp("_up");
		var re_isfront = new RegExp("_front");
		if (re_isup.test(rod_clicked.id)) {
			new_tilt = rod_clicked.substring(0, 4)+"back";
		} else {
			if (re_isfront.test(rod_clicked.id)) {			
				new_tilt = rod_clicked.id.substring(0, 4)+"_back";
			} else {
				new_tilt = rod_clicked.id.substring(0, 4)+"_front";
			};
		};
	};
	
	var new_tilt_svg = s.select("#" + new_tilt);
		
	// hide clicked and show new_tilt
	rod_clicked_svg.attr({ display : "none" });   
	new_tilt_svg.attr({ display : "inline" });   
	
	
};