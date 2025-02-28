document.addEventListener('DOMContentLoaded', () => {

    const FORM = document.querySelector('form');
    const CHAR_LENGTH_RANGE = document.querySelector('#char-length');
    const CHAR_LENGTH_OUTPUT = document.querySelector('#char-length-output');

    handleRangeChange(CHAR_LENGTH_RANGE, CHAR_LENGTH_OUTPUT);
    
    FORM.addEventListener('submit', handleSubmit);
    CHAR_LENGTH_RANGE.addEventListener('input', () => handleRangeChange(CHAR_LENGTH_RANGE, CHAR_LENGTH_OUTPUT));


    function handleRangeChange(range, output) {
        styleRange(range);
        output.value = range.value;
    }

    function handleSubmit(e) {
        e.preventDefault();
    }

    function percentage(value, total) {
        return value / total * 100;
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