
   var layers = [];
main();
function main(){
    var layers = [];
	getLayers(app.activeDocument, layers);
    var layerCount = layers.length;
    alert (layerCount);
    }

function getLayers (layer, collect) {
       //alert (layer);
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