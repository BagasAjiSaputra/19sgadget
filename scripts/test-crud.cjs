const http = require("http");

async function runE2ETest() {
  const baseUrl = "http://localhost:3000";

  console.log("=== STARTING FULL CRUD & SYNC VERIFICATION ===");

  // 1. Check initial GET /api/products
  console.log("\n[TEST 1] GET /api/products (should return empty or current DB items)");
  let res = await fetch(`${baseUrl}/api/products`);
  let data = await res.json();
  console.log("Status:", res.status);
  console.log("Current products count:", data.products?.length);

  // 2. Login to Admin
  console.log("\n[TEST 2] POST /api/admin/auth (login with admin19s)");
  res = await fetch(`${baseUrl}/api/admin/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "admin19s" }),
  });
  const cookieHeader = res.headers.get("set-cookie");
  const authCookie = cookieHeader ? cookieHeader.split(";")[0] : "";
  console.log("Login Status:", res.status, "Cookie obtained:", !!authCookie);

  // 3. CREATE Product via Admin
  console.log("\n[TEST 3] POST /api/admin/products (Create new gadget)");
  const newProduct = {
    category_id: "handphone",
    brand: "Apple",
    name: "iPhone 15 Pro Test Unit",
    image_url: "https://kycdtpppomsvfydovwrl.supabase.co/storage/v1/object/public/19sgadget_products/iphone-16-pro.webp",
    specs: {
      description: "Unit pengujian CRUD sistem 19s Gadget",
      ram: "8GB",
      storage: "256GB",
    },
    price: 18500000,
  };

  res = await fetch(`${baseUrl}/api/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: authCookie,
    },
    body: JSON.stringify(newProduct),
  });
  const createData = await res.json();
  console.log("Create Status:", res.status, "Success:", createData.success);
  const createdId = createData.product?.id;
  console.log("Created Product ID:", createdId, "Name:", createData.product?.name);

  if (!createdId) {
    throw new Error("Failed to create product");
  }

  // 4. READ via Public Catalog API
  console.log("\n[TEST 4] GET /api/products (Catalog sync check)");
  res = await fetch(`${baseUrl}/api/products`);
  data = await res.json();
  const foundInCatalog = data.products.find((p) => p.id === createdId);
  console.log("Found in catalog:", !!foundInCatalog, "Name:", foundInCatalog?.name);
  if (!foundInCatalog) {
    throw new Error("Newly created product not found in public catalog!");
  }

  // 5. UPDATE Product via Admin
  console.log("\n[TEST 5] PUT /api/admin/products (Update gadget specs)");
  res = await fetch(`${baseUrl}/api/admin/products`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: authCookie,
    },
    body: JSON.stringify({
      id: createdId,
      name: "iPhone 15 Pro Max Updated",
      brand: "Apple",
      category_id: "handphone",
      image_url: newProduct.image_url,
      specs: {
        description: "Unit pengujian CRUD yang telah di-update",
        ram: "12GB",
        storage: "512GB",
      },
    }),
  });
  const updateData = await res.json();
  console.log("Update Status:", res.status, "Success:", updateData.success);
  console.log("Updated Name:", updateData.product?.name, "RAM:", updateData.product?.specs?.ram);

  // 6. Verify Catalog received Update
  console.log("\n[TEST 6] GET /api/products (Verify updated product in catalog)");
  res = await fetch(`${baseUrl}/api/products`);
  data = await res.json();
  const updatedItem = data.products.find((p) => p.id === createdId);
  console.log("Updated item in catalog:", updatedItem?.name, "RAM:", updatedItem?.specs?.ram);

  // 7. DELETE Product via Admin
  console.log("\n[TEST 7] DELETE /api/admin/products (Delete gadget)");
  res = await fetch(`${baseUrl}/api/admin/products?id=${createdId}`, {
    method: "DELETE",
    headers: {
      Cookie: authCookie,
    },
  });
  const deleteData = await res.json();
  console.log("Delete Status:", res.status, "Success:", deleteData.success);

  // 8. VERIFY DELETION IN CATALOG (THE KEY ISSUE: MUST NOT FALL BACK TO MOCK DATA!)
  console.log("\n[TEST 8] GET /api/products (Verify deleted item is GONE and NO mock fallback appears)");
  res = await fetch(`${baseUrl}/api/products`);
  data = await res.json();
  const stillExists = data.products.some((p) => p.id === createdId);
  console.log("Does deleted product still exist?:", stillExists);
  console.log("Total items now in catalog:", data.products?.length);
  if (stillExists) {
    throw new Error("Product was NOT removed from catalog!");
  }

  console.log("\n>>> ALL CRUD TESTS PASSED SUCCESSFULLY! <<<");
}

runE2ETest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

