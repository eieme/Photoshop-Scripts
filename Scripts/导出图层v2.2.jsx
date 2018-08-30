#target photoshop
app.bringToFront();
var PRESOLUTION = 72;
app.preferences.rulerUnits = Units.PIXELS;

// Settings.
var ignoreHiddenLayers = true;
var savePNGs = true;
var saveJSON = false;
var scaleFactor = 1;
var useCanvasSize = false;
var useBat = false;
var originalDoc;
try {
	originalDoc = app.activeDocument;
} catch (ignored) {}

res ="dialog { \
text:'导出图层v2.1 ',\
        group: Group{orientation: 'column',alignChildren:'left',\
                top:StaticText{text:'',align:'left'},\
                corrdination: Panel { orientation: 'column',alignChildren:'left', \
                        text: '设置', \
                                savePNGs: Group { orientation: 'row', \
                                         cBox: Checkbox { preferredSize: [16, 16]} ,\
                                         string: StaticText {text:'Save PNGs'},\
                                        }, \
                                saveJSON: Group { orientation: 'row', \
                                         cBox: Checkbox { preferredSize: [16, 16]} ,\
                                         string: StaticText {text:'Save JSON'},\
                                        } ,\
                                 ignoreHiddenLayers: Group { orientation: 'row', \
                                         cBox: Checkbox { preferredSize: [16, 16]} ,\
                                         string: StaticText {text:'Ignore Hidden Layers'},\
                                        } ,\
                                useCanvasSize: Group { orientation: 'row', \
                                         cBox: Checkbox { preferredSize: [16, 16]} ,\
                                         string: StaticText {text:'Use Canvas Size'},\
                                        } ,\
                                }, \
                   scalePanel: Panel { orientation: 'column',alignChildren:'left', \
                        text: 'Image Scale', \
                                 scaleFactor: Group { orientation: 'row', \
                                         scaleText: EditText{preferredSize:[32,18],text:'100'},\
                                         hd: StaticText {text:'%'},\
                                         scaleSlider: Slider {preferredSize:[120,20],value:100},\
                                        } ,\
                                }, \
                bat:Group{ orientation: 'row', \
                                cBox: Checkbox { preferredSize: [16, 16]} ,\
                                string: StaticText {text:'批量处理PSD（否则只处理当前文档）'},\
                                }, \
                sourceFolder:Group{ orientation: 'row', \
                                btn: Button {text:'待处理文件夹', properties:{name:'open'} ,helpTip:'选择您需要处理的文件所在的文件夹'},\
                                string: EditText  { text:'', preferredSize: [180, 20] },\
                                },\
                },\
        buttons: Group { orientation: 'row', alignment: 'right',\
                Btnok: Button { text:'确定', properties:{name:'ok'} }, \
                Btncancel: Button { text:'取消', properties:{name:'cancel'} } \
                }, \
}";
win = new Window (res);
// 初始化选项
var setting = win.group.corrdination;
var sourceFolder=win.group.sourceFolder;//文件夹
var scaleFactorUI = win.group.scalePanel.scaleFactor;
var scaleText = scaleFactorUI.scaleText;
var scaleSlider = scaleFactorUI.scaleSlider;

win.group.bat.cBox.value =  !originalDoc;
sourceFolder.enabled = !originalDoc;
//保存png
setting.savePNGs.cBox.value = savePNGs;
//保存json
setting.saveJSON.cBox.value = saveJSON;
//忽略隐藏图层
setting.ignoreHiddenLayers.cBox.value = ignoreHiddenLayers;
//使用画布尺寸
setting.useCanvasSize.cBox.value = useCanvasSize;


scaleText.onChanging = function() {
    scaleSlider.value = scaleText.text;
    if (scaleText.text < 1 || scaleText.text > 100) {
        alert("Valid numbers are 1-100.");
        scaleText.text = scaleFactor * 100;
        scaleSlider.value = scaleFactor * 100;
    }
};
scaleSlider.onChanging = function() { scaleText.text = Math.round(scaleSlider.value); };

// 打开文件夹的操作
sourceFolder.btn.onClick = function() { 
        var defaultFolder = sourceFolder.string.text;
        var testFolder = new Folder(defaultFolder);
        if (!testFolder.exists) {
            defaultFolder = "~";
        }
        var selFolder = Folder.selectDialog("选择待处理文件夹", defaultFolder);
        if ( selFolder != null ) {
            sourceFolder.string.text = selFolder.fsName;
            sourceFolder.string.helpTip = selFolder.fsName.toString();
        }
}
//操作文件夹开关
win.group.bat.cBox.onClick =function(){
   sourceFolder.enabled = !sourceFolder.enabled;
}


win.buttons.Btncancel.onClick = function () {
    this.parent.parent.close();
}

win.buttons.Btnok.onClick = function () {
     //保存png
    savePNGs = setting.savePNGs.cBox.value;
    //保存json
    saveJSON = setting.saveJSON.cBox.value;
    //忽略隐藏图层
    ignoreHiddenLayers = setting.ignoreHiddenLayers.cBox.value;
    //使用画布尺寸
    useCanvasSize = setting.useCanvasSize.cBox.value ;
    
    scaleFactor = scaleSlider.value / 100;
    run();
    
    this.parent.parent.close();
}

