document.addEventListener('DOMContentLoaded', () => {
    console.log('[BELENTANI OS] Red Glossy Chromatic Neon Engine Initialized.');
    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');

    function appendChat(sender, text) {
        if(!chatBox) return;
        const div = document.createElement('div');
        div.className = 'log-line';
        div.style.color = sender === 'AI' ? '#ff073a' : '#00ffcc';
        div.textContent = '[' + sender + ']: ' + text;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    if(chatSend && chatInput) {
        chatSend.addEventListener('click', () => {
            const val = chatInput.value.trim();
            if(!val) return;
            appendChat('User', val);
            chatInput.value = '';
            setTimeout(() => {
                appendChat('AI Tutor', 'Analyzing query: Java/JS open-source compilation successful. Belentani neural core verified.');
            }, 600);
        });
        chatInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') chatSend.click();
        });
    }

    const btnVoice = document.getElementById('btn-voice');
    if(btnVoice) {
        btnVoice.addEventListener('click', () => {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance('Belentani neural voice synthesis online. Red glossy chromatic neon mode active.');
                utterance.pitch = 1.1;
                utterance.rate = 1.0;
                window.speechSynthesis.speak(utterance);
                appendChat('VoiceLab', 'Synthesizing audio wave successfully.');
            } else {
                alert('Speech synthesis not supported.');
            }
        });
    }

    const termOutput = document.getElementById('term-output');
    const termInput = document.getElementById('term-input');
    const termExec = document.getElementById('term-exec');

    function appendTerm(text, color = '#00ffcc') {
        if(!termOutput) return;
        const div = document.createElement('div');
        div.className = 'log-line';
        div.style.color = color;
        div.textContent = text;
        termOutput.appendChild(div);
        termOutput.scrollTop = termOutput.scrollHeight;
    }

    if(termExec && termInput) {
        termExec.addEventListener('click', () => {
            const cmd = termInput.value.trim();
            if(!cmd) return;
            appendTerm('belentani@core:~$ ' + cmd, '#ffffff');
            termInput.value = '';
            const lower = cmd.toLowerCase();
            if(lower === 'help') {
                appendTerm('Available commands: status, lab, compile, tutor, clear, about');
            } else if(lower === 'status') {
                appendTerm('SYSTEM STATUS: ALL REPOSITORIES SYNCED. RED GLOSSY CHROMA 100%.');
            } else if(lower === 'lab') {
                appendTerm('Entering Red Glossy Laboratory Studio...');
            } else if(lower === 'compile') {
                appendTerm('Compiling Java & HTML5 Open Source Modules... [SUCCESS]');
            } else if(lower === 'clear') {
                termOutput.innerHTML = '';
            } else {
                appendTerm('Command not recognized: ' + cmd + '. Type ' + 'help' + ' for instructions.');
            }
        });
        termInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') termExec.click();
        });
    }
});
