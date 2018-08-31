#target photoshop

res ="dialog { alignChildren:'fill',\
text:'批量修改图片 bits 通道 ',\
        batGroup: Group{orientation: 'column',alignChildren:'left',\
            sourceFolder:Group{ orientation: 'row', \
                    btn: Button {text:'待处理文件夹', properties:{name:'open'} ,helpTip:'选择您需要处理的文件所在的文件夹'},\
                    string: EditText  { text:'', preferredSize: [180, 20] },\
              },\
            select: Group{orientation: 'row', \
                    text:Group{\
                            top:StaticText{text:'选择通道 bits',align:'left'},\
                    }\
                    other:Group{ orientation: 'column',alignChildren:'left',\
                              dropdownlist:DropDownList { alignment:'left', itemSize: [120,16] },\
                    },\
             }, \
          },\
        buttons: Group { orientation: 'row', alignment: 'right',\
                btnOK: Button { text:'确定', properties:{name:'ok'} }, \
                btnCancel: Button { text:'取消', properties:{name:'cancel'} } \
        }, \
}";

 var bits = new Array();
    bits[0]= "8位/通道";
    bits[1]= "16位/通道";
    bits[2]= "32位/通道";
var bitsIndex = 0;

showDialog();
var docName;
var sourceFolder ;
var dropDownList
function showDialog () {
    win = new Window (res);
    sourceFolder = win.batGroup.sourceFolder;
    sourceFolder.btn.onClick = function() { // 打开文件夹的操作
            var selFolder = Folder.selectDialog("选择待处理文件夹");
            if ( selFolder != null ) {
              sourceFolder.string.text = selFolder.fsName;
              choosePath = selFolder.fsName;
              sourceFolder.string.helpTip = selFolder.fsName.toString();
            }
    };
    
    var bitsCount = bits.length;
    dropDownList = win.batGroup.select.other.dropdownlist;
    for(var i = 0; i < bitsCount; i++){//给下拉列表添加元素
        dropDownList.add("item",bits[i]);
    }
    dropDownList.items[0].selected=true;//使第一个被选中    
    
    dropDownList.onChange = function(){
        bitsIndex = dropDownList.selection.index;
        //log('dropDownList.selection.index: '+bitsIndex);
    };
    
   win.buttons.btnOK.onClick = function () {
        this.parent.parent.close();
      
        run();
        //getAllFilesFromPath();
    }
    
      win.center();
      win.show();
 }
//输出
function log(text){
        $.writeln(text);
        alert (text);
}

//获取文件夹下的文件
function getAllFils(folder){
    var filelist = folder.getFiles();
    var result = [];
    result = result.concat (filelist);
    
    for(var i = 0;i < filelist.length;i++){
        var file = filelist[i];
        if(file instanceof Folder){
             result = result.concat (getAllFils(file));
        }
    }

    return result ;
}
//获取路径下的所有文件
function getAllFilesFromPath(path){
      var openFolder = Folder(path);      
      var filelist = getAllFils(openFolder);
      $.writeln( filelist.length);
      for(var i = 0;i < filelist.length;i++){
            var file = filelist[i];
            if(file.hidden == true){//不处理隐藏文件
                continue;
            }

            if (file instanceof File){ 
                $.writeln("File: "+file.fsName);
                
            }
        
            if(file instanceof Folder){
                $.writeln("Folder: "+ file.fsName);
            }
            
      }
        return filelist;
}

function run(){
    var flielist = getAllFilesFromPath(sourceFolder.string.text);
    if(flielist.length == 0){
        log("没有发现文档");
        return;
    }
    for (i=0;i<flielist.length;i++){
        var file = flielist[i];
        if (file instanceof File){
            var filename = file.name;
            var ext = filename.toLowerCase().split('.').splice(-1);
            //log ("ext:"+ext);            
            if(ext =='png' || ext =='jpg' || ext == 'webp' || ext == 'psd' || ext == 'gif'){
                open(file); 
                logic();            
            }
            
        }
    }

      log ("完成并打开源文件夹");
      
      new Folder(sourceFolder.string.text).execute();//打开文件夹
 }

function logic(){
   /* var docPath = app.activeDocument.path;
    var name = decodeURI(app.activeDocument.name);
	name = name.substring(0, name.indexOf("."));
    var dir = docPath + "/"+name+"/";
	new Folder(dir).create(); //创建文档同名目录
    
	app.activeDocument.duplicate(); //创建文档副本*/
    
    
    //这里写 批处理的逻辑
    
    var bitsEnums = [BitsPerChannelType.EIGHT,BitsPerChannelType.SIXTEEN,BitsPerChannelType.THIRTYTWO];
    var doc = app.activeDocument;
        
     if(doc.bitsPerChannel != bitsEnums[bitsIndex]){
        doc.bitsPerChannel = bitsEnums[bitsIndex];
        doc.save();
        
     }
    
    doc.close (SaveOptions.DONOTSAVECHANGES);
    
 }























