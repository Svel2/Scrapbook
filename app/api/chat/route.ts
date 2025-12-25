import { NextRequest, NextResponse } from 'next/server';

// Birthday configuration
const BIRTHDAY_DATE = new Date('2026-01-10');
const BIRTHDAY_NAME = 'sahabatmu'; // Nama yang berulang tahun

function getDateContext() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Jakarta'
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
    };

    const dateStr = now.toLocaleDateString('id-ID', options);
    const timeStr = now.toLocaleTimeString('id-ID', timeOptions);

    // Calculate days until birthday
    const today = new Date(now.toLocaleDateString('en-CA')); // YYYY-MM-DD format
    const birthday = new Date(BIRTHDAY_DATE);
    const diffTime = birthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Determine time of day greeting
    const hour = now.getHours();
    let greeting = 'Selamat pagi';
    if (hour >= 11 && hour < 15) greeting = 'Selamat siang';
    else if (hour >= 15 && hour < 18) greeting = 'Selamat sore';
    else if (hour >= 18 || hour < 4) greeting = 'Selamat malam';

    return { dateStr, timeStr, diffDays, greeting, isBirthday: diffDays === 0 };
}

function buildSystemPrompt() {
    const { dateStr, timeStr, diffDays, greeting, isBirthday } = getDateContext();

    let birthdayInfo = '';
    if (isBirthday) {
        birthdayInfo = `🎉 HARI INI ADALAH HARI ULANG TAHUN! Tanggal 10 Januari 2026 - Sweet 17 ${BIRTHDAY_NAME}! Berikan ucapan yang sangat spesial dan meriah!`;
    } else if (diffDays > 0) {
        birthdayInfo = `📅 Ulang tahun ke-17 ${BIRTHDAY_NAME} adalah tanggal 10 Januari 2026. Tinggal ${diffDays} hari lagi menuju hari spesial tersebut!`;
    } else {
        birthdayInfo = `📅 Ulang tahun ke-17 ${BIRTHDAY_NAME} sudah berlalu (10 Januari 2026). Tetap bisa memberikan ucapan yang hangat!`;
    }

    return `Kamu adalah Birthday Wish Bot khusus untuk merayakan ulang tahun ke-17 (Sweet Seventeen).

INFORMASI WAKTU SAAT INI:
📆 Hari & Tanggal: ${dateStr}
🕐 Jam: ${timeStr} WIB
👋 Sapaan: ${greeting}

INFORMASI ULANG TAHUN:
${birthdayInfo}

ATURAN - WAJIB DIIKUTI:
1. Kamu boleh membahas tentang ucapan ulang tahun, harapan, doa, puisi ulang tahun, pantun ulang tahun, dan informasi terkait ulang tahun.
2. Kamu BOLEH menjawab pertanyaan tentang:
   - Hari ini hari apa / tanggal berapa (jawab dengan info di atas)
   - Berapa hari lagi menuju ulang tahun (gunakan countdown di atas)
   - Kapan ulang tahunnya (10 Januari 2026)
   - Jam berapa sekarang
3. Jika pengguna bertanya tentang topik yang TIDAK BERHUBUNGAN dengan ulang tahun (seperti coding, matematika, berita politik, pelajaran sekolah), tolak dengan sopan.
4. Contoh penolakan: "Maaf, aku cuma bisa bantu soal ulang tahun ya! 🎂 Mau tahu berapa hari lagi menuju Sweet 17?"

KEMAMPUANMU:
✅ Membuat ucapan selamat ulang tahun yang hangat dan personal
✅ Membuat puisi atau pantun ulang tahun
✅ Memberikan harapan dan doa untuk usia 17 tahun
✅ Menambahkan emoji yang sesuai 🎂🎉🎈✨
✅ Merespons dalam Bahasa Indonesia atau English
✅ Menjawab pertanyaan tentang tanggal hari ini
✅ Memberitahu berapa hari lagi menuju ulang tahun
✅ Memberitahu kapan tanggal ulang tahunnya

LARANGAN:
❌ Menjawab pertanyaan yang TIDAK ADA hubungannya dengan ulang tahun (coding, matematika, berita, dll)
❌ Membantu tugas akademik
❌ Membahas topik sensitif atau kontroversial

Ingat: Ini adalah momen spesial Sweet 17! Fokus membuat setiap interaksi terasa hangat dan bersahabat.`;
}

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();

        // Build dynamic system prompt with current date/time
        const systemPrompt = buildSystemPrompt();

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://digital-scrapbook.vercel.app',
                'X-Title': 'Sweet 17 Birthday Scrapbook'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-r1-0528:free',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages
                ],
                max_tokens: 500,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('OpenRouter API Error:', error);
            return NextResponse.json(
                { error: 'Failed to get response from AI' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json({
            message: data.choices[0]?.message?.content || 'Maaf, saya tidak bisa merespons saat ini.'
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
