/**
 * Created by yb on 2019/7/4.
 */
(function (window){


    function  Lyric(path){
        return  new Lyric.prototype.init(path);
    }
    Lyric.prototype={
        constructor:Lyric,
        init:function(path){
            this.path=path;
        },
        times:[],
        lyrices:[],
        index:-1,
        loadLyric:function (callBack){
            var $this=this;
            $.ajax({
                url:$this.path,
                dataType:"text",
                success:function(data){
                    //	console.log(data)
                    $this.parseLyric(data);
                    callBack();
                },
                error:function(e){
                    console.log(e);
                }
            });
        },
        parseLyric:function(data){
            var $this=this;
            //一定要清空上一首歌曲的歌词和 时间
            $this.times=[];
            $this.lyrices=[];

            var  array=data.split("\n");
            //console.log(array);
            var timeReg=/\[(\d*:\d*\.\d*)\]/ ;
            //遍历取出每一条歌词
            $.each(array, function(index, ele){

                //处理歌词
                var lrc=ele.split("]")[1];
                if(lrc.length==1) return true;
                $this.lyrices.push(lrc);


                var res=timeReg.exec(ele);
                if(res ==null) return true;
                var timeStr=res[1];
                //console.log(timeStr);
                var res2=timeStr.split(":");
                var min=parseInt(res2[0])*60;
                var sec=parseFloat(res2[1]);
                var time=parseFloat(Number(min+sec).toFixed(2));
                //	console.log(time);
                $this.times.push(time);

            });
        },

        currentIndex:function(currentTime){
            if(currentTime >= this.times[0]){
                this.index++;
                this.times.shift();  //shift 方法删除数字最前面的一个  元素
            }
            return  this.index;
        }
    }
    Lyric.prototype.init.prototype=Lyric.prototype;
    window.Lyric=Lyric;
})(window);
