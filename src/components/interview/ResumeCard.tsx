"use client";
import { CardBody, CardContainer, CardItem } from "../ui/TCard";
import { IconFileText } from "@tabler/icons-react";
import { ResumeInfo } from "./ResumeVerification";

interface ResumeCardProps {
  resumeInfo: ResumeInfo;
  pdfUrl?: string;
}

export function ResumeCard({ resumeInfo, pdfUrl }: ResumeCardProps) {
  const pdfSource = pdfUrl || resumeInfo.pdfBase64;

  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
        <div className="flex gap-6 flex-col md:flex-row">
          {/* PDF 预览部分 */}
          <CardItem translateZ="100" className="w-full md:w-1/2 flex-shrink-0">
            {pdfSource ? (
              <iframe
                src={`${pdfSource}#toolbar=0`}
                className="w-full h-[300px] rounded-lg"
              />
            ) : (
              <div className="w-full h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <IconFileText className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </CardItem>

          {/* 信息部分 */}
          <div className="w-full md:w-1/2 flex flex-col h-[300px] overflow-hidden">
            <div className="flex-none space-y-2">
              <CardItem
                translateZ="50"
                className="text-lg font-bold text-neutral-600 dark:text-white"
              >
                {resumeInfo.name}的简历
              </CardItem>
              
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-xs dark:text-neutral-300"
              >
                {resumeInfo.age && `${resumeInfo.age}岁 · `}
                最后更新于 {new Date().toLocaleDateString()}
              </CardItem>
            </div>

            <CardItem
              translateZ="40"
              className="flex-1 mt-2 overflow-hidden"
            >
              <div className="h-full overflow-y-auto px-3 py-2 rounded-xl text-xs text-gray-600 dark:text-gray-300 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {resumeInfo.text}
              </div>
            </CardItem>

            <CardItem
              translateZ="30"
              className="flex-none mt-2 text-xs text-gray-500 dark:text-gray-400"
            >
              <div className="flex flex-wrap gap-1">
                {resumeInfo.industry && (
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                    {resumeInfo.industry.name}
                  </span>
                )}
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                  PDF 简历
                </span>
              </div>
            </CardItem>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  );
} 