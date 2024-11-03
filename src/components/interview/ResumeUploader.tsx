import { FileUpload } from "../ui/FileUpload";
import { useResumeStore } from "@/stores/useResumeStore";
import { fileToBase64, createObjectURL, revokeObjectURL } from "@/lib/fileUtils";
import { readPdf } from "@/lib/resume-parser";

export function ResumeUploader() {
  const { setResume, setLoading, setError } = useResumeStore();

  const handleFileChange = async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    if (file.type !== 'application/pdf') {
      setError("请上传 PDF 格式的文件");
      return;
    }

    setLoading(true);
    const fileUrl = createObjectURL(file);
    
    try {
      const [base64Data, pdfData] = await Promise.all([
        fileToBase64(file),
        readPdf(fileUrl)
      ]);

      setResume({
        ...pdfData,
        pdfBase64: base64Data
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "简历上传失败");
    } finally {
      setLoading(false);
      revokeObjectURL(fileUrl);
    }
  };

  return <FileUpload onChange={handleFileChange} />;
} 