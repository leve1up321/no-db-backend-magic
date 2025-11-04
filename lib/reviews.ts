import fs from 'fs';
import path from 'path';

/**
 * 💬 نظام إدارة التقييمات
 * 
 * يدير تقييمات العملاء للمنتجات بعد الشراء
 */

const reviewsFilePath = path.join(process.cwd(), 'data', 'reviews.json');

export interface Review {
  id: string;
  orderId: string;
  productId: number;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  approved: boolean; // للمراجعة قبل النشر
}

interface ReviewsData {
  reviews: Review[];
}

/**
 * قراءة جميع التقييمات
 */
export function getAllReviews(): Review[] {
  try {
    const fileContent = fs.readFileSync(reviewsFilePath, 'utf-8');
    const data: ReviewsData = JSON.parse(fileContent);
    return data.reviews || [];
  } catch (error) {
    console.error('❌ Error reading reviews:', error);
    return [];
  }
}

/**
 * الحصول على التقييمات المعتمدة فقط
 */
export function getApprovedReviews(): Review[] {
  const reviews = getAllReviews();
  return reviews.filter(review => review.approved);
}

/**
 * الحصول على تقييمات منتج معين
 */
export function getProductReviews(productId: number): Review[] {
  const reviews = getApprovedReviews();
  return reviews.filter(review => review.productId === productId);
}

/**
 * الحصول على متوسط التقييم لمنتج
 */
export function getProductAverageRating(productId: number): number {
  const reviews = getProductReviews(productId);
  
  if (reviews.length === 0) return 0;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((totalRating / reviews.length) * 10) / 10; // تقريب لرقم عشري واحد
}

/**
 * التحقق من أن العميل اشترى المنتج
 */
export function hasCustomerPurchasedProduct(
  customerEmail: string,
  productId: number
): boolean {
  try {
    const ordersPath = path.join(process.cwd(), 'data', 'orders.json');
    const ordersContent = fs.readFileSync(ordersPath, 'utf-8');
    const ordersData = JSON.parse(ordersContent);
    
    // البحث عن طلبات مدفوعة تحتوي على المنتج
    const hasPurchased = ordersData.orders.some((order: any) => 
      order.customerEmail === customerEmail &&
      order.status === 'paid' &&
      order.items.some((item: any) => item.productId === productId)
    );
    
    return hasPurchased;
  } catch (error) {
    console.error('❌ Error checking purchase:', error);
    return false;
  }
}

/**
 * التحقق من أن العميل قيّم المنتج من قبل
 */
export function hasCustomerReviewedProduct(
  customerEmail: string,
  productId: number
): boolean {
  const reviews = getAllReviews();
  return reviews.some(
    review => 
      review.customerEmail === customerEmail && 
      review.productId === productId
  );
}

/**
 * إضافة تقييم جديد
 */
export function addReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'approved'>): Review {
  try {
    const reviews = getAllReviews();
    
    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      createdAt: new Date().toISOString(),
      approved: false, // يحتاج موافقة المسؤول
    };
    
    reviews.push(newReview);
    
    const data: ReviewsData = { reviews };
    fs.writeFileSync(reviewsFilePath, JSON.stringify(data, null, 2));
    
    console.log('✅ Review added:', newReview.id);
    return newReview;
    
  } catch (error: any) {
    console.error('❌ Error adding review:', error);
    throw new Error('فشل في إضافة التقييم');
  }
}

/**
 * الموافقة على تقييم
 */
export function approveReview(reviewId: string): boolean {
  try {
    const reviews = getAllReviews();
    const review = reviews.find(r => r.id === reviewId);
    
    if (!review) {
      return false;
    }
    
    review.approved = true;
    
    const data: ReviewsData = { reviews };
    fs.writeFileSync(reviewsFilePath, JSON.stringify(data, null, 2));
    
    console.log('✅ Review approved:', reviewId);
    return true;
    
  } catch (error) {
    console.error('❌ Error approving review:', error);
    return false;
  }
}

/**
 * حذف تقييم
 */
export function deleteReview(reviewId: string): boolean {
  try {
    const reviews = getAllReviews();
    const filteredReviews = reviews.filter(r => r.id !== reviewId);
    
    if (filteredReviews.length === reviews.length) {
      return false; // التقييم غير موجود
    }
    
    const data: ReviewsData = { reviews: filteredReviews };
    fs.writeFileSync(reviewsFilePath, JSON.stringify(data, null, 2));
    
    console.log('✅ Review deleted:', reviewId);
    return true;
    
  } catch (error) {
    console.error('❌ Error deleting review:', error);
    return false;
  }
}

/**
 * الحصول على أحدث التقييمات
 */
export function getLatestReviews(limit: number = 10): Review[] {
  const reviews = getApprovedReviews();
  return reviews
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

