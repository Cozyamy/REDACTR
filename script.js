function redact() {
    const originalText = document.getElementById('originalText').value;
    const wordsToRedact = document.getElementById('wordsToRedact').value.toLowerCase().split(' ');
    const replacement = document.getElementById('replacement').value;
    const scrambleWordOption = document.getElementById('scrambleWordOption').checked;

    const startTime = performance.now();
    const redactedText = redactText(originalText, wordsToRedact, replacement, scrambleWordOption);
    const endTime = performance.now();

    const stats = {
        wordsScanned: originalText.split(' ').length,
        matchesFound: wordsToRedact.filter(word => originalText.toLowerCase().includes(word)).length,
        charactersScrambled: redactedText.replace(/[^*?-_ ]/g, '').length,
        timeTaken: ((endTime - startTime) / 1000).toFixed(4)
    };

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p class="text-xl font-bold mb-2">Original Text:</p><p class="mb-4">${originalText}</p><p class="text-xl font-bold mb-2">Redacted Text:</p><div class="flex items-center mb-4" id="redactedTextContainer"><p id="redactedText">${redactedText}</p></div>`;

    if (stats) {
        resultDiv.innerHTML += `<div class="bg-gray-200 p-4 rounded">
            <p class="font-bold">Stats:</p>
            <p>Words Scanned: ${stats.wordsScanned}</p>
            <p>Matches Found: ${stats.matchesFound}</p>
            <p>Characters Scrambled: ${stats.charactersScrambled}</p>
            <p>Time Taken: ${stats.timeTaken} seconds</p>
        </div>`;
    }

    // Add a "Copy" button
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.className = 'bg-green-800 text-white p-2 rounded hover:bg-green-700  ml-4';
    copyButton.onclick = copyRedactedText;

    const redactedTextContainer = document.getElementById('redactedTextContainer');
    redactedTextContainer.appendChild(copyButton);
}

function copyRedactedText() {
    const redactedTextElement = document.getElementById('redactedText');

    if (redactedTextElement) {
        const textToCopy = redactedTextElement.textContent;

        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                alert('Redacted text copied to clipboard!');
            })
            .catch(err => {
                console.error('Unable to copy to clipboard', err);
            });
    }
}

function scrambleWord(word) {
    return word.split('').reverse().join('');
}

function redactText(originalText, wordsToRedact, replacement, scrambleWordOption) {
    return originalText.split(' ').map(word => {
        const isRedactable = wordsToRedact.includes(word.toLowerCase());
        const scrambledWord = isRedactable ? (scrambleWordOption ? scrambleWord(word) : replacement.repeat(word.length)) : word;
        return scrambledWord;
    }).join(' ');
}
