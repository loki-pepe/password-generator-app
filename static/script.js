document.addEventListener('DOMContentLoaded', () => {

    const FORM = document.querySelector('form');
    const PASSWORD_OUTPUT = document.querySelector('#password');
    const CHAR_LENGTH_RANGE = document.querySelector('#char-length');
    const CHAR_LENGTH_OUTPUT = document.querySelector('#char-length-output');
    const STRENGTH_GAUGE = document.querySelector('#gauge')

    const CHARACTERS_OBJECT = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~',
    }

    handleRangeChange(CHAR_LENGTH_RANGE, CHAR_LENGTH_OUTPUT);
    
    FORM.addEventListener('submit', handleSubmit);
    CHAR_LENGTH_RANGE.addEventListener('input', () => handleRangeChange(CHAR_LENGTH_RANGE, CHAR_LENGTH_OUTPUT));


    function generatePassword(length, options, charactersObject) {
        let characters = stringFromObjectItems(charactersObject, ...options);
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

    function getNewPassword(data, charactersObject) {
        const LENGTH = parseInt(data['char-length']);
        if (LENGTH < 1) return '';
        
        const OPTIONS = Object.keys(data).filter(option => option !== 'char-length');
        if (OPTIONS.length === 0) return '';

        while (OPTIONS.length > LENGTH) {
            let randomIndex = Math.floor(Math.random() * OPTIONS.length);
            OPTIONS.splice(randomIndex, 1);
        }
        
        return generatePassword(LENGTH, OPTIONS, charactersObject);
    }

    function handleRangeChange(range, output) {
        styleRange(range);
        output.value = range.value;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const DATA = Object.fromEntries(new FormData(e.target))
        let password = getNewPassword(DATA, CHARACTERS_OBJECT);
        PASSWORD_OUTPUT.value = password;
        STRENGTH_GAUGE.className = passwordStrength(
            password,
            parseInt(CHAR_LENGTH_RANGE.max),
            stringFromObjectItems(CHARACTERS_OBJECT).length
        );
    }

    function passwordStrength(password, maxLength, possibleCharCount) {
        /**/
        return 'weak';
    }

    function percentage(value, total) {
        return value / total * 100;
    }

    function randomItem(iterable) {
        return iterable[Math.floor(Math.random() * iterable.length)];
    }

    function stringFromObjectItems(obj, ...items) {
        let str = '';

        if (items.length) {
            for (let item of items) {
                str = str + obj[item];
            }
        } else {
            for (let key in obj) {
                str = str + obj[key];
            }
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