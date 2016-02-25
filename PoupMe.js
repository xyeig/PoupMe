;(function($){
	var PoupMe = function(){
																							//面向对象，初始化，属性，行为、执行过程
		var self = this;
		//
		this.winWidth  = $(window).width();
		this.winHeight = $(window).height();
		console.log("初始化时宽高："+this.winWidth+":"+this.winHeight);
		this.poupLayer = $('<div class="Poup-show-layer" id="Poup-show-layer">');
		this.poupMask  = $('<div id="Poup-mask">');
		this.bodyNode  = $(document.body);
		//
		this.renderDom();
		this.poupBodyArea= this.poupLayer.find("div.Poup-show-body");						//获取图片插入区域
		this.poupPic	 = this.poupLayer.find("img.poup-image");							//获取图片
		this.poupCaption = this.poupLayer.find("div.Poup-show-header");						//标题
		this.poupFooter  = this.poupLayer.find("div.Poup-show-footer");
		this.leftBtn	 = this.poupLayer.find("span.Poup-btn-l");							//按钮
		this.rightBtn	 = this.poupLayer.find("span.Poup-btn-r");							//
		this.captionText = this.poupLayer.find("p.Poup-show-title");						//标题文字
		this.closeBtnTop = this.poupLayer.find("button.close");
		this.closeBtnBtm = this.poupLayer.find("button.Poup-show-btn");
		//console.log(this.poupPic);																					//获取数据，事件委托
		this.groupName = null;
		this.groupData = [];																//放置同一组数据
		this.bodyNode.delegate("[data-role=PoupMe]", 'click', function(e){
																							//阻止事件冒泡
			e.stopPropagation();
			var currentGroupName  = $(this).attr('data-group');
			if (currentGroupName != self.groupName) {
				self.groupName = currentGroupName;
				self.getGroup();
			};
																							//初始化弹框
			self.initPoup($(this));
		});
	};
	PoupMe.prototype = {
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		
		loadPicSize:function(sourceSrc){
			var self = this;
			this.preLoadImg(sourceSrc, function(){
				self.poupPic.attr("src", sourceSrc);
				var picWidth = self.poupPic.width();
				var picHeight= self.poupPic.height();
				console.log("图片真实比例:"+picWidth/picHeight);
				console.log("图片真实宽高:"+picWidth+":"+picHeight);
				self.changePic(picWidth,picHeight);
			});
		},

		changePic:function(width,height){
			var self = this;
			var winWidth = $(window).width();
			var winHeight= $(window).height();
			console.log("变化照片时测得屏幕宽高:"+winWidth+":"+winHeight);
			//>>如果图片的宽高大于浏览器的宽高比例，我们就看是否溢出
			//>>如果图片宽高小于浏览器，我们等比放大
			//>>当点击100%后，按照图片实际大小显示
			//>>当点击100%后，弹出层(图片)处于可拖动状态，执行拖动
			if (width>winWidth || height>winHeight) {
				var scale = Math.min(winWidth/width, winHeight/height, 1);
			} else if (width<winWidth && height<winHeight) {
				var scale = Math.min(winWidth/width, winHeight/height ,1.2);				//实际测试，若照片太小，放大倍数过大后，效果很差，故限制1.2倍
			};
			
			width  = width*scale;
			height = height*scale;
			console.log("scale后比例:"+width/height);
			console.log("scale后宽高:"+width+":"+height);
			this.poupBodyArea.animate({
									width:width,
									height:height-52
			});
			this.poupLayer.animate({
									width:width,
									height:height,
									marginLeft:-(width/2),
									top:(winHeight-height)/2
			},function(){
				self.poupPic.css({
								width:width-28,
								height:height-52
				}).fadeIn();
				self.poupCaption.fadeIn();
				self.poupFooter.fadeIn();
			});
		},

		preLoadImg:function(src, callback){
			var img = new Image();
			img.onload = function(){
				callback();
			};
			img.src = src;
		},

		showMaskAndPoup:function(sourceSrc,currentId){
			//console.log(sourceSrc,currentId);
			var self = this;
			this.poupPic.hide();
			this.poupCaption.hide();
			this.poupFooter.hide();
			this.poupMask.fadeIn();
			var winWidth  = $(window).width();
			var winHeight = $(window).height();
			console.log("展现弹出层和遮罩层测得宽高:"+winWidth+":"+winHeight);
			
			this.poupLayer.fadeIn();
			this.poupLayer.css({
				width:winWidth/2,
				height:winHeight/2,
				marginLeft:-winWidth/4,
				top:winHeight/4
			});//

			self.loadPicSize(sourceSrc);
			this.index = this.getIndexOf(currentId);
			//console.log(this.index);
			var groupDataLength = this.groupData.length;
			if(groupDataLength>1){
				if(this.index === 0){
					this.leftBtn.addClass("disabled");
					this.rightBtn.removeClass("disabled");
					this.rightBtn.css('cursor', 'pointer');
				}else if(this.index === groupDataLength-1){
					this.leftBtn.removeClass("disabled");
					this.leftBtn.css('cursor', 'pointer');
					this.rightBtn.addClass("disabled");
				}else{
					this.leftBtn.removeClass("disabled");
					this.rightBtn.removeClass("disabled");
					this.leftBtn.css('cursor', 'pointer');
					this.rightBtn.css('cursor', 'pointer');
				};
			};
		},

		getIndexOf:function(currentId){
			var index = 0;
			$(this.groupData).each(function(i){
				index = i;
				if (this.id === currentId){
					return false;
				};
			});
			return index;
		},

		initPoup:function(currentObj){
			var self 		= this;
			var sourceSrc	= currentObj.attr("data-source");
			var currentId 	= currentObj.attr("data-id");

			this.showMaskAndPoup(sourceSrc,currentId);
		},
																							//获取当前组数据
		getGroup:function(){
																							//保存self，防止this漂移
			var self = this;
			var groupList = this.bodyNode.find("*[data-group=" +this.groupName+ "]");
			self.groupData.length = 0;														//每次获取组数据前清空原先已获取的数据
			groupList.each(function(){
				self.groupData.push({
									src:$(this).attr("data-source"),
									id:$(this).attr("data-id"),
									caption:$(this).attr("data-caption")
				});																			//以对象的形式组合数组(:this在同的位置代表的对象不同)
				//console.log(self.groupData);
			});
		},
																							//对象方法的实现
		renderDom:function(){
			var strDom =	'<div class="Poup-show-header" id="Poup-show-header">'+
								'<button type="button" class="close" data-dismiss="modal">'+
									'<span aria-hidden="true">×</span>'+
									'<span class="sr-only">Close</span>'+
								'</button>'+
								'<p class="Poup-show-title">标题信息预留</p>'+
								'</div>'+
							'<div class="Poup-show-body">'+
								'<span class="Poup-btn-l"></span>'+
								'<img class="poup-image" src="./IMG/1.jpg">'+
								'<span class="Poup-btn-r"></span>'+
							'</div>'+
							'<div class="Poup-show-footer">'+
								'<button type="button" class="Poup-show-btn" data-dismiss="modal">Close</button>'+
							'</div>';
		//
		this.poupLayer.html(strDom);
		this.bodyNode.append(this.poupMask,this.poupLayer);
		}
	};
	window["PoupMe"] = PoupMe;
})(jQuery);	

