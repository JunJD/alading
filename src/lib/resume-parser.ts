import * as pdfjs from "pdfjs-dist";

// 设置 PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

export interface ResumeData {
  text: string;    // 简历的完整文本内容
  name?: string;   // 可能的姓名
  age?: number;    // 可能的年龄
}

/**
 * 从PDF中提取文本内容
 */
export const readPdf = async (fileUrl: string): Promise<ResumeData> => {
  const pdfDoc = await pdfjs.getDocument(fileUrl).promise;
  let fullText = '';

  // 遍历所有页面提取文本
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + ' ';
  }

  fullText = fullText.trim();

  // 提取姓名（多种可能的格式）
  const namePatterns = [
    /姓名[：:\s]*?([\u4e00-\u9fa5]{2,4})/,          // 姓名：张三
    /^([\u4e00-\u9fa5]{2,4})/,                      // 张三（开头）
    /Name[：:\s]*?([\u4e00-\u9fa5]{2,4})/i,         // Name: 张三
    /本人[：:\s]*?([\u4e00-\u9fa5]{2,4})/,          // 本人：张三
    /个人信息[：:\s]*?([\u4e00-\u9fa5]{2,4})/,      // 个人信息：张三
    /简历[：:\s]*?([\u4e00-\u9fa5]{2,4})/,          // 简历：张三
    /([\u4e00-\u9fa5]{2,4})的简历/,                 // 张三的简历
  ];

  let name: string | undefined;
  for (const pattern of namePatterns) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      name = match[1];
      break;
    }
  }

  // 提取年龄（多种可能的格式）
  const agePatterns = [
    /年龄[：:\s]*?(\d{1,2})/,                     // 年龄：25
    /(\d{1,2})[岁周]*/,                          // 25岁
    /Age[：:\s]*?(\d{1,2})/i,                    // Age: 25
    /生日[：:\s]*?(\d{4})[年\-\.\/]/,            // 生日：1990年
    /出生[：:\s]*?(\d{4})[年\-\.\/]/,            // 出生：1990年
    /出生日期[：:\s]*?(\d{4})[年\-\.\/]/,        // 出生日期：1990年
    /(\d{4})[年\-\.\/](\d{1,2})[月\-\.\/]/,     // 1990年6月
    /(\d{4})[年\-\.\/]出生/,                    // 1990年出生
  ];

  let age: number | undefined;
  for (const pattern of agePatterns) {
    const match = fullText.match(pattern);
    if (match) {
      const value = match[1];
      if (value.length === 4) {
        // 如果是年份，计算年龄
        const birthYear = parseInt(value);
        const currentYear = new Date().getFullYear();
        age = currentYear - birthYear;
      } else {
        // 直接是年龄数字
        age = parseInt(value);
      }
      // 验证年龄是否合理 (16-100岁)
      if (age < 16 || age > 100) {
        age = undefined;
        continue;
      }
      break;
    }
  }

  return {
    text: fullText,
    name,
    age
  };
};