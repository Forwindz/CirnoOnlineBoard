function removeArrayValue(array, v){
    const index = array.indexOf(v);
    if (index > -1) {
        array.splice(index, 1);
    }
    return array;
}

function removeArrayAllValues(array, v){
    let i = 0;
    while (i < array.length) {
        if (array[i] === v) {
            array.splice(i, 1);
        } else {
            ++i;
        }
    }
    return array;
}



export {removeArrayAllValues, removeArrayValue};