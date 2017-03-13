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


/**
 * Returns an array of some random color hex codes
 *
 * @return {Array}
 */
function getColors() {
    return ['#F44336', '#9C27B0', '#3F51B5', '#00BCD4', '#8BC34A', '#FF9800', '#795548', '#E91E63', '#673AB7', '#2196F3', '#009688', '#4CAF50', '#FFC107'];
}


export default {
    getNumberStr,
    formatDate,
    getColors
};
