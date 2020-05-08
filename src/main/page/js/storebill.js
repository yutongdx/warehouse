layui.use(['form','layer','table','laytpl'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    //信息列表
    var tableIns = table.render({
        elem: '#storebill',
        url : '../json/storebill.json',  //获取后台json
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 20,
        id : "storebillTable",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {field: 'storebillId', title: '库存清单编号',  align:"center"},
            {field: 'partId', title: '零件编号',  align:"center"},
            {field: 'amount', title: '库存数量', minWidth:100, align:'center'},
            {field: 'threshold', title: '库存临界值', minWidth:100, align:'center'},
            {title: '操作', minWidth:175, templet:'#storebillBar',fixed:"right",align:"center"}
        ]]
    });

    //添加信息
    function addStorebill(edit){
        var index = layui.layer.open({
            title : "添加供应商信息",
            type : 2,
            content : "addStorebill.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                if(edit){
                    body.find(".storebillId").val(edit.partId);
                    body.find(".partId").val(edit.partId);
                    body.find(".amount").val(edit.amount);
                    body.find(".threshold").val(edit.threshold);
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
        addStorebill();
    })

    //批量删除
    $(".delAll_btn").click(function(){
        var checkStatus = table.checkStatus('storebillTable'),
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
    table.on('tool(storebill)', function(obj){
        var layEvent = obj.event,
            data = obj.data;

        if(layEvent === 'edit'){ //编辑
            addStorebill(data);
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