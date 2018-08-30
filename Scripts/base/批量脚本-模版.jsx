
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
    }
    
      win.center();
      win.show();
 }
function run(){
   var openFolder = Folder(sourceFolder.string.text);                
                var fileList = openFolder.getFiles() //获取open文件夹下所有文件
                     if(fileList.length == 0){
                         $.writeln("没有发现文档");
                         alert ("没有发现文档");
                        return;
                     }
                for (i=0;i<fileList.length;i++){
                    if (fileList[i] instanceof File && fileList[i].hidden == false){ //不处理隐藏文件
                        open(fileList[i]); 
                       logic();
                    }
                }
              $.writeln("完成并打开源文件夹");
              alert ("完成并打开源文件夹");
              new Folder(sourceFolder.string.text).execute();//打开文件夹
 }

function logic(){
    var docPath = app.activeDocument.path;
    var name = decodeURI(app.activeDocument.name);
	name = name.substring(0, name.indexOf("."));
    var dir = docPath + "/"+name+"/";
	new Folder(dir).create();
    
	app.activeDocument.duplicate();
    
    //这里写 批处理的逻辑
 }























