//文字转图片
var change = $('#reduce');
var context = $("#context");
var frame = $("#frame");
//富文本编辑器
//https://ueditor.baidu.com/doc/#UE.Editor
var ue = UE.getEditor('container', {
    // toolbars: [
    //     ['fullscreen', 'source', 'undo', 'redo'],
    //     ['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript',
    // 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|',
    // 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall',
    // 'cleardoc'] ]
    fontfamily: [
        {
            label: '微软雅黑',
            // name: 'yahei',
            val: '微软雅黑'
        }, {
            label: '楷体',
            val: 'cursive'
        }, {
            label: '宋体',
            val: 'serif'
        }, {
            label: '文鼎黄阳尖魏体',
            val: 'wenDing'
        }, {
            label: '拼音体',
            val: 'pinyinti'
        }, {
            label: '声声滴',
            val: 'shengshengdi'
        },{
            label: '综艺体',
            val:'zongyiti'
        }, {
            label: '钢笔体',
            val: 'gangbiti'
        },{
            label: '彩云体',
            val:'caiyunti'
        }
    ]
})
//对编辑器的操作最好在编辑器ready之后再做
ue.ready(function () {
    //设置编辑器的内容
    ue.setContent(
        '<p><br/><br/><br/><br/><br/><br/><br/></p><p style="text-align: center;"><span style="font-size: 36px; color: rgb(255, 255, 255);">一键文字转图片</span></p>');
    //获取html内容，返回: <p>hello</p>
    // var html = ue.getContent();
    //获取纯文本内容，返回: hello
    // var txt = ue.getContentTxt();
    ue.addListener('selectionchange', function (editor) {
        context.html(ue.getContent());
    })
    $("#ueditor_0").contents().find('.view')
        .css('background-color', context.css("background-color"));
});

function getOS() { // 获取当前操作系统
    var os;
    if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1) {
        os = 'Android';
    } else if (navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('iPad')
               > -1) {
        os = 'iOS';
    } else if (navigator.userAgent.indexOf('Windows Phone') > -1) {
        os = 'WP';
    } else {
        os = 'Others';
    }
    return os;
}

// let w = $(window).width(); //图片宽度
// let h = $(window).height(); //图片高度
var dom = context.get(0); //将jQuery对象转换为dom对象
console.log("操作系统" + getOS());
// 点击转成canvas，最后用于生成图片
change.click(function (e) {
    var shareContent = dom;//需要截图的包裹的（原生的）DOM 对象
    var width = shareContent.offsetWidth; //获取dom 宽度
    var height = shareContent.offsetHeight; //获取dom 高度
    var canvas = document.createElement("canvas"); //创建一个canvas节点
    var scale = 2; //定义任意放大倍数 支持小数
    canvas.width = width * scale; //定义canvas 宽度 * 缩放
    canvas.height = height * scale; //定义canvas高度 *缩放
    canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
    // 调用html2canvas插件
    //https://github.com/niklasvh/html2canvas/blob/master/docs/configuration.md
    html2canvas(dom, {
        //滚动条导致空白的解决方案
        windowWidth: document.body.scrollWidth,
        windowHeight: document.body.scrollHeight,
        scale: scale, // 添加的scale 参数
        canvas: canvas, //自定义 canvas
        // logging: true, //日志开关，便于查看html2canvas的内部执行流程
        width: width, //dom 原始宽度
        height: height,
        useCORS: true // 【重要】开启跨域配置
    }).then(function (canvas) {
        var context = canvas.getContext('2d');
        // 【重要】关闭抗锯齿
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        // canvas宽度
        var canvasWidth = canvas.width;
        // canvas高度
        var canvasHeight = canvas.height;
        // 控制台查看绘制区域的宽高
        console.log("canvas: " + canvasWidth + "    " + canvasHeight);
        // 渲染canvas，这个时候将我们用于生成图片的区域隐藏
        // context.hide();
        // 下面注释内容为测试内容，测试时可以去掉注释，方便查看生成的canvas区域
        // $("body").after(canvas);
        // 调用Canvas2Image插件
        var w = $(window).width(); //图片宽度
        // let h = $(window).height(); //图片高度
        // 这里因为我们生成图片区域高度为400，所以这里我们直接指定
        var h = $(window).height();
        console.log(w + "    " + h);
        // 将canvas转为图片
        var img = Canvas2Image.convertToImage(canvas, canvasWidth, canvasHeight);
        // console.log( '<img src="'+$(img).attr("src")+'"/>');
        // 渲染图片，并且加到页面中查看效果
        // frame.html(img);
        //页面层
        layer.open({
                       type: 1,
                       skin: 'layui-layer-demo', //样式类名
                       closeBtn: 1, //不显示关闭按钮
                       title: false, //不显示标题
                       anim: 2,
                       shadeClose: true, //开启遮罩关闭
                       area: ['80%', '80%'], //宽高
                       content: '<img src="' + $(img).attr("src") + '"/>'
                   });
        //新窗口打开图片
        // var img2 = new Image();
        // img2.src = $(img).attr("src");
        // var newWin = window.open("", "_blank");
        // newWin.document.write('<script>window.location.href="'+$(img).attr("src")+'"</script>'+img2.outerHTML);
        // newWin.document.title = "请另存为本地图片"; newWin.document.close(); 保存
        var type = "png"; //图片类型
        var f = "DNF"; //图片文件名，自定义名称
        // w = (w === '') ? canvasWidth : w; //判断输入宽高是否为空，为空时保持原来的值
        // h = (h === '') ? canvasHeight : h;
        // 这里的判断用于区分移动端和pc端
        if (getOS() === "Others") {
            // 调用Canvas2Image插件
            // Canvas2Image.saveAsImage(canvas, w, h, type, f);
        }
    });
});
// 改变颜色
colorpicker.render({
                       elem: '#test-all',
                       color: context.css("background-color"),
                       format: 'rgb',
                       predefine: true,
                       alpha: true,
                       change: function (color) {
                           console.log('color change')
                           //给当前页面头部和左侧设置主题色
                           context.css('background-color', color);
                           $("#ueditor_0").contents().find('.view').css('background-color', color);
                       }
                   });