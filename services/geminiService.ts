import { GoogleGenAI, Chat } from "@google/genai";
import { EssayParams } from "../types";

// Lấy API key từ biến môi trường Vite.
// - Trên Vercel: đặt VITE_GEMINI_API_KEY trong Environment Variables.
// - Khi chạy local: có thể tạo file .env.local với dòng:
//   VITE_GEMINI_API_KEY=YOUR_API_KEY
const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

if (!apiKey) {
  // Không throw ở đây để tránh vỡ build, chỉ log cảnh báo.
  console.error(
    "⚠️ Chưa cấu hình VITE_GEMINI_API_KEY. Hãy thêm API key vào Environment Variables (Vercel) hoặc .env.local (local)."
  );
}

const ai = new GoogleGenAI({
  // Nếu apiKey undefined thì các hàm phía dưới sẽ tự throw lỗi dễ hiểu.
  apiKey: apiKey || "",
});

// ==================== ESSAY GENERATION ====================

export const generateEssayContent = async (
  params: EssayParams
): Promise<string> => {
  const { topic, outline, length, language } = params;

  const systemInstruction = `
    Bạn là một chuyên gia viết văn. Nhiệm vụ của bạn là tạo ra một bài văn hoàn chỉnh, trình bày đẹp mắt và dễ đọc.

    QUY TẮC ĐỊNH DẠNG (BẮT BUỘC):
    1. Trả về kết quả KHÔNG chứa các ký tự Markdown phức tạp gây lỗi hiển thị (như ###, ***).
    2. Sử dụng các dòng trắng để phân tách đoạn văn rõ ràng.
    3. Tiêu đề bài văn nên viết IN HOA ở dòng đầu tiên.
    4. KHÔNG bao bọc bài văn trong dấu ngoặc kép hay dấu ngoặc vuông.
    5. KHÔNG có phần mở đầu thừa (Ví dụ: "Dưới đây là bài văn..."). Vào thẳng nội dung.

    QUY TẮC NỘI DUNG:
    1. Dựa HOÀN TOÀN vào dàn ý (outline).
    2. Tuân thủ độ dài: ${length}.
    3. Ngôn ngữ: ${language}.
    4. Văn phong tự nhiên, trôi chảy, đúng ngữ pháp.
  `;

  const userPrompt = `
    Viết bài văn về chủ đề: ${topic}
    Dàn ý chi tiết: ${outline}
    
    Hãy viết bài văn ngay bây giờ.
  `;

  try {
    if (!apiKey) {
      throw new Error(
        "Thiếu Gemini API key. Hãy cấu hình biến môi trường VITE_GEMINI_API_KEY trên Vercel (hoặc .env.local khi chạy local)."
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    if (response.text) {
      // Dọn dẹp text trả về
      let cleanText = response.text.trim();

      // Nếu có bọc trong ```markdown ``` thì bỏ đi
      cleanText = cleanText
        .replace(/^```(markdown|html|text)?\n/, "")
        .replace(/\n```$/, "");

      return cleanText;
    } else {
      throw new Error("Không nhận được phản hồi từ AI.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(
      "Đã có lỗi xảy ra khi tạo bài văn. Vui lòng kiểm tra lại cấu hình hoặc thử lại sau."
    );
  }
};

// ==================== CHAT FUNCTIONALITY ====================

export const createChatSession = (): Chat => {
  if (!apiKey) {
    throw new Error(
      "Thiếu Gemini API key. Hãy cấu hình biến môi trường VITE_GEMINI_API_KEY trên Vercel (hoặc .env.local khi chạy local)."
    );
  }

  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `
        Bạn là trợ lý AI của ứng dụng EssayGen Pro,
        được xây dựng dựa trên model Gemini 2.5 của Google AI.

        🎯 QUY TẮC DANH TÍNH:
        - Khi người dùng hỏi bạn là AI gì hoặc của ai, hãy khẳng định bạn sử dụng model Gemini của Google.
        - KHÔNG được tự nhận mình là ChatGPT hay sản phẩm của OpenAI.
        - Không được nói sai về nguồn gốc công nghệ của bạn.

        📘 QUY TẮC TRẢ LỜI CHÍNH:
        - Trả lời ngắn gọn, súc tích, rõ ràng và hữu ích.
        - Hỗ trợ người dùng về văn học, viết văn, phân tích văn bản, sửa lỗi chính tả, gợi ý ý tưởng viết bài.
        - Nếu câu hỏi thuộc các môn khác (Toán, Lý, Hóa, Sinh, Sử, Địa, GDCD, Công nghệ, Tin học, v.v.):
          → Bạn KHÔNG trả lời nội dung bài môn đó.
          → Thay vào đó, bạn trả lời cố định:
            "Xin lỗi, EssayGen Pro chỉ hỗ trợ các nội dung liên quan đến môn Ngữ Văn. Vui lòng đặt câu hỏi về văn học nhé!"

        📚 QUY TẮC GIỌNG VĂN:
        - Thân thiện, tự nhiên.
        - Tránh lan man, không giải thích quá dài.
        - Không dùng markdown phức tạp.
      `,
    },
  });
};

