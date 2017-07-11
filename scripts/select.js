var seelect = seelect || {};


seelect = (function(){

	var defaults = {
		selector: 'data-seelect'
	}

	var collectObjects = function(){
		$('[data-seelect]').each(function(){

			var optArray = [];
			$.each(this.options, function(idx,opt){
				optArray.push({
					text: $(opt).text(),
					value: $(opt).attr('value')
				})
			});

			var selectObj = {
				el: $(this),
				id: $(this).attr('id'),
				name: $(this).attr('name'),
				orgState: $(this).find('option:selected').text(),
				opts: optArray
			}
			//console.log( selectObj );
			generateDHTML(selectObj);



		});
	};

	var generateDHTML = function(obj){
		var build = obj;

		build.el.wrap('<div class="seelect-wrapper" id="seelect-' + build.id + '">');
		var seelectWrapper = build.el.parent('div.seelect-wrapper');
		//console.log(seelectWrapper);

		seelectWrapper.append('<div class="seelect-el" tabindex="0"><ul>');

		var seelectEl = seelectWrapper.find('.seelect-el');
		//console.log(seelectEl);

		seelectEl.prepend('<span class="seelect-item">' + build.orgState);

		$.each(build.opts, function(idx,item){
			//console.log(item);
			var HTML = '<li '

				if( build.orgState === item.text ){
					HTML += 'class="seelect-list selected" ';
				} else {
					HTML += 'class="seelect-list" ';
				}

				HTML += 'data-value="' + item.value + '" tabindex="0">' 
				HTML += item.text + '</li>';

			

			seelectEl.find('ul').append(HTML);
		});

		bindDHTML(seelectWrapper);


	};

	var bindDHTML = function(el){

		$('#cars').focus()

		var self = el;
		var total = $(self).find('.seelect-list').length-1;

		function openList(){
			$(self).addClass('open');
			$(self).find('.seelect-list.selected').focus();
		}
		function closeList(){
			$(self).find('.seelect-el').focus();
			$(self).removeClass('open');
		}
		function makeSelection(el){
			var val = $(el).attr('data-value');
			console.log(val);
			var txt =  $(el).text();

			$(self).find('.seelect-list').removeClass('selected');
			$(self).find('select').val(val);
			$(self).find('.seelect-item').text(txt);
			$(el).addClass('selected');
			closeList();
		}


		function focusTo(el){
			el.focus();
		}


		el.on('keydown', function(e){
			console.log(e.which);
			
			/// ESC KEY or ENTER KEY
			if(e.which === 27 || e.which === 13){
				closeList();
			}
			// SPACE BAR
			if(e.which === 32){
				openList();
			}

			// UP ARROW
			if(e.which === 38){
				$(e.target).prev().focus();
			}

			// DOWN ARROW
			if(e.which === 40){
				$(e.target).next().focus();
			}
		});

		el.on('click', '.seelect-item', function(e){
			openList();
		});

		el.on('click','.seelect-list', function(e){
			makeSelection(this);
		});

		el.on('keydown','.seelect-list', function(e){
			var sel = $(self).find('.seelect-list').index( e.target );

			if( e.which === 13 ){
				makeSelection(this);
			}
			if(e.which === 9 && !e.shiftKey ){
				if( $(e.target).hasClass('seelect-list') ){
					
					if( sel === total ){
						focusTo($(self).find('.seelect-list:first'));
						return false;
					} 
				}
			}
			if(e.which === 9 && e.shiftKey){
				if( sel === 0 ){
					focusTo($(self).find('.seelect-list:last'));
					return false;
				}
			}
		});




	}

	var init = function(){
		collectObjects();
	};

	return {
		defaults: defaults,
		init: init
	}

})();

(function(){
	seelect.init();
})();