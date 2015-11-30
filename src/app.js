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
}
