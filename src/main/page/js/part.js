layui.use(['form','layer','table','laytpl'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    //信息列表
    var tableIns = table.render({
        elem: '#part',
        url : '../json/part.json',  //获取后台json
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 20,
        id : "partTable",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {field: 'partId', title: '零件编号',  align:"center"},
            {field: 'partName', title: '零件名称', minWidth:100, align:'center'},
            {field: 'price', title: '零件价格(元)', minWidth:100, align:'center'},
            {field: 'amount', title: '订货数量',  align:"center"},
            {field: 'firstSupplier', title: '主要供应商编号', minWidth:100, align:'center'},
            {field: 'secondSupplier', title: '次要供应商编号', minWidth:100, align:'center'},
            {title: '操作', minWidth:175, templet:'#partBar',fixed:"right",align:"center"}
        ]]
    });

    //添加信息
    function addPart(edit){
        var index = layui.layer.open({
            title : "添加供应商信息",
            type : 2,
            content : "addPart.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                if(edit){
                    body.find(".partId").val(edit.partId);
                    body.find(".partName").val(edit.partName);
                    body.find(".price").val(edit.price);
                    body.find(".amount").val(edit.amount);
                    body.find(".firstSupplier").val(edit.firstSupplier);
                    body.find(".secondSupplier").val(edit.secondSupplier);
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
        addPart();
    })

    //批量删除
    $(".delAll_btn").click(function(){
        var checkStatus = table.checkStatus('partTable'),
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
    table.on('tool(part)', function(obj){
        var layEvent = obj.event,
            data = obj.data;

        if(layEvent === 'edit'){ //编辑
            addPart(data);
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