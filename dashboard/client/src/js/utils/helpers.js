import fecha from 'fecha';

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


/**
 * For a given date object, it will return the string
 * representation in the format specified as 'format'
 *
 * @param  {Date} dateObj
 * @param  {String} format
 *
 * @return {String}
 */
function formatDate(dateObj, format = 'MMM Do, YYYY') {
    return fecha.format(dateObj, format);
}


export default {
    getNumberStr,
    formatDate
};
