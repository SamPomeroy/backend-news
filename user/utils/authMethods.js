function isEmpty(str) {
    return str.length === 0
}

function isStrongPassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChars = password.match(/[!@#$%^&*()\-,.?><]/g) || [];
    
    if(password.length >= minLength && hasUpperCase && hasLowerCase && hasSpecialChars.length){
        return true
    }else{
        return false
    }
}
function isEmail(email) {
    var reg = /\S+@\S+\.\S+/;
    return reg.test(email);
}
function isAlpha(str) {
    return /^[a-zA-Z]+$/.test(str);
}
function isAlphanumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
}

module.exports = {
    isEmail,
    isEmpty,
    isAlpha,
    isAlphanumeric, 
    isStrongPassword
}