var colorpicker = layui.colorpicker;
//开启全功能
colorpicker.render({
    elem: '#test-all',
    color: 'rgba(7, 155, 140, 1)',
    format: 'rgb',
    predefine: true,
    alpha: true,
    done: function(color) {
        $('#test-all-input').val(color); //向隐藏域赋值
        layer.tips('给指定隐藏域设置了颜色值：' + color, this.elem);
        color || this.change(color); //清空时执行 change
    },
    change: function(color) {
        //给当前页面头部和左侧设置主题色
        $('.header-demo,.layui-side .layui-nav').css('background-color', color);
    }
});