	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-53425526-1', 'auto');
	ga('send', 'pageview');



	var genRand = function(min=0, max=Number.MAX_SAFE_INTEGER) {
		return Math.floor(min + Math.random() * (max + 1 - min));
	}

	var isMobile = ($(window).width()<1200) ? true : false;
	// var dpi = (isMobile) ? '300' : '600';
	var dpi = '300';

	$('body').removeClass('loading');
	$("#write").prop('disabled', false);




















	var canvas = document.createElement('canvas');
	var sprites = [];



	var api_url = "https://api0.coo.by/writer/list.php?ping";
	var api_timer;
	var sendText = function(timeout=3000){
		console.log('sendText');
		var text = $("#text").val();
		$.ajax({
			url: api_url,
			type: "POST",
			data: {text: text},
			dataType: "json",
			timeout: timeout,
			success: function(data){
				console.log('success', api_url);
				if(data.status == 'ok'){
					loadSprites(data['lists'][0]);
				} else {
					// api_timer = setInterval(function(){
					// 	api_url = "https://api.coo.by/writer/list.php?ping";
					// }, 10000);
					// sendText(30000);
				}
			},
			error: function(data){
				console.log('error', api_url);
				clearInterval(api_timer);
				api_timer = setInterval(function(){
					api_url = "https://api0.coo.by/writer/list.php?ping";
				}, 30000);
				api_url = "https://api.coo.by/writer/list.php?ping";
				sendText(30000);
			}
		});
	}



	var loadSprites = function(data){
		console.log('loadSprites');
		var spritesToLoad = Object.keys(data);
		if(spritesToLoad.every(spriteToLoad => sprites.hasOwnProperty(spriteToLoad))){
			renderList(data);
		} else {
			var j=0;
			for(var i=0; i<spritesToLoad.length; i++) {
				if(!sprites.hasOwnProperty(spritesToLoad[i])){
					var sprite = new Image();
					sprite.src = './writer_core/cursives/kate/bitmaps/sprites/tiny/'+dpi+'dpi/'+spritesToLoad[i]+'.png';
					// sprite.src = './writer_core/cursives/kate/bitmaps/sprites/tiny/'+dpi+'dpi/'+spritesToLoad[i]+'.png?rand='+genRand();
					sprite.onload = function(){
						j++;
						// console.log(j);
						if(j>=spritesToLoad.length){
							renderList(data);
						}
					}
					sprites[spritesToLoad[i]] = sprite;
				} else {
					j++;
					// console.log(j);
					if(j>=spritesToLoad.length){
						renderList(data);
					}
				}
			}
		}
	}



	var renderList = function(data){
		console.log('renderList');
		var canvas_ctx = canvas.getContext('2d');
		var r = dpi/600;
		canvas.width = 4960*r;
		canvas.height = 7016*r;
		canvas_ctx.fillStyle = "#fff";
		canvas_ctx.fillRect(0, 0, canvas.width, canvas.height);
		// canvas_ctx.clearRect(0, 0, canvas.width, canvas.height); // прозрачный фон
		$.each(data, function(key, items){
			items.forEach((item) => {
				canvas_ctx.drawImage(sprites[key], item[2][0]*r, item[2][1]*r, item[2][2]*r, item[2][3]*r, item[0]*r, item[1]*r, item[2][2]*r, item[2][3]*r);
			})
		});
		showList(canvas);
	}













































	// Нажатие на "Перевести в рукопись" + логика доната
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
		// if(lists_count==2 || lists_count%3==0){
		if(lists_count%3==0){
			openPopup();
		}
	});

	// Обработка горячих клавиш сокращений
	$('#text').keydown(function (e) {
		if(e.keyCode === 9){ // +Tab
			var val = this.value,
				start = this.selectionStart,
				end = this.selectionEnd;
			this.value = val.substring(0, start) + '\t' + val.substring(end);
			this.selectionStart = this.selectionEnd = start + 1;
			return false;
		}
		if(e.ctrlKey && e.keyCode == 13){ // Ctrl+Enter
			$("#write").prop('disabled', true);
			$('.clipboard').addClass('loading');
			sendText();
		}
	});

	// Показать лист при готовом canvas
	var showList = function(canvas){
		console.log('showList');
		$('#list_img').attr('crossorigin', 'anonymous');
		$('#list_img').attr("src", canvas.toDataURL());
		// $('#list').css('margin-left', '0');
		$('#list').show();

		$('.clipboard').removeClass('loading');
		$('body').removeClass('loading');
		$("#write").prop('disabled', false);
	}

	// При изменении textarea показывать кнопку, при очистке скрывать
	$('#text').bind('keydown input propertychange', function() {
		if($('#text').val() !== ''){
			$("#write").show();
		} else {
			$("#write").hide();
		}
	});



	// Прячем лист если с телефона
	$("#list").click(function() {
		if(isMobile){
			// $('#list').css('margin-left', '100%');
			$('#list').hide();
		}
	});



	// Блок логики доната
	var openPopup = function(){
		console.log('openPopup');
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