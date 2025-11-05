import { NextResponse } from 'next/server';
import products from '@/data/products.json';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = products.find((p) => p.product_id === parseInt(params.id));
  
  if (!product) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(product);
}
