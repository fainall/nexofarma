import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetailClient from "@/components/shop/ProductDetailClient";
import { Product } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage(props: Props) {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      active: true,
    },
    include: { category: true },
    take: 4,
  });

  return (
    <ProductDetailClient
      product={product as unknown as Product}
      relatedProducts={relatedProducts as unknown as Product[]}
    />
  );
}
