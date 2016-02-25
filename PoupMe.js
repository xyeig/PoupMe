;(function($){
	var PoupMe = function(){
																							//面向对象，初始化，属性，行为、执行过程
		var self = this;
		//
		this.poupLayer = $('<div class="Poup-show-layer" id="Poup-show-layer">');
		this.poupMask  = $('<div id="Poup-mask">');
		this.bodyNode  = $(document.body);
		//
		this.renderDom();
		this.picViewArea = this.poupLayer.find("div.Poup-show-body");						//获取图片插入区域
		this.poupPic	 = this.poupLayer.find("img.poup-image");							//获取图片
		this.poupCaption = this.poupLayer.find("div.Poup-show-header");						//标题
		this.leftBtn	 = this.poupLayer.find("span.Poup-btn-l");							//按钮
		this.rightBtn	 = this.poupLayer.find("span.Poup-btn-r");							//
		this.captionText = this.poupLayer.find("p.Poup-show-title");						//标题文字
																							//获取数据，事件委托
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
		});
	};
	PoupMe.prototype = {
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
				console.log(self.groupData);
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

