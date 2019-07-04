/**
 * Created by yhfz11 on 2019/7/4.
 */
$(function () {
    $(".content_list").mCustomScrollbar()
    //1.监听歌曲的移入移除的事件
    /**
     * 说明因为：----> 下面注释的代码，这些事件当初是直接添加的， 后来是动态创建的， 所以不能直接使用添加的事件。
     * 动态创建的元素只能使用事件委托，使用事件委托前提条件是： 找一个在入口函数执行前就已经存在的元素
     */
    /*$(".list_music").hover(function () {
     $(this).find(".list_menu").stop().fadeIn(100);
     $(this).find(".list_time a").stop().fadeIn(100);
     $(this).find(".list_time span").stop().fadeOut(100);
     },function () {
     $(this).find(".list_menu").stop().fadeOut(100);
     $(this).find(".list_time a").stop().fadeOut(100);
     $(this).find(".list_time span").stop().fadeIn(100);
     });*/
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

    //2.点击复选框的监听事件
    $(".content_list").delegate(".list_check", "click", function () {
        $(this).toggleClass("list_checked");
    });

    //3.加载歌曲列表
    getPlayerList();
    function getPlayerList(){
        $.ajax({
            url:"./scource/musicList.json",
            dataType: "json",
            success: function (data){
                //遍历获取的数据，创建每一条数据
                var  $musicList=$(".content_list ul");
                $.each(data, function (index, ele){
                    var  $item=crateMusicItem(index, ele);
                    $musicList.append($item);
                });
            },
            error:function(e){
                console.log(e);
            }
        });
    }

    //4.添加子菜单播放按钮点击事件
    var $musicPlay=$(".music_play");
    $(".content_list").delegate(".list_menu_play", "click", function () {
        //为了优化代码把它提出来
        var  $time=$(this).parents(".list_music ");
        //切换播放的一个图标
        $(this).toggleClass("list_menu_play2");
        $time.siblings().find(".list_menu_play").removeClass("list_menu_play2");
        //同步底部播放按钮
        if($(this).attr("class").indexOf("list_menu_play2") != -1){
            $musicPlay.addClass(" music_play2");
            //让文字高亮
            $time.find("div").css("color","#fff");
            $time.siblings().find("div").css("color","rgba(255,255,255,.5");
        }else{
            $musicPlay.removeClass(" music_play2");
            //让文字不高亮
            $time.find("div").css("color","rgba(255,255,255,.5)");
        }
        //切换序号的状态
        $time.find(".list_number").toggleClass("list_number2");
        $time.siblings().find(".list_number").removeClass("list_number2");
    });


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
        return $item;
    }
});