//主逻辑
function run () {
        if (win.group.bat.cBox.value) {// 文件夹为操作对象  
            useBat = true;
               var openFolder = Folder(sourceFolder.string.text);                
                var fileList = openFolder.getFiles() //获取open文件夹下所有文件
                     if(fileList.length == 0){
                            alert ("没有发现文档");
                        return;
                     }
                for (i=0;i<fileList.length;i++){
                    if (fileList[i] instanceof File && fileList[i].hidden == false){ //不处理隐藏文件
                        open(fileList[i]); 
                        main();
                    }
                }
              alert ("完成并打开源文件夹");
              new Folder(sourceFolder.string.text).execute();//打开文件夹
        }else{// 当前活动文档为操作对象
            useBat = false;
            main();
        }
}
function main () {
	var name = decodeURI(app.activeDocument.name);
	name = name.substring(0, name.indexOf("."));
	// Output dir.
	var dir = app.activeDocument.path + "/"+name+"/";

	new Folder(dir).create();

	app.activeDocument.duplicate();

	// Collect original layer visibility and hide all layers.
	var layers = [];
	getLayers(app.activeDocument, layers);

	var layerCount = layers.length;
	var layerVisibility = {};

	for (var i = layerCount - 1; i >= 0; i--) {
		var layer = layers[i];
		layerVisibility[layer] = layer.visible;
		layer.visible = false;
	}

	// Save JSON.
	if (saveJSON || savePNGs) {
		var json = "{\"bones\":[{\"name\":\"root\"}],\"slots\":[\n";
		for (var i = layerCount - 1; i >= 0; i--) {
			var layer = layers[i];
			
			if (ignoreHiddenLayers && !layerVisibility[layer]) continue;

			json += "{\"name\":\"" + trim(layer.name) + "\",\"bone\":\"root\",\"attachment\":\"" + trim(layer.name) + "\"},\n";
		}
		json += "],\"skins\":{\"default\":{\n";
		for (var i = layerCount - 1; i >= 0; i--) {
			var layer = layers[i];
			
			if (ignoreHiddenLayers && !layerVisibility[layer]) continue;
				
			var x = app.activeDocument.width.as("px") * scaleFactor;
			var y = app.activeDocument.height.as("px") * scaleFactor;
			
			layer.visible = true;
               
			if (!layer.isBackgroundLayer && !useCanvasSize)
				app.activeDocument.trim(TrimType.TRANSPARENT, false, true, true, false);
			x -= app.activeDocument.width.as("px") * scaleFactor;
			y -= app.activeDocument.height.as("px") * scaleFactor;
			if (!layer.isBackgroundLayer && !useCanvasSize)
				app.activeDocument.trim(TrimType.TRANSPARENT, true, false, false, true);
			var width = app.activeDocument.width.as("px") * scaleFactor;
			var height = app.activeDocument.height.as("px") * scaleFactor;

			// Save image.
			if (savePNGs) {
				if (scaleFactor != 1) scaleImage();

				var file = File(dir + "/" + trim(layer.name));
				if (file.exists) file.remove();
				activeDocument.saveAs(file, new PNGSaveOptions(), true, Extension.LOWERCASE);

				//if (scaleFactor != 1 && !useCanvasSize ) stepHistoryBack();
				if (scaleFactor != 1) stepHistoryBack();
			}
			
			if (!layer.isBackgroundLayer && !useCanvasSize) {
				stepHistoryBack();
				stepHistoryBack();
			}
			layer.visible = false;
			
			x += Math.round(width) / 2;
			y += Math.round(height) / 2;
			json += "\"" + trim(layer.name) + "\":{\"" + trim(layer.name) + "\":{\"x\":" + x + ",\"y\":" + y+ ",\"width\":" + Math.round(width) + ",\"height\":" + Math.round(height) + "}},\n";
		}
		json += "}}, \"animations\": { \"animation\": {} }}";

		if (saveJSON) {
			// Write file.
			var file = new File(dir + name + ".json");
			file.remove();
			file.open("a");
			file.lineFeed = "\n";
			file.write(json);
			file.close();
		}
	}

	activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    if(useBat){
        activeDocument.close(SaveOptions.DONOTSAVECHANGES); //关闭当前文档    
    }

}

// Unfinished!
function hasLayerSets (layerset) {
	layerset = layerset.layerSets;
	for (var i = 0; i < layerset.length; i++)
		if (layerset[i].layerSets.length > 0) hasLayerSets(layerset[i]);
}

function scaleImage() {
	var imageSize = app.activeDocument.width.as("px");
	app.activeDocument.resizeImage(UnitValue(imageSize * scaleFactor, "px"), undefined, 72, ResampleMethod.BICUBICSHARPER);
}

function stepHistoryBack () {
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putEnumerated( charIDToTypeID( "HstS" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Prvs" ));
	desc.putReference(charIDToTypeID( "null" ), ref);
	executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );
}

function getLayers (layer, collect) {
	if (!layer.layers || layer.layers.length == 0) return layer;
	for (var i = 0, n = layer.layers.length; i < n; i++) {
		// For checking if its an adjustment layer, but it also excludes
		// LayerSets so we need to find the different types needed.
		//if (layer.layers[i].kind == LayerKind.NORMAL) {
			var child = getLayers(layer.layers[i], collect)
			if (child) collect.push(child);
		//}
	}
}

function trim (value) {
	return value.replace(/^\s+|\s+$/g, "");
}

function hasFilePath() {
	var ref = new ActionReference();
	ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") ); 
	return executeActionGet(ref).hasKey(stringIDToTypeID('fileReference'));
}

//主逻辑end



win.center();
win.show();