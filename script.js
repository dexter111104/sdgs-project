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