/****************  VirtualKeyboard *************************/	
VirtualKeyboard = (function(undefined){
    var doBlurTimeout = 1200;
	function VirtualKeyboard(dom){
		if(dom)
			this.dom = dom;
		else {
			this.dom = document.createElement('div')
			this.dom.setAttribute('id', 'keyboard')
			this.dom.setAttribute('data-shown', 'false')
			document.body.appendChild(this.dom)
		}
		
		this.keys = [];
		this.connectedInput = undefined;
		var self = this;
		this.dom.addEventListener('click', function(e){
			if(e.target.tagName.toLowerCase() == "button")
				self.vKeyPressed(e.target.innerText);
			else
				self.connectedInput.focus();
		});
		this.doBlurTimer = undefined;
		this.linkedInputs = []
	}
	VirtualKeyboard.prototype.link = function(inputs){
		var self = this;
		function link_input(input){
			input.addEventListener('focus', function(){ self.show(input); clearTimeout(self.doBlurTimer); })
			input.addEventListener('blur', function(){ self.doBlurTimer = setTimeout(function(){self.hide();}, doBlurTimeout)})
		}
		if( inputs.length ){
			for(var i=0, len=inputs.length; i<len; i++){
				var input = inputs[i];
				this.linkedInputs.push(input);
				link_input(input);
			}
		}
	}
	VirtualKeyboard.prototype.load = function(layout){
		this.dom.innerHTML = '';
		for(var lineIndex=0; lineIndex < layout.length; lineIndex++){
			for(var i=0; i < layout[lineIndex].length; i++){
				if(layout[lineIndex][i] == ""){
					var spacer = document.createElement('div');
					spacer.className = 'spacer';
					this.dom.appendChild(spacer);
				}else{
					var key = document.createElement("button");
					key.innerText = layout[lineIndex][i];
					this.keys.push(key)
					this.dom.appendChild(key);
				}
			}
			this.dom.appendChild(document.createElement("br"));
		}
	}
	VirtualKeyboard.prototype.show = function(input){ 
		var rect = input.getBoundingClientRect();
		this.dom.style.top = rect.top + window.scrollY + rect.height + 'px' ;
		this.dom.style.left = rect.left + rect.width + window.scrollX - 440 + 'px' ;		
		this.dom.setAttribute("data-shown", "true"); 
		this.connectedInput = input;
	}
	VirtualKeyboard.prototype.hide = function(){ this.dom.setAttribute("data-shown", "false"); }
	VirtualKeyboard.prototype.vKeyPressed = function(key){
		var ci = this.connectedInput;
		ci.focus();
		var s = ci.selectionStart;
		if(key != BACKSPACE_KEY){
			ci.value = ci.value.substr(0, s) + key + ci.value.substr(ci.selectionEnd);
			ci.selectionEnd = s+1;
		}else{
			if(ci.selectionStart == ci.selectionEnd){
				ci.value = ci.value.substr(0, s-1) + ci.value.substr(ci.selectionEnd);
				ci.selectionStart = ci.selectionEnd = s-1;
			}else{
				ci.value = ci.value.substr(0, s) + ci.value.substr(ci.selectionEnd);
				ci.selectionStart = ci.selectionEnd = s;
			}
		}
		if(this.onVirtualInput) this.onVirtualInput(ci.value);
	}
	BACKSPACE_KEY = "←";
	VirtualKeyboard.keyboard_layouts = { "he": [
					["", "ק", "ר", "א", "ט", "ו", "ן", "ם", "פ", BACKSPACE_KEY],
					["ש", "ד", "ג", "כ", "ע", "י", "ח", "ל", "ך", "ף"],
					["ז", "ס", "ב", "ה", "נ", "מ", "צ", "ת", "ץ"]
					],
				"ar": [
					["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د", BACKSPACE_KEY],
					["ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط", "ذ"],
					["ئ", "ء", "ؤ", "ر", "لا", "ى", "ة", "و", "ز", "ظ", "أ", "إ", "آ"]
				    ]
				}
	return VirtualKeyboard
})()