Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

function newChord() {
    pitchclasses = ["C","D","E","F","G","A","B"];
    sharpflat = ["#","b"];
    majmindom = ["Maj","min",""];
    extension = ["","7","9","11","13"];
    chord = pitchclasses.randomElement() +
        sharpflat.randomElement() + 
        majmindom.randomElement() +
        extension.randomElement()
    if (Tonal.Chord.exists(chord)) {
        prompt = document.getElementById("chord_prompt");
        prompt.innerText = chord;

        answer = document.getElementById("answer_text");
        answer.innerText = Tonal.Chord.notes(chord).join("  ");
    } else {
        newChord();
    }
}

function onMIDISuccess(midiAccess_) {
    midiAccess = midiAccess_
    var inputs = midiAccess.inputs.values();
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // Create a checkbox for each available port
        var container = document.getElementById('checkbox_container');

        var div = document.createElement('div');
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "midi_input_checkbox";
        checkbox.value = input.value.name;
        checkbox.id = input.value.name;
        checkbox.addEventListener("change", function() {
            var inputs = midiAccess.inputs.values();
            for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
                // Assign callback function to the selected MIDI input(s)
                cb = document.getElementById(input.value.name);
                if (cb.checked) { 
                    input.value.onmidimessage = onMIDIMessage;
                } else {
                    input.value.onmidimessage = null;
                }
            }
        });

        var label = document.createElement('label')
        label.htmlFor = input.value.name;
        label.appendChild(document.createTextNode(input.value.name));

        div.appendChild(checkbox);
        div.appendChild(label);
        container.appendChild(div);
    }
}
function onMIDIFailure(e) {
    // when we get a failed response, run this code
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
}


$(document).ready(function() {
    window.addEventListener('keyup', function (e) {
        newChord();
    });
    window.addEventListener("touchstart", newChord(), false);
    
    // request MIDI access
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({
            sysex: false
        }).then(onMIDISuccess, onMIDIFailure);
    } else {
        alert("No MIDI support in your browser.");
    }    
});