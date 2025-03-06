document.addEventListener('DOMContentLoaded', () => {

    const CHAR_LENGTH_RANGE = document.querySelector('#char-length');
    const CHAR_LENGTH_OUTPUT = document.querySelector('#char-length-output');
    const COPY_BUTTON = document.querySelector('#copy');
    const FORM = document.querySelector('form');
    const PASSWORD_OUTPUT = document.querySelector('#password');
    const STRENGTH_OUTPUT = document.querySelector('#strength');
    const STRENGTH_GAUGE = document.querySelector('#gauge');


    handleRangeChange(CHAR_LENGTH_RANGE, CHAR_LENGTH_OUTPUT);
    
    CHAR_LENGTH_RANGE.addEventListener('input', () => handleRangeChange(CHAR_LENGTH_RANGE, CHAR_LENGTH_OUTPUT));
    COPY_BUTTON.addEventListener('click', handleCopy)
    FORM.addEventListener('submit', handleSubmit);


    function flashElementClass(element, className, delay) {
        element.classList.add(className);
        setTimeout(() => {
            element.classList.remove(className)
        }, delay);
    }

    function generatePassword(length, options, charactersObject) {
        let characters = stringFromObjectValues(charactersObject, ...options);
        let password = '';
        let usedOptions = [];

        do {
            password = '';
            usedOptions = [];
            for (let i = 0; i < length; i++) {
                let char = randomItem(characters);
                for (let key in charactersObject) {
                    if (charactersObject[key].includes(char) && !usedOptions.includes(key)) {
                        usedOptions.push(key);
                    }
                }
                password += char;
            }
        } while (usedOptions.length < options.length);

        return password;
    }

    function getNewPassword(data) {
        const LENGTH = parseInt(data['char-length']);
        const OPTIONS = Object.keys(data).filter(option => option !== 'char-length');

        if (LENGTH < 1 || OPTIONS.length === 0) return {
            password: '',
            strength: '',
        };

        const CHARACTERS_OBJECT = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~',
        }

        while (OPTIONS.length > LENGTH) {
            let randomIndex = Math.floor(Math.random() * OPTIONS.length);
            OPTIONS.splice(randomIndex, 1);
        }
        
        password = generatePassword(LENGTH, OPTIONS, CHARACTERS_OBJECT);
        strength = passwordStrength(LENGTH, stringFromObjectValues(CHARACTERS_OBJECT, ...OPTIONS).length);

        return {password, strength};
    }

    function handleCopy() {
        navigator.clipboard.writeText(PASSWORD_OUTPUT.value).then(
            () => flashElementClass(COPY_BUTTON, 'copied', 3000)
        );
    }

    function handleRangeChange(range, output) {
        styleRange(range);
        output.value = range.value;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const DATA = Object.fromEntries(new FormData(e.target))
        let {password, strength} = getNewPassword(DATA);
        PASSWORD_OUTPUT.value = password;
        setPasswordStrength(strength);
    }

    function passwordEntropy(length, characterRange) {
        return Math.log(characterRange) / Math.log(2) * length;
    }

    function passwordStrength(length, characterRange) {
        let entropy = passwordEntropy(length, characterRange);

        if (entropy < 36) return 'too-weak';
        if (entropy < 60) return 'weak';
        if (entropy < 120) return 'medium';
        return 'strong';
    }

    function percentage(value, total) {
        return value / total * 100;
    }

    function randomItem(iterable) {
        return iterable[Math.floor(Math.random() * iterable.length)];
    }

    function setPasswordStrength(strength) {
        STRENGTH_GAUGE.classList = strength;
        STRENGTH_OUTPUT.value = strength.replace('-', ' ');
    }

    function stringFromObjectValues(obj, ...keys) {
        let str = '';

        if (keys.length) {
            for (let key of keys) {
                str = str + obj[key];
            }
        } else {
            str = Object.values(obj).join('');
        }

        return str;
    }

    function styleRange(range) {
        let valuePercent = percentage(range.value, range.max);
        
        if (range.value === range.max) {
            range.classList.remove('empty')
            range.classList.add('full')
        } else if (range.value === range.min) {
            range.classList.remove('full')
            range.classList.add('empty')
        } else {
           range.classList.remove('full', 'empty')
        }

        range.style.background = `
            linear-gradient(
                90deg,
                var(--range-progress) ${valuePercent}%,
                var(--range-background) ${valuePercent}%
            )
        `;
    }
});