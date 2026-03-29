/*
const slider = document.getElementById('lightSlider');
const lightsLayer = document.getElementById('lightsLayer');
const heatmapLayer = document.getElementById('heatmapLayer');

const baseLayer = document.querySelector('.base'); // 抓取 class 為 base 的底圖

const lightPcnt = document.getElementById('lightPcnt');
const energyVal = document.getElementById('energyVal');
const starVis = document.getElementById('starVis');

const energyMixToggle = document.getElementById('energyMixToggle');
const energyMixLayer = document.getElementById('energyMixLayer');

slider.addEventListener('input', function() {
    let val = parseInt(this.value); // 滑桿值 0-100

    // 1. 更新數據面板文字
    lightPcnt.innerText = val + "%";
    
    // 2. 核心互動 A：燈光層透明度 (0 -> 1)
    // 隨著滑桿右移，燈光越來越亮，遮住星星
    lightsLayer.style.opacity = val / 100;

    // --- 讓背景隨滑桿 0-100% 逐漸變暗 ---
    if (baseLayer) {
        let brightnessValue = 1 - (val / 100 * 0.95); 
        baseLayer.style.filter = `brightness(${brightnessValue})`;
    }

    // 3. 核心互動 B：(新增) 熱力層邏輯
    // 當照明度超過 70%，能源過載熱力圖開始浮現
    if (val > 70) {
        // 將 70-100 的值對應到 0-1 的透明度
        let heatmapOpacity = (val - 70) / 30;
        heatmapLayer.style.opacity = heatmapOpacity;
        
        // 更新數據狀態
        energyVal.innerText = "極高 (過載)";
        energyVal.style.color = "#FF3131"; // 警告紅
        starVis.innerText = "不可見";
        starVis.style.color = "#888";
    } else if (val > 30) {
        heatmapLayer.style.opacity = 0;
        energyVal.innerText = "中等";
        energyVal.style.color = "#FFCC00"; // 暖黃
        starVis.innerText = "僅部分可見";
        starVis.style.color = "#FFCC00";
    } else {
        heatmapLayer.style.opacity = 0;
        energyVal.innerText = "低 (節能)";
        energyVal.style.color = "#00FF41"; // 安全綠
        starVis.innerText = "極佳";
        starVis.style.color = "#00FF41";
    }
});

energyMixToggle.addEventListener('change', function() {
    if (this.checked) {
        // 開啟時，顯示能源結構圖層 (透明度設為 0.8 效果較好)
        energyMixLayer.style.opacity = "0.8";
    } else {
        // 關閉時隱藏
        energyMixLayer.style.opacity = "0";
    }
});

*/

// 1. 初始化 Chart.js
const ctx = document.getElementById('energyChart').getContext('2d');
let energyChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['再生能源', '化石燃料', '核能'],
        datasets: [{
            data: [80, 15, 5],
            backgroundColor: ['#00FF41', '#FF3131', '#FFCC00'],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { color: '#888', font: { size: 10 } } } }
    }
});

// 2. 原有的變數宣告
const slider = document.getElementById('lightSlider');
const lightsLayer = document.getElementById('lightsLayer');
const heatmapLayer = document.getElementById('heatmapLayer');
const baseLayer = document.querySelector('.base');
const lightPcnt = document.getElementById('lightPcnt');
const energyVal = document.getElementById('energyVal');
const starVis = document.getElementById('starVis');
const energyMixToggle = document.getElementById('energyMixToggle');
const energyMixLayer = document.getElementById('energyMixLayer');

// 3. 新增的數據變數
const co2Val = document.getElementById('co2-value');
const bortleScale = document.getElementById('bortle-scale');

slider.addEventListener('input', function() {
    let val = parseInt(this.value);
    
    // --- 原有邏輯 ---
    lightPcnt.innerText = val + "%";
    lightsLayer.style.opacity = val / 100;
    if (baseLayer) {
        let brightnessValue = 1 - (val / 100 * 0.95); 
        baseLayer.style.filter = `brightness(${brightnessValue})`;
    }

    // --- 加強版數據連動 ---
    // 更新碳排放 (隨照明增加)
    co2Val.innerText = Math.round(120 + (val * 9.5));
    
    // 更新波特爾等級 (1-9級)
    // 將 0-100 的滑桿值，均勻且精準地映射到 1-9 級
    const level = Math.min(9, Math.floor(val / 11.2) + 1); 
    bortleScale.innerText = `Class ${level}`;

    if (level >= 7) {
        bortleScale.style.color = "#FF3131"; // 警告紅
        bortleScale.style.textShadow = "0 0 10px rgba(255, 49, 49, 0.8)";
    } else {
        bortleScale.style.color = "#00FF41"; // 安全綠
        bortleScale.style.textShadow = "none";
    }

    // 更新圖表 (模擬能源結構變化：照明越高，化石燃料比例上升)
    energyChart.data.datasets[0].data = [Math.max(10, 80-val/2), 15+val/1.5, 5+val/10];
    energyChart.update('none'); // 'none' 讓動畫更流暢不卡頓

    // --- 狀態面板邏輯 ---
    if (val > 70) {
        heatmapLayer.style.opacity = (val - 70) / 30;
        energyVal.innerText = "極高 (過載)";
        energyVal.style.color = "#FF3131";
        starVis.innerText = "不可見";
        starVis.style.color = "#888";
    } else if (val > 30) {
        heatmapLayer.style.opacity = 0;
        energyVal.innerText = "中等";
        energyVal.style.color = "#FFCC00";
        starVis.innerText = "僅部分可見";
        starVis.style.color = "#FFCC00";
    } else {
        heatmapLayer.style.opacity = 0;
        energyVal.innerText = "低 (節能)";
        energyVal.style.color = "#00FF41";
        starVis.innerText = "極佳";
        starVis.style.color = "#00FF41";
    }
});

// 生態知識卡片邏輯
function showEcoDetail(type) {
    const box = document.getElementById('eco-detail-box');
    const content = {
        'birds': '【SDG 15 陸域生態】候鳥依賴星光導航。強烈城市光害會導致牠們迷失方向，每年造成數百萬隻鳥類撞擊建築物死亡。',
        'insects': '【生態平衡】光害會干擾昆蟲的授粉行為與繁殖週期，進而引發食物鏈的連鎖反應，影響農業產量。',
        'human': '【健康福祉】過度的人造藍光會抑制褪黑激素分泌，干擾生理時鐘，增加失眠、肥胖及心理疾病的風險。'
    };

    box.style.opacity = '0';

    // 2. 設定一個定時器，在 200 毫秒後執行更換動作
    setTimeout(() => {
        
        // --- 就是寫在這裡！ ---
        box.style.color = '#fff';        // 確保字體是白色
        box.innerText = content[type];   // 更換為對應的生態知識文字
        // ----------------------
        // 3. 更換完內容後，再讓它淡入 (opacity 變 1)
        box.classList.add('show');
        box.style.opacity = '1';
        
    }, 200); // 這個 200 毫秒要配合你 CSS transition 的時間
}

// 能源圖層切換
energyMixToggle.addEventListener('change', function() {
    energyMixLayer.style.opacity = this.checked ? "0.8" : "0";
});