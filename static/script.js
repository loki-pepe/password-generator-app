document.addEventListener('DOMContentLoaded', () => {

    const FORM = document.querySelector('form');
    const PASSWORD_OUTPUT = document.querySelector('#password');
    const CHAR_LENGTH_RANGE = document.querySelector('#char-length');
    const CHAR_LENGTH_OUTPUT = document.querySelector('#char-length-output');

    handleRangeChange(CHAR_LENGTH_RANGE, CHAR_LENGTH_OUTPUT);
    
    FORM.addEventListener('submit', e => handleSubmit(e, PASSWORD_OUTPUT));
    CHAR_LENGTH_RANGE.addEventListener('input', () => handleRangeChange(CHAR_LENGTH_RANGE, CHAR_LENGTH_OUTPUT));
    
    
    function generatePassword(length, options, characters) {
        let password = '';
        let usedOptions = [];

        do {
            password = '';
            usedOptions = [];
            for (let i = 0; i < length; i++) {
                let option = randomItem(options);
                if (!usedOptions.includes(option)) usedOptions.push(option);
                password += randomItem(characters[option]);
            }
        } while (usedOptions.length < options.length)

        return password;
    }

    function getNewPassword(data) {
        const LENGTH = parseInt(data['char-length']);
        if (LENGTH < 1) return '';
        
        const OPTIONS = Object.keys(data).filter(option => option !== 'char-length');
        if (OPTIONS.length === 0) return '';

        while (OPTIONS.length > LENGTH) {
            let randomIndex = Math.floor(Math.random() * OPTIONS.length);
            OPTIONS.splice(randomIndex, 1);
        }

        const CHARACTERS = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~',
        }

        return generatePassword(LENGTH, OPTIONS, CHARACTERS);
    }

    function handleRangeChange(range, output) {
        styleRange(range);
        output.value = range.value;
    }

    function handleSubmit(e, output) {
        e.preventDefault();
        const DATA = Object.fromEntries(new FormData(e.target))
        output.value = getNewPassword(DATA);
    }

    function percentage(value, total) {
        return value / total * 100;
    }

    function randomItem(iterable) {
        return iterable[Math.floor(Math.random() * iterable.length)];
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