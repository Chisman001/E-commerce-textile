import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isAdminUser } from "@/lib/admin";
import AdminProductImagesForm from "./admin-product-images-form";

export default function AdminProductImagesPage() {
  const { userId } = auth();

  if (!userId) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Product images</h1>
        <p className="text-sm text-gray-600">
          Sign in to manage product images.
        </p>
        <Button asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </div>
    );
  }

  if (!isAdminUser(userId)) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Product images</h1>
        <p className="text-sm text-gray-600">
          Your account is not in{" "}
          <code className="rounded bg-gray-200 px-1 text-xs">ADMIN_USER_IDS</code>
          . Add your Clerk user ID to{" "}
          <code className="rounded bg-gray-200 px-1 text-xs">.env.local</code>{" "}
          (comma-separated), restart the dev server, and try again.
        </p>
        <Button variant="outline" asChild>
          <Link href="/shop">Back to shop</Link>
        </Button>
      </div>
    );
  }

  return <AdminProductImagesForm />;
}
