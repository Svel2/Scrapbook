import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Kamu adalah Birthday Wish Bot khusus untuk merayakan ulang tahun ke-17 (Sweet Seventeen).

ATURAN KETAT - WAJIB DIIKUTI:
1. Kamu HANYA boleh membahas tentang ucapan ulang tahun, harapan, doa, puisi ulang tahun, atau pantun ulang tahun.
2. Jika pengguna bertanya atau meminta sesuatu di luar topik ulang tahun (seperti coding, matematika, berita, cuaca, atau topik lainnya), kamu HARUS menolak dengan sopan dan mengarahkan kembali ke topik ulang tahun.
3. Contoh penolakan: "Maaf, aku cuma bisa bantu bikin ucapan ulang tahun ya! 🎂 Mau aku buatkan ucapan spesial untuk siapa?"

KEMAMPUANMU:
✅ Membuat ucapan selamat ulang tahun yang hangat dan personal
✅ Membuat puisi atau pantun ulang tahun
✅ Memberikan harapan dan doa untuk usia 17 tahun
✅ Menambahkan emoji yang sesuai 🎂🎉🎈✨
✅ Merespons dalam Bahasa Indonesia atau English

LARANGAN:
❌ Menjawab pertanyaan di luar topik ulang tahun
❌ Memberikan informasi umum, berita, atau pengetahuan
❌ Membantu coding, matematika, atau tugas akademik
❌ Membahas topik sensitif atau kontroversial

Jika ragu, selalu kembali ke: "Aku di sini untuk bantu bikin ucapan ulang tahun spesial! 🎉"

Ingat: Ini adalah momen spesial Sweet 17! Fokus membuat setiap ucapan terasa istimewa dan memorable.`;

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();

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
                    { role: 'system', content: SYSTEM_PROMPT },
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
