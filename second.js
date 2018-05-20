var path = require('path'), fs = require('fs'),
    finalMassObj = [];

function fromDir(startPath, filter) {
    if (!fs.existsSync(startPath)) {
        console.log('no dir ', startPath);
        return;
    }

    var files = fs.readdirSync(startPath);

    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]),
            stat = fs.lstatSync(filename);

        if (stat.isDirectory()) {
            fromDir(filename, filter);
        } else if (filename.indexOf(filter) >= 0) {
            // console.log('-- found: ', filename);

            finalMassObj.push({
                'path': filename,
                'size': stat.size
            });
        }
    }
}

fromDir('../terminal/game-platform/ui/states/slot/', '.png');
fromDir('../terminal/game-platform/ui/states/slot/', '.jpg');

//NEXT STEP
    var firstObj = fs.readFileSync('assets/tracker.json'),
    firstObj1 = JSON.parse(firstObj);

Object.keys(finalMassObj).forEach(function(i){
    finalMassObj[i]['changeSize'] = finalMassObj[i].size - firstObj1[i].size;
});

console.log(finalMassObj);
