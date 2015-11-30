function tagemall(){
	var lexer = new Lexer(),
	tagger = new POSTagger(),
	nodes = document.querySelectorAll("#tagtext");

	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i],
		words = lexer.lex(node.value),
		tagged = tagger.tag(words);

		var output = document.createElement("div");
		output.setAttribute("class", "output");

		for (var j = 0; j < tagged.length; j++) {
			var tag = tagged[j],
			word = tag[0],
			wordType = tag[1];

			var span = document.createElement("span");
			//set html attributes like class="word"
			span.setAttribute("class", "word");
			span.setAttribute("data-word-type", wordType);
			span.setAttribute("data-word-type-name", wordTypes[wordType]);
			span.textContent = word;

			output.appendChild(span);
		}

		//check if the element already exists in the dom
		var outputnode = document.querySelector('.output');
		if(outputnode){
			outputnode.parentNode.removeChild(outputnode);
		}

		// add the node in dom before the output node
		node.parentNode.insertBefore(output, node.nextSibling);
	}

	//download the final data
	var textFile = null,
	makeTextFile = function (text) {
		var data = new Blob([text], {type: 'text/plain'});

		// If we are replacing a previously generated file we need to
		// manually revoke the object URL to avoid memory leaks.
		if (textFile !== null) {
			window.URL.revokeObjectURL(textFile);
		}

		textFile = window.URL.createObjectURL(data);

		return textFile;
	};

	var url = makeTextFile(document.querySelector('.output').innerHTML);
	document.getElementById('download').setAttribute('href', url);
}

var example4 = example4 || {};
example4.readBlob = function(opt_startByte, opt_stopByte) {
	var files = document.getElementById('file-7').files;
	if (!files.length) {
		alert('Please select a file!');
		return;
	}

	var file = files[0];
	var start = parseInt(opt_startByte) || 0;
	var stop = parseInt(opt_stopByte) || file.size - 1;

	var reader = new FileReader();

	reader.onloadend = function(evt) {
		if (evt.target.readyState == FileReader.DONE) { // DONE == 2
			// get('byte_content').textContent = evt.target.result;
			//out put the text into the console to see if it's the same
			var inputdata = evt.target.result;
			var inputsplit = inputdata.split(" ");
			document.getElementById('tagtext').value = inputdata;
			tagemall();
			var trueperc = 0;
			//calculating accuracy
			var cusid_ele = document.getElementsByClassName('word');
			for (var i = 0; i < cusid_ele.length; ++i) {
				var item = cusid_ele[i];
				if(lexicon[item.innerHTML] == item.getAttribute('data-word-type')){
				 trueperc++;
			 }
			}
			var sizedata = inputsplit.length;
			var accuracy = (trueperc/sizedata) * 100;
			document.getElementById('testresult').innerHTML = 'Accuracy: ' + accuracy + '%';
			// get('byte_range').textContent = ['Read bytes: ', start + 1, ' - ', stop + 1,
			//  ' of ', file.size, ' byte file'].join('');
		}
	};
	reader.readAsBinaryString(file.slice(start, stop + 1));
};

//test it on data
document.querySelector('.testdata').addEventListener('click', function(evt) {
	var startByte = evt.target.getAttribute('data-startbyte');
	var stopByte = evt.target.getAttribute('data-endbyte');
	example4.readBlob(startByte, stopByte);
}, false);

//populate the types data into table
for(var key in wordTypes) {
	var tbl = document.getElementById('datatable'), // table reference
	row = tbl.insertRow(tbl.rows.length);
	createCell(row.insertCell(0), key, 'mdl-data-table__cell--non-numeric');
	createCell(row.insertCell(1), wordTypes[key], 'mdl-data-table__cell--non-numeric');
}

// create DIV element and append to the table cell
function createCell(cell, text, style) {
	var div = document.createElement('div'), // create DIV element
	txt = document.createTextNode(text); // create text node
	div.appendChild(txt);                    // append text node to the DIV
	div.setAttribute('class', style);        // set DIV class attribute
	div.setAttribute('className', style);    // set DIV class attribute for IE (?!)
	cell.appendChild(div);                   // append DIV to the table cell
}
