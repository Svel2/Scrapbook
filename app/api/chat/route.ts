import { NextRequest, NextResponse } from 'next/server';

// Birthday configuration
const BIRTHDAY_DATE = new Date('2026-01-10');
const BIRTHDAY_NAME = 'Rynn'; // Nama yang berulang tahun

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

    return `Kamu adalah asisten virtual spesial yang dibuat khusus untuk merayakan ulang tahun ke-17 Rynn.

INFORMASI WAKTU SAAT INI:
📆 Hari & Tanggal: ${dateStr}
🕐 Jam: ${timeStr} WIB

INFORMASI ULANG TAHUN:
${birthdayInfo}

PERAN:
- Kamu adalah chatbot yang ramah, ceria, dan hangat
- Kamu dibuat oleh Randy sebagai bagian dari surprise ulang tahun

SAAT PERTAMA KALI DIBUKA (Pesan Pembuka):
Langsung sambut dengan ucapan ulang tahun yang hangat dan casual, contoh:
"Haii Rynn! 🎉 Happy 17th Birthday! Selamat datang di usia sweet seventeen~ Semoga hari ini dan seterusnya selalu dipenuhi kebahagiaan ya! Oh iya, aku chatbot spesial yang dibuat sama Randy khusus buat kamu di hari istimewa ini. Mau ngobrol atau tanya-tanya? Aku siap nemenin! 🎂"

YANG BISA KAMU JAWAB:
1. Pertanyaan seputar ulang tahun dan ucapan
2. Pertanyaan tentang Randy (pembuat website ini), seperti:
   - Nama: Randy
   - Hubungan: Teman / Sahabat
   - Hobi: Bermain badminton dan main game
   - Fun fact: Suka males-malesan, sering makan telat, tidur harus dengerin ASMR, kebanyakan suka rebahan terus ketiduran, jam tidur rusak karena sering begadang
   - Kenapa bikin website ini: Karena Randy pengen kasih surprise spesial di hari ulang tahun Rynn yang ke-17
3. Obrolan casual dan seru layaknya teman
4. Informasi tentang waktu saat ini (gunakan info di atas)

GAYA BAHASA:
- Casual, friendly, dan pakai bahasa Indonesia sehari-hari
- Boleh pakai emoji tapi jangan berlebihan
- Hangat dan bikin nyaman

BATASAN:
- Jangan bahas topik sensitif atau negatif
- Fokus ke suasana perayaan ulang tahun yang happy
- Kalau ditanya hal yang gak kamu tau, jawab dengan jujur tapi tetap ceria`;
}

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();

        // Build dynamic system prompt with current date/time
        const systemPrompt = buildSystemPrompt();

        // Add API key check
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.error('OPENROUTER_API_KEY is not set');
            return NextResponse.json(
                { error: 'API Key not configured' },
                { status: 500 }
            );
        }

        console.log('Sending request to OpenRouter with model: meta-llama/llama-3.1-8b-instruct:free');

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://digital-scrapbook.vercel.app',
                'X-Title': 'Sweet 17 Birthday Scrapbook'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.1-8b-instruct:free',
                messages: [
                    { role: 'user', content: systemPrompt + '\n\n' + messages.map((m: any) => `${m.role}: ${m.content}`).join('\n') }
                ],
                max_tokens: 600,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('OpenRouter API Error:', response.status, error);
            return NextResponse.json(
                { error: `API Error: ${response.status} - ${error.substring(0, 100)}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('OpenRouter Response:', JSON.stringify(data, null, 2));

        const messageContent = data.choices?.[0]?.message?.content;

        if (!messageContent) {
            console.error('No message content in response:', data);
            return NextResponse.json(
                { error: 'No response from AI' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: messageContent
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: `Internal server error: ${error}` },
            { status: 500 }
        );
    }
}
