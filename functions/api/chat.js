// Cloudflare Worker - وسيط بوت الذكاء الاصطناعي
export async function onRequest(context) {
  const { request, env } = context;

  // معالجة طلب CORS المسبق (Preflight)
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    // قراءة الطلب من المستخدم
    const body = await request.json();
    
    // إرسال الطلب إلى Groq API
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768", // نموذج مجاني وقوي
          messages: [
            { role: "system", content: "أنت مساعد برمجة ذكي ومفيد. أجب باللغة العربية." },
            ...body.messages,
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    const data = await response.json();
    
    // إعادة الرد مع إعدادات CORS
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "حدث خطأ في البوت" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
