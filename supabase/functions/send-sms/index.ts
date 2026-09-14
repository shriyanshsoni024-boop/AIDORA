import "@supabase/functions-js/edge-runtime.d.ts";

/**
 * AIDORA Demo SMS Hook Function
 * In demo mode, real SMS dispatch via Fast2SMS/DLT is disabled.
 * Demo OTP is fixed to: 123456
 */
Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const payloadText = await req.text();
    let data: any = {};
    try {
      data = JSON.parse(payloadText);
    } catch {
      // ignore
    }

    const phone = data?.user?.phone || data?.phone || "Demo Phone";
    console.log(`[Demo SMS Hook] Demo OTP 123456 generated for: ${phone}. No real SMS sent.`);

    return Response.json({
      success: true,
      mode: "demo",
      message: "Demo OTP: 123456",
    });
  } catch (error) {
    console.error("Demo Send SMS Hook error:", error);
    return Response.json({ success: true, mode: "demo" });
  }
});