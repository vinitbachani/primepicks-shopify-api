export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const search = url.searchParams.get("q");

    const shop = env.SHOPIFY_STORE;
    const token = env.SHOPIFY_TOKEN;

    const apiUrl = `https://${shop}/admin/api/2024-07/products.json?limit=10&title=${encodeURIComponent(search)}`;

    const response = await fetch(apiUrl, {
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    const products = data.products.map(p => ({
      title: p.title,
      price: p.variants[0]?.price,
      link: `https://${shop}/products/${p.handle}`
    }));

    return new Response(JSON.stringify(products, null, 2), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
