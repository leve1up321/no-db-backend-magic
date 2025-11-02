import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetail from '@/components/ProductDetail';
import products from '@/data/products.json';

interface Props {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export async function generateMetadata({ params }: Props) {
  const product = products.find((p) => p.id === parseInt(params.id));
  
  if (!product) {
    return {
      title: 'المنتج غير موجود',
    };
  }

  return {
    title: `${product.name} | متجر لفل اب`,
    description: product.description,
  };
}

export default function ProductPage({ params }: Props) {
  const product = products.find((p) => p.id === parseInt(params.id));

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <ProductDetail product={product} />
      <Footer />
    </main>
  );
}

