#target photoshop
function selectAllLayers() {
    var ref = new ActionReference();
    ref.putEnumerated(app.charIDToTypeID('Lyr '), app.charIDToTypeID('Ordn'), app.charIDToTypeID('Trgt'));
    var desc = new ActionDescriptor();
    desc.putReference(app.charIDToTypeID('null'), ref);
    executeAction(app.stringIDToTypeID('selectAllLayers'), desc);
}

selectAllLayers()