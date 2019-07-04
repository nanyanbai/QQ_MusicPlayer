/**这是一个闭包函数
 * js的面向对象
**/
(function (window){
    function Progress($progressBar,$progressLine,$progressDot) {
        return new  Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype = {
        constructor:Progress,
        init: function ($progressBar,$progressLine,$progressDot) {
            this.$progressBar=$progressBar;
            this.$progressLine=$progressLine;
            this.$progressDot=$progressDot;
        },
        isMove: false,
        progressClick: function(callBack){
            var $this = this;
            this.$progressBar.click(function (event) {
                //获取背景距离窗口默认的位置
                var  normalLeft = $(this).offset().left;
                console.log(normalLeft);
                //获取点击的位置距离窗口的位置
                var  eventLeft=event.pageX;
                console.log(eventLeft);
                //设置前景的宽度
                $this.$progressLine.css("width", eventLeft-normalLeft);
                $this.$progressDot.css("left", eventLeft-normalLeft);
                //计算进度条的比例
                var value = (eventLeft-normalLeft) / $(this).width();
                callBack(value);
            })
        },
        progressMove: function (callBack) {
            var $this=this;
            var  normalLeft = this.$progressBar.offset().left;
            var barWidth=this.$progressBar.width();
            var  eventLeft;
            this.$progressBar.mousedown(function () {
                $this.isMove = true;
               $(document).mousemove(function (event){
                   //获取点击的位置距离窗口的位置
                    eventLeft = event.pageX;
                   console.log('这是点击位置距离浏览器窗口的位置：---------->'+eventLeft);
                   //设置前景的宽度
                   var  offset=eventLeft-normalLeft;
                   if(offset>=0 && offset<=barWidth){
                       $this.$progressLine.css("width", eventLeft-normalLeft);
                       $this.$progressDot.css("left", eventLeft-normalLeft);
                   }
               });
            });
            //鼠标抬起事件
            $(document).mouseup(function() {
                $(document).off("mousemove");
                $this.isMove = false;
                //计算进度条的比例
                var value = (eventLeft-normalLeft) / $this.$progressBar.width();
                callBack(value);
            });
        },
        setProgress: function(value){
            if(this.isMove)  return;
            if (value<0 || value >100)  return;
            this.$progressLine.css({
                width:value +"%"
            });
            this.$progressDot.css({
                left:value +"%"
            });
        }

    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);