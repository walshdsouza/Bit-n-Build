const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATA_DIR = path.join(__dirname, '..', 'data', 'datasets');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function downloadZipAndExtract(url, lang) {
    const outDir = path.join(DATA_DIR, lang);
    const zipPath = path.join(DATA_DIR, `${lang}.zip`);
    
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    console.log(`Downloading ${lang} from ${url}...`);
    
    // We can use powershell to download and extract for simplicity in Node script
    try {
        const cmd = `powershell -Command "Invoke-WebRequest -Uri '${url}' -OutFile '${zipPath}'; Expand-Archive -Path '${zipPath}' -DestinationPath '${outDir}' -Force"`;
        execSync(cmd, { stdio: 'inherit' });
        
        // Move sigml files to root of outDir and clean up
        const moveCmd = `powershell -Command "Get-ChildItem -Path '${outDir}' -Recurse -Filter *.sigml | Move-Item -Destination '${outDir}' -Force; Remove-Item '${zipPath}' -Force"`;
        execSync(moveCmd, { stdio: 'inherit' });
        
        console.log(`Finished ${lang}.`);
    } catch (e) {
        console.error(`Error processing ${lang}:`, e.message);
    }
}

async function run() {
    await downloadZipAndExtract('https://github.com/shoebham/text_to_isl/archive/refs/heads/main.zip', 'isl');
    await downloadZipAndExtract('https://github.com/vhcg/sigml/archive/refs/heads/master.zip', 'bsl');
    await downloadZipAndExtract('https://github.com/PratyushaKumarKar/ASLtoSig-transformer/archive/refs/heads/main.zip', 'asl');
}

run();
