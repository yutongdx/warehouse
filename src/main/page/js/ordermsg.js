layui.use(['form','layer','table','laytpl'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    //信息列表
    var tableIns = table.render({
        elem: '#ordermsg',
        url : '../json/ordermsg.json',  //获取后台json
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 20,
        id : "ordermsgTable",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {field: 'ordermsgId', title: '订货信息编号',  align:"center"},
            {field: 'storebillId', title: '库存清单编号', minWidth:100, align:'center'},
            {field: 'transactionId', title: '事务编号', minWidth:100, align:'center'},
            {field: 'time', title: '操作时间', minWidth:100, align:'center'},
            {title: '操作', minWidth:175, templet:'#ordermsgBar',fixed:"right",align:"center"}
        ]]
    });

    //添加信息
    function addOrdermsg(edit){
        var index = layui.layer.open({
            title : "添加订货信息",
            type : 2,
            content : "addOrdermsg.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                if(edit){
                    body.find(".ordermsgId").val(edit.ordermsgId);
                    body.find(".storebillId").val(edit.storebillId);
                    body.find(".transactionId").val(edit.transactionId);
                    body.find(".time").val(edit.time);
                    form.render();
                }
                setTimeout(function(){
                    layui.layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)
            }
        })
        layui.layer.full(index);
        window.sessionStorage.setItem("index",index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize",function(){
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    $(".addNews_btn").click(function(){
        addOrdermsg();
    })

    //批量删除
    $(".delAll_btn").click(function(){
        var checkStatus = table.checkStatus('ordermsgTable'),
            data = checkStatus.data,
            newsId = [];
        if(data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].newsId);
            }
            layer.confirm('确定删除选中的信息？', {icon: 3, title: '提示信息'}, function (index) {
                // $.get("删除文章接口",{
                //     newsId : newsId  //将需要删除的newsId作为参数传入
                // },function(data){
                tableIns.reload();
                layer.close(index);
                // })
            })
        }else{
            layer.msg("请选择需要删除的信息");
        }
    })

    //列表操作
    table.on('tool(ordermsg)', function(obj){
        var layEvent = obj.event,
            data = obj.data;

        if(layEvent === 'edit'){ //编辑
            addOrdermsg(data);
        }else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除此信息？',{icon:3, title:'提示信息'},function(index){
                // $.get("删除文章接口",{
                //     newsId : data.newsId  //将需要删除的newsId作为参数传入
                // },function(data){
                tableIns.reload();
                layer.close(index);
                // })
            });
        }
    });

})