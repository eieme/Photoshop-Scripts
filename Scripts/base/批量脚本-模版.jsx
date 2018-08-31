#target photoshop

res ="dialog { alignChildren:'fill',\
text:'批量处理PSD ',\
        batGroup: Group{orientation: 'column',alignChildren:'left',\
           sourceFolder:Group{ orientation: 'row', \
                    btn: Button {text:'待处理文件夹', properties:{name:'open'} ,helpTip:'选择您需要处理的文件所在的文件夹'},\
                    string: EditText  { text:'', preferredSize: [180, 20] },\
              },\
          },\
        buttons: Group { orientation: 'row', alignment: 'right',\
                btnOK: Button { text:'确定', properties:{name:'ok'} }, \
                btnCancel: Button { text:'取消', properties:{name:'cancel'} } \
        }, \
}";
showDialog();
var docName;
 var sourceFolder ;
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
            log ("ext:"+ext);            
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
    var docPath = app.activeDocument.path;
    var name = decodeURI(app.activeDocument.name);
	name = name.substring(0, name.indexOf("."));
    var dir = docPath + "/"+name+"/";
	new Folder(dir).create(); //创建文档同名目录
    
	app.activeDocument.duplicate(); //创建文档副本

    //这里写 批处理的逻辑
 }























