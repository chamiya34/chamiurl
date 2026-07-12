function previewFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileNameDisplay = document.getElementById('fileName');
    if (fileNameDisplay) {
        fileNameDisplay.innerText = "Selected: " + file.name;
    }

    const preview = document.getElementById('preview');
    if (preview) {
        const reader = new FileReader();
        reader.onload = function() {
            preview.src = reader.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
}

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const loading = document.getElementById('loading');
    const resultBox = document.getElementById('resultBox');
    const directLinkInput = document.getElementById('directLink');

    if (fileInput.files.length === 0) {
        alert('Please select a file!');
        return;
    }

    loading.style.display = 'block';
    resultBox.style.display = 'none';

    try {
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);

        // Using the latest Global Upload Endpoint to avoid server busy errors
        const uploadRes = await fetch('https://upload.gofile.io/uploadfile', {
            method: 'POST',
            body: formData
        });

        if (!uploadRes.ok) throw new Error('Gofile API is currently unresponsive. Please try again later.');

        const result = await uploadRes.json();

        if (result.status === 'ok') {
            directLinkInput.value = result.data.downloadPage;
            resultBox.style.display = 'block';
        } else {
            alert('Upload failed! Server returned an error.');
        }

    } catch (error) {
        console.error(error);
        alert('Error: ' + error.message);
    } finally {
        loading.style.display = 'none';
    }
}

function copyLink() {
    const linkInput = document.getElementById('directLink');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // Mobile compatibility
    navigator.clipboard.writeText(linkInput.value);
    alert('Copied to clipboard! ✅');
}
