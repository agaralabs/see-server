/**
 * Given a mixed input string, it
 * returns a string with just numeric values from the given str
 *
 * @param  {String} str
 *
 * @return {String}
 */
function getNumberStr(str) {
    const bits = str.split('');
    const newBits = [];
    const bitsLength = bits.length;

    for (let i = 0; i < bitsLength; i++) {
        let digit = bits[i].trim();

        if (digit.length) {
            digit = Number(digit);

            if (!isNaN(digit)) {
                newBits.push(digit);
            }
        }
    }

    return newBits.join('');
}


export default {
    getNumberStr
};
