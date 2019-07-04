$(function () {
	$(".content_list").mCustomScrollbar()
    var  $audio=$("audio"); //找到播放的标签
    var player = new  Player($audio);
    var progress;
    var voiceProgress;
    var lyric;
    //1.加载歌曲列表
    getPlayerList();
    function getPlayerList(){
        $.ajax({
            url:"./scource/musicList.json",
            dataType: "json",
            success: function (data){
                player.musicList = data;
                //遍历获取的数据，创建每一条数据
                var  $musicList=$(".content_list ul");
                $.each(data, function (index, ele){
                    var  $item=crateMusicItem(index, ele);
                    $musicList.append($item);
                });
                initMusicInfo(data[0]);
                initMusicLyric(data[0]);
            },
            error:function(e){
                console.log(e);
            }
        });
    }
    //2.初始化歌曲信息
    function initMusicInfo(music){
        var $musicImage=$(".song_info_pic  img");
        var $musicName=$(".song_info_name  a");
        var $musicSinger=$(".song_info_singer  a");
        var $musicAblum=$(".song_info_ablum  a");
        var $musicProgressName=$(".music_progress_name ");
        var $musicProgressTime=$(".music_progress_time ");
        var $musicBg=$(".mask_bg ");

        $musicImage.attr("src",music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.album);
        $musicProgressName.text(music.name +" / "+music.singer);
        $musicProgressTime.text("00:00 /" +music.time);
        $musicBg.css("background","url('"+music.cover+"')");

    }
    //初始化歌词信息
    function  initMusicLyric(music){
        lyric=new Lyric(music.link_lrc);
        var $lryicContainer=$('.song_lyric');
        //清空上一首音乐的歌词
        $lryicContainer.html("");
        lyric.loadLyric(function (){
            //创建歌词列表
            $.each(lyric.lyrices, function(index, ele) {
                var $item=$("<li>"+ele+"</li>");
                $lryicContainer.append($item);
            });
        });
    };
    //3.初始化进度条
    initProgress();
    function initProgress(){
        var  $progressBar = $(".music_progress_bar");
        var  $progressLine = $(".music_progress_line");
        var  $progressDot = $(".music_progress_dot");

        progress = Progress($progressBar,$progressLine,$progressDot);
        progress.progressClick(function (value){
            player.musicSeekTo(value);
        });
        progress.progressMove(function (value){
            player.musicSeekTo(value);
        });

        var  $voiceBar = $(".music_voice_bar");
        var  $voiceLine = $(".music_voice_line");
        var  $voiceDot = $(".music_voice_dot");

        voiceProgress = Progress($voiceBar,$voiceLine,$voiceDot);
        voiceProgress.progressClick(function (value){
            player.musicVoiceSeekTo(value);
        });
        voiceProgress.progressMove(function (value){
            player.musicVoiceSeekTo(value);
        });

    }

    //4.初始化事件监听
    initEvents();
    function  initEvents(){
        //2.1监听歌曲的移入移除的事件
        $('.content_list').delegate(".list_music","mouseenter" ,function (){
            $(this).find('.list_menu').stop().fadeIn(100);
            $(this).find('.list_time a').stop().fadeIn(100);
            $(this).find('.list_time span').stop().fadeOut(100);
        });
        $(".content_list").delegate(".list_music", "mouseleave", function () {
            $(this).find(".list_menu").stop().fadeOut(100);
            $(this).find(".list_time a").stop().fadeOut(100);
            $(this).find(".list_time span").stop().fadeIn(100);
        });

        //2.2.点击复选框的监听事件
        $(".content_list").delegate(".list_check", "click", function () {
            $(this).toggleClass("list_checked");
        });

        //2.3.添加子菜单播放按钮点击事件
        var $musicPlay=$(".music_play");
        $(".content_list").delegate(".list_menu_play", "click", function () {
            //为了优化代码把它提出来
            var  $item=$(this).parents(".list_music ");
            //console.log($item.get(0).index);
            //console.log($item.get(0).music);
            //切换播放的一个图标
            $(this).toggleClass("list_menu_play2");
            $item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
            //同步底部播放按钮
            if($(this).attr("class").indexOf("list_menu_play2") != -1){
                $musicPlay.addClass(" music_play2");
                //让文字高亮
                $item.find("div").css("color","#fff");
                $item.siblings().find("div").css("color","rgba(255,255,255,.5");
            }else{
                $musicPlay.removeClass(" music_play2");
                //让文字不高亮
                $item.find("div").css("color","rgba(255,255,255,.5)");
            }
            //切换序号的状态
            $item.find(".list_number").toggleClass("list_number2");
            $item.siblings().find(".list_number").removeClass("list_number2");

            //播放音乐
            player.playMusic($item.get(0).index, $item.get(0).music);
            //切换歌曲信息
            initMusicInfo($item.get(0).music);
            //切换歌词的信息
            initMusicLyric($item.get(0).music);
        });

        //监听底部控制区域播放按钮的点击事件
        $musicPlay.click(function () {
            //判断有没有播放音乐的历史记录
            if(player.currentIndex == -1){
                //没有播放过
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            }else{
                $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
            }
        });
        //监听底部控制区域上一首按钮的点击事件
        $(".music_pre").click(function () {
            $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
        });
        //监听底部控制区域下一首按钮的点击事件
        $(".music_next").click(function () {
            $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
        });

        //监听删除按钮的点击
        $(".content_list").delegate(".list_menu_del","click", function (){
            //找到被点击的音乐
            var $item=$(this).parents(".list_music");
            //判断当前删除的是否正在播放的
            if($item.get(0).index == player.currentIndex){
                $(".music_next").trigger("click");
            }
            $item.remove();
            player.changeMusic($item.get(0).index);
            //重新排序
            $(".list_music").each(function(index, ele){
                ele.index=index;
                $(ele).find(".list_number").text(index+1);
            });
        });

        //监听播放的速度
        player.musicTimeUpdate(function(currentTime,duration,timeStr){
            //同步时间
            $(".music_progress_time").text(timeStr);
            var value = currentTime / duration * 100;
            progress.setProgress(value);

            //实现歌词的同步
            var  index= lyric.currentIndex(currentTime);
            var  $item= $('.song_lyric li').eq(index);
            $item.addClass('curr');
            $item.siblings().removeClass('curr');

            //让ul滚动
            if(index<=2) return  ;
            $('.song_lyric').css({
                marginTop:(-index +2) *30
            });

        });

        //监听声音按钮的点击
        $(".music_voice_icon").click(function () {
            $(this).toggleClass("music_voice_icon2");
            //声音的一个切换
            if($(this).attr("class").indexOf("music_voice_icon2")!=-1){
                //变为没有声音
                player.musicVoiceSeekTo(0);
            }else{
                player.musicVoiceSeekTo(1);
            }
        });
    }

    //定义一格式化时间的方法
    /*function  formatDate(duration,currentTime){
        var endMin= parseInt( duration / 60 );
        var endSec= parseInt( duration % 60 );
        if(endMin < 10){
            endMin = "0"+endMin;
        }
        if(endSec < 10){
            endSec = "0"+endSec;
        }

        var startMin= parseInt( currentTime / 60 );
        var startSec= parseInt( currentTime % 60 );
        if(startMin < 10){
            startMin = "0"+startMin;
        }
        if(startSec < 10){
            startSec = "0"+startSec;
        }

        return startMin+":"+startSec+" / " +endMin+":"+endSec;
    }*/
	//定义一个方法创建一条音乐
    function  crateMusicItem(index, music){
        var  $item=$("<li class=\"list_music\">\n"+
            "<div class=\"list_check\"><i></i></div>\n"+
            "<div class=\"list_number\">"+(index+1)+"</div>\n"+
            "<div class=\"list_name\">"+music.name+"" +
            "<div class=\"list_menu\">\n"+
            "<a href=\"javascript:;\"  class='menu_item list_menu_play' title=\"播放\"></a>\n"+
            "<a href=\"javascript:;\"  class='menu_item' title=\"添加\"></a>\n"+
            "<a href=\"javascript:;\"  class='menu_item' title=\"下载\"></a>\n"+
            "<a href=\"javascript:;\"  class='menu_item' title=\"分享\"></a>\n"+
            "</div>\n"+
            "</div>\n"+
            "<div class=\"list_singer\">"+music.singer+"</div>\n"+
            "<div class=\"list_time\">\n"+
            "<a href=\"javascript:;\"  class='list_menu_del' title=\"删除\"></a>\n"+
            "<span>"+music.time+"</span>\n"+
            "</div>\n"+
            "</li>");
        //这是为了解决点击播放要知道是点击哪一首
        $item.get(0).index = index;
        $item.get(0).music = music;
        return $item;
	}
});
