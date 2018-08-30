#target photoshop
app.bringToFront();
var PRESOLUTION = 72;
app.preferences.rulerUnits = Units.PIXELS;
        
    var win;
    var layers = new Array();
    layers[0]= "正常";
    layers[1]= "溶解";
    layers[2]= "变暗";
    layers[3]= "正片叠底";
    layers[4]= "颜色加深";
    var selectedLayer;
    
    var res ="dialog { \
    text:'批量尺寸调整 ',\
            group: Group{orientation: 'column',alignChildren:'left',\
                    top:StaticText{text:'点击确定显示选中选项',align:'left'},\
                    bgChoose: Group {orientation: 'row', \
                                            text:Group{\
                                                    top:StaticText{text:'选择背景层',align:'left'},\
                                            }\
                                            other:Group{ orientation: 'column',alignChildren:'left',\
                                                      d:DropDownList { alignment:'left', itemSize: [120,16] },\
                                            },\
                                    },\
                    },\
            buttons: Group { orientation: 'row', alignment: 'right',\
                    Btnok: Button { text:'确定', properties:{name:'ok'} }, \
                    Btncancel: Button { text:'取消', properties:{name:'cancel'} } \
                    }, \
    }";
     
main();   


function main(){

        win = new Window (res);
    win.buttons.Btncancel.onClick = function () {
        this.parent.parent.close();
    }
    win.buttons.Btnok.onClick = function () {
        run();
        alert ("选中的图层："+selectedLayer);
    this.parent.parent.close();
    }
    //直接看下面就是了---------------------------------------------------------------------------


        var layerCount = layers.length;
        var dropDownList = win.group.bgChoose.other.d;
        for(var i = 0; i < layerCount; i++){//给下拉列表添加元素
           dropDownList.add("item",layers[i]);
        }
        dropDownList.items[0].selected=true;//使第一个被选中
        //显示窗口
        win.center();
        win.show();
 }

function run(){
         var layerCount = layers.length;
         var dropDownList = win.group.bgChoose.other.d;
         for(var i = 0; i < layerCount; i++){//遍历获取被选中的图层
            if (dropDownList.items[i].selected==true){
                    selectedLayer = layers[i];
                break;
            }
        }
    
}