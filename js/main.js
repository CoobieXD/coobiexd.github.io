



		var isMobile = ($(window).width()<1200) ? true : false;


		if(isMobile){
			$('#text').val('');
		}


		var lists_count = 0;
		$("#write").click(function(){
			lists_count++;
			if(isMobile){
				$('body').addClass('loading');
			}
			$("#write").prop('disabled', true);
			$('.clipboard').addClass('loading');
			sendText();
			// if(lists_count>3 && lists_count%3==0){
			if(lists_count==2 || lists_count%3==0){
				openPopup();
			}
		});


		$('#text').keydown(function (e) {
			if(e.keyCode === 9){
				var val = this.value,
					start = this.selectionStart,
					end = this.selectionEnd;
				this.value = val.substring(0, start) + '\t' + val.substring(end);
				this.selectionStart = this.selectionEnd = start + 1;
				return false;
			}
			if(e.ctrlKey && e.keyCode == 13){
				$("#write").prop('disabled', true);
				$('.clipboard').addClass('loading');
				sendText();
			}
		});


		// $("#text").change(function() {
		$('#text').bind('keydown input propertychange', function() {
			if($('#text').val() !== ''){
				$("#write").show();
			} else {
				$("#write").hide();
			}
		});



		var dpi = (isMobile) ? '300' : '600';
		dpi = '300';
		var sprites = [];
		var main_sprite = 'cyrillic_lowercase';


/*
		sprites[main_sprite] = new Image();
		sprites[main_sprite].crossOrigin = 'anonymous';
		sprites[main_sprite].src = './writer_core/cursives/kate/bitmaps/sprites/tiny/'+dpi+'dpi/'+main_sprite+'.png';
		// sprite.src = 'https://raw.githubusercontent.com/CoobieXD/coobiexd.github.io/master/sprite.png?2';
		sprites[main_sprite].onload = function() {
			$('body').removeClass('loading');
			$("#write").prop('disabled', false);
		}
*/
			$('body').removeClass('loading');
			$("#write").prop('disabled', false);

		// const imgblob = await fetch('writer_core/lists/list_dots.png').then(r => r.blob());
		// const img = await createImageBitmap(imgblob);




















		if(window.OffscreenCanvas){
			// var worker = new Worker('worker.js');
			// var htmlCanvas = document.getElementById("canvas");
			// var offscreen = htmlCanvas.transferControlToOffscreen();
			// var offscreen = new OffscreenCanvas(4960, 7016);
			// worker.postMessage({canvas: offscreen, data: data}, [offscreen]);
		} else {

		}
		var canvas = document.createElement('canvas');












		var sendText = function(){
			var text = $("#text").val();
			$.ajax({
				// url: "/writer_core/list.php?scratch&hyphen", // rand&300dpi&scratch&hyphen&curv
				// url: "//api2.coo.by/list.php?scratch&hyphen",
				url: "//api.coo.by/writer/list.php?scratch&hyphen",
				type: "POST",
				data: {text: text},
				dataType: "json",
				// jsonpCallback: "logResults",
				// jsonpCallback: 'processJSONPResponse',
				// jsonp: "callback",
				success: async function(data){
					// console.log('success');
					// console.log('data='+data);

					var spritesToLoad = Object.keys(data[0]);
					await loadSprites(spritesToLoad, sprites);
					renderList(canvas, sprites, data[0], isMobile);
					// await showList(canvas);

				}
			});
		}





		var loadSprites = async function(spritesToLoad, sprites){
			 return new Promise((resolve) => {
			console.log('loadSprites 1');
			if(spritesToLoad.every(spriteToLoad => sprites.hasOwnProperty(spriteToLoad))){
				// return 1;
				resolve(1);
			} else {
				var j=0;
				for(var i=0; i<spritesToLoad.length; i++) {
					if(!sprites.hasOwnProperty(spritesToLoad[i])){
						var sprite = new Image();
						sprite.src = './writer_core/cursives/kate/bitmaps/sprites/tiny/'+dpi+'dpi/'+spritesToLoad[i]+'.png';
						// sprite.src = './writer_core/cursives/kate/bitmaps/sprites/tiny/'+dpi+'dpi/'+spritesToLoad[i]+'.png?rand='+genRand();
						// sprite.src = './gh-pages/writer_core/cursives/kate/bitmaps/sprites/tiny/'+dpi+'dpi/'+spritesToLoad[i]+'.png?rand='+genRand();
						sprite.onload = function(){
							j++;
							console.log(j);
							if(j >= spritesToLoad.length){
								console.log('spriteLoaded 2');
								// return 1;
								resolve(1);
							}
						}
						sprites[spritesToLoad[i]] = sprite;
					}
				}
			}
			 })
		};





		var renderList = async function(canvas, sprites, data, isMobile){
			console.log('renderList 3');

			var canvas_ctx = canvas.getContext('2d');

			// console.log(data);
			// console.log(sprites);

			var r = isMobile ? 0.5 : 1;
			r = 0.5;

			canvas.width = 4960*r;
			canvas.height = 7016*r;
			if(window.location.hash !== '#max_blame'){
				canvas_ctx.fillStyle = "#fff";
				canvas_ctx.fillRect(0, 0, canvas.width, canvas.height);
			} else {
				canvas_ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
			$.each(data, function(key, items){

				// console.log(key);
				// console.log(sprites);
				// console.log(sprites['scratches']);
				// console.log(sprites[key]);

				items.forEach((item) => {
					canvas_ctx.drawImage(sprites[key], item[2][0]*r, item[2][1]*r, item[2][2]*r, item[2][3]*r, item[0]*r, item[1]*r, item[2][2]*r, item[2][3]*r);
				})
			});
			// return canvas;
			showList(canvas);
		}





		var showList = function(canvas){
			$('#list_img').attr('crossorigin', 'anonymous');
			$('#list_img').attr("src", canvas.toDataURL());
			// $('#list').css('margin-left', '0');
			$('#list').show();

			$('.clipboard').removeClass('loading');
			$('body').removeClass('loading');
			$("#write").prop('disabled', false);
		}
























		$("#list").click(function() {
			if(isMobile){
				// $('#list').css('margin-left', '100%');
				$('#list').hide();
			}
		});



		var openPopup = function(){
			$('.popup').fadeIn(200);
			$('.popup').slideDown(200, function() {
				$('.env_list').slideDown(800);
			});
		}

		var closePopup = function(){
			$('.env_list').slideUp(400, function() {
				$('.popup').hide(0, function() {
				});
			});
		}

		$('.env_list_x, .popup').click(function(e) {
			if (e.target !== this) return;
			closePopup();
		});
