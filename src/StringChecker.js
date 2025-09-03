let bannedWordsRegExp;
export const initBannedStrings = async () => {
    const bannedWordsRegExprArray = [];
    const rawBannedStrings = await fetch('BannedStrings.json');
    
    /**@type {Array<String>} */
    const bannedStrings = await rawBannedStrings.json();
    console.log(bannedStrings)

    const rawBannedStringsRegexes = await fetch('BannedStringsRegexes.json');
    console.log(rawBannedStringsRegexes)
    const bannedStringsRegexes = await rawBannedStringsRegexes.json();

    for(const bannedString of bannedStrings){
        bannedWordsRegExprArray.push(bannedString);
    }

    bannedWordsRegExp = new RegExp(bannedWordsRegExprArray.concat(bannedWordsRegExprArray.map(e => {
        if(e.includes(' ')){
            return e.replace(/\s/g, '.*');
        }
        return e.split('').join('+\\**\\s*.?.?.?');
    }).concat(bannedStringsRegexes)).join('|'), 'gi');

}

/**@param {String} char*/
const isalpha = (char) => {
    return char.toUpperCase() != char.toLowerCase();
}

/**
 * @param {String} str
 * @returns null if the string is fine, but @returns a message if the string is inappropriate
 */
export const checkString = (str) => {
    const checkString = Array.from(str.trim()).filter(char => isalpha(char) || char == '*').join('');
    console.log(checkString);

    for(let i = 0; i < checkString.length; i++){
        for(let k = i; k < checkString.length; k++){
            if(BannedStringSet.has(checkString.substring(i, k + 1))){
                return checkString.substring(i, k);
            }
        }
    }
    
    return null;
}

/**
 * @param {String} str
 * @returns null if the string is fine, but @returns a message if the string is inappropriate
 */
export const censorString = (str) => {
    const resultString = str;
    
    return resultString.replace(bannedWordsRegExp, match => {
        return '*'.repeat(match.length)
    })
}
