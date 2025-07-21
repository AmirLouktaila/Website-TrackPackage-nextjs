const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// 🧠 الرموز حسب الحالة
const STATUS_ICONS = {
    placed: '📋',
    processing: '⚙️',
    dispatched: '📦',
    transit: '🚚',
    delivery: '🚛',
    delivered: '✅',
    default: '📍'
};

// 🔍 تحديد الأيقونة حسب الوصف
function matchIcon(text) {
    const lower = text.toLowerCase();
    if (lower.includes("order placed") || lower.includes("accepted")) return STATUS_ICONS.placed;
    if (lower.includes("processing") || lower.includes("sorting")) return STATUS_ICONS.processing;
    if (lower.includes("dispatched") || lower.includes("shipped") || lower.includes("left")) return STATUS_ICONS.dispatched;
    if (lower.includes("in transit") || lower.includes("departure") || lower.includes("transport")) return STATUS_ICONS.transit;
    if (lower.includes("out for delivery") || lower.includes("delivery")) return STATUS_ICONS.delivery;
    if (lower.includes("delivered") || lower.includes("received")) return STATUS_ICONS.delivered;
    return STATUS_ICONS.default;
}

// ✅ Cainiao tracking
async function track_cainio(message) {
    try {
        const response = await axios.get(`https://global.cainiao.com/global/detail.json?mailNos=${message}&lang=en-US&language=en-US`);
        const apiData = response.data;

        const detailList = apiData?.module?.[0]?.detailList || [];
        const copyRealMailNo = apiData?.module?.[0]?.copyRealMailNo || null;

        const lastIndex = detailList.length - 1;

        const listDetails = detailList.map((item, index) => ({
            status: item.desc || 'N/A',
            location: item.standerdDesc || item.standard_desc || 'N/A',
            timestamp: item.timeStr || item.time || 'N/A',
            completed: index < lastIndex,
            icon: matchIcon(item.desc || '')
        }));

        return { detail_list: listDetails, copyRealMailNo };
    } catch (error) {
        console.error('Error in track_cainio:', error.message);
        return { detail_list: [], copyRealMailNo: null };
    }
}

// ✅ EMS tracking
async function Ems(trackingNumber) {
    try {
        const url = `https://ems.dz/track/index.php?icd=${trackingNumber}`;
        const response = await axios.get(url);
        const dom = new JSDOM(response.data);
        const document = dom.window.document;

        const timeline = document.querySelectorAll(".cd-timeline__content.js-cd-content");

        const listDetails = [];
        const total = timeline.length;

        timeline.forEach((element, index) => {
            const title = element.querySelector('h2')?.textContent.trim() || 'N/A';
            const description = element.querySelector('p')?.textContent.trim() || 'N/A';
            const date = element.querySelector('.cd-timeline__date')?.textContent.trim() || 'N/A';

            listDetails.push({
                status: title,
                location: description,
                timestamp: date,
                completed: index < total - 1,
                icon: matchIcon(title)
            });
        });

        return listDetails;
    } catch (error) {
        console.error('Error in EMS:', error.message);
        return [];
    }
}

// ✅ استخراج آخر حالة (للاستخدام فقط في واجهات مختصرة)
function getLastTrack(cainioList, emsList) {
    const combine = [...(cainioList || []), ...(emsList || [])];

    if (combine.length === 0) return null;

    const latest = combine.reduce((latest, current) => {
        const currentDate = new Date(current.timestamp);
        const latestDate = new Date(latest.timestamp);
        return currentDate > latestDate ? current : latest;
    });

    return latest;
}

// ✅ الدالة النهائية الموحدة
export async function trackAll(trackingNumber) {
    const [emsList, cainiaoData] = await Promise.all([
        Ems(trackingNumber),
        track_cainio(trackingNumber)
    ]);

    const allEvents = [...(cainiaoData.detail_list || []), ...(emsList || [])];
    const lastEvent = getLastTrack(cainiaoData.detail_list, emsList);

    return {
        trackingNumber,
        newTrackingNumber: cainiaoData.copyRealMailNo || null,
        events: allEvents,
        lastEvent: lastEvent || null
    };
}
