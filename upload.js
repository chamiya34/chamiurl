function previewFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    // ෆයිල් එකේ නම පෙන්වන්න (Music/GIF වලට ලේසි වෙන්න)
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

// Gofile API එක හරහා ෆයිල් එක අප්ලෝඩ් කරන ප්‍රධාන Function එක
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const loading = document.getElementById('loading');
    const resultBox = document.getElementById('resultBox');
    const directLinkInput = document.getElementById('directLink');

    // ෆයිල් එකක් තෝරලා නැත්නම් Alert එකක් දෙනවා
    if (fileInput.files.length === 0) {
        alert('කරුණාකර File එකක් තෝරන්න!');
        return;
    }

    // Loading එක පෙන්වලා, පරණ ලින්ක් බොක්ස් එක හංගනවා
    loading.style.display = 'block';
    resultBox.style.display = 'none';

    try {
        // පියවර 1: Gofile API එකෙන් දැනට හිස්ව තියෙන හොඳම Server එකක් ඉල්ලනවා
        const serverRes = await fetch('https://api.gofile.io/contents/upload/server');
        if (!serverRes.ok) throw new Error('gofile සර්වර් එක කාර්යබහුලයි. පසුව උත්සාහ කරන්න.');
        
        const serverData = await serverRes.json();
        const serverName = serverData.data.server; // උදා: store1, store2 වගේ එකක් එනවා

        // පියවර 2: අප්ලෝඩ් කරන්න ඕන ෆයිල් එක FormData එකකට සෙට් කරනවා
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);

        // පියවර 3: අර අපිට හම්බවුණු සර්වර් එකට කෙලින්ම ෆයිල් එක Upload කරනවා
        const uploadRes = await fetch(`https://${serverName}.gofile.io/contents/upload/file`, {
            method: 'POST',
            body: formData
        });

        const result = await uploadRes.json();

        // පියවර 4: අප්ලෝඩ් එක සාර්ථක නම් ලින්ක් එක බොක්ස් එකට දාලා පෙන්වනවා
        if (result.status === 'ok') {
            // result.data.downloadPage එකෙන් තමයි සින්දුව/පින්තූරය බාගත කරන්න පුළුවන් ලින්ක් එක ලැබෙන්නේ
            directLinkInput.value = result.data.downloadPage;
            resultBox.style.display = 'block';
        } else {
            alert('Upload failed! සර්වර් එකෙන් ප්‍රතිචාරයක් නැත.');
        }

    } catch (error) {
        console.error(error);
        alert('Error: ' + error.message);
    } finally {
        // වැඩේ ඉවර වුණාම Loading එක අයින් කරනවා
        loading.style.display = 'none';
    }
}

// ලින්ක් එක ක්ලික් කරපු ගමන් Copy කරගන්න Function එක
function copyLink() {
    const linkInput = document.getElementById('directLink');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // මොබයිල් ෆෝන් වලටත් වැඩ කරන්න
    navigator.clipboard.writeText(linkInput.value);
    alert('Link එක සාර්ථකව Copy කරගත්තා! 📋✅');
}
