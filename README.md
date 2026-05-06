# ⚡ DMC.CC — Full-Fat Qwen, Delivered Globally

**Stop settling for watered-down Qwen. Get the real one, via DMC.CC.**

DMC.CC is an independent, high-performance API relay that serves **Alibaba's Qwen models in their full, uncompromised form**.
No distillation, no hidden context clipping, no crippled tool calling — just the true Qwen experience, accelerated through our global network.

---

## 🥩 What “Full-Fat Qwen” Actually Means

Many third-party APIs secretly serve quantized, pruned, or otherwise degraded versions of Qwen.  
**DMC.CC never does that.**

| What you get with us | Why it matters |
|----------------------|----------------|
| ✅ **Full parameter count** (e.g., Qwen3-235B-A22B with all 22 active experts) | You access the exact model that tops the leaderboards, not a cheap clone. |
| ✅ **Complete context window** (128K / 1M tokens as officially designed) | Long documents, complex conversations — no silent truncation. |
| ✅ **Unmodified tool & function calling** | Agent / workflow applications work exactly as they should. |
| ✅ **Original precision (BF16 / FP16)** | Mathematical depth and multilingual quality are fully preserved. |
| ✅ **Full vision / multimodality** (on VL models) | Image understanding is not stripped or compressed. |

> With DMC.CC, you get a **genuine, full-blooded Qwen** — the same model that makes Qwen a global open-weight leader.

---

## 🌍 Why DMC.CC?

| | Official API | DMC.CC |
|---|---|---|
| Region access | Often limited or slow outside Asia | 🌐 **Multi-region acceleration** (US, EU, Asia-Pacific) |
| Billing | Complex, CNY-centric | 💳 Simple, international-friendly |
| Model version | Sometimes lagging behind | 🔄 **Day-one support for new Qwen releases** |
| Rate limits | Strict per-account | 🚀 Generous, production-ready |
| Transparency | Opaque quantization details | 📋 **Full disclosure** — what you request is what you get |

DMC.CC runs on **our own infrastructure**, optimized specifically for Qwen workloads. That means consistent latency, no noisy neighbors, and an API that behaves predictably at scale.

---

## 🧪 Try It in 30 Seconds

```bash
curl -X POST https://api.dmc.cc/v1/chat/completions \
  -H "Authorization: Bearer $DMC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3-235b-a22b",
    "messages": [{"role": "user", "content": "Explain the Banach-Tarski paradox like I'\''m a mathematician."}]
  }'

✅ OpenAI-compatible — drop DMC.CC into any existing toolchain by just changing the base URL.
✅ Streaming (SSE) supported on all models.
✅ Free trial credits available at dmc.cc — no credit card required to start.

📦 Supported Qwen Models
We host the full-fat versions of these variants (more added continuously):

Model ID	Type	Context	Highlights
qwen3-235b-a22b	MoE (235B total, 22B active)	128K	Latest flagship — all experts, full precision
qwen2.5-72b-instruct	Dense 72B	128K	Best-in-class dense LLaMA-alternative
qwen2.5-vl-72b-instruct	Vision-Language	128K	Native image understanding
qwen2.5-coder-32b-instruct	Code	128K	Top-tier coding & debugging
qwen2.5-14b-instruct	Dense 14B	128K	Lightning-fast, full-quality
Need a dedicated deployment, a different Qwen variant, or on-premise access? Contact us.

🚀 Getting Started
Sign up at dmc.cc and grab your API key.

Configure your client — set base_url to https://api.dmc.cc/v1 and use the key.

Enjoy full-fat Qwen anywhere in the world.

Works with openai Python library, LangChain, LlamaIndex, LobeChat, Open WebUI, and any OpenAI-compatible tool.

📊 Latency & Uptime
Typical latency: < 200ms (US/EU nodes), < 80ms (Asia-Pacific)

Uptime SLA: 99.9% (check our status page)

Auto failover across regions, transparent to your application

🗣️ Community
💬 Discord — chat with the team and other builders

🐦 Twitter/X — release updates & announcements

📧 hello@dmc.cc — enterprise, custom deployments

