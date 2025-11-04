import { put, head } from '@vercel/blob';

/**
 * 📦 إدارة الملفات على Vercel Blob Storage
 * 
 * يتيح رفع الملفات وتوليد روابط تحميل مؤقتة
 */

export interface UploadResult {
  url: string;
  pathname: string;
  downloadUrl: string;
}

/**
 * رفع ملف إلى Vercel Blob
 * 
 * @param filename - اسم الملف مع المسار (مثل: products/file.pdf)
 * @param content - محتوى الملف (Buffer, string, أو ReadableStream)
 * @param options - خيارات إضافية
 * @returns معلومات الملف المرفوع
 */
export async function uploadFile(
  filename: string,
  content: Buffer | string | ReadableStream,
  options?: {
    access?: 'public' | 'private';
    contentType?: string;
    addRandomSuffix?: boolean;
  }
): Promise<UploadResult> {
  try {
    const { url, pathname, downloadUrl } = await put(filename, content, {
      access: options?.access || 'public',
      contentType: options?.contentType,
      addRandomSuffix: options?.addRandomSuffix || false,
    });

    console.log('✅ File uploaded to Vercel Blob:', pathname);
    console.log('📍 URL:', url);
    console.log('🔗 Download URL:', downloadUrl);

    return { url, pathname, downloadUrl };
  } catch (error: any) {
    console.error('❌ Error uploading file to Vercel Blob:', error.message);
    throw error;
  }
}

/**
 * رفع ملف من buffer
 */
export async function uploadFileFromBuffer(
  filename: string,
  buffer: Buffer,
  contentType?: string
): Promise<UploadResult> {
  return uploadFile(filename, buffer, {
    access: 'public',
    contentType,
  });
}

/**
 * رفع ملف نصي
 */
export async function uploadTextFile(
  filename: string,
  text: string
): Promise<UploadResult> {
  return uploadFile(filename, text, {
    access: 'public',
    contentType: 'text/plain',
  });
}

/**
 * رفع ملف JSON
 */
export async function uploadJsonFile(
  filename: string,
  data: any
): Promise<UploadResult> {
  const jsonString = JSON.stringify(data, null, 2);
  return uploadFile(filename, jsonString, {
    access: 'public',
    contentType: 'application/json',
  });
}

/**
 * رفع ملف خاص (private) - يتطلب signed URL للوصول
 */
export async function uploadPrivateFile(
  filename: string,
  content: Buffer | string | ReadableStream,
  contentType?: string
): Promise<UploadResult> {
  return uploadFile(filename, content, {
    access: 'private',
    contentType,
  });
}

/**
 * توليد رابط تحميل مؤقت لملف خاص
 * 
 * Note: هذه الدالة تحتاج تطبيق إضافي حسب توثيق Vercel
 * حالياً نستخدم الملفات العامة، لكن يمكن تطويرها لاحقاً
 */
export async function generateSignedUrl(
  pathname: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  try {
    // هذا مثال - يحتاج تطبيق حسب توثيق Vercel الرسمي
    // حالياً نرجع الـ pathname كما هو لأن الملفات عامة
    
    console.log(`📝 Generating signed URL for: ${pathname}`);
    console.log(`⏰ Expires in: ${expiresInSeconds} seconds`);
    
    // في الإنتاج، ستحتاج استخدام:
    // import { getDownloadUrl } from '@vercel/blob';
    // const signedUrl = await getDownloadUrl(pathname, { expiresIn: expiresInSeconds });
    
    // حالياً نرجع رابط مباشر لأن الملفات عامة
    return `https://blob.vercel-storage.com/${pathname}`;
  } catch (error: any) {
    console.error('❌ Error generating signed URL:', error.message);
    throw error;
  }
}

/**
 * التحقق من وجود ملف على Vercel Blob
 */
export async function fileExists(url: string): Promise<boolean> {
  try {
    await head(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * رفع ملف منتج للعميل بعد الدفع
 * 
 * @param orderId - معرف الطلب
 * @param productName - اسم المنتج
 * @param fileContent - محتوى الملف
 * @returns رابط التحميل
 */
export async function uploadProductFile(
  orderId: string,
  productName: string,
  fileContent: Buffer | string
): Promise<string> {
  // تنظيف اسم المنتج لاستخدامه في اسم الملف
  const cleanProductName = productName
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .toLowerCase();

  const filename = `orders/${orderId}/${cleanProductName}.zip`;

  const result = await uploadFile(filename, fileContent, {
    access: 'public',
    contentType: 'application/zip',
  });

  return result.downloadUrl;
}

/**
 * رفع ملف وصول للعميل بعد الدفع (PDF, ZIP, etc.)
 */
export async function uploadCustomerAccessFile(
  paymentId: string,
  fileName: string,
  fileContent: Buffer,
  contentType: string = 'application/octet-stream'
): Promise<UploadResult> {
  const path = `customer-files/${paymentId}/${fileName}`;
  
  return uploadFile(path, fileContent, {
    access: 'public',
    contentType,
  });
}

