import { GoogleGenAI, Chat } from "@google/genai";
import { EssayParams } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Essay Generation
export const generateEssayContent = async (params: EssayParams): Promise<string> => {
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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    if (response.text) {
      // Clean up potential artifacts
      let cleanText = response.text.trim();
      // Remove generic markdown code block wrappers if present
      cleanText = cleanText.replace(/^```(markdown|html|text)?\n/, '').replace(/\n```$/, '');
      return cleanText;
    } else {
      throw new Error("Không nhận được phản hồi từ AI.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Đã có lỗi xảy ra khi tạo bài văn. Vui lòng thử lại.");
  }
};

// Chat Functionality
export const createChatSession = () => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'Bạn là trợ lý AI thông minh, thân thiện của ứng dụng EssayGen Pro. Bạn giúp người dùng giải đáp thắc mắc về văn học, sửa lỗi chính tả, hoặc gợi ý ý tưởng viết bài. Hãy trả lời ngắn gọn, súc tích và hữu ích.',
    },
  });
};
