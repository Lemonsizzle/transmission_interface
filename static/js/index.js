const { ipcRenderer } = require('electron');

// Listen for the response from the main process.
ipcRenderer.on('response-data', (event, data) => {
    // Handle the data received from the backend.
    console.log('Data from backend:', data);

    const container = document.getElementById("container");

    // Access items within the object
    if (data) {
        for (let root in data) {
            console.log(root);
            const newRoot = document.createElement("div");
            newRoot.id = root;
            newRoot.classList.add("root");
            container.appendChild(newRoot);
            console.log(newRoot)
            for (let path in data[root]) {
                // Create the label element
                const customCheckboxLabel = document.createElement('label');
                customCheckboxLabel.className = 'custom-checkbox';

                // Create the input element
                const customCheckboxInput = document.createElement('input');
                customCheckboxInput.type = 'radio';
                customCheckboxInput.name = 'radios';
                customCheckboxInput.value = root + data[root][path];

                // Create the span element for the label text
                const checkboxLabelText = document.createElement('span');
                checkboxLabelText.className = 'checkbox-label';
                checkboxLabelText.textContent = path;

                // Append the input and label text to the label element
                customCheckboxLabel.appendChild(customCheckboxInput);
                customCheckboxLabel.appendChild(checkboxLabelText);

                // Append the label element to the body or any other parent element
                newRoot.appendChild(customCheckboxLabel);
            }
        }
    } else {
        console.log('No JSON data.');
    }
});

function Generate() {
    ipcRenderer.send('request-data', /* optional data to send */);
}

function Download() {
    const magnetInput = document.getElementById("magnet_input")
    let url = magnetInput.value;

    console.log(url);
    if (!url.length){
        console.error("No input url");
        return;
    }

    // Get selected radio button for paths
    let downloadDir = "";
    const dirRadio = document.querySelector(`input[name="radios"]:checked`);
    if (dirRadio) downloadDir = dirRadio.value;

    // Log or use the checked values as needed
    console.log('Checked value:', downloadDir);

    if (!downloadDir.length){
        console.error("No selected download location");
    }

    magnetInput.value = "";
    ipcRenderer.send('download', {"url": url, "dir": downloadDir});
}