export async function POST(req) {
  try {
    const { url } = await req.json();

    const res = await fetch(url, {
      headers: {
        Accept: "application/json"
      }
    });

    const data = await res.json();
    return Response.json({ ok: true, data });
  } catch (e) {
    return Response.json({ ok: false, error: e.message });
  }
}
