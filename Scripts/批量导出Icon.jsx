#target photoshop
app.bringToFront();

var nowTime=new Date();
var PRESOLUTION = 72; 
var startRulerUnits = app.preferences.rulerUnits;
var startTypeUnits = app.preferences.typeUnits;
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;
var title="ICON"
res ="dialog { \
text:'"+title+"直接保存并关闭',\
        group: Group{orientation: 'column',alignChildren:'left',\
				top:StaticText{text:'建议ICON尺寸：1024*1024或512*512'},\
				otherSet: Panel {orientation: 'column',alignChildren:'left',\
                        text: '选择导出类型', \
                            android: Checkbox { text:' Android项目',helpTip:'Android目录结构的'},\
                            ios: Checkbox { text:' IOS项目',helpTip:'IOS目录结构的'},\
                            datum: Checkbox { text:' google资料提交',helpTip:'无目录结构的'},\
                            inland: Checkbox { text:' 国内资料提交',helpTip:'无目录结构的'},\
						},\
                       exportBtn: Button{ alignment:'right',text: '导出'},\
				},\
}";
		
win = new Window (res);

//alert("Icon导出工具V1.0");

win.group.otherSet.android.value =true;//默认勾选
win.group.otherSet.ios.value =false;
win.group.otherSet.datum.value =false;
win.group.otherSet.inland.value =false;
var exportBtn = win.group.exportBtn;
exportBtn.onClick = function(){
            OpenPng();
            this.parent.parent.close();
    };
function OpenPng(){
try
{
  //var iTunesArtwork = File.openDialog("选择PNG文件.", "*.png", false);

    var doc = app.activeDocument ;
    if (doc == null)
    {
      throw "有问题的文件。确保它是一个有效的PNG文件.";
    }
  

    var startState = doc.activeHistoryState;
    var initialPrefs = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.PIXELS;


    var sfw = new ExportOptionsSaveForWeb();
    sfw.format = SaveDocumentType.PNG;
    sfw.PNG8 = false; //PNG-24
    sfw.transparency = true;
    doc.info = null;
    

	
    if(win.group.otherSet.android.value){//选中android
         var android = app.activeDocument.path + "/android/";
            new Folder(android).create();
                var icons = [
                  {"name": "mipmap", "size":144},
				{"name": "mipmap-ldpi", "size":32},
                  {"name": "mipmap-hdpi", "size":72},
                  {"name": "mipmap-mdpi",  "size":48},
                  {"name": "mipmap-xhdpi",  "size":96},
                  {"name": "mipmap-xxhdpi",  "size":144},
                  {"name": "mipmap-xxxhdpi",  "size":512}
                ];
                var icon;
                for (i = 0; i < icons.length; i++) 
                {	
                  icon = icons[i];
               var dir = android + "/"+icon.name+"/";
               new Folder(dir).create();
                  doc.resizeImage(icon.size, icon.size,null, ResampleMethod.BICUBICSHARPER);
                  var destFileName =  "icon.png";
                  doc.exportDocument(new File(android +"/"+icon.name+"/"+ destFileName), ExportType.SAVEFORWEB, sfw);
                  doc.activeHistoryState = startState; 
                }
     
     }
    if(win.group.otherSet.ios.value){//选中ios
      var ios = app.activeDocument.path + "/ios/";
            new Folder(ios).create();
                var icons = [
                  {"name": "iTunesArtwork",        "size":1024},
                  {"name": "Icon",                      "size":57},
                  {"name": "Icon@2x",                "size":114},
                  {"name": "Icon-@2x",               "size":114},
                  {"name": "Icon-40",                  "size":40},
                  {"name": "Icon-72",                  "size":72},
                  {"name": "Icon-72@2x",            "size":144},
                  {"name": "Icon-Small",              "size":29},
                  {"name": "Icon-Small@2x",       "size":58},
                  {"name": "Icon-Small-50",         "size":50},
                  {"name": "Icon-Small-50@2x",  "size":100},
                  {"name": "logo-76",                  "size":76},
                  {"name": "logo-80",                  "size":80},
                  {"name": "logo-100",                "size":100},
                  {"name": "logo-120",                "size":120},
                  {"name": "logo-152",                "size":152}
                ];
                var icon;
                for (i = 0; i < icons.length; i++) 
                {	
                  icon = icons[i];
                  var dir = ios + "/"+icon.name+"/";
                  new Folder(dir).create();
                  doc.resizeImage(icon.size, icon.size,null, ResampleMethod.BICUBICSHARPER);
                  var destFileName = icon.name + ".png";
                  doc.exportDocument(new File(ios +"/"+icon.name+"/"+ destFileName), ExportType.SAVEFORWEB, sfw);
                  doc.activeHistoryState = startState; 
                }
     
        
      }
       
             if(win.group.otherSet.inland.value){//选中提交资料
            var datum = app.activeDocument.path + "/国内/";
            new Folder(datum).create();
                  var icons = [
                    {"name": "drawable", "size":16},
                    {"name": "drawable", "size":28},
                    {"name": "drawable", "size":36},
                    {"name": "drawable", "size":48},
                    {"name": "drawable", "size":72},
                    {"name": "drawable", "size":74},
                    {"name": "drawable", "size":90},
                    {"name": "drawable", "size":96},
                    {"name": "drawable", "size":108},
                    {"name": "drawable", "size":136},
                    {"name": "drawable", "size":144},
                    {"name": "drawable", "size":186},
                    {"name": "drawable", "size":192},
                    {"name": "drawable", "size":218},
                    {"name": "drawable", "size":224},
                    {"name": "drawable", "size":256},
                    {"name": "drawable", "size":512},
                ];

                var icon;
                for (i = 0; i < icons.length; i++) 
                {	
                  icon = icons[i];
                  doc.resizeImage(icon.size, icon.size,
                                  null, ResampleMethod.BICUBICSHARPER);
                  var destFileName =  "icon_"+icon.size+".png";
                  doc.exportDocument(new File(datum +"/"+ destFileName), ExportType.SAVEFORWEB, sfw);
                  doc.activeHistoryState = startState; 
                }
        }
      if(win.group.otherSet.datum.value){//选中提交资料
            var datum = app.activeDocument.path + "/google/";
            new Folder(datum).create();
                  var icons = [
                    {"name": "drawable", "size":1024},
                    {"name": "drawable-hdpi", "size":48},
                    {"name": "drawable-mdpi",  "size":72},
                    {"name": "drawable-xhdpi",  "size":96},
                    {"name": "drawable-xxhdpi",  "size":144},
                    {"name": "drawable-xxhdpi",  "size":400},
                    {"name": "drawable-xxhdpi",  "size":512}
                ];

                var icon;
                for (i = 0; i < icons.length; i++) 
                {	
                  icon = icons[i];
                  doc.resizeImage(icon.size, icon.size,
                                  null, ResampleMethod.BICUBICSHARPER);
                  var destFileName =  "icon_"+icon.size+".png";
                  doc.exportDocument(new File(datum +"/"+ destFileName), ExportType.SAVEFORWEB, sfw);
                  doc.activeHistoryState = startState; 
                }
        }
}
catch (exception)
{
	if ((exception != null) && (exception != ""))
    alert(exception);
 }
finally
{
    if (doc != null){
             new Folder( app.activeDocument.path).execute();//打开文件夹
            //doc.close(SaveOptions.DONOTSAVECHANGES);
                app.preferences.rulerUnits = initialPrefs;
     }

  
}
    
}
win.center();
win.show();

