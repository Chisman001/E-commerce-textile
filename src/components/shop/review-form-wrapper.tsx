"use client";

import { useRouter } from "next/navigation";
import ReviewForm from "./review-form";

interface ReviewFormWrapperProps {
  productId: number;
}

export default function ReviewFormWrapper({ productId }: ReviewFormWrapperProps) {
  const router = useRouter();

  const handleReviewSubmitted = () => {
    router.refresh(); // re-fetch server data to show the new review
  };

  return (
    <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />
  );
}
