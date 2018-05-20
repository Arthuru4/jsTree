var path = require('path'), fs = require('fs'),
    finalMassObj = [],
    cuttedPaths = [],
    sliceOfUrl = '\\';   //sliceOfUrl разделитель в URL: '\\' - для Windows; '/' - для Unix.


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
            console.log('-- found: ', filename);

            finalMassObj.push({
                'path': filename,
                'size': stat.size
            });
        }
    }
}

fromDir('../terminal/game-platform/ui/states/slot/', '.png');
fromDir('../terminal/game-platform/ui/states/slot/', '.jpg');

//SECOND STEP - получаем изменение размера после второго прохода
var firstObj = fs.readFileSync('assets/tracker.json'),
    firstObj1 = JSON.parse(firstObj);

Object.keys(finalMassObj).forEach(function(i){
    finalMassObj[i]['changeSize'] = finalMassObj[i].size - firstObj1[i].size;

});

//THIRD STEP - создаем дерево папок
Object.keys(finalMassObj).forEach(function(i){

    cutPath(finalMassObj[i]);

});
console.log(finalMassObj);

// console.log(cuttedPaths['terminal']['game-platform']['ui']['states']['slot']);
// var str = JSON.stringify(cuttedPaths['terminal']['game-platform']['ui']['states']['slot']);
// fs.writeFileSync('assets/test.json', str);

//CUTTING

function cutPath(objImg) {

    var pos = 0,
        posMass = [];

    //ДОСТАЕМ МАССИВ ПОЗИЦИЙ РАЗДЕЛИТЕЛЕЙ('/') В URL
    while (true){
        var foundPos = objImg.path.indexOf(sliceOfUrl, pos);

        if (foundPos === -1) break;

        posMass.push(foundPos);
        pos = foundPos + 1;
    }

    //СОЗДАЕМ Объект cuttedPaths с вложенными "папками" и размерами
    var startPath = objImg.path.slice(posMass[0] + 1, posMass[1]);
    if (!cuttedPaths[startPath]){
        cuttedPaths[startPath] = {
            'size': 0
        };
        beforeRecurs(posMass, 0, cuttedPaths[startPath]);
    } else{
        beforeRecurs(posMass, 0, cuttedPaths[startPath]);
    }


    function beforeRecurs(posMass, counter, firstPath) {
        if (!firstPath) {
            firstPath['size'] = objImg.size;
            counter++;

            if (posMass[counter]){
                var secondPath = objImg.path.slice(posMass[counter] + 1, posMass[counter + 1]);

                firstPath[secondPath] = {
                    'size': 0
                };

                beforeRecurs(posMass, counter, firstPath[secondPath]);
            }

        } else {
            firstPath['size'] += objImg.size;
            counter++;

            if (posMass[counter]){
                secondPath = objImg.path.slice(posMass[counter] + 1, posMass[counter + 1]);

                if(!firstPath[secondPath]) {
                    firstPath[secondPath] = {
                        'size': 0
                    }
                }
                beforeRecurs(posMass, counter, firstPath[secondPath]);
            }
        }
    }
}
